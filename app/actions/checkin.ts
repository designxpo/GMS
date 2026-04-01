"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { sendBulkNotification } from "@/lib/notifications";

export async function checkInRider(checkInId: string) {
  const session = await getServerSession();
  await prisma.checkIn.update({
    where: { id: checkInId },
    data: { status: "CHECKED_IN", scannedAt: new Date(), scannedBy: session!.user.id },
  });
  revalidatePath("/checkin");
}

export async function markNoShow(checkInId: string) {
  await prisma.checkIn.update({ where: { id: checkInId }, data: { status: "NO_SHOW" } });
  revalidatePath("/checkin");
}

export async function scanQRToken(token: string) {
  const checkIn = await prisma.checkIn.findUnique({
    where: { qrToken: token },
    include: { rider: true, horse: true, event: true },
  });
  if (!checkIn) return { error: "Invalid QR code" };
  if (checkIn.status === "CHECKED_IN") return { error: "Already checked in", checkIn };

  const session = await getServerSession();
  const updated = await prisma.checkIn.update({
    where: { id: checkIn.id },
    data: { status: "CHECKED_IN", scannedAt: new Date(), scannedBy: session!.user.id },
    include: { rider: true, horse: true },
  });

  revalidatePath(`/checkin?event=${checkIn.eventId}`);
  return { success: true, checkIn: updated };
}

// Sync offline drafts from PWA IndexedDB
export async function syncOfflineDrafts(drafts: Array<{ checkInId: string; action: string; timestamp: Date; deviceId: string }>) {
  const results = [];
  for (const d of drafts) {
    try {
      await prisma.checkIn.update({
        where: { id: d.checkInId },
        data: { status: d.action === "check_in" ? "CHECKED_IN" : d.action === "no_show" ? "NO_SHOW" : "SCRATCHED", offlineSync: true, syncedAt: new Date() },
      });
      results.push({ id: d.checkInId, synced: true });
    } catch { results.push({ id: d.checkInId, synced: false, error: "Not found" }); }
  }
  return results;
}

export async function nudgeDocPendingRiders(eventId: string) {
  const pending = await prisma.checkIn.findMany({
    where: { eventId, docStatus: "PENDING" },
    include: { rider: true },
  });

  await sendBulkNotification({
    templateKey: "doc_pending_reminder",
    recipientIds: pending.map((p) => p.riderId),
    variables: { eventName: "Delhi Classic 2026" },
    channels: ["WHATSAPP", "EMAIL"],
  });
}
