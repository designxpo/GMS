import { User } from "@/types";
import { cookies } from "next/headers";


interface Session {
  user: User;
}

export async function getServerSession(): Promise<Session | null> {
  // Calling cookies() tells Next.js this is a dynamic function
  cookies();
  // replace with actual session logic
  return { user: { id: "1", tenantId: "1", role: "SUPER_ADMIN" } };
}