"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageProvider";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-gradient">Vita</span>Hub
          </span>
        </Link>
        <h1 className="mb-1 text-2xl font-bold">{t("auth2.loginTitle")}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{t("auth2.loginRequiredDesc")}</p>
        <LoginForm
          onSuccess={() => {
            const next = new URLSearchParams(window.location.search).get("next");
            router.push(next && next.startsWith("/") ? next : "/dashboard/patient");
            router.refresh();
            setTimeout(() => window.location.reload(), 50);
          }}
        />
      </Card>
    </div>
  );
}
