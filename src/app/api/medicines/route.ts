import { NextRequest, NextResponse } from "next/server";
import {
  getMedicineBySlug,
  getMedicinesByIds,
  getPricesForIds,
  parseIdsParam,
  searchMedicines,
} from "@/lib/catalog.server";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 24;

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  // Single medicine (plus its prices) - used by the medicine detail page.
  const slug = params.get("slug");
  if (slug) {
    const medicine = getMedicineBySlug(slug);
    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
    }
    return NextResponse.json({
      medicine,
      prices: getPricesForIds([medicine.id])[medicine.id] ?? [],
    });
  }

  // Explicit list of medicines (plus their prices).
  const ids = parseIdsParam(params.get("ids"));
  if (ids.length) {
    return NextResponse.json({
      medicines: getMedicinesByIds(ids),
      medicinePrices: getPricesForIds(ids),
    });
  }

  // Searchable / paginated catalog.
  const rawLimit = Number.parseInt(params.get("limit") ?? "", 10);
  const rawOffset = Number.parseInt(params.get("offset") ?? "", 10);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;
  const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0;

  const { items, total } = searchMedicines({
    query: params.get("query") ?? "",
    category: params.get("category") ?? "",
    limit,
    offset,
  });

  return NextResponse.json({ medicines: items, total, limit, offset });
}
