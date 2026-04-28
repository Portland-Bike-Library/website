import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "pbl_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set.");
  return s;
}

function getPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("ADMIN_PASSWORD is not set.");
  return p;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function makeCookieValue(): string {
  const ts = Date.now().toString();
  return `${ts}.${sign(ts)}`;
}

function verifyCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const idx = value.indexOf(".");
  if (idx === -1) return false;
  const ts = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  if (!/^\d+$/.test(ts) || !sig) return false;

  const expected = sign(ts);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  const age = (Date.now() - Number(ts)) / 1000;
  return age >= 0 && age < SESSION_MAX_AGE_SECONDS;
}

export function checkPassword(submitted: string): boolean {
  if (typeof submitted !== "string") return false;
  const expected = Buffer.from(getPassword());
  const got = Buffer.from(submitted);
  if (got.length !== expected.length) return false;
  return timingSafeEqual(got, expected);
}

export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyCookieValue(cookieStore.get(COOKIE_NAME)?.value);
}
