/**
 * Payment System
 * Supports: Payme, Click, UzCard, Visa/Mastercard, Cash on Delivery
 */

export type PaymentProvider =
  | "payme"
  | "click"
  | "uzcard"
  | "visa"
  | "mastercard"
  | "cash";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  name: string;
  nameRu: string;
  nameEn: string;
  icon: string;
  description: string;
  descriptionRu: string;
  descriptionEn: string;
  isEnabled: boolean;
  fee: number; // percentage
  minAmount: number;
  maxAmount: number;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  fee: number;
  totalAmount: number;
  status: PaymentStatus;
  cardLast4?: string;
  phone?: string;
  transactionId?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

const STORAGE_KEY = "vitahub-payments";

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pm-payme",
    provider: "payme",
    name: "Payme",
    nameRu: "Payme",
    nameEn: "Payme",
    icon: "/images/payment/payme.svg",
    description: "Payme orqali to'lov",
    descriptionRu: "Оплата через Payme",
    descriptionEn: "Pay with Payme wallet",
    isEnabled: true,
    fee: 0,
    minAmount: 1000,
    maxAmount: 50000000,
  },
  {
    id: "pm-click",
    provider: "click",
    name: "Click",
    nameRu: "Click",
    nameEn: "Click",
    icon: "/images/payment/click.svg",
    description: "Click orqali to'lov",
    descriptionRu: "Оплата через Click",
    descriptionEn: "Pay with Click wallet",
    isEnabled: true,
    fee: 0,
    minAmount: 1000,
    maxAmount: 50000000,
  },
  {
    id: "pm-uzcard",
    provider: "uzcard",
    name: "UzCard",
    nameRu: "UzCard",
    nameEn: "UzCard",
    icon: "/images/payment/uzcard.svg",
    description: "UzCard plastik kartasi",
    descriptionRu: "Карта UzCard",
    descriptionEn: "UzCard debit card",
    isEnabled: true,
    fee: 0,
    minAmount: 1000,
    maxAmount: 100000000,
  },
  {
    id: "pm-visa",
    provider: "visa",
    name: "Visa",
    nameRu: "Visa",
    nameEn: "Visa",
    icon: "/images/payment/visa.svg",
    description: "Visa kredit/debet kartasi",
    descriptionRu: "Кредитная/дебетовая карта Visa",
    descriptionEn: "Visa credit/debit card",
    isEnabled: true,
    fee: 1.5,
    minAmount: 5000,
    maxAmount: 100000000,
  },
  {
    id: "pm-mastercard",
    provider: "mastercard",
    name: "Mastercard",
    nameRu: "Mastercard",
    nameEn: "Mastercard",
    icon: "/images/payment/mastercard.svg",
    description: "Mastercard kredit/debet kartasi",
    descriptionRu: "Кредитная/дебетовая карта Mastercard",
    descriptionEn: "Mastercard credit/debit card",
    isEnabled: true,
    fee: 1.5,
    minAmount: 5000,
    maxAmount: 100000000,
  },
  {
    id: "pm-cash",
    provider: "cash",
    name: "Naqd pul",
    nameRu: "Наличные",
    nameEn: "Cash on Delivery",
    icon: "/images/payment/cash.svg",
    description: "Yetkazib berishda naqd pul bilan to'lash",
    descriptionRu: "Оплата наличными при доставке",
    descriptionEn: "Pay cash when delivered",
    isEnabled: true,
    fee: 0,
    minAmount: 1000,
    maxAmount: 5000000,
  },
];

export function getPaymentMethods(): PaymentMethod[] {
  return paymentMethods.filter((m) => m.isEnabled);
}

export function getPaymentMethod(id: string): PaymentMethod | undefined {
  return paymentMethods.find((m) => m.id === id);
}

export function calculateFee(amount: number, provider: PaymentProvider): number {
  const method = paymentMethods.find((m) => m.provider === provider);
  if (!method) return 0;
  return Math.round(amount * (method.fee / 100));
}

export function getPaymentHistory(): PaymentTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePaymentTransaction(tx: PaymentTransaction): void {
  const history = getPaymentHistory();
  history.unshift(tx);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function updatePaymentTransaction(
  id: string,
  updates: Partial<PaymentTransaction>
): void {
  const history = getPaymentHistory();
  const index = history.findIndex((t) => t.id === id);
  if (index !== -1) {
    history[index] = { ...history[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

export function simulatePayment(
  orderId: string,
  amount: number,
  provider: PaymentProvider,
  phone?: string,
  cardLast4?: string
): PaymentTransaction {
  const fee = calculateFee(amount, provider);
  const tx: PaymentTransaction = {
    id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    orderId,
    provider,
    amount,
    fee,
    totalAmount: amount + fee,
    status: "processing",
    phone,
    cardLast4,
    createdAt: new Date().toISOString(),
  };
  savePaymentTransaction(tx);

  // Simulate async payment processing
  setTimeout(() => {
    const success = Math.random() > 0.05; // 95% success rate
    updatePaymentTransaction(tx.id, {
      status: success ? "completed" : "failed",
      completedAt: success ? new Date().toISOString() : undefined,
      transactionId: success ? `txn-${Date.now()}` : undefined,
      errorMessage: success ? undefined : "Payment declined by bank",
    });
  }, 2000);

  return tx;
}

export function getPaymentStats() {
  const history = getPaymentHistory();
  return {
    total: history.length,
    completed: history.filter((t) => t.status === "completed").length,
    totalSpent: history
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.totalAmount, 0),
    totalFees: history
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.fee, 0),
    byProvider: paymentMethods.map((m) => ({
      provider: m.provider,
      name: m.name,
      count: history.filter((t) => t.provider === m.provider && t.status === "completed").length,
    })),
  };
}
