/**
 * Server-side catalog over the generated dataset.
 *
 * The dataset (src/lib/generated-data.json) is ~21MB. It must never be
 * imported from a client component: bundling it ships the whole file to the
 * browser and blocks hydration for seconds. Everything in this module is only
 * ever reached through the /api/medicines* and /api/pharmacies routes.
 */
import generatedData from "./generated-data.json";
import type { Medicine, MedicinePrice, Pharmacy } from "@/types";


// ─── Data clean-up for the generated dataset ──────────────────────
/** "Dorixona 777 Dorixona" -> "Dorixona 777", "Shifo Dorixona Dorixona" -> "Shifo Dorixona". */
function cleanPharmacyName(name: string): string {
  const n = String(name ?? "").replace(/\s+/g, " ").trim();
  const count = (n.match(/dorixona/gi) ?? []).length;
  return count > 1 ? n.replace(/\s+Dorixona$/i, "") : n;
}
/** "52-49 min" -> "49-52 min" */
function fixRange(t: string): string {
  const m = /^(\d+)\s*-\s*(\d+)(.*)$/.exec(String(t ?? ""));
  if (!m) return t;
  const [a, b] = [Number(m[1]), Number(m[2])].sort((x, y) => x - y);
  return `${a}-${b}${m[3]}`;
}

const rawPharmacies = (generatedData.generatedPharmacies as any[]).map((p) => ({
  ...p,
  name: cleanPharmacyName(p.name),
  deliveryTime: fixRange(p.deliveryTime),
}));
const rawMedicines = generatedData.generatedMedicines as any[];
const pharmacyNameById = new Map(rawPharmacies.map((p) => [p.id, p.name]));
const rawPrices: Record<string, any[]> = Object.fromEntries(
  Object.entries(generatedData.generatedMedicinePrices as Record<string, any[]>).map(([id, rows]) => [
    id,
    rows.map((r) => ({ ...r, pharmacyName: pharmacyNameById.get(r.pharmacyId) ?? cleanPharmacyName(r.pharmacyName) })),
  ])
);

export const pharmacies: Pharmacy[] = rawPharmacies.map((p: any) => ({
  ...p,
  description: `${p.name} — ${p.city} shahridagi ishonchli dorixona. ${p.address}`,
  logo: `/images/pharmacy-${(parseInt(p.id.replace("ph-", "")) % 12) + 1}.svg`,
  coverImage: `/images/pharmacy-cover-${(parseInt(p.id.replace("ph-", "")) % 4) + 1}.svg`,
  email: `info@pharmacy${parseInt(p.id.replace("ph-", ""))}.uz`,
  zipCode: "100000",
  workingHours: {
    monday: { open: p.is24hours ? "00:00" : "08:00", close: p.is24hours ? "23:59" : "22:00", isOpen: true },
    tuesday: { open: p.is24hours ? "00:00" : "08:00", close: p.is24hours ? "23:59" : "22:00", isOpen: true },
    wednesday: { open: p.is24hours ? "00:00" : "08:00", close: p.is24hours ? "23:59" : "22:00", isOpen: true },
    thursday: { open: p.is24hours ? "00:00" : "08:00", close: p.is24hours ? "23:59" : "22:00", isOpen: true },
    friday: { open: p.is24hours ? "00:00" : "08:00", close: p.is24hours ? "23:59" : "22:00", isOpen: true },
    saturday: { open: p.is24hours ? "00:00" : "09:00", close: p.is24hours ? "23:59" : "20:00", isOpen: true },
    sunday: { open: p.is24hours ? "00:00" : "09:00", close: p.is24hours ? "23:59" : "18:00", isOpen: p.is24hours },
  },
  availableMedicines: [],
  createdAt: "2024-01-01",
  updatedAt: "2024-11-01",
}));

// Many generated medicines share a slug; keep the first, suffix later ones with their id number.
const seenSlugs = new Set<string>();
export const medicines: Medicine[] = rawMedicines.map((m: any) => {
  let slug: string = m.slug;
  if (seenSlugs.has(slug)) slug = `${slug}-${String(m.id).replace("med-", "")}`;
  seenSlugs.add(slug);
  return { ...m, slug, alternatives: [] };
});

export const medicinePrices: Record<string, MedicinePrice[]> = rawPrices as Record<
  string,
  MedicinePrice[]
>;

const medicineById = new Map(medicines.map((m) => [m.id, m]));
const medicineBySlug = new Map(medicines.map((m) => [m.slug, m]));

/**
 * Fields that are needed to browse, search and render a medicine card.
 * Dropping `description` (and the rest) keeps the catalog small enough to
 * ship to the browser while every consumer keeps working unchanged.
 */
export const MEDICINE_CARD_FIELDS = [
  "id",
  "slug",
  "name",
  "category",
  "manufacturer",
  "form",
  "dosage",
  "image",
  "unitPrice",
  "discountedPrice",
  "discount",
  "rating",
  "reviewCount",
  "isPopular",
  "isFeatured",
  "prescriptionRequired",
  "isAvailable",
  "country",
  "unit",
  "packSize",
  "minimumOrder",
] as const;

export type MedicineCard = Pick<Medicine, (typeof MEDICINE_CARD_FIELDS)[number]>;

export function toMedicineCard(m: Medicine): MedicineCard {
  const card = {} as Record<string, unknown>;
  for (const field of MEDICINE_CARD_FIELDS) {
    card[field] = (m as unknown as Record<string, unknown>)[field];
  }
  return card as MedicineCard;
}

export function getMedicineBySlug(slug: string): Medicine | undefined {
  return medicineBySlug.get(slug) ?? medicineById.get(slug);
}

export function getMedicineById(id: string): Medicine | undefined {
  return medicineById.get(id);
}

export function getMedicinesByIds(ids: string[]): Medicine[] {
  const out: Medicine[] = [];
  for (const id of ids) {
    const m = medicineById.get(id);
    if (m) out.push(m);
  }
  return out;
}

export function getPricesForIds(ids: string[]): Record<string, MedicinePrice[]> {
  const out: Record<string, MedicinePrice[]> = {};
  for (const id of ids) {
    const prices = medicinePrices[id];
    if (prices) out[id] = prices;
  }
  return out;
}

/**
 * Case-insensitive search over name / manufacturer / category / dosage,
 * with optional category narrowing and pagination.
 */
export function searchMedicines({
  query,
  category,
  limit,
  offset,
}: {
  query?: string;
  category?: string;
  limit: number;
  offset: number;
}): { items: Medicine[]; total: number } {
  const q = (query ?? "").trim().toLowerCase();
  const cat = (category ?? "").trim().toLowerCase();

  const matches = medicines.filter((m) => {
    if (cat && m.category?.toLowerCase() !== cat) return false;
    if (!q) return true;
    return (
      m.name?.toLowerCase().includes(q) ||
      m.manufacturer?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q) ||
      m.dosage?.toLowerCase().includes(q)
    );
  });

  return { items: matches.slice(offset, offset + limit), total: matches.length };
}

export function parseIdsParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);
}
