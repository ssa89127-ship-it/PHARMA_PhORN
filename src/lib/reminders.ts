/**
 * Medicine Reminders System
 * Store and manage medicine reminders in localStorage
 */

export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  times: string[]; // ["08:00", "20:00"]
  days: string[]; // ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  startDate: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  lastNotified?: string;
}

const STORAGE_KEY = "pharmahub-reminders";

export function getReminders(): Reminder[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveReminders(reminders: Reminder[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

export function addReminder(reminder: Omit<Reminder, "id" | "createdAt">): Reminder {
  const newReminder: Reminder = {
    ...reminder,
    id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  const reminders = getReminders();
  saveReminders([...reminders, newReminder]);
  return newReminder;
}

export function updateReminder(id: string, updates: Partial<Reminder>): void {
  const reminders = getReminders();
  const index = reminders.findIndex((r) => r.id === id);
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates };
    saveReminders(reminders);
  }
}

export function deleteReminder(id: string): void {
  const reminders = getReminders();
  saveReminders(reminders.filter((r) => r.id !== id));
}

export function toggleReminder(id: string): void {
  const reminders = getReminders();
  const index = reminders.findIndex((r) => r.id === id);
  if (index !== -1) {
    reminders[index].isActive = !reminders[index].isActive;
    saveReminders(reminders);
  }
}

// Check if it's time for a reminder
export function checkReminders(reminders: Reminder[]): Reminder[] {
  const now = new Date();
  const currentDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][now.getDay()];
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return reminders.filter((reminder) => {
    if (!reminder.isActive) return false;
    if (!reminder.days.includes(currentDay)) return false;
    if (reminder.endDate && new Date(reminder.endDate) < now) return false;
    return reminder.times.includes(currentTime);
  });
}

// Day labels
export const dayLabels = {
  uz: { mon: "Dush", tue: "Sesh", wed: "Chor", thu: "Pay", fri: "Jum", sat: "Shan", sun: "Yak" },
  ru: { mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс" },
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
};

export const allDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
