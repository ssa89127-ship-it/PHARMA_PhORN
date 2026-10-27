import { NextResponse } from "next/server";
import { pharmacies } from "@/lib/catalog.server";

export async function GET() {
  return NextResponse.json({ pharmacies });
}
