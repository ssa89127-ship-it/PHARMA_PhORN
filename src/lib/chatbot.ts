/**
 * VitaHub AI yordamchi — data-driven offline assistant.
 * Searches real medicine catalog and answers symptom questions
 * in Uzbek, Russian and English.
 */

import { medicines, medicinePrices } from "./data";
import type { Medicine } from "@/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SuggestedMedicine {
  slug: string;
  name: string;
  price: number;
}

export interface ChatResponse {
  message: string;
  suggestedMedicines?: SuggestedMedicine[];
  suggestedActions?: string[];
}

type Lang = "uz" | "ru" | "en";

const RU_ALIASES: Record<string, string[]> = {
  "болеутоляющие": ["og'riq qoldiruvchi", "painkiller", "analgesic", "og'riq"],
  "антибиотики": ["antibiotik", "antibiotic"],
  "сердце": ["yurak-qon tomir", "yurak", "heart"],
  "диабет": ["qandli diabet", "diabet", "diabetes"],
  "аллергия": ["allergiya", "allergy"],
  "пищеварение": ["ovqat hazm qilish", "digestion"],
  "дыхание": ["nafas olish", "respiratory", "breathing"],
  "витамины": ["vitamin", "vitaminlar"],
  "головная боль": ["bosh og'rig'i", "headache", "bosh"],
  "температура": ["isitma", "fever"],
  "грипп": ["gripp", "flu"],
  "кашель": ["yo'tal", "cough"],
  "боль": ["og'riq", "pain"],
  "живот": ["oshqozon", "stomach", "qorin"],
};

const EN_ALIASES: Record<string, string[]> = {
  pain: ["og'riq", "painkiller", "analgesic"],
  painkillers: ["og'riq qoldiruvchi", "analgesic"],
  antibiotics: ["antibiotik"],
  heart: ["yurak-qon tomir", "yurak"],
  diabetes: ["qandli diabet", "diabet"],
  allergy: ["allergiya"],
  digestion: ["ovqat hazm qilish"],
  respiratory: ["nafas olish"],
  vitamins: ["vitamin"],
  headache: ["bosh og'rig'i", "bosh"],
  fever: ["isitma"],
  flu: ["gripp"],
  cough: ["yo'tal"],
  stomach: ["oshqozon"],
};

const EN_WORDS = /\b(the|what|should|take|have|and|for|please|price|cheap|buy|medicine|headache|fever|cough|flu|doctor|recommend|you|i|help|find)\b/i;
const UZ_WORDS = /\b(nima|qancha|uchun|kerak|bormi|ichsam|og'rig|dorixona|yordam|men|siz|dori|arzon|bor|narx)\b/i;

function detectLang(text: string): Lang {
  if (/[а-яё]/i.test(text)) return "ru";
  const enMatches = (text.match(EN_WORDS) || []).length;
  const uzMatches = (text.match(UZ_WORDS) || []).length;
  return enMatches > uzMatches ? "en" : "uz";
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^\w\sа-яёa-z]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandSynonyms(text: string, lang: Lang): string[] {
  const tokens = normalize(text).split(" ");
  const aliases = lang === "ru" ? RU_ALIASES : lang === "en" ? EN_ALIASES : {};
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const [key, vals] of Object.entries(aliases)) {
      const keyNorm = normalize(key);
      if (keyNorm.includes(token) || token.includes(keyNorm.split(" ")[0] || keyNorm)) {
        vals.forEach((v) => expanded.add(normalize(v)));
      }
    }
  }
  return [...expanded];
}

function scoreMedicine(med: Medicine, terms: string[]): number {
  const haystack = normalize([med.name, med.genericName, med.category, med.description].join(" "));
  const nameNorm = normalize(med.name + " " + med.genericName + " " + med.category);
  let score = 0;
  for (const term of terms) {
    if (!term || term.length < 2) continue;
    if (nameNorm.includes(term)) score += 3;
    else if (haystack.includes(term)) score += 1;
  }
  return score;
}

function cheapestPrice(medId: string): number {
  const offers = medicinePrices[medId];
  if (!offers || offers.length === 0) return 0;
  return Math.min(...offers.map((o) => o.price));
}

