"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MedicineBox } from "@/components/medicines/medicine-box";

type Med = {
  id?: string;
  slug?: string;
  name?: string;
  dosage?: string;
  form?: string;
  manufacturer?: string;
  category?: string;
  prescriptionRequired?: boolean;
};

// Position, tilt and float timing of each package in the cluster.
const SLOTS = [
  { cls: "left-[2%] top-[30%] w-[38%] z-20", rotate: -14, dur: 5.5, delay: 0 },
  { cls: "left-[27%] top-[0%] w-[36%] z-10", rotate: 6, dur: 6.5, delay: 0.6 },
  { cls: "left-[56%] top-[4%] w-[34%] z-10", rotate: -5, dur: 6, delay: 1.1 },
  { cls: "left-[57%] top-[38%] w-[38%] z-30", rotate: 15, dur: 5, delay: 0.3 },
];

function shapeOf(form = ""): string {
  const f = form.toLowerCase();
  if (/krem|gel|maz/.test(f)) return "tube";
  if (/sirop|damla|sprey|eritma|suspenziya/.test(f)) return "bottle";
  if (/in'?ektsiya/.test(f)) return "vial";
  return "box";
}

/** Up to 4 medicines, preferring different package shapes for variety. */
function pick(meds: Med[]): Med[] {
  const out: Med[] = [];
  const seen = new Set<string>();
  for (const m of meds) {
    const sh = shapeOf(m.form);
    if (!seen.has(sh)) {
      seen.add(sh);
      out.push(m);
    }
    if (out.length === 4) return out;
  }
  for (const m of meds) {
    if (out.length === 4) break;
    if (!out.includes(m)) out.push(m);
  }
  return out;
}

// Different categories -> different package colors in the cluster.
const SHOWCASE = [
  { category: "Vitaminlar", form: "kapsula" },
  { category: "Antibiotiklar", form: "tabletka" },
  { category: "Teri kasalliklari", form: "krem" },
  { category: "Nafas olish", form: "sprey" },
];

export function HeroShowcase({ meds }: { meds: Med[] }) {
  const [curated, setCurated] = useState<Med[]>([]);
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      SHOWCASE.map(({ category }) =>
        fetch(`/api/medicines?limit=24&category=${encodeURIComponent(category)}`)
          .then((r) => r.json())
          .then((d) => {
            const list: Med[] = d.medicines ?? [];
            const want = SHOWCASE.find((x) => x.category === category)!.form;
            return list.find((m) => (m.form || "").toLowerCase() === want) ?? list[0];
          })
          .catch(() => undefined)
      )
    ).then((res) => {
      if (!cancelled) setCurated(res.filter(Boolean) as Med[]);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const items = curated.length >= 3 ? curated.slice(0, 4) : pick(meds);

  return (
    <div className="relative mx-auto aspect-[1/0.9] w-full max-w-[400px] sm:max-w-[520px] lg:max-w-none">
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute left-[2%] right-0 top-[22%] bottom-[6%] rounded-[50%] bg-sky-200/70 dark:bg-sky-900/30 -rotate-[14deg]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, rotate: 30 }}
        animate={{ opacity: 1, rotate: 45 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
        className="absolute left-[-2%] top-[4%] h-[30%] w-[30%] rounded-[32%] bg-sky-200/80 dark:bg-sky-900/40"
      />
      <div aria-hidden className="absolute right-[2%] bottom-[2%] h-[22%] w-[22%] rounded-full bg-emerald-200/60 dark:bg-emerald-900/30" />

      {items.map((m, i) => {
        const s = SLOTS[i];
        return (
          <motion.div
            key={m.id ?? i}
            className={`absolute ${s.cls}`}
            initial={{ opacity: 0, y: 40, rotate: s.rotate - 8 }}
            animate={{ opacity: 1, y: 0, rotate: s.rotate }}
            transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.25 + i * 0.12 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: s.dur, ease: "easeInOut", delay: s.delay }}
              whileHover={{ scale: 1.06 }}
            >
              <Link href={m.slug ? `/medicines/${m.slug}` : "/medicines"} aria-label={m.name}>
                <MedicineBox
                  name={m.name ?? ""}
                  dosage={m.dosage}
                  form={m.form}
                  manufacturer={m.manufacturer}
                  category={m.category}
                  prescription={m.prescriptionRequired}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </Link>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default HeroShowcase;
