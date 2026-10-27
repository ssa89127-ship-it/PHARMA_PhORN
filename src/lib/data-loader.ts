"use client";

import { useState, useEffect } from "react";
import type { Category, Pharmacy, Doctor, Medicine, MedicinePrice } from "@/types";

interface CachedData {
  medicines: Medicine[];
  categories: Category[];
  medicinePrices: Record<string, MedicinePrice[]>;
  pharmacies: Pharmacy[];
  doctors: Doctor[];
  orders: any[];
  appointments: any[];
  medicalRecords: any[];
  savedAddresses: any[];
  paymentMethods: any[];
  loyaltyPoints: any;
  notifications: any[];
  dashboardStats: any;
}

let cachedData: CachedData | null = null;
let loadingPromise: Promise<CachedData> | null = null;

async function loadData(): Promise<CachedData> {
  if (cachedData) return cachedData;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    // Static demo data - small enough to ship in the client bundle.
    const mod = await import("./data");

    // Fetch the medicine catalog (slim version) and pharmacies from the API.
    let medicines: Medicine[] = [];
    let medicinePrices: Record<string, MedicinePrice[]> = {};
    let pharmacies: Pharmacy[] = [];

    try {
      const [medsRes, pharmsRes] = await Promise.all([
        fetch("/api/medicines?limit=10000"), // full slim catalog
        fetch("/api/pharmacies"),
      ]);

      if (medsRes.ok) {
        const body = await medsRes.json();
        medicines = body.medicines ?? [];
      }
      if (pharmsRes.ok) {
        const body = await pharmsRes.json();
        pharmacies = body.pharmacies ?? [];
      }
      // medicinePrices stays empty - pages that need prices should use useMedicinePrices hook
    } catch {
      medicines = [];
      medicinePrices = {};
      pharmacies = [];
    }

    cachedData = {
      medicines,
      categories: mod.categories,
      medicinePrices,
      pharmacies,
      doctors: mod.doctors,
      orders: mod.orders,
      appointments: mod.appointments,
      medicalRecords: mod.medicalRecords,
      savedAddresses: mod.savedAddresses,
      paymentMethods: mod.paymentMethods,
      loyaltyPoints: mod.loyaltyPoints,
      notifications: mod.notifications,
      dashboardStats: mod.dashboardStats,
    };
    return cachedData;
  })();

  return loadingPromise;
}

export function useDataLoader() {
  const [data, setData] = useState<CachedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      setIsLoading(false);
    });
  }, []);

  return { data, isLoading };
}
