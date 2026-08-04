"use client";

import { useState, useEffect } from "react";
import type { Medicine, Category, MedicinePrice, Pharmacy } from "@/types";

interface CachedData {
  medicines: Medicine[];
  categories: Category[];
  medicinePrices: Record<string, MedicinePrice[]>;
  pharmacies: Pharmacy[];
}

let cachedData: CachedData | null = null;
let loadingPromise: Promise<CachedData> | null = null;

async function loadData(): Promise<CachedData> {
  if (cachedData) return cachedData;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const mod = await import("./data");
    cachedData = {
      medicines: mod.medicines,
      categories: mod.categories,
      medicinePrices: mod.medicinePrices,
      pharmacies: mod.pharmacies,
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
