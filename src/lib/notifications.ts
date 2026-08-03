/**
 * Push Notifications UI
 * Notification preferences and history
 */

export interface NotificationPreference {
  id: string;
  type: "promotions" | "order_updates" | "price_alerts" | "reminders" | "health_tips" | "referrals";
  enabled: boolean;
  channel: "push" | "email" | "sms";
}

export interface NotificationItem {
  id: string;
  type: "promo" | "order" | "price" | "reminder" | "tip" | "referral";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const PREF_KEY = "pharmahub-notif-prefs";
const HISTORY_KEY = "pharmahub-notif-history";

export function getNotificationPreferences(): NotificationPreference[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PREF_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [
    { id: "promotions", type: "promotions", enabled: true, channel: "push" },
    { id: "order_updates", type: "order_updates", enabled: true, channel: "push" },
    { id: "price_alerts", type: "price_alerts", enabled: true, channel: "push" },
    { id: "reminders", type: "reminders", enabled: true, channel: "push" },
    { id: "health_tips", type: "health_tips", enabled: false, channel: "email" },
    { id: "referrals", type: "referrals", enabled: true, channel: "push" },
  ];
}

export function saveNotificationPreferences(prefs: NotificationPreference[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

export function getNotificationHistory(): NotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [
    {
      id: "notif-1",
      type: "promo",
      title: "Yangi chegirma!",
      message: "Paracetamol 500mg - 20% OFF",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "notif-2",
      type: "tip",
      title: "Salomatlik maslahati",
      message: "Kuniga 2 litr suv ichish tavsiya etiladi",
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export function markNotificationRead(id: string): void {
  const history = getNotificationHistory();
  const item = history.find((n) => n.id === id);
  if (item) {
    item.read = true;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

export function markAllNotificationsRead(): void {
  const history = getNotificationHistory();
  history.forEach((n) => (n.read = true));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getUnreadCount(): number {
  return getNotificationHistory().filter((n) => !n.read).length;
}
