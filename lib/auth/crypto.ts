import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET ?? "gms-fallback-secret-change-in-prod";
const COOKIE_NAME = "gms_session";

export function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}

export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): any | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
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

export function getSessionFromCookie(cookieValue: string | undefined): {
  userId: string;
  tenantId: string;
  role: string;
  name?: string;
  email?: string;
} | null {
  if (!cookieValue) return null;
  return verifyToken(cookieValue);
}

export { COOKIE_NAME, SECRET };
