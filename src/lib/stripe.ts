/**
 * Stripe integration placeholder.
 * Replace with actual Stripe keys in production.
 */

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder";

export const stripeConfig = {
  publishableKey: stripeKey,
  currency: "uzs",
  currencySymbol: "so'm",
  locale: "uz",
};

export interface StripePaymentIntent {
  id: string;
  amount: number;
  status: "requires_payment_method" | "processing" | "succeeded" | "failed";
  clientSecret: string;
}

export async function createPaymentIntent(amount: number): Promise<StripePaymentIntent> {
  // Placeholder: In production, call Stripe API
  console.log(`[Stripe Placeholder] Creating payment intent for ${amount} so'm`);

  return {
    id: `pi_placeholder_${Date.now()}`,
    amount,
    status: "requires_payment_method",
    clientSecret: `pi_secret_placeholder_${Date.now()}`,
  };
}

export async function confirmPayment(paymentIntentId: string): Promise<boolean> {
  // Placeholder: In production, confirm with Stripe
  console.log(`[Stripe Placeholder] Confirming payment: ${paymentIntentId}`);
  return true;
}

export async function processRefund(paymentIntentId: string, amount?: number): Promise<boolean> {
  // Placeholder: In production, process refund via Stripe
  console.log(`[Stripe Placeholder] Processing refund for ${paymentIntentId}: ${amount || "full"}`);
  return true;
}

export function formatStripePrice(amount: number): string {
  return `${(amount / 100).toLocaleString("uz-UZ")} so'm`;
}
