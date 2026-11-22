import crypto from "crypto";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS, codeHash, registerAttempt, sign, verify } from "@/lib/otp.server";

export async function POST(req: Request) {
  const { token, code, name } = await req.json().catch(() => ({}));
  const data = verify<{ p: string; h: string }>(token);
  if (!data) return NextResponse.json({ error: "expired" }, { status: 400 });
  if (registerAttempt(token) > 5) return NextResponse.json({ error: "too_many" }, { status: 429 });
  const expected = codeHash(data.p, String(code ?? "").trim());
  if (expected.length !== data.h.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(data.h))) {
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  }
  const cleanName = typeof name === "string" ? name.trim().slice(0, 60) : "";
  const user = { phone: data.p, name: cleanName };
  const res = NextResponse.json({ user });
  res.cookies.set(SESSION_COOKIE, sign({ ...user, exp: Date.now() + SESSION_DAYS * 86400_000 }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return res;
}
