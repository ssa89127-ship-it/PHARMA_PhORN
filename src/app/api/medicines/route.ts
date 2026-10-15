import { NextResponse } from "next/server";
import generatedData from "@/lib/generated-data.json";

export async function GET() {
  const medicines = (generatedData.generatedMedicines as any[]).map((m: any) => ({
    ...m,
    alternatives: [],
  }));

  const medicinePrices = generatedData.generatedMedicinePrices as any;

  return NextResponse.json({ medicines, medicinePrices });
}