function findMedicines(query: string, lang: Lang, limit = 4): SuggestedMedicine[] {
  const terms = expandSynonyms(query, lang);
  const scored = medicines
    .map((med) => ({ med, score: scoreMedicine(med, terms) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map(({ med }) => ({
    slug: med.slug,
    name: med.name,
    price: cheapestPrice(med.id),
  }));
}

const symptomSearches: Record<string, string[]> = {
  "bosh og'rig'i": ["paratsetamol", "ibuprofen"],
  "isitma": ["paratsetamol", "ibuprofen"],
  "gripp": ["vitamin c", "paratsetamol"],
  "yo'tal": ["ambroksol", "sirop"],
  "allergiya": ["loratadin", "setirizin"],
  "oshqozon": ["omez", "domperidon"],
  "qon bosim": ["enalapril", "amlodipin"],
  "diabet": ["metformin"],
  "vitamin": ["vitamin"],
};

type LangStrings = {
  welcome: string;
  greeting: string;
  thanks: string;
  medicineFound: (n: number) => string;
  symptom: string;
  fallback: string;
  disclaimer: string;
  actions: string[];
};

const strings: Record<Lang, LangStrings> = {
  uz: {
    welcome: "Assalomu alaykum! VitaHub AI yordamchisiga xush kelibsiz. Dori nomi, simptom yoki kasallik nomini yozing — men sizga real dorixonalardagi dorilar va narxlarni topib beraman.",
    greeting: "Salom! Qanday yordam bera olaman? Masalan: \"bosh og'rig'iga nima ichsam?\" yoki \"vitamin C narxi\" deb yozing.",
    thanks: "Arzimaydi! Yana savolingiz bo'lsa yozing. Sog' bo'ling!",
    medicineFound: (n: number) =>
      n > 0
        ? `Topildi! Mana eng mos dorilar (narxlar eng arzon dorixonadan):`
        : "Kechirasiz, dorilar bazasida bunday dori topilmadi. Boshqa nom bilan urinib ko'ring yoki shifokor bilan maslahatlashing.",
    symptom: "Simptomlaringiz bo'yicha quyidagi dorilarni tavsiya qilamiz. Iltimos, dorini ishlatishdan oldin shifokor bilan maslahatlashing:",
    fallback: "Men sizni to'liq tushunmadim. Dori nomi, simptom yoki kategoriya (masalan: \"antibiotiklar\", \"vitaminlar\") yozib ko'ring.",
    disclaimer: "Bu AI yordamchi tibbiy maslahat o'rnini bosmaydi. Shifokor bilan maslahatlashing.",
    actions: ["Dori qidirish", "Bosh og'rig'i", "Isitma", "Vitaminlar"],
  },
  ru: {
    welcome: "Здравствуйте! Добро пожаловать в AI-помощник VitaHub. Напишите название лекарства, симптом или болезнь — я найду реальные препараты и цены в аптеках.",
    greeting: "Здравствуйте! Чем могу помочь? Например: «что выпить от головной боли?» или «цена витамина C».",
    thanks: "Пожалуйста! Обращайтесь, если будут вопросы. Будьте здоровы!",
    medicineFound: (n: number) =>
      n > 0
        ? "Найдено! Вот наиболее подходящие лекарства (цены из самой дешёвой аптеки):"
        : "К сожалению, такого лекарства нет в базе. Попробуйте другое название или проконсультируйтесь с врачом.",
    symptom: "По вашим симптомам рекомендуем следующие препараты. Пожалуйста, проконсультируйтесь с врачом перед применением:",
    fallback: "Я не совсем понял вас. Попробуйте написать название лекарства, симптом или категорию (например: «антибиотики», «витамины»).",
    disclaimer: "Этот AI-помощник не заменяет медицинскую консультацию. Проконсультируйтесь с врачом.",
    actions: ["Найти лекарство", "Головная боль", "Температура", "Витамины"],
  },
  en: {
    welcome: "Hello! Welcome to the VitaHub AI assistant. Type a medicine name, symptom, or condition — I'll find real medicines and pharmacy prices for you.",
    greeting: "Hi! How can I help? Try: \"what should I take for a headache?\" or \"vitamin C price\".",
    thanks: "You're welcome! Feel free to ask anytime. Stay healthy!",
    medicineFound: (n: number) =>
      n > 0
        ? "Found! Here are the most suitable medicines (prices from the cheapest pharmacy):"
        : "Sorry, no medicine found in our catalog. Try a different name or consult a doctor.",
    symptom: "Based on your symptoms, we recommend the following medicines. Please consult a doctor before use:",
    fallback: "I didn't quite understand. Try typing a medicine name, symptom, or category (e.g. \"antibiotics\", \"vitamins\").",
    disclaimer: "This AI assistant does not replace medical advice. Please consult a doctor.",
    actions: ["Find medicine", "Headache", "Fever", "Vitamins"],
  },
};

const formatPrice = (lang: Lang, amount: number): string =>
  amount > 0 ? `${new Intl.NumberFormat("ru-RU").format(amount)} ${lang === "ru" ? "сум" : lang === "uz" ? "so'm" : "UZS"}` : "";

function buildMedicineResponse(
  lang: Lang,
  query: string,
  symptomMode: boolean
): ChatResponse {
  const found = findMedicines(query, lang);
  const message = symptomMode
    ? String(strings[lang].symptom)
    : (strings[lang].medicineFound as (n: number) => string)(found.length);
  const suggestedMedicines = found.map((m) => ({
    ...m,
    name: m.price > 0 ? `${m.name} — ${formatPrice(lang, m.price)}` : m.name,
  }));
  return { message, suggestedMedicines, suggestedActions: strings[lang].actions as string[] };
}

export async function getChatResponse(message: string): Promise<ChatResponse> {
  const lang = detectLang(message);
  const lower = normalize(message);

  const greeting = /(salom|assalom|hey|hello|hi|привет|здравствуйте|alo)/.test(lower);
  const thanks = /(rahmat|tashakkur|thanks|thank you|спасибо|благодарю)/.test(lower);
  const helps = /(yordam|help|помощь)/.test(lower);

  if (greeting) {
    return { message: strings[lang].greeting, suggestedActions: strings[lang].actions };
  }
  if (thanks) {
    return { message: strings[lang].thanks };
  }
  if (helps) {
    return { message: strings[lang].greeting, suggestedActions: strings[lang].actions };
  }

  const priceIntent = /(narx|qancha|arzon|price|cheap|buy|сколько|цена|купить|стоит)/i.test(message);

  if (priceIntent) {
    const found = findMedicines(message, lang);
    if (found.length > 0) {
      return buildMedicineResponse(lang, message, false);
    }
  }

  for (const [symptom, meds] of Object.entries(symptomSearches)) {
    const syn = expandSynonyms(symptom, lang);
    const matched = syn.some((term) => term && term.length >= 3 && lower.includes(term));
    if (matched) {
      return buildMedicineResponse(lang, meds.join(" "), true);
    }
  }

  const found = findMedicines(message, lang);
  if (found.length > 0) {
    return buildMedicineResponse(lang, message, false);
  }

  return {
    message: strings[lang].fallback as string,
    suggestedActions: strings[lang].actions as string[],
  };
}

export async function analyzeSymptoms(symptoms: string): Promise<{
  possibleConditions: string[];
  recommendedAction: string;
  urgency: "low" | "medium" | "high" | "emergency";
}> {
  const lang = detectLang(symptoms);
  const lower = normalize(symptoms);

  const isFever = /(isitma|temp|harorat|температура|fever)/.test(lower);
  const isHeadache = /(bosh og'ri|boshogri|голов|headache)/.test(lower);
  const isCough = /(yo'tal|yotal|кашель|cough)/.test(lower);
  const isFlu = /(gripp|грипп|flu)/.test(lower);
  const isChest = /(ko'krak|kokrak|груд|chest|heart)/.test(lower);

  let urgency: "low" | "medium" | "high" | "emergency" = "low";
  const possibleConditions: string[] = [];
  let recommendedAction = "";

  if (isFever) {
    possibleConditions.push(lang === "ru" ? "Лихорадка" : lang === "en" ? "Fever" : "Isitma");
    urgency = "medium";
  }
  if (isHeadache) {
    possibleConditions.push(lang === "ru" ? "Головная боль" : lang === "en" ? "Headache" : "Bosh og'rig'i");
  }
  if (isCough) {
    possibleConditions.push(lang === "ru" ? "Кашель" : lang === "en" ? "Cough" : "Yo'tal");
  }
  if (isFlu) {
    possibleConditions.push(lang === "ru" ? "Грипп / ОРВИ" : lang === "en" ? "Flu / ARVI" : "Gripp / O'RVI");
    urgency = "medium";
  }
  if (isChest) {
    possibleConditions.push(lang === "ru" ? "Боль в груди" : lang === "en" ? "Chest pain" : "Ko'krak qafasi og'rig'i");
    urgency = "emergency";
  }

  if (possibleConditions.length === 0) {
    possibleConditions.push(lang === "ru" ? "Неопределённые симптомы" : lang === "en" ? "Unspecified symptoms" : "Aniqlanmagan simptomlar");
  }

  recommendedAction =
    urgency === "emergency"
      ? lang === "ru"
        ? "Немедленно вызовите скорую помощь (103)"
        : lang === "en"
          ? "Call emergency services immediately (103)"
          : "Zudlik bilan tez yordam chaqiring (103)"
      : lang === "ru"
        ? "Рекомендуется проконсультироваться с врачом"
        : lang === "en"
          ? "Consultation with a doctor is recommended"
          : "Shifokor bilan maslahatlashish tavsiya etiladi";

  return { possibleConditions, recommendedAction, urgency };
}
