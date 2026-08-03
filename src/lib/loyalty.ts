/**
 * Loyalty Program
 * Points system for repeat customers
 */

export interface LoyaltyTransaction {
  id: string;
  type: "earn" | "spend";
  points: number;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = "pharmahub-loyalty";
const POINTS_PER_SO_M = 1; // 1 point per 1 so'm spent
const REWARD_THRESHOLD = 100000; // Spend 100,000 so'm to get reward

export function getLoyaltyPoints(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(`${STORAGE_KEY}-points`) || "0");
}

export function saveLoyaltyPoints(points: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY}-points`, points.toString());
}

export function getLoyaltyHistory(): LoyaltyTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}-history`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addLoyaltyTransaction(type: "earn" | "spend", points: number, description: string): void {
  const history = getLoyaltyHistory();
  const transaction: LoyaltyTransaction = {
    id: `loyalty-${Date.now()}`,
    type,
    points,
    description,
    createdAt: new Date().toISOString(),
  };
  history.unshift(transaction);
  localStorage.setItem(`${STORAGE_KEY}-history`, JSON.stringify(history));

  const currentPoints = getLoyaltyPoints();
  saveLoyaltyPoints(type === "earn" ? currentPoints + points : currentPoints - points);
}

export function earnPoints(amount: number): number {
  const points = Math.floor(amount / 1000); // 1 point per 1,000 so'm
  if (points > 0) {
    addLoyaltyTransaction("earn", points, `Buyurtma uchun: ${amount.toLocaleString()} so'm`);
  }
  return points;
}

export function getLoyaltyTier(): { name: string; color: string; discount: number } {
  const points = getLoyaltyPoints();
  if (points >= 5000) return { name: "Platinum", color: "from-gray-400 to-gray-600", discount: 10 };
  if (points >= 2000) return { name: "Gold", color: "from-yellow-400 to-orange-500", discount: 7 };
  if (points >= 500) return { name: "Silver", color: "from-gray-300 to-gray-500", discount: 5 };
  return { name: "Bronze", color: "from-orange-300 to-orange-500", discount: 2 };
}

export const TIER_LABELS = {
  uz: { Bronze: "Bronza", Silver: "Kumush", Gold: "Oltin", Platinum: "Platina" },
  ru: { Bronze: "Бронза", Silver: "Серебро", Gold: "Золото", Platinum: "Платина" },
  en: { Bronze: "Bronze", Silver: "Silver", Gold: "Gold", Platinum: "Platinum" },
};
