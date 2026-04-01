"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { createRiderSchema, updateRiderSchema } from "@/lib/validation/riders";
import { writeAuditLog } from "@/lib/audit";
import { CreateRiderDto, UpdateRiderDto } from "@/types";

export async function createRider(state: any, formData: FormData) {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  const raw = Object.fromEntries(formData.entries());
  const validated = createRiderSchema.safeParse(raw);
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  const data = validated.data as CreateRiderDto;

  // Duplicate detection
  const existing = await prisma.rider.findFirst({
    where: { tenantId, licenseNumber: data.licenseNumber },
  });
  if (existing) return { error: { licenseNumber: ["License number already registered"] } };

  const rider = await prisma.rider.create({
    data: {
      tenantId,
      ...data,
      consentGiven: data.consentGiven === true || data.consentGiven === "true",
      consentDate: (data.consentGiven === true || data.consentGiven === "true") ? new Date() : null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    },
  });

  await writeAuditLog({ tenantId, userId: session!.user.id, action: "rider.create", entityType: "Rider", entityId: rider.id, newValues: data });

  revalidatePath("/riders");
  redirect(`/riders/${rider.id}`);
}

export async function updateRider(state: any, riderId: string, formData: FormData) {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  const raw = Object.fromEntries(formData.entries());
  const validated = updateRiderSchema.safeParse(raw);
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  const current = await prisma.rider.findUnique({ where: { id: riderId } });
  
  const updateData = { ...validated.data } as any;
  if (updateData.consentGiven !== undefined) {
    updateData.consentGiven = updateData.consentGiven === true || updateData.consentGiven === "true";
  }
  if (updateData.dateOfBirth) {
    updateData.dateOfBirth = new Date(updateData.dateOfBirth);
  }

  const updated = await prisma.rider.update({ where: { id: riderId }, data: updateData });

  await writeAuditLog({ tenantId, userId: session!.user.id, action: "rider.update", entityType: "Rider", entityId: riderId, oldValues: current, newValues: validated.data });

  revalidatePath(`/riders/${riderId}`);
  revalidatePath("/riders");
}

export async function bulkUpdateRiderStatus(riderIds: string[], status: string) {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  await prisma.rider.updateMany({ where: { id: { in: riderIds }, tenantId }, data: { status: status as any } });
  revalidatePath("/riders");
}

export async function importRidersCSV(formData: FormData) {
  // Parse CSV, validate, deduplicate by licenseNumber, batch insert
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const text = await file.text();
  const rows = text.split("\n").slice(1); // skip header
  const results = { created: 0, duplicates: 0, errors: 0 };

  for (const row of rows) {
    const [licenseNumber, firstName, lastName, email, clubName] = row.split(",").map(s => s.trim());
    if (!licenseNumber || !firstName) continue;

    const exists = await prisma.rider.findFirst({ where: { tenantId, licenseNumber } });
    if (exists) { results.duplicates++; continue; }

    try {
      await prisma.rider.create({ data: { tenantId, licenseNumber, firstName, lastName, email, clubName, status: "ACTIVE", consentGiven: false } });
      results.created++;
    } catch { results.errors++; }
  }

  revalidatePath("/riders");
  return { success: true, ...results };
}
