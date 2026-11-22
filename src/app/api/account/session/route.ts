import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verify } from "@/lib/otp.server";

export async function GET(req: NextRequest) {
  const s = verify<{ phone: string; name?: string }>(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ user: s ? { phone: s.phone, name: s.name ?? "" } : null });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
