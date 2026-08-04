/**
 * Health Records System
 * Store and manage personal health information
 */

export interface HealthRecord {
  id: string;
  type: "allergy" | "condition" | "medication" | "test" | "note";
  title: string;
  description: string;
  date: string;
  doctor?: string;
  attachments?: string[];
  createdAt: string;
}

const STORAGE_KEY = "vitahub-health";

export function getHealthRecords(): HealthRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHealthRecords(records: HealthRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addHealthRecord(record: Omit<HealthRecord, "id" | "createdAt">): HealthRecord {
  const newRecord: HealthRecord = {
    ...record,
    id: `health-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  const records = getHealthRecords();
  saveHealthRecords([...records, newRecord]);
  return newRecord;
}

export function updateHealthRecord(id: string, updates: Partial<HealthRecord>): void {
  const records = getHealthRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updates };
    saveHealthRecords(records);
  }
}

export function deleteHealthRecord(id: string): void {
  const records = getHealthRecords();
  saveHealthRecords(records.filter((r) => r.id !== id));
}

export const recordTypes = {
  uz: { allergy: "Allergiya", condition: "Kasallik", medication: "Dori", test: "Tahlil", note: "Eslatma" },
  ru: { allergy: "Аллергия", condition: "Заболевание", medication: "Лекарство", test: "Анализ", note: "Заметка" },
  en: { allergy: "Allergy", condition: "Condition", medication: "Medication", test: "Test", note: "Note" },
};
