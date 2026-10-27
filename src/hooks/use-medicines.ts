"use client";

import { useEffect, useRef, useState } from "react";
import type { Medicine, MedicinePrice } from "@/types";

/**
 * Hooks for the medicine catalog.
 *
 * The catalog (10k medicines + their prices) is served by /api/medicines*
 * instead of being bundled into the client, so every screen has to ask for
 * the slice it actually needs.
 */

const MEDICINE_CARD_LIMIT = 500;

export interface MedicinesPage {
  medicines: Medicine[];
  total: number;
  limit: number;
  offset: number;
}

export function useMedicines({
  query = "",
  category = "",
  limit = 24,
  offset = 0,
  enabled = true,
}: {
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
} = {}) {
  const [page, setPage] = useState<MedicinesPage>({
    medicines: [],
    total: 0,
    limit,
    offset,
  });
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  // Guards against out-of-order responses while the user keeps typing.
  const requestId = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const id = ++requestId.current;
    const controller = new AbortController();
    setIsLoading(true);

    const params = new URLSearchParams({ query, category, limit: String(limit), offset: String(offset) });

    fetch(`/api/medicines?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load medicines");
        return res.json();
      })
      .then((body) => {
        if (id !== requestId.current) return;
        setPage({
          medicines: body.medicines ?? [],
          total: body.total ?? 0,
          limit: body.limit ?? limit,
          offset: body.offset ?? offset,
        });
        setError(null);
      })
      .catch((err) => {
        if (err?.name === "AbortError" || id !== requestId.current) return;
        setError(err?.message ?? "Failed to load medicines");
      })
      .finally(() => {
        if (id === requestId.current) setIsLoading(false);
      });

    return () => controller.abort();
  }, [query, category, limit, offset, enabled]);

  return { ...page, isLoading, error };
}

/**
 * Debounced search over the whole catalog - used by the medicine pickers.
 */
export function useMedicineSearch(query: string, delay = 250) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), delay);
    return () => clearTimeout(id);
  }, [query, delay]);

  const { medicines, isLoading } = useMedicines({
    query: debounced,
    limit: MEDICINE_CARD_LIMIT,
    enabled: debounced.trim().length > 0,
  });

  return { medicines, isLoading };
}

/** A specific set of medicines by id. */
export function useMedicinesByIds(ids: string[]) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const key = ids.join(",");

  useEffect(() => {
    const list = key ? key.split(",").filter(Boolean) : [];
    if (!list.length) {
      setMedicines([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/medicines?ids=${encodeURIComponent(list.join(","))}`)
      .then((res) => (res.ok ? res.json() : { medicines: [] }))
      .then((body) => {
        if (!cancelled) setMedicines(body.medicines ?? []);
      })
      .catch(() => {
        if (!cancelled) setMedicines([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { medicines, isLoading };
}

/** One medicine (by slug) together with its pharmacy prices. */
export function useMedicineBySlug(slug: string | undefined) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [prices, setPrices] = useState<MedicinePrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setMedicine(null);
      setPrices([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);

    fetch(`/api/medicines?slug=${encodeURIComponent(slug)}`)
      .then((res) => {
        if (res.status === 404) return { medicine: null, prices: [] };
        if (!res.ok) throw new Error("Failed to load medicine");
        return res.json();
      })
      .then((body) => {
        if (cancelled) return;
        setMedicine(body.medicine ?? null);
        setPrices(body.prices ?? []);
        if (!body.medicine) setNotFound(true);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { medicine, prices, isLoading, notFound };
}

/** Prices for a specific set of medicines. */
export function useMedicinePrices(ids: string[]) {
  const [medicinePrices, setMedicinePrices] = useState<Record<string, MedicinePrice[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const key = ids.join(",");

  useEffect(() => {
    const list = key ? key.split(",").filter(Boolean) : [];
    if (!list.length) {
      setMedicinePrices({});
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/medicines/prices?ids=${encodeURIComponent(list.join(","))}`)
      .then((res) => (res.ok ? res.json() : { medicinePrices: {} }))
      .then((body) => {
        if (!cancelled) setMedicinePrices(body.medicinePrices ?? {});
      })
      .catch(() => {
        if (!cancelled) setMedicinePrices({});
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { medicinePrices, isLoading };
}
