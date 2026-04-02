import { prisma } from "@/lib/db";

interface AuditLogEntry {
  tenantId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: object | null;
  newValues?: object | null;
  ipAddress?: string;
}

export async function writeAuditLog(log: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        tenantId: log.tenantId,
        userId: log.userId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        oldValues: log.oldValues ? (log.oldValues as any) : undefined,
        newValues: log.newValues ? (log.newValues as any) : undefined,
        ipAddress: log.ipAddress ?? "server",
      },
    });
  } catch (err) {
    // Never let audit logging break the main flow
    console.error("[AuditLog] Failed to write:", err);
  }
}
