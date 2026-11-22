"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

/** Translated text usable anywhere, including dynamic() loading fallbacks. */
export function TrText({ k }: { k: string }) {
  const { t } = useLanguage();
  return <>{t(k)}</>;
}
