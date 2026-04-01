// lib/auth/session.ts
import { User } from "@/types";

interface Session {
  user: User;
}

export async function getServerSession(): Promise<Session | null> {
  // replace with actual session logic
  return { user: { id: "1", tenantId: "1", role: "SUPER_ADMIN" } };
}