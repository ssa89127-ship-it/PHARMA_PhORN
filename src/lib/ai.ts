import type { ChatResponse, UserProfile } from "@/lib/chatbot";

/**
 * Real AI layer for the VitaHub assistant (Claude API).
 *
 * The rule-based engine in chatbot.ts still runs first: it finds real medicines,
 * prices and pharmacies from our catalog. Those facts are passed to Claude, which
 * writes the final answer in the user's language. If ANTHROPIC_API_KEY is not set
 * or the API call fails, the rule-based answer is returned unchanged.
 */

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-haiku-5-5";

const SYSTEM_PROMPT = `You are VitaHub's pharmacy assistant for users in Uzbekistan.
Reply in the user's language: Uzbek (Latin script) if they write Uzbek, Russian if Russian, English if English.

Rules:
- Use ONLY the medicine names, prices and pharmacies given in "Catalog facts". Never invent prices, stock or pharmacies. If the facts don't cover it, say you don't have that information.
- You are not a doctor. Give general information only. Do not diagnose. For doses, tell the user to follow the package leaflet or ask a pharmacist/doctor.
- Prescription (Rx) medicines, including antibiotics, require an e-retsept (electronic prescription) in Uzbekistan — say so when relevant.
- If the user describes emergency signs (chest pain, trouble breathing, heavy bleeding, loss of consciousness, signs of stroke, severe allergic reaction, suicidal thoughts), tell them to call 103 immediately, first.
- Respect the user's allergies, conditions and current medications if provided; warn about possible interactions you are told about.
- Be short and friendly: 2–6 sentences, plain text, no markdown headers.`;

function buildFacts(rule: ChatResponse): string {
  const parts: string[] = [];
  parts.push(`Rule-engine draft answer:\n${rule.message}`);
  if (rule.suggestedMedicines?.length) {
    parts.push(
      "Medicines found:\n" +
        rule.suggestedMedicines
          .map((m) => `- ${m.name}${m.dosage ? ` (${m.dosage})` : ""}: ${m.price} so'm${m.warning ? ` — warning: ${m.warning}` : ""}`)
          .join("\n")
    );
  }
  if (rule.interactionWarning) parts.push(`Interaction warning: ${rule.interactionWarning}`);
  if (rule.urgency) parts.push(`Urgency level detected: ${rule.urgency}`);
  return parts.join("\n\n");
}

export function isAIEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function generateAIReply(params: {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  rule: ChatResponse;
  profile?: UserProfile;
}): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const { message, history, rule, profile } = params;
  const profileText = profile
    ? `User profile — allergies: ${profile.allergies?.join(", ") || "none"}; conditions: ${profile.conditions?.join(", ") || "none"}; medications: ${profile.medications?.join(", ") || "none"}.`
    : "User profile: not provided.";

  // Last 10 turns of history, must start with a user turn.
  let past = history.slice(-10);
  while (past.length && past[0].role !== "user") past = past.slice(1);

  const messages = [
    ...past,
    {
      role: "user" as const,
      content: `${message}\n\n<catalog_facts>\n${buildFacts(rule)}\n</catalog_facts>\n<profile>${profileText}</profile>`,
    },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("Claude API error:", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.filter((b) => b.type === "text").map((b) => b.text ?? "").join("").trim();
    return text || null;
  } catch (err) {
    console.error("Claude API request failed:", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
