/**
 * Price Alerts System
 * Get notified when medicine prices drop
 */

export interface PriceAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  currentPrice: number;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

const STORAGE_KEY = "vitahub-price-alerts";

export function getPriceAlerts(): PriceAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePriceAlerts(alerts: PriceAlert[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export function addPriceAlert(alert: Omit<PriceAlert, "id" | "createdAt">): PriceAlert {
  const newAlert: PriceAlert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  const alerts = getPriceAlerts();
  savePriceAlerts([...alerts, newAlert]);
  return newAlert;
}

export function deletePriceAlert(id: string): void {
  const alerts = getPriceAlerts();
  savePriceAlerts(alerts.filter((a) => a.id !== id));
}

export function togglePriceAlert(id: string): void {
  const alerts = getPriceAlerts();
  const index = alerts.findIndex((a) => a.id === id);
  if (index !== -1) {
    alerts[index].isActive = !alerts[index].isActive;
    savePriceAlerts(alerts);
  }
}

// Check if any alerts should be triggered
export function checkPriceAlerts(alerts: PriceAlert[], currentPrices: Record<string, number>): PriceAlert[] {
  return alerts.filter((alert) => {
    if (!alert.isActive) return false;
    const currentPrice = currentPrices[alert.medicineId];
    return currentPrice && currentPrice <= alert.targetPrice;
  });
}
