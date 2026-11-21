/** Translation helpers with sensible fallbacks (never show raw "a.b.c" keys). */

type T = (path: string, params?: Record<string, string | number>) => string;

/** t() returns the path itself when a key is missing; fall back instead. */
export function tr(t: T, key: string, fallback: string): string {
  const v = t(key);
  return !v || v === key ? fallback : v;
}

// Dataset forms are Uzbek words; map them to translation keys.
const FORM_KEYS: Record<string, string> = {
  tabletka: "tablet",
  kapsula: "capsule",
  sirop: "syrup",
  krem: "cream",
  "in'ektsiya": "injection",
  inyeksiya: "injection",
  damla: "drops",
  tomchi: "drops",
  poroshok: "powder",
  sprey: "spray",
  maz: "ointment",
  eritma: "solution",
  plastir: "patch",
};

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function formLabel(t: T, form?: string | null): string {
  if (!form) return "";
  const f = form.toLowerCase();
  const key = FORM_KEYS[f] ?? f;
  return tr(t, `medicines.formLabels.${key}`, capitalize(form));
}
