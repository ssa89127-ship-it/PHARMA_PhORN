/**
 * AI Chatbot placeholder.
 * Replace with actual AI/LLM integration in production.
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestedMedicines?: string[];
  suggestedActions?: string[];
}

const symptomResponses: Record<string, ChatResponse> = {
  bosh_ogrigi: {
    message: "Bosh og'rig'i uchun quyidagilarni tavsiya qilamiz:\n1. Paratsetamol 500mg\n2. Ibuprofen 400mg\n3. Ko'p suv iching va dam oling\n\nAgar og'riq 3 kundan ortiq davom etsa, shifokorga murojaat qiling.",
    suggestedMedicines: ["Paratsetamol 500mg", "Ibuprofen 400mg"],
    suggestedActions: ["Shifokor bilan maslahatlashish"],
  },
  isitma: {
    message: "Isitma uchun:\n1. Paratsetamol qabul qiling\n2. Ko'p suyuqlik iching\n3. Dam oling\n\nAgar isitma 38.5°C dan yuqori bo'lsa yoki 3 kundan ortiq davom etsa, shifokorga murojaat qiling.",
    suggestedMedicines: ["Paratsetamol 500mg", "Ibuprofen 400mg"],
    suggestedActions: ["Shifokor bilan maslahatlashish", "Tez yordam chaqirish"],
  },
  gripp: {
    message: "Gripp belgilari uchun:\n1. Ko'p suyuqlik iching\n2. Vitamin C qabul qiling\n3. Immunitetni mustahkamlovchi vositalar\n4. Uyda dam oling",
    suggestedMedicines: ["Vitamin C 500mg", "Paratsetamol 500mg"],
    suggestedActions: ["Shifokor bilan maslahatlashish"],
  },
};

export async function getChatResponse(message: string): Promise<ChatResponse> {
  const lower = message.toLowerCase();

  if (lower.includes("bosh") && (lower.includes("og'ri") || lower.includes("ogri"))) {
    return symptomResponses.bosh_ogrigi;
  }
  if (lower.includes("isitma") || lower.includes("temp") || lower.includes("harorat")) {
    return symptomResponses.isitma;
  }
  if (lower.includes("gripp") || lower.includes("shamoll") || lower.includes("sovuq")) {
    return symptomResponses.gripp;
  }
  if (lower.includes("salom") || lower.includes("assalom")) {
    return {
      message: "Assalomu alaykum! PharmaHub AI yordamchisiga xush kelibsiz. Men sizga dori vositalarini topishda, shifokor bilan maslahatlashishda va sog'lig'ingiz haqida ma'lumot olishda yordam beraman. Qanday yordam kerak?",
      suggestedActions: ["Dori qidirish", "Shifokor bilan maslahat", "Simptomlarni tekshirish"],
    };
  }

  return {
    message: "Kechirasiz, men hozircha faqat asosiy simptomlar bo'yicha maslahat bera olaman. Iltimos, shifokor bilan maslahatlashing yoki dori vositalarini qidirib ko'ring.",
    suggestedActions: ["Dori qidirish", "Shifokor bilan maslahat"],
  };
}

export async function analyzeSymptoms(symptoms: string): Promise<{
  possibleConditions: string[];
  recommendedAction: string;
  urgency: "low" | "medium" | "high" | "emergency";
}> {
  // Placeholder AI symptom checker
  console.log("[AI Placeholder] Analyzing symptoms:", symptoms);
  return {
    possibleConditions: ["Bosh og'rig'i", "O'tkir respirator infeksiya"],
    recommendedAction: "Shifokor bilan maslahatlashish tavsiya etiladi",
    urgency: "low",
  };
}
