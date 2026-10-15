import { NextResponse } from "next/server";
import generatedData from "@/lib/generated-data.json";

export async function GET() {
  const pharmacies = (generatedData.generatedPharmacies as any[]).map((p: any) => ({
    ...p,
    description: `${p.name} — ${p.city} shahridagi ishonchli dorixona. ${p.address}`,
    logo: `/images/pharmacy-${(parseInt(p.id.replace('ph-', '')) % 12) + 1}.svg`,
    coverImage: `/images/pharmacy-cover-${(parseInt(p.id.replace('ph-', '')) % 4) + 1}.svg`,
    email: `info@pharmacy${parseInt(p.id.replace('ph-', ''))}.uz`,
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

  return NextResponse.json({ pharmacies });
}
