/**
 * Family Accounts System
 * Manage medicines for family members
 */

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth?: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  createdAt: string;
}

const STORAGE_KEY = "pharmahub-family";

export function getFamilyMembers(): FamilyMember[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFamilyMembers(members: FamilyMember[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function addFamilyMember(member: Omit<FamilyMember, "id" | "createdAt">): FamilyMember {
  const newMember: FamilyMember = {
    ...member,
    id: `family-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  const members = getFamilyMembers();
  saveFamilyMembers([...members, newMember]);
  return newMember;
}

export function updateFamilyMember(id: string, updates: Partial<FamilyMember>): void {
  const members = getFamilyMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...updates };
    saveFamilyMembers(members);
  }
}

export function deleteFamilyMember(id: string): void {
  const members = getFamilyMembers();
  saveFamilyMembers(members.filter((m) => m.id !== id));
}

export const relationshipLabels = {
  uz: { spouse: "Turmush o'rtog'i", child: "Bola", parent: "Ota-ona", sibling: "Op'a aka", grandparent: "Bobo-dada", other: "Boshqa" },
  ru: { spouse: "Супруг(а)", child: "Ребёнок", parent: "Родитель", sibling: "Брат/Сестра", grandparent: "Дедушка/Бабушка", other: "Другое" },
  en: { spouse: "Spouse", child: "Child", parent: "Parent", sibling: "Sibling", grandparent: "Grandparent", other: "Other" },
};
