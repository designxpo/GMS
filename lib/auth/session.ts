import { User } from "@/types";
import { cookies } from "next/headers";
import crypto from "crypto";

interface Session {
  user: User;
}

const SECRET = process.env.NEXTAUTH_SECRET ?? "gms-fallback-secret-change-in-prod";
const COOKIE_NAME = "gms_session";

function verifyToken(token: string): any | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const sig = parts.pop()!;
  const data = parts.join(".");
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<Session | null> {
  // Reading cookies() marks this as dynamic (no-cache)
  const jar = cookies();
  const token = jar.get(COOKIE_NAME)?.value;

  if (token) {
    const payload = verifyToken(token);
    if (payload?.userId) {
      return {
        user: {
          id: payload.userId,
          tenantId: payload.tenantId,
          role: payload.role,
          name: payload.name,
          email: payload.email,
        } as User,
      };
    }
  }

  // DEV FALLBACK: allow bypass via env variable for local testing
  if (process.env.DEV_BYPASS_AUTH === "true") {
    return { user: { id: "1", tenantId: "1", role: "SUPER_ADMIN" } as User };
  }

  return null;
}
