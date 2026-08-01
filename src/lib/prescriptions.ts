"use client";

export type PrescriptionStatus = "pending" | "verified" | "preparing" | "ready" | "completed" | "rejected";

export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  doctorName?: string;
  pharmacyName: string;
  imageUrl?: string;
  notes?: string;
  status: PrescriptionStatus;
  createdAt: string;
}

const STORAGE_KEY = "pharmahub-prescriptions";

export function getPrescriptions(): Prescription[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Prescription[]) : [];
  } catch {
    return [];
  }
}

export function savePrescriptions(list: Prescription[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function createPrescription(input: Omit<Prescription, "id" | "status" | "createdAt">): Prescription {
  const rx: Prescription = {
    ...input,
    id: `rx-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const list = getPrescriptions();
  savePrescriptions([rx, ...list]);
  return rx;
}

export function updatePrescriptionStatus(id: string, status: PrescriptionStatus) {
  const list = getPrescriptions().map((p) => (p.id === id ? { ...p, status } : p));
  savePrescriptions(list);
}

export function removePrescription(id: string) {
  savePrescriptions(getPrescriptions().filter((p) => p.id !== id));
}

const STATUS_ORDER: PrescriptionStatus[] = ["pending", "verified", "preparing", "ready", "completed"];

export function getStatusIndex(status: PrescriptionStatus): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export function getNextStatus(status: PrescriptionStatus): PrescriptionStatus | null {
  if (status === "completed" || status === "rejected") return null;
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? null : STATUS_ORDER[idx + 1];
}
