import crypto from "crypto";
import { NextResponse } from "next/server";
import { canSend, codeHash, normalizePhone, secretConfigured, sendSms, sign, smsConfigured } from "@/lib/otp.server";

export async function POST(req: Request) {
  if (!secretConfigured()) return NextResponse.json({ error: "server_not_configured" }, { status: 500 });
  const { phone: raw } = await req.json().catch(() => ({}));
  const phone = normalizePhone(raw);
  if (!phone) return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  if (!canSend(phone)) return NextResponse.json({ error: "too_many" }, { status: 429 });

  const code = String(crypto.randomInt(100000, 1000000));
  const token = sign({ p: phone, h: codeHash(phone, code), exp: Date.now() + 5 * 60_000 });

  if (smsConfigured()) {
    try {
      await sendSms(phone, `VitaHub: tasdiqlash kodingiz ${code}. Kodni hech kimga bermang.`);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "sms_failed" }, { status: 502 });
    }
    return NextResponse.json({ token });
  }
  // Demo mode: no SMS provider configured yet.
  return NextResponse.json({ token, demoCode: code });
}
