/**
 * Makes the generated demo catalog internally consistent and plausible:
 * - prescription (Rx) status follows category and form, not chance
 * - the dosage form matches the dosage unit ("500mg" is not a syrup)
 * - prices depend on category, form and dose, and differ between pharmacies
 * - one row per pharmacy, fees rounded like real prices
 *
 * It is still demo data. Replace with an official registry / pharmacy feed
 * before launch.
 */

export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
/** Deterministic pseudo-random number in [0, 1). */
const rnd = (key: string) => (hash(key) % 100000) / 100000;
const roundTo = (n: number, step: number) => Math.max(step, Math.round(n / step) * step);

const RX_CATEGORIES = new Set([
  "Antibiotiklar", "Gormonlar", "Psixiatriya", "Onkologiya", "Onkologiya-kimyo",
  "Endokrinologiya", "Qandli diabet", "Yurak-qon tomir", "Nevrologiya", "Immunologiya",
  "Revmatologiya", "Urologiya", "Qon topish",
]);
const OTC_CATEGORIES = new Set([
  "Vitaminlar", "Kosmetologiya", "Gigiena", "Parfyumeriya", "Tibbiy buyumlar",
  "O'simlik preparatlari", "Sport tibbiyoti", "Uy sharoitida davolash", "Hayvonlar uchun",
  "Og'riq qoldiruvchi", "Tish og'riq", "Allergiyaga qarshi", "Teri kasalliklari",
  "Nafas olish", "Nafas yo'llari", "Ovqat hazm qilish", "Oshqozon", "Bolalar", "Bolalar salomatligi",
]);

const LIQUID_FORMS = /^(sirop|damla|tomchi|sprey|eritma|suspenziya|sharbat)$/i;

export function fixForm(name: string, dosage: string, form: string): string {
  const d = `${dosage} ${name}`.toLowerCase();
  if (LIQUID_FORMS.test(form) && /\d\s*(mg|g|mkg|mcg)\b/.test(d) && !/ml\b|\/\s*\d*\s*ml/.test(d)) {
    return hash(name) % 3 === 0 ? "kapsula" : "tabletka";
  }
  return form;
}

export function isPrescription(category: string, form: string, name: string): boolean {
  if (/in'?ektsiya|inyeksiya/i.test(form)) return true;
  if (RX_CATEGORIES.has(category)) return true;
  if (OTC_CATEGORIES.has(category)) return false;
  return hash(name) % 4 === 0; // remaining specialist categories: mostly OTC
}

const CATEGORY_BASE: Record<string, [number, number]> = {
  Vitaminlar: [18000, 120000], Antibiotiklar: [15000, 90000], "Og'riq qoldiruvchi": [3000, 45000],
  Onkologiya: [250000, 2400000], "Onkologiya-kimyo": [400000, 3200000], Psixiatriya: [35000, 260000],
  "Qandli diabet": [30000, 320000], "Yurak-qon tomir": [15000, 180000], Kosmetologiya: [40000, 380000],
  Parfyumeriya: [90000, 900000], Gigiena: [8000, 60000], "Tibbiy buyumlar": [6000, 450000],
};
const FORM_FACTOR: Record<string, number> = {
  "in'ektsiya": 1.8, sprey: 1.4, krem: 1.15, gel: 1.15, maz: 1.05, sirop: 1.1, damla: 0.9, kapsula: 1.1, tabletka: 1,
};

/** Base retail price for a medicine (so'm, rounded to 500). */
export function basePrice(base: string, category: string, form: string, dosage: string): number {
  const [lo, hi] = CATEGORY_BASE[category] ?? [9000, 140000];
  const r = rnd(`base:${base}`);
  let p = lo * Math.pow(hi / lo, r * r); // skewed: most medicines are cheap
  const mg = Number((dosage.match(/(\d+(?:[.,]\d+)?)\s*mg/i)?.[1] ?? "").replace(",", "."));
  const g = Number((dosage.match(/(\d+(?:[.,]\d+)?)\s*g\b/i)?.[1] ?? "").replace(",", "."));
  const dose = mg || (g ? g * 1000 : 0);
  if (dose) p *= 0.75 + Math.min(1.5, Math.log10(dose + 1) / 3);
  p *= FORM_FACTOR[form.toLowerCase()] ?? 1;
  return roundTo(p, 500);
}

/** Price at one pharmacy: ±12–18 % around the base, rounded to 100 so'm. */
export function pharmacyPrice(base: number, medicineId: string, pharmacyId: string): number {
  const f = 0.88 + rnd(`p:${medicineId}:${pharmacyId}`) * 0.3;
  return roundTo(base * f, 100);
}

export function roundFee(fee: number): number {
  return fee <= 0 ? 0 : roundTo(fee, 1000);
}
