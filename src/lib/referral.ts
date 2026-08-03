/**
 * Referral System
 * Invite friends and earn rewards
 */

export interface Referral {
  id: string;
  code: string;
  referredEmail: string;
  status: "pending" | "completed" | "rewarded";
  reward: number;
  createdAt: string;
  completedAt?: string;
}

const STORAGE_KEY = "pharmahub-referrals";
const USER_KEY = "pharmahub-user";

export function getReferralCode(): string {
  if (typeof window === "undefined") return "";
  let code = localStorage.getItem(`${USER_KEY}-referral-code`);
  if (!code) {
    code = `PH-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    localStorage.setItem(`${USER_KEY}-referral-code`, code);
  }
  return code;
}

export function getReferrals(): Referral[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveReferrals(referrals: Referral[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(referrals));
}

export function addReferral(email: string): Referral {
  const referral: Referral = {
    id: `ref-${Date.now()}`,
    code: getReferralCode(),
    referredEmail: email,
    status: "pending",
    reward: 10000,
    createdAt: new Date().toISOString(),
  };
  const referrals = getReferrals();
  saveReferrals([...referrals, referral]);
  return referral;
}

export function getReferralStats() {
  const referrals = getReferrals();
  return {
    total: referrals.length,
    completed: referrals.filter((r) => r.status === "completed" || r.status === "rewarded").length,
    totalRewards: referrals.filter((r) => r.status === "rewarded").reduce((sum, r) => sum + r.reward, 0),
  };
}

export const REFERRAL_REWARD = 10000; // 10,000 so'm per referral
