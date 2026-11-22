"use client";

import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useAuth } from "./auth-provider";

/** Shows children only to logged-in users; everyone else gets a login prompt. */
export function RequireLogin({ children }: { children: ReactNode }) {
  const { user, loading, requireLogin } = useAuth();
  const { t } = useLanguage();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">{t("auth2.loginRequired")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t("auth2.loginRequiredDesc")}</p>
        <Button variant="primary" onClick={() => requireLogin()}>
          {t("auth2.loginTitle")}
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}
