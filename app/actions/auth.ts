"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET ?? "gms-fallback-secret-change-in-prod";
const COOKIE_NAME = "gms_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}

function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${sig}`;
}

function verifyToken(token: string): any | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase().trim(), isActive: true },
    include: { tenant: true },
  });

  if (!user) return { error: "Invalid email or password" };

  // Accept either hashed password match OR a default password for demo accounts
  const hashed = hashPassword(password);
  const defaultPass = hashPassword("Admin@123");
  const isValid = user.hashedPassword
    ? user.hashedPassword === hashed
    : password === "Admin@123" || hashed === defaultPass;

  if (!isValid) return { error: "Invalid email or password" };

  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    name: user.name,
    email: user.email,
    exp: Date.now() + SESSION_DURATION,
  };

  const token = signToken(payload);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  redirect("/dashboard");
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect("/login");
}

export function getSessionFromCookie(): {
  userId: string;
  tenantId: string;
  role: string;
  name?: string;
  email?: string;
} | null {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
