"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { PAGES, type Lang } from "./content";

export function StaticPage({ page }: { page: keyof typeof PAGES }) {
  const { language } = useLanguage();
  const c = PAGES[page][(language as Lang) in PAGES[page] ? (language as Lang) : "uz"];
  return (
    <article className="container-custom max-w-3xl py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{c.title}</h1>
      {c.updated && <p className="mt-2 text-xs text-muted-foreground">{c.updated}</p>}
      <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground">{c.intro}</p>
      <div className="mt-8 space-y-8">
        {c.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg sm:text-xl font-semibold">{s.h}</h2>
            {s.p.length > 1 ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm sm:text-base leading-relaxed">
                {s.p.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm sm:text-base leading-relaxed">{s.p[0]}</p>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
