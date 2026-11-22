import crypto from "crypto";

/**
 * Phone + SMS-code login, stateless: the server signs short-lived tokens with
 * AUTH_SECRET (or NEXTAUTH_SECRET). SMS is sent through Eskiz.uz when
 * ESKIZ_EMAIL and ESKIZ_PASSWORD are set; otherwise the API runs in demo mode
 * and returns the code to the client so the flow can be tested.
 */

const SECRET =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV !== "production" ? "dev-only-secret" : "");

export const SESSION_COOKIE = "vh_session";
export const SESSION_DAYS = 30;

export function secretConfigured(): boolean {
  return SECRET.length > 0;
}

/** "+998 90 123-45-67", "901234567" -> "998901234567"; null if not an Uzbek mobile number. */
export function normalizePhone(raw: unknown): string | null {
  const digits = String(raw ?? "").replace(/\D/g, "");
  const full = digits.length === 9 ? `998${digits}` : digits;
  return /^998\d{9}$/.test(full) ? full : null;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const mac = (data: string) => crypto.createHmac("sha256", SECRET).update(data).digest("base64url");

export function sign(payload: Record<string, unknown>): string {
  const body = b64(JSON.stringify(payload));
  return `${body}.${mac(body)}`;
}

export function verify<T = Record<string, unknown>>(token: string | undefined | null): (T & { exp: number }) | null {
  if (!token || !SECRET) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = mac(body);
  if (expected.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export const codeHash = (phone: string, code: string) => mac(`otp:${phone}:${code}`);

export function smsConfigured(): boolean {
  return Boolean(process.env.ESKIZ_EMAIL && process.env.ESKIZ_PASSWORD);
}

let eskizToken: { value: string; exp: number } | null = null;

async function eskizAuth(): Promise<string> {
  if (eskizToken && eskizToken.exp > Date.now()) return eskizToken.value;
  const form = new FormData();
  form.set("email", process.env.ESKIZ_EMAIL!);
  form.set("password", process.env.ESKIZ_PASSWORD!);
  const res = await fetch("https://notify.eskiz.uz/api/auth/login", { method: "POST", body: form });
  if (!res.ok) throw new Error(`Eskiz auth failed: ${res.status}`);
  const data = await res.json();
  const value = data?.data?.token as string;
  if (!value) throw new Error("Eskiz auth: no token");
  eskizToken = { value, exp: Date.now() + 25 * 24 * 3600 * 1000 };
  return value;
}

export async function sendSms(phone: string, text: string): Promise<void> {
  const token = await eskizAuth();
  const form = new FormData();
  form.set("mobile_phone", phone);
  form.set("message", text);
  form.set("from", process.env.ESKIZ_FROM || "4546");
  const res = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Eskiz send failed: ${res.status} ${await res.text().catch(() => "")}`);
}

// Best-effort, per-instance abuse limits.
const lastSent = new Map<string, number>();
const attempts = new Map<string, number>();

export function canSend(phone: string): boolean {
  const t = lastSent.get(phone) ?? 0;
  if (Date.now() - t < 60_000) return false;
  lastSent.set(phone, Date.now());
  if (lastSent.size > 5000) lastSent.clear();
  return true;
}

export function registerAttempt(token: string): number {
  const n = (attempts.get(token) ?? 0) + 1;
  attempts.set(token, n);
  if (attempts.size > 5000) attempts.clear();
  return n;
}
