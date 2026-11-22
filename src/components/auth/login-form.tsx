"use client";

import { useState } from "react";
import { Loader2, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/i18n/LanguageProvider";

export type SessionUser = { phone: string; name: string };

const formatUz = (digits: string) => {
  const d = digits.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.length ? `${parts[0]} ${parts.slice(1).join("-")}`.trim() : "";
};

export function LoginForm({ onSuccess }: { onSuccess: (user: SessionUser) => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const errorText = (code: string) =>
    ({
      invalid_phone: t("auth2.invalidPhone"),
      invalid_code: t("auth2.invalidCode"),
      expired: t("auth2.expired"),
      too_many: t("auth2.tooMany"),
    } as Record<string, string>)[code] ?? t("common.error");

  const sendCode = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/account/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `998${phone.replace(/\D/g, "")}` }),
      });
      const data = await res.json();
      if (!res.ok) return setError(errorText(data.error));
      setToken(data.token);
      setDemoCode(data.demoCode ?? null);
      setStep("code");
    } catch {
      setError(t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/account/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code, name }),
      });
      const data = await res.json();
      if (!res.ok) return setError(errorText(data.error));
      onSuccess(data.user);
    } catch {
      setError(t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendCode();
          }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium">{t("auth2.phone")}</label>
          <div className="flex items-center gap-2">
            <span className="flex h-11 items-center rounded-lg border bg-muted/40 px-3 text-sm font-medium">+998</span>
            <Input
              inputMode="tel"
              autoComplete="tel-national"
              autoFocus
              placeholder="90 123-45-67"
              value={formatUz(phone)}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              className="h-11 text-base"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full h-11" disabled={busy || phone.length !== 9}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
            {t("auth2.sendCode")}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyCode();
          }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">{t("auth2.codeSentTo", { phone: `+998 ${formatUz(phone)}` })}</p>
          {demoCode && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
              {t("auth2.demoNotice", { code: demoCode })}
            </div>
          )}
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-11 text-center text-lg tracking-[0.4em]"
          />
          <Input placeholder={t("auth2.name")} value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
          <Button type="submit" variant="primary" className="w-full h-11" disabled={busy || code.length !== 6}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
            {t("auth2.verify")}
          </Button>
          <div className="flex justify-between text-xs">
            <button type="button" className="text-muted-foreground hover:text-primary" onClick={() => setStep("phone")}>
              {t("auth2.changePhone")}
            </button>
            <button type="button" className="text-primary hover:underline" onClick={sendCode} disabled={busy}>
              {t("auth2.resend")}
            </button>
          </div>
        </form>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
