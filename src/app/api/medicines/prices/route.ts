import { NextRequest, NextResponse } from "next/server";
import { getPricesForIds, parseIdsParam } from "@/lib/catalog.server";

/**
 * Prices for a specific set of medicines. Kept separate from the catalog so
 * the (much larger) price table is only transferred for the medicines that
 * are actually on screen.
 */
export async function GET(req: NextRequest) {
  const ids = parseIdsParam(req.nextUrl.searchParams.get("ids"));
  return NextResponse.json({ medicinePrices: getPricesForIds(ids) });
}
