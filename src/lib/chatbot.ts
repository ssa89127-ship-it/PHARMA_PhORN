/**
 * VitaHub AI Yordamchi v2 — Advanced offline AI assistant.
 *
 * Features:
 * - Fuzzy matching with Levenshtein distance for typo tolerance
 * - Multi-turn conversation context memory
 * - Personalized recommendations (allergies, conditions, medications)
 * - Drug interaction warnings
 * - Dosage & side effect information
 * - 30+ symptom patterns with body system analysis
 * - Severity scoring and urgency detection
 * - 3-language support (UZ/RU/EN) with cross-language synonyms
 */

import type { Medicine } from "@/types";
import { getFamilyMembers } from "./family";

let medicines: Medicine[] = [];
let medicinePrices: Record<string, any[]> = {};
let _dataLoaded = false;

async function ensureData() {
  if (_dataLoaded) return;
  try {
    const mod = await import("./data");
    medicines = mod.medicines;
    medicinePrices = mod.medicinePrices as any;
    pharmacies = mod.pharmacies;
    _dataLoaded = true;
  } catch (error) {
    console.error("Failed to load data for chatbot:", error);
    medicines = [];
    medicinePrices = {};
    pharmacies = [];
  }
}

let pharmacies: any[] = [];

// ─── Types ────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "warning" | "info";
}

export interface SuggestedMedicine {
  slug: string;
  name: string;
  price: number;
  dosage?: string;
  sideEffects?: string[];
  warning?: string;
}

export interface ChatResponse {
  message: string;
  suggestedMedicines?: SuggestedMedicine[];
  suggestedActions?: string[];
  interactionWarning?: string;
  urgency?: "low" | "medium" | "high" | "emergency";
  followUpQuestions?: string[];
}

export interface ConversationContext {
  messages: ChatMessage[];
  currentTopic: string | null;
  lastMedicines: string[];
  userProfile?: {
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
}

type Lang = "uz" | "ru" | "en";

// ─── Fuzzy Matching (Levenshtein Distance) ────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function fuzzyMatch(query: string, target: string, threshold = 0.6): boolean {
  const q = normalize(query || "");
  const t = normalize(target || "");
  if (!q || !t) return false;

  if (t.includes(q) || q.includes(t)) return true;

  const maxLen = Math.max(q.length, t.length);
  if (maxLen === 0) return true;
  const distance = levenshtein(q, t);
  const similarity = 1 - distance / maxLen;
  return similarity >= threshold;
}

// ─── Expanded Synonym Database ────────────────────────────────────

const SYNONYMS: Record<string, string[]> = {
  // Pain & Fever
  "headache": ["bosh og'rig'i", "bosh og'riq", "migren", "головная боль", "мигрень"],
  "fever": ["isitma", "harorat", "temperatura", "лихорадка", "жар"],
  "pain": ["og'riq", "боль", "pain"],
  "toothache": ["tish og'rig'i", "зубная боль"],
  "stomachache": ["qorin og'rig'i", "oshqozon og'rig'i", "боль в животе"],
  "backache": ["bel og'rig'i", "спинная боль"],
  "joint": ["bo'g'im", "сустав"],
  "muscle": ["mushak", "мышца"],

  // Cold & Flu
  "cold": ["shamollash", "prostuda", "ОРВИ", "common cold"],
  "flu": ["gripp", "грипп", "influenza"],
  "cough": ["yo'tal", "кашель"],
  "sore_throat": ["tomog' og'rig'i", "angina", "боль в горле"],
  "runny_nose": ["burun oqishi", "насморк", "rhinitis"],
  "sneezing": ["aksirish", "чихание"],
  "congestion": ["burun tiqilishi", "заложенность носа"],

  // Allergies
  "allergy": ["allergiya", "аллергия", "allergic"],
  "rash": ["to'shma", "сыпь", "dermatitis"],
  "itching": ["qichish", "зуд", "itch"],
  "swelling": ["shish", "отёк", "edema"],
  "hives": ["qichitqi", "крапивница", "urticaria"],
  "watery_eyes": ["ko'z yoshlanishi", "слёзотечение"],

  // Digestive
  "nausea": ["ko'ngil aynish", "тошнота", "nausea"],
  "vomiting": ["qusish", "рвота", "vomiting"],
  "diarrhea": ["ish chalkashishi", "диарея", "понос"],
  "constipation": ["qabziyat", "запор", "constipation"],
  "heartburn": ["oshqozon yonishi", "изжога", "GERD"],
  "bloating": ["shishish", "вздутие", "bloating"],
  "indigestion": ["ovqat hazm bo'lmaslik", "диспепсия"],

  // Respiratory
  "asthma": ["astma", "астhma", "bronchial asthma"],
  "breathing": ["nafas olish", "дыхание", "dyspnea"],
  "wheezing": ["viqillash", "хрипы", "wheeze"],

  // Cardiovascular
  "blood_pressure": ["qon bosim", "артериальное давление", "hypertension"],
  "heart": ["yurak", "сердце", "cardiac"],
  "palpitation": ["yurak urishi", "тахикардия", "palpitation"],

  // Mental Health
  "anxiety": ["tashvish", "тревога", "anxiety", "stress"],
  "insomnia": ["uyqusizlik", "бессонница", "insomnia"],
  "depression": ["depressiya", "депрессия", "depression"],

  // Skin
  "acne": ["akne", "угри", "pimples"],
  "eczema": ["ekzema", "экзема", "dermatitis"],
  "fungus": ["zamburug'", "грибок", "fungal"],

  // Eye
  "eye_pain": ["ko'z og'rig'i", "боль в глазах"],
  "dry_eye": ["ko'z qurishi", "сухость глаз"],

  // Urinary
  "uti": ["siydik infektsiyasi", "цистит", "urinary infection"],
  "kidney": ["buyrak", "почка", "renal"],

  // Women's Health
  "menstrual": ["hayz", "менструация", "menstruation"],
  "cramps": ["spazm", "спазм", "cramps"],

  // Categories
  "antibiotics": ["antibiotik", "антибиотик", "antibacterial"],
  "painkillers": ["og'riq qoldiruvchi", "обезболивающее", "analgesic", "NSAID"],
  "vitamins": ["vitamin", "витамин", "supplement"],
  "probiotics": ["probiotik", "пробиотик", "probiotic"],
  "antifungal": ["antifung", "противогрибковый"],
  "antihistamine": ["antigistamin", "антигистаминный"],

  // Medicine Forms
  "tablet": ["tableta", "таблетка", "pill"],
  "capsule": ["kapsula", "капсула"],
  "syrup": ["sirop", "сироп"],
  "cream": ["krem", "крем", "ointment"],
  "drops": ["tomchi", "капли", "drops"],
  "injection": ["ukol", "укол", "injection", "syringe"],
  "spray": ["sprey", "спрей"],
  "gel": ["gel", "гель"],
};

// ─── Language Detection ───────────────────────────────────────────

const LANG_PATTERNS = {
  ru: /[а-яё]/i,
  en: /\b(the|what|should|take|have|and|for|please|price|cheap|buy|medicine|headache|fever|cough|flu|doctor|recommend|you|i|help|find|my|i'm|can|do|does|is|are|how|where|when|why|which|tell|about|give|need|want|have|has|had)\b/i,
  uz: /\b(nima|qancha|uchun|kerak|bormi|ichsam|og'rig|dorixona|yordam|men|siz|dori|arzon|bor|narx|bering|toping|qilish|bo'yicha|haqida|tavsiya|maslahat)\b/i,
};

function detectLang(text: string): Lang {
  if (LANG_PATTERNS.ru.test(text)) return "ru";
  const enScore = (text.match(LANG_PATTERNS.en) || []).length;
  const uzScore = (text.match(LANG_PATTERNS.uz) || []).length;
  return enScore > uzScore ? "en" : "uz";
}

function normalize(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^\w\sа-яёa-z]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Intent Detection ─────────────────────────────────────────────

interface Intent {
  type: "greeting" | "thanks" | "help" | "price" | "symptom" | "medicine_search" | "interaction_check" | "dosage" | "side_effects" | "alternative" | "category" | "emergency" | "where_to_buy" | "discounts" | "hours" | "delivery" | "popular" | "who_are_you" | "order_status" | "unknown";
  confidence: number;
  entities: string[];
}

function detectIntent(text: string, lang: Lang): Intent {
  const lower = normalize(text);
  const entities: string[] = [];

  // Greeting
  if (/(salom|assalom|hey|hello|hi|привет|здравствуйте|alo|salomley|assalomu)\b/i.test(lower)) {
    return { type: "greeting", confidence: 0.95, entities: [] };
  }

  // Thanks
  if (/(rahmat|tashakkur|thanks|thank you|спасибо|благодарю|rahmatlar)\b/i.test(lower)) {
    return { type: "thanks", confidence: 0.95, entities: [] };
  }

  // Help
  if (/(yordam|help|помощь|nima qil|what can|qanday qil|qanday yordam)/i.test(lower)) {
    return { type: "help", confidence: 0.9, entities: [] };
  }

  // Emergency
  if (/(tez yordam|emergency|скорая|103|112|shoshilinch|urgent|juda og'ri|juda yomon|ottle|choking|heart attack|stroke)/i.test(lower)) {
    return { type: "emergency", confidence: 0.95, entities: [] };
  }

  // Who are you / capabilities
  if (/(sen kimsan|кто ты|who are you|nima qila olasan|what can you do|qanday ishlaysan|что ты умеешь)/i.test(lower)) {
    return { type: "who_are_you", confidence: 0.95, entities: [] };
  }

  // Discounts / promotions (checked early: "chegirma bormi?" etc.)
  if (/(chegirma|акция|скидк|discount|promo|sale|arzonlashtir|aktsiya|deals?)/i.test(lower)) {
    return { type: "discounts", confidence: 0.85, entities: [] };
  }

  // Opening hours
  if (/(ish vaqti|qachongacha|ochiq|soat nechada|open now|opening hours|working hours|часы работы|работает|во сколько работает|24 soat|24\/7|24ч)/i.test(lower)) {
    return { type: "hours", confidence: 0.85, entities: [] };
  }

  // Delivery
  if (/(yetkaz|доставка|delivery|dostavka|курьер|tez yetib)/i.test(lower)) {
    return { type: "delivery", confidence: 0.85, entities: [] };
  }

  // Popular / bestsellers
  if (/(mashhur|popular|bestseller|популярное|top dorilar|eng ko'p sotil|best seller|tavsiya etilgan|хиты)/i.test(lower)) {
    return { type: "popular", confidence: 0.8, entities: [] };
  }

  // Order status
  if (/(buyurtma|заказ|order status|где мой заказ|\border\b|tracking)/i.test(lower)) {
    return { type: "order_status", confidence: 0.8, entities: [] };
  }

  // Where to buy / pharmacy availability
  if (/(qaerdan|qayerdan|qayerda bor|qaysi dorixona|dorixonada|bormi\b|bormasmi|есть ли|в наличии|где купить|где можно|where can i buy|where to buy|where is|which pharmacy|in stock)/i.test(lower)) {
    const medName = extractMedicineName(lower);
    if (medName) entities.push(medName);
    return { type: "where_to_buy", confidence: 0.85, entities };
  }

  // Symptom detection — must run before price/dosage/side-effects so phrases
  // like "bosh og'rig'iga nima ichsam" resolve as symptoms, not dosage queries
  const symptomResult = detectSymptoms(lower, lang);
  if (symptomResult.symptoms.length > 0) {
    return { type: "symptom", confidence: symptomResult.confidence, entities: symptomResult.symptoms };
  }

  // Price query
  if (/(narx|qancha|arzon|price|cheap|buy|сколько|цена|купить|стоит|necha|qimmat|sarovon)/i.test(lower)) {
    // Extract medicine name from price query
    const medName = extractMedicineName(lower);
    if (medName) entities.push(medName);
    return { type: "price", confidence: 0.85, entities };
  }

  // Interaction check — safety-critical, checked before dosage/side-effects
  if (/(interaction|o'zaro ta'sir|взаимодействие|together|birga|combined|mixed)/i.test(lower)) {
    return { type: "interaction_check", confidence: 0.85, entities: extractMedicineNames(lower) };
  }

  // Dosage query
  if (/(doz|dозировка|necha mg|qancha mg|tablet|dose|qabul|ichish|ichsam|qanday qilib|instructions|usage|directions)/i.test(lower)) {
    const medName = extractMedicineName(lower);
    if (medName) entities.push(medName);
    return { type: "dosage", confidence: 0.85, entities };
  }

  // Side effects
  if (/(side effect|nojo'ya|побочный|efect|reaction|allergik|allergic reaction)/i.test(lower)) {
    const medName = extractMedicineName(lower);
    if (medName) entities.push(medName);
    return { type: "side_effects", confidence: 0.85, entities };
  }

  // Alternative
  if (/(alternative|almashinuv|замена|instead|boshqa|другой|generic|oxirgi)/i.test(lower)) {
    const medName = extractMedicineName(lower);
    if (medName) entities.push(medName);
    return { type: "alternative", confidence: 0.8, entities };
  }

  // Category search
  if (/(antibiotik|vitamin|og'riq qoldiruvchi|antibiotic|painkiller|vitamin|обезболивающее|антибиотик)/i.test(lower)) {
    const cats = extractCategory(lower);
    if (cats) entities.push(cats);
    return { type: "category", confidence: 0.85, entities };
  }

  // Medicine search (fallback)
  const medName = extractMedicineName(lower);
  if (medName) {
    entities.push(medName);
    return { type: "medicine_search", confidence: 0.7, entities };
  }

  return { type: "unknown", confidence: 0.3, entities: [] };
}

function bestMedicineMatch(text: string): Medicine | null {
  const cleaned = normalize(text);
  if (cleaned.length < 2) return null;

  let best: { med: Medicine; score: number } | null = null;
  for (const med of medicines) {
    const names = [med.name, med.genericName]
      .filter((n): n is string => typeof n === "string" && n.length > 0)
      .map(normalize)
      .filter((n) => n.length > 1);
    for (const n of names) {
      let score = 0;
      if (cleaned.includes(n)) score = n.length * 2;
      else if (n.includes(cleaned) && cleaned.length >= 3) score = cleaned.length;
      else if (fuzzyMatch(cleaned, n, 0.72) && cleaned.length >= 3) score = Math.min(n.length, cleaned.length);
      if (score > 0 && (!best || score > best.score)) best = { med, score };
    }
  }
  return best?.med ?? null;
}

const MED_STOPWORDS = new Set([
  "nima", "qancha", "uchun", "kerak", "bormi", "bormasmi", "bering", "toping", "qilish", "bo'yicha",
  "haqida", "tavsiya", "maslahat", "price", "narx", "narxi", "arzon", "qimmat", "buy", "give", "find",
  "search", "show", "tell", "about", "what", "which", "how", "where", "the", "a", "an", "for", "my",
  "i", "me", "you", "do", "does", "is", "are", "can", "should", "take", "have", "has", "had", "ichsam",
  "ichish", "qabul", "qanday", "necha", "mg", "tableta", "kapsula", "sirop", "dori", "dorilar", "dori vositasi",
  "qayerda", "qayerdan", "qaerdan", "qaysi", "dorixona", "dorixonada", "bor", "ochiq", "soat", "holati",
  "kuni", "24", "24/7", "shu", "bu", "u", "uning", "ё", "лекарство", "препарат",
]);

function extractMedicineName(text: string): string | null {
  const exact = bestMedicineMatch(text);
  if (exact) return exact.name;

  const cleaned = text
    .replace(/^(nima|qancha|narxi|uchun|kerak|bormi|bering|toping|qilish|bo'yicha|haqida|tavsiya|maslahat|price|narx|arzon|qimmat|give|find|search|show|tell|about|what|which|how|where|the|a|an|for|my|i|me|you|do|does|is|are|can|should|take|have|has|had|ichsam|ichish|qabul|qanday|necha|mg|tableta|kapsula|sirop|dori|dorilar|medicines?|edicine?|qayerda|qayerdan|qaerdan|qaysi|dorixona|bor|ochiq|soat|holati|лекарство|препарат|dori vositasi)\s*/gi, "")
    .trim();

  if (cleaned.length < 2) return null;

  // Try to find exact medicine match
  for (const med of medicines) {
    if (fuzzyMatch(cleaned, med.name) || (med.genericName && fuzzyMatch(cleaned, med.genericName))) {
      return med.name;
    }
  }

  // Try partial match
  for (const med of medicines) {
    const nameLower = normalize(med.name);
    const genericLower = normalize(med.genericName);
    if (nameLower.includes(cleaned) || cleaned.includes(nameLower) ||
        (genericLower && (genericLower.includes(cleaned) || cleaned.includes(genericLower)))) {
      return med.name;
    }
  }

  // Strip noise words and match on the name prefix
  // e.g. "paratsetamol qayerda bor" → "paratsetamol" → "Paratsetamol 200mg"
  const filtered = cleaned
    .split(" ")
    .filter((w) => w && !MED_STOPWORDS.has(w))
    .join(" ");
  if (filtered.length >= 3) {
    const prefix = filtered.split(" ").slice(0, 3).join(" ");
    for (const med of medicines) {
      const nameLower = normalize(med.name);
      const genericLower = normalize(med.genericName);
      if (nameLower.startsWith(prefix) || (genericLower && genericLower.startsWith(prefix))) {
        return med.name;
      }
    }
  }

  return cleaned.length > 2 && filtered ? cleaned : null;
}

function extractMedicineNames(text: string): string[] {
  const names: string[] = [];

  // Multi-word match first (e.g. "vitamin C", "ACC 200", "Diklofenak gel")
  const multi = bestMedicineMatch(text);
  if (multi) {
    names.push(multi.name);
    return names;
  }

  const words = text.split(/\s+/);
  for (const word of words) {
    if (word.length > 3) {
      for (const med of medicines) {
        if (fuzzyMatch(word, med.name) || (med.genericName && fuzzyMatch(word, med.genericName))) {
          if (!names.includes(med.name)) names.push(med.name);
        }
      }
    }
  }
  return names;
}

function extractCategory(text: string): string | null {
  const categoryMap: Record<string, string[]> = {
    "antibiotiklar": ["antibiotik", "antibiotic", "антибиотик"],
    "vitaminlar": ["vitamin", "витамин"],
    "og'riq qoldiruvchi": ["og'riq", "pain", "обезболивающее", "painkiller"],
    "allergiyaga qarshi": ["allergi", "аллерг", "antihistamine"],
    "ovqat hazm qilish": ["hazm", "digest", "желудок", " stomach"],
    "yurak-qon tomir": ["yurak", "heart", "сердце", "cardio"],
    "nafas olish": ["nafas", "breath", "дыхан", "asthma"],
    "asab tizimi": ["asab", "neuro", "нерв"],
    "teri kasalliklari": ["teri", "skin", "кожа", "dermat"],
    "ko'z dorilari": ["ko'z", "eye", "глаз"],
  };

  for (const [cat, keywords] of Object.entries(categoryMap)) {
    for (const kw of keywords) {
      if (text.includes(kw)) return cat;
    }
  }
  return null;
}

// ─── Symptom Detection ────────────────────────────────────────────

interface SymptomResult {
  symptoms: string[];
  bodySystem: string;
  severity: "low" | "medium" | "high" | "emergency";
  confidence: number;
}

const SYMPTOM_DB: Record<string, { keywords: string[]; system: string; severity: SymptomResult["severity"] }> = {
  // Head & Neurological
  headache: { keywords: ["bosh og'ri", "headache", "головн боль", "migren", "migraine", "boshim og"], system: "neurological", severity: "low" },
  migraine: { keywords: ["migren", "migraine", "мигрень", "yarim bosh"], system: "neurological", severity: "medium" },
  dizziness: { keywords: ["bosh aylanish", "dizziness", "головокружение", "vertigo"], system: "neurological", severity: "medium" },

  // Fever & Infection
  fever: { keywords: ["isitma", "fever", "температура", "harorat", "жар"], system: "infection", severity: "medium" },
  chills: { keywords: ["qotish", "chills", "озноб", "sovuq"], system: "infection", severity: "low" },

  // Respiratory
  cough: { keywords: ["yo'tal", "cough", "кашель"], system: "respiratory", severity: "low" },
  sore_throat: { keywords: ["tomog' og'ri", "sore throat", "боль в горле", "angina"], system: "respiratory", severity: "low" },
  runny_nose: { keywords: ["burun oq", "runny nose", "насморк", "rhinit"], system: "respiratory", severity: "low" },
  shortness_of_breath: { keywords: ["nafas qis", "shortness", "одышка", "dyspnea"], system: "respiratory", severity: "high" },
  wheezing: { keywords: ["viqillash", "wheez", "хрип"], system: "respiratory", severity: "medium" },

  // Digestive
  nausea: { keywords: ["ko'ngil ayn", "nausea", "тошнот", "to'g'ri"], system: "digestive", severity: "low" },
  vomiting: { keywords: ["qusish", "vomit", "рвот"], system: "digestive", severity: "medium" },
  diarrhea: { keywords: ["ish chalkash", "diarrhea", "диарея", "понос"], system: "digestive", severity: "medium" },
  constipation: { keywords: ["qabziyat", "constip", "запор"], system: "digestive", severity: "low" },
  heartburn: { keywords: ["oshqozon yon", "heartburn", "изжог"], system: "digestive", severity: "low" },
  stomachache: { keywords: ["qorin og'ri", "stomach", "живот", "abdom"], system: "digestive", severity: "medium" },

  // Cardiovascular
  chest_pain: { keywords: ["ko'krak og'ri", "chest pain", "грудная боль", "angina pectoris"], system: "cardiovascular", severity: "emergency" },
  palpitations: { keywords: ["yurak urish", "palpitation", "тахикард", "arrhythm"], system: "cardiovascular", severity: "high" },
  high_blood_pressure: { keywords: ["qon bosim yuqori", "hypertension", "гипертония", "high blood pressure"], system: "cardiovascular", severity: "high" },

  // Allergic
  rash: { keywords: ["to'shma", "rash", "сыпь", "dermatitis"], system: "allergic", severity: "low" },
  itching: { keywords: ["qichish", "itch", "зуд"], system: "allergic", severity: "low" },
  swelling: { keywords: ["shish", "swelling", "отёк", "edema"], system: "allergic", severity: "medium" },
  hives: { keywords: ["qichitqi", "hives", "крапивница", "urticaria"], system: "allergic", severity: "medium" },

  // Musculoskeletal
  joint_pain: { keywords: ["bo'g'im og'ri", "joint pain", "боль в суставе"], system: "musculoskeletal", severity: "low" },
  back_pain: { keywords: ["bel og'ri", "back pain", "боль в спине"], system: "musculoskeletal", severity: "low" },
  muscle_pain: { keywords: ["mushak og'ri", "muscle pain", "мышечная боль"], system: "musculoskeletal", severity: "low" },

  // Urinary
  uti: { keywords: ["siydik infektsiya", "urinary", "цистит", "cystitis"], system: "urinary", severity: "medium" },

  // Mental
  anxiety: { keywords: ["tashvish", "anxiety", "тревог", "stress"], system: "mental", severity: "low" },
  insomnia: { keywords: ["uyqusizlik", "insomnia", "бессон"], system: "mental", severity: "low" },
};

function detectSymptoms(text: string, lang: Lang): SymptomResult {
  const found: string[] = [];
  let maxSeverity: SymptomResult["severity"] = "low";
  let bodySystem = "general";
  let confidence = 0;

  // Keywords may contain apostrophes ("bosh og'ri") while `text` is normalized
  // without them — normalize keywords too so Uzbek text matches reliably
  for (const [symptom, data] of Object.entries(SYMPTOM_DB)) {
    for (const keyword of data.keywords) {
      const kw = normalize(keyword);
      if (kw && text.includes(kw)) {
        found.push(symptom);
        bodySystem = data.system;
        confidence = Math.max(confidence, 0.8);
        if (severityRank(data.severity) > severityRank(maxSeverity)) {
          maxSeverity = data.severity;
        }
        break;
      }
    }
  }

  return { symptoms: found, bodySystem, severity: maxSeverity, confidence };
}

function severityRank(s: string): number {
  return { low: 1, medium: 2, high: 3, emergency: 4 }[s] || 0;
}

// ─── Symptom → Medicine Mapping (Expanded) ────────────────────────

const SYMPTOM_MEDS: Record<string, Record<Lang, string[]>> = {
  headache: {
    uz: ["paratsetamol", "ibuprofen", "aspirin", "nurofen", "tsitramon"],
    ru: ["парацетамол", "ибупрофен", "аспирин", "нурофен"],
    en: ["paracetamol", "ibuprofen", "aspirin", "nurofen"],
  },
  fever: {
    uz: ["paratsetamol", "ibuprofen", "nurofen", "meksal"],
    ru: ["парацетамол", "ибупрофен", "нурофен"],
    en: ["paracetamol", "ibuprofen", "nurofen"],
  },
  cough: {
    uz: ["ambroksol", " ACC", "libeksin", "sirop", "bronholin"],
    ru: ["амброксол", "АЦЦ", "лордестин"],
    en: ["ambroxol", "ACC", "bromhexine"],
  },
  sore_throat: {
    uz: ["strepsils", "lizobakt", "ingalipt", "gorpil"],
    ru: ["стрепсилс", "лизобакт", "ингалипт"],
    en: ["strepsils", "lozenges", "chloraseptic"],
  },
  runny_nose: {
    uz: ["nazivin", "sanorin", "vibrocil", "xylometazoline"],
    ru: ["називин", "санорин", "виброцил"],
    en: ["oxymetazoline", "phenylephrine", "cetirizine"],
  },
  allergy: {
    uz: ["loratadin", "setirizin", "cetirizin", "zodak", "suprastin"],
    ru: ["лоратадин", "цетиризин", "зодак", "супрастин"],
    en: ["loratadine", "cetirizine", "fexofenadine"],
  },
  nausea: {
    uz: ["mezim", "festal", "domperidon", "motilium"],
    ru: ["мезим", "фестал", "домперидон"],
    en: ["ondansetron", "domperidone", "pepto-bismol"],
  },
  diarrhea: {
    uz: ["loperamid", "smekta", "enterosgel", "polysorb"],
    ru: ["лоперамид", "смекта", "энтеросгель"],
    en: ["loperamide", "bismuth", "probiotics"],
  },
  heartburn: {
    uz: ["omez", "omeprazol", "ranitidin", "pantoprazol", "nexium"],
    ru: ["омепразол", "ранитидин", "пантопразол"],
    en: ["omeprazole", "pantoprazole", "esomeprazole"],
  },
  stomachache: {
    uz: ["mezim", "festal", "no-shpa", "drotaverin", "buscopan"],
    ru: ["мезим", "но-шпа", "дротаверин"],
    en: ["dicyclomine", "hyoscine", "antacid"],
  },
  constipation: {
    uz: ["laktuloza", "bisacodyl", "forlax", "duphalac"],
    ru: ["лактулоза", "бисакодил", "дюфалак"],
    en: ["polyethylene glycol", "docusate", "psyllium"],
  },
  joint_pain: {
    uz: ["ibuprofen", "diklofenak", "ketonal", "nimesulid"],
    ru: ["ибупрофен", "диклофенак", "кетонал"],
    en: ["ibuprofen", "naproxen", "diclofenac"],
  },
  muscle_pain: {
    uz: ["ibuprofen", "diklofenak gel", "fastum gel", "finalgon"],
    ru: ["ибупрофен", "диклофенак гель", "фастум гель"],
    en: ["ibuprofen", "topical NSAIDs", "menthol cream"],
  },
  back_pain: {
    uz: ["ibuprofen", "diklofenak", "midocalm", "sirdalud"],
    ru: ["ибупрофен", "диклофенак", "мидокалм"],
    en: ["ibuprofen", "cyclobenzaprine", "naproxen"],
  },
  anxiety: {
    uz: ["valeriana", "passionflower", "glicin", "adaptol"],
    ru: ["валериана", "глицин", "адаптол"],
    en: ["lorazepam", "buspirone", "valerian"],
  },
  insomnia: {
    uz: ["melatonin", "donormil", "valeriana", "passiflora"],
    ru: ["мелатонин", "донормил", "валериана"],
    en: ["melatonin", "diphenhydramine", "doxepin"],
  },
  uti: {
    uz: ["monural", "nitroksolin", "furadonin", "canephron"],
    ru: ["монураль", "нитроксолин", "фурадонин"],
    en: ["nitrofurantoin", "trimethoprim", "cranberry"],
  },
  rash: {
    uz: ["fenistil gel", "prednizolon", "hydrocortisone", "zirtec"],
    ru: ["фенистил гель", "преднизолон", "гидрокортизон"],
    en: ["hydrocortisone", "calamine", "diphenhydramine"],
  },
  dizziness: {
    uz: ["betaserk", "vestibo", "betahistine", "ginkgo biloba"],
    ru: ["бетасерк", "вестибо", "гинкго билоба"],
    en: ["meclizine", "betahistine", "ginger"],
  },
  high_blood_pressure: {
    uz: ["amlodipin", "enalapril", "losartan", "metoprolol"],
    ru: ["амлодипин", "эналаприл", "лозартан"],
    en: ["amlodipine", "lisinopril", "losartan"],
  },
  shortness_of_breath: {
    uz: ["salbutamol", "berodual", "ventolin", "beclomet"],
    ru: ["салбутамол", "беродуал", "вентолин"],
    en: ["albuterol", "ipratropium", "theophylline"],
  },
};

// ─── Medicine Scoring & Search ────────────────────────────────────

function scoreMedicine(med: Medicine, terms: string[], userProfile?: { allergies: string[]; conditions: string[] }): number {
  const haystack = normalize([med.name, med.genericName, med.category, med.description].join(" "));
  const nameNorm = normalize(med.name + " " + med.genericName + " " + med.category);
  let score = 0;

  for (const term of terms) {
    if (!term || term.length < 2) continue;
    if (nameNorm.includes(term)) score += 5;
    else if (haystack.includes(term)) score += 2;
    else if (fuzzyMatch(term, med.name) || (med.genericName && fuzzyMatch(term, med.genericName))) score += 3;
  }

  // Penalize if matches user's allergies
  if (userProfile?.allergies) {
    for (const allergy of userProfile.allergies) {
      if (fuzzyMatch(allergy, med.name) || fuzzyMatch(allergy, med.genericName) ||
          normalize(med.description).includes(normalize(allergy))) {
        score -= 100;
      }
    }
  }

  return score;
}

function cheapestPrice(medId: string): number {
  const offers = medicinePrices[medId];
  if (!offers || offers.length === 0) return 0;
  return Math.min(...offers.map((o) => o.price));
}

function findMedicines(query: string, lang: Lang, limit = 4, userProfile?: { allergies: string[]; conditions: string[] }): SuggestedMedicine[] {
  const terms = expandSynonyms(query, lang);
  const scored = medicines
    .map((med) => ({ med, score: scoreMedicine(med, terms, userProfile) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ med }) => ({
    slug: med.slug,
    name: med.name,
    price: cheapestPrice(med.id),
    dosage: med.dosage,
    sideEffects: med.sideEffects?.slice(0, 3),
  }));
}

function expandSynonyms(text: string, lang: Lang): string[] {
  const tokens = normalize(text).split(" ");
  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const [key, vals] of Object.entries(SYNONYMS)) {
      const keyNorm = normalize(key);
      if (keyNorm.includes(token) || token.includes(keyNorm) ||
          fuzzyMatch(token, keyNorm, 0.7)) {
        vals.forEach((v) => expanded.add(normalize(v)));
      }
    }
  }

  return [...expanded];
}

// ─── Drug Interaction Checking ────────────────────────────────────

function checkInteractions(medicineNames: string[], userMedications: string[]): string[] {
  const warnings: string[] = [];

  // Known dangerous combinations
  const DANGEROUS_COMBOS: [string[], string, string][] = [
    [["warfarin", "varfarin"], "aspirin", "Qon ketishi xavfi oshadi / Increased bleeding risk"],
    [["metformin"], "alcohol", "Laktikatsidoz xavfi / Lactic acidosis risk"],
    [["ibuprofen", "nurofen"], "aspirin", "Aspirin samarasi kamayishi mumkin"],
    [["paratsetamol"], "alcohol", "Jigar zararlanishi xavfi / Liver damage risk"],
    [["omeprazol"], "clopidogrel", "Clopidogrel samarasi kamayadi"],
    [["ciprofloxacin"], "antacid", "Antibiotik so'rilishi kamayadi"],
    [["lisinopril"], "potassium", "Qon kaliy darajasi oshishi mumkin"],
    [["metoprolol"], "verapamil", "Yurak blokasi xavfi"],
    [["amoxicillin"], "methotrexate", "Methotrexate zaharlanishi oshishi"],
  ];

  const allMeds = [...medicineNames, ...userMedications].map(normalize).filter(Boolean);

  for (const [triggers, danger, warning] of DANGEROUS_COMBOS) {
    const hasTrigger = triggers.some(t => allMeds.some(m => fuzzyMatch(t, m, 0.6)));
    const hasDanger = allMeds.some(m => fuzzyMatch(danger, m, 0.6));
    if (hasTrigger && hasDanger) {
      warnings.push(`⚠️ ${warning}`);
    }
  }

  return warnings;
}

// ─── User Profile Loading ─────────────────────────────────────────

function loadUserProfile(): { allergies: string[]; conditions: string[]; medications: string[] } | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const family = getFamilyMembers();
    if (family.length > 0) {
      const allergies = family.flatMap(m => m.allergies || []);
      const conditions = family.flatMap(m => m.conditions || []);
      const medications = family.flatMap(m => m.medications || []);
      return { allergies, conditions, medications };
    }
  } catch {}

  return undefined;
}

// ─── Response Strings ─────────────────────────────────────────────

type LangStrings = {
  welcome: string;
  greeting: string;
  thanks: string;
  medicineFound: (n: number) => string;
  symptom: string;
  fallback: string;
  disclaimer: string;
  actions: string[];
  emergency: string;
  dosageInfo: string;
  sideEffectsInfo: string;
  interactionWarning: string;
  allergyWarning: (allergies: string[]) => string;
  conditionWarning: (conditions: string[]) => string;
  alternativeFound: string;
  noAlternative: string;
  categoryResults: string;
  contextFollowUp: string;
  priceResults: string;
  availabilityIntro: string;
  noAvailability: string;
  discountsIntro: string;
  noDiscounts: string;
  hoursIntro: string;
  noHours: string;
  deliveryIntro: string;
  popularIntro: string;
  whoAreYou: string;
  orderIntro: string;
  noOrders: string;
};

const strings: Record<Lang, LangStrings> = {
  uz: {
    welcome: "Assalomu alaykum! VitaHub AI yordamchisiga xush kelibsiz. Men sizga 10,000+ dori vositasini topishda yordam beraman. Dori nomi, simptom yoki kasallik nomini yozing.",
    greeting: "Salom! Qanday yordam bera olaman? Masalan: \"bosh og'rig'iga nima ichsam?\" yoki \"vitamin C narxi\" deb yozing.",
    thanks: "Arzimaydi! Yana savolingiz bo'lsa yozing. Sog' bo'ling!",
    medicineFound: (n: number) =>
      n > 0
        ? `Topildi! Mana eng mos dorilar (narxlar eng arzon dorixonadan):`
        : "Kechirasiz, dorilar bazasida bunday dori topilmadi. Boshqa nom bilan urinib ko'ring yoki shifokor bilan maslahatlashing.",
    symptom: "Simptomlaringiz bo'yicha quyidagi dorilarni tavsiya qilamiz. Iltimos, dorini ishlatishdan oldin shifokor bilan maslahatlashing:",
    fallback: "Men sizni to'liq tushunmadim. Dori nomi, simptom yoki kategoriya (masalan: \"antibiotiklar\", \"vitaminlar\") yozib ko'ring.",
    disclaimer: "Bu AI yordamchi tibbiy maslahat o'rnini bosmaydi. Shifokor bilan maslahatlashing.",
    actions: ["Dori qidirish", "Bosh og'rig'i", "Isitma", "Vitaminlar", "Allergiya", "Qorin og'rig'i"],
    emergency: "🚨 SHOSHLINCH! Tez yordamni chaqiring (103) yoki eng yaqin shifokorga murojaat qiling!",
    dosageInfo: "Dozani shifokor belgilashi kerak. Odatda:",
    sideEffectsInfo: "Nojo'ya ta'sirlar:",
    interactionWarning: "⚠️ DIQQAT! Bu dori sizning hozirgi doringiz bilan o'zaro ta'sir qilishi mumkin:",
    allergyWarning: (allergies: string[]) => `🚫 DIQQAT! Sizda ${allergies.join(", ")} allergiyasi bor. Bu dorini ishlatishdan oldin shifokor bilan maslahatlashing!`,
    conditionWarning: (conditions: string[]) => `⚠️ Sizning ${conditions.join(", ")} kasalligingizni hisobga oling.`,
    alternativeFound: "Alternativ dorilar:",
    noAlternative: "Alternativ dori topilmadi.",
    categoryResults: "Kategoriyaga ko'ra natijalar:",
    contextFollowUp: "Avvalgi suhbat bo'yicha:",
    priceResults: "Narxlar solishtirilmoqda:",
    availabilityIntro: "Quyidagi dorixonalarda mavjud (eng arzoni birinchi):",
    noAvailability: "Kechirasiz, hozircha bu dorining dorixonalarda mavjudligi haqida ma'lumot topilmadi.",
    discountsIntro: "Mana hozirgi chegirmadagi dorilar:",
    noDiscounts: "Hozircha faol chegirmalar topilmadi. Tez orada qaytadan urinib ko'ring!",
    hoursIntro: "Dorixonalarning ish vaqti:",
    noHours: "Kechirasiz, bu dorixona haqida ma'lumot topilmadi.",
    deliveryIntro: "Yetkazib berish xizmati:",
    popularIntro: "Mana eng mashhur dorilar:",
    whoAreYou: "Men VitaHub AI yordamchisiman! Quyidagilarda yordam bera olaman:",
    orderIntro: "Buyurtma holati:",
    noOrders: "Buyurtmalar haqida ma'lumot topilmadi. Buyurtma ID sini yozing (masalan: ORD-001).",
  },
  ru: {
    welcome: "Здравствуйте! Добро пожаловать в AI-помощник VitaHub. Я помогу найти более 10,000 лекарств. Напишите название лекарства, симптом или болезнь.",
    greeting: "Здравствуйте! Чем могу помочь? Например: «что выпить от головной боли?» или «цена витамина C».",
    thanks: "Пожалуйста! Обращайтесь, если будут вопросы. Будьте здоровы!",
    medicineFound: (n: number) =>
      n > 0
        ? "Найдено! Вот наиболее подходящие лекарства (цены из самой дешёвой аптеки):"
        : "К сожалению, такого лекарства нет в базе. Попробуйте другое название или проконсультируйтесь с врачом.",
    symptom: "По вашим симптомам рекомендуем следующие препараты. Пожалуйста, проконсультируйтесь с врачом перед применением:",
    fallback: "Я не совсем понял вас. Попробуйте написать название лекарства, симптом или категорию (например: «антибиотики», «витамины»).",
    disclaimer: "Этот AI-помощник не заменяет медицинскую консультацию. Проконсультируйтесь с врачом.",
    actions: ["Найти лекарство", "Головная боль", "Температура", "Витамины", "Аллергия", "Боль в животе"],
    emergency: "🚨 СРОЧНО! Немедленно вызовите скорую помощь (103) или обратитесь к врачу!",
    dosageInfo: "Дозировку должен назначить врач. Обычно:",
    sideEffectsInfo: "Побочные эффекты:",
    interactionWarning: "⚠️ ВНИМАНИЕ! Это лекарство может взаимодействовать с вашим текущим препаратом:",
    allergyWarning: (allergies: string[]) => `🚫 ВНИМАНИЕ! У вас аллергия на ${allergies.join(", ")}. Проконсультируйтесь с врачом перед применением!`,
    conditionWarning: (conditions: string[]) => `⚠️ Учтите ваше заболевание: ${conditions.join(", ")}.`,
    alternativeFound: "Альтернативные лекарства:",
    noAlternative: "Альтернатива не найдена.",
    categoryResults: "Результаты по категории:",
    contextFollowUp: "По предыдущему вопросу:",
    priceResults: "Сравнение цен:",
    availabilityIntro: "В наличии в следующих аптеках (сначала дешевле):",
    noAvailability: "К сожалению, информации о наличии этого лекарства в аптеках пока нет.",
    discountsIntro: "Вот лекарства со скидкой прямо сейчас:",
    noDiscounts: "Активных скидок пока нет. Попробуйте позже!",
    hoursIntro: "Часы работы аптек:",
    noHours: "К сожалению, информации об этой аптеке нет.",
    deliveryIntro: "Служба доставки:",
    popularIntro: "Вот самые популярные лекарства:",
    whoAreYou: "Я AI-помощник VitaHub! Я могу помочь вам с:",
    orderIntro: "Статус заказа:",
    noOrders: "Информация о заказах не найдена. Напишите ID заказа (например: ORD-001).",
  },
  en: {
    welcome: "Hello! Welcome to the VitaHub AI assistant. I'll help you find from 10,000+ medicines. Type a medicine name, symptom, or condition.",
    greeting: "Hi! How can I help? Try: \"what should I take for a headache?\" or \"vitamin C price\".",
    thanks: "You're welcome! Feel free to ask anytime. Stay healthy!",
    medicineFound: (n: number) =>
      n > 0
        ? "Found! Here are the most suitable medicines (prices from the cheapest pharmacy):"
        : "Sorry, no medicine found in our catalog. Try a different name or consult a doctor.",
    symptom: "Based on your symptoms, we recommend the following medicines. Please consult a doctor before use:",
    fallback: "I didn't quite understand. Try typing a medicine name, symptom, or category (e.g. \"antibiotics\", \"vitamins\").",
    disclaimer: "This AI assistant does not replace medical advice. Please consult a doctor.",
    actions: ["Find medicine", "Headache", "Fever", "Vitamins", "Allergy", "Stomach ache"],
    emergency: "🚨 EMERGENCY! Call emergency services immediately (103) or see a doctor right away!",
    dosageInfo: "Dosage should be prescribed by a doctor. Typically:",
    sideEffectsInfo: "Common side effects:",
    interactionWarning: "⚠️ WARNING! This medicine may interact with your current medication:",
    allergyWarning: (allergies: string[]) => `🚫 WARNING! You have allergies to ${allergies.join(", ")}. Consult a doctor before taking this!`,
    conditionWarning: (conditions: string[]) => `⚠️ Consider your conditions: ${conditions.join(", ")}.`,
    alternativeFound: "Alternative medicines:",
    noAlternative: "No alternative found.",
    categoryResults: "Results by category:",
    contextFollowUp: "Following up on our previous conversation:",
    priceResults: "Comparing prices:",
    availabilityIntro: "Available at these pharmacies (cheapest first):",
    noAvailability: "Sorry, we couldn't find stock information for this medicine right now.",
    discountsIntro: "Here are the current deals:",
    noDiscounts: "No active discounts right now. Check back soon!",
    hoursIntro: "Pharmacy opening hours:",
    noHours: "Sorry, no information found about this pharmacy.",
    deliveryIntro: "Delivery service:",
    popularIntro: "Here are the most popular medicines:",
    whoAreYou: "I'm the VitaHub AI assistant! I can help you with:",
    orderIntro: "Order status:",
    noOrders: "No order info found. Type an order ID (e.g. ORD-001).",
  },
};

const formatPrice = (lang: Lang, amount: number): string =>
  amount > 0
    ? `${new Intl.NumberFormat("ru-RU").format(amount)} ${lang === "ru" ? "сум" : lang === "uz" ? "so'm" : "UZS"}`
    : "";

// ─── Conversation Context (In-Memory) ─────────────────────────────

const conversationStore = new Map<string, ConversationContext>();

function getContext(chatId: string): ConversationContext {
  if (!conversationStore.has(chatId)) {
    conversationStore.set(chatId, { messages: [], currentTopic: null, lastMedicines: [] });
  }
  return conversationStore.get(chatId)!;
}

function updateContext(chatId: string, userMsg: string, response: ChatResponse, lang: Lang): void {
  const ctx = getContext(chatId);
  ctx.messages.push(
    { id: `user-${Date.now()}`, role: "user", content: userMsg, timestamp: new Date() },
    { id: `assistant-${Date.now()}`, role: "assistant", content: response.message, timestamp: new Date() }
  );
  if (ctx.messages.length > 20) ctx.messages = ctx.messages.slice(-20);

  // Track topic
  if (response.suggestedMedicines && response.suggestedMedicines.length > 0) {
    ctx.currentTopic = "medicine";
    ctx.lastMedicines = response.suggestedMedicines.map(m => m.name);
  }
}

// ─── Main Chat Response ───────────────────────────────────────────

export type UserProfile = {
  allergies: string[];
  conditions: string[];
  medications: string[];
};

export async function getChatResponse(
  message: string,
  chatId = "default",
  profile?: UserProfile
): Promise<ChatResponse> {
  await ensureData();
  const lang = detectLang(message);
  const intent = detectIntent(message, lang);
  const userProfile = profile ?? loadUserProfile();
  const context = getContext(chatId);
  const s = strings[lang];

  // Check for context follow-up
  const isFollowUp = context.currentTopic && isFollowUpQuestion(message, lang);

  // Resolve pronouns / short follow-ups to the last discussed medicine
  // e.g. "u qancha turadi?", "its price?", "а сколько стоит?"
  let resolvedIntent = intent;
  if (
    isFollowUp &&
    resolvedIntent.entities.length === 0 &&
    context.lastMedicines.length > 0 &&
    (resolvedIntent.type === "price" ||
      resolvedIntent.type === "dosage" ||
      resolvedIntent.type === "side_effects" ||
      resolvedIntent.type === "alternative" ||
      resolvedIntent.type === "where_to_buy")
  ) {
    resolvedIntent = { ...resolvedIntent, entities: [context.lastMedicines[0]] };
  }

  // Emergency
  if (resolvedIntent.type === "emergency") {
    return {
      message: s.emergency,
      urgency: "emergency",
      suggestedActions: ["103 - Tez yordam", "Shifokor topish"],
    };
  }

  // Greeting
  if (resolvedIntent.type === "greeting") {
    const response: ChatResponse = {
      message: s.greeting,
      suggestedActions: s.actions,
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Thanks
  if (resolvedIntent.type === "thanks") {
    return { message: s.thanks };
  }

  // Help
  if (resolvedIntent.type === "help") {
    return {
      message: s.greeting,
      suggestedActions: s.actions,
    };
  }

  // Who are you / capabilities
  if (resolvedIntent.type === "who_are_you") {
    const capabilities =
      lang === "uz"
        ? "• Dori qidirish va narxlarini solishtirish\n• Simptomlar bo'yicha tavsiya\n• Dorixonalarda mavjudlik\n• Chegirmalar va mashhur dorilar\n• Dozalash va nojo'ya ta'sirlar\n• Buyurtma holati"
        : lang === "ru"
          ? "• Поиск лекарств и сравнение цен\n• Рекомендации по симптомам\n• Наличие в аптеках\n• Скидки и популярные лекарства\n• Дозировка и побочные эффекты\n• Статус заказа"
          : "• Find medicines and compare prices\n• Symptom-based recommendations\n• Pharmacy availability\n• Deals and popular medicines\n• Dosage and side effects\n• Order status";
    return {
      message: s.whoAreYou + "\n" + capabilities,
      suggestedActions: s.actions,
    };
  }

  // Where to buy / pharmacy availability
  if (resolvedIntent.type === "where_to_buy") {
    const query = resolvedIntent.entities.join(" ") || message;
    const med = bestMedicineMatch(query);
    if (med) {
      const offers = (medicinePrices[med.id] || [])
        .filter((o) => o.isAvailable)
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
      if (offers.length > 0) {
        const lines = offers.map((o) => {
          const ph = pharmacies.find((p) => p.id === o.pharmacyId);
          const deliveryFee = o.deliveryFee || ph?.deliveryFee;
          const feeText = deliveryFee > 0 ? formatPrice(lang, deliveryFee) : lang === "uz" ? "bepul" : lang === "ru" ? "бесплатно" : "free";
          const delivery =
            lang === "uz" ? `Yetkazish: ${feeText}, ${o.deliveryTime}`
            : lang === "ru" ? `Доставка: ${feeText}, ${o.deliveryTime}`
            : `Delivery: ${feeText}, ${o.deliveryTime}`;
          return `• ${o.pharmacyName} — ${formatPrice(lang, o.price)}${ph?.address ? ` (${ph.address})` : ""}\n  ${delivery}`;
        });
        const response: ChatResponse = {
          message: `${s.availabilityIntro}\n${lines.join("\n")}`,
          suggestedMedicines: [{
            slug: med.slug,
            name: med.name,
            price: offers[0].price,
            dosage: med.dosage,
          }],
          suggestedActions: s.actions,
        };
        updateContext(chatId, message, response, lang);
        return response;
      }
      return { message: `${s.noAvailability} (${med.name})`, suggestedActions: s.actions };
    }
  }

  // Discounts / promotions
  if (resolvedIntent.type === "discounts") {
    const deals = medicines
      .filter((m) => (m.discount ?? 0) > 0 || m.discountedPrice)
      .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
      .slice(0, 5);
    const found = deals.length > 0
      ? deals.map((m) => ({
          slug: m.slug,
          name: m.name,
          price: m.discountedPrice ?? cheapestPrice(m.id),
          dosage: m.discount ? `${m.discount}% chegirma` : undefined,
        }))
      : [];
    const response: ChatResponse = {
      message: found.length > 0 ? s.discountsIntro : s.noDiscounts,
      suggestedMedicines: found,
      suggestedActions: s.actions,
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Opening hours
  if (resolvedIntent.type === "hours") {
    const query = normalize(message);
    const ph = pharmacies.find((p) => fuzzyMatch(query, normalize(p.name), 0.5)) || null;
    if (ph) {
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const dayNames: Record<Lang, string[]> = {
        uz: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
        ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      };
      const nowDay = new Date().getDay();
      const hoursLines = days.map((d, i) => {
        const day = ph.workingHours?.[d];
        if (!day || !day.isOpen) return `${dayNames[lang][i]}: ${lang === "uz" ? "Yopiq" : lang === "ru" ? "Закрыто" : "Closed"}`;
        return `${dayNames[lang][i]}: ${day.open} – ${day.close}`;
      });
      const openText = ph.isOpen
        ? lang === "uz" ? "Hozir ochiq ✅" : lang === "ru" ? "Открыто сейчас ✅" : "Open now ✅"
        : lang === "uz" ? "Hozir yopiq" : lang === "ru" ? "Сейчас закрыто" : "Currently closed";
      const response: ChatResponse = {
        message: `${s.hoursIntro} ${ph.name}\n${openText}\n${hoursLines.join("\n")}`,
        suggestedActions: s.actions,
      };
      updateContext(chatId, message, response, lang);
      return response;
    }
    const open24 = pharmacies.filter((p) => p.is24hours).slice(0, 5);
    if (open24.length > 0) {
      const names = open24.map((p) => `• ${p.name} (${p.address})`).join("\n");
      const prefix = lang === "uz" ? "24/7 ishlaydigan dorixonalar:" : lang === "ru" ? "Аптеки, работающие 24/7:" : "24/7 pharmacies:";
      const response: ChatResponse = {
        message: `${s.hoursIntro}\n${prefix}\n${names}`,
        suggestedActions: s.actions,
      };
      updateContext(chatId, message, response, lang);
      return response;
    }
    return { message: s.noHours, suggestedActions: s.actions };
  }

  // Delivery
  if (resolvedIntent.type === "delivery") {
    const ph = pharmacies.find((p) => p.offersDelivery) || pharmacies[0];
    if (ph) {
      const fee = ph.freeDelivery ? (lang === "uz" ? "Bepul" : lang === "ru" ? "Бесплатно" : "Free") : formatPrice(lang, ph.deliveryFee ?? 0);
      const minOrder = formatPrice(lang, ph.minimumOrder ?? 0);
      const line =
        lang === "uz"
          ? `• ${ph.name}: yetkazish ${fee}, ${ph.deliveryTime ?? "1-2 soat"}, minimal buyurtma ${minOrder}`
          : lang === "ru"
            ? `• ${ph.name}: доставка ${fee}, ${ph.deliveryTime ?? "1-2 часа"}, минимальный заказ ${minOrder}`
            : `• ${ph.name}: delivery ${fee}, ${ph.deliveryTime ?? "1-2 hours"}, minimum order ${minOrder}`;
      const response: ChatResponse = {
        message: `${s.deliveryIntro}\n${line}`,
        suggestedActions: s.actions,
      };
      updateContext(chatId, message, response, lang);
      return response;
    }
    return { message: s.deliveryIntro, suggestedActions: s.actions };
  }

  // Popular / bestsellers
  if (resolvedIntent.type === "popular") {
    const popular = [...medicines]
      .sort((a, b) => (b.stockQuantity ?? 0) - (a.stockQuantity ?? 0))
      .slice(0, 5)
      .map((m) => ({
        slug: m.slug,
        name: m.name,
        price: cheapestPrice(m.id),
        dosage: m.dosage,
      }));
    const response: ChatResponse = {
      message: s.popularIntro,
      suggestedMedicines: popular,
      suggestedActions: s.actions,
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Order status
  if (resolvedIntent.type === "order_status") {
    try {
      const { orders } = await import("./data");
      const idMatch = message.match(/\b(ORD[-_ ]?\d+)\b/i);
      const order = idMatch
        ? orders.find((o) => normalize(o.id) === normalize(idMatch[1]))
        : orders[orders.length - 1];
      if (order) {
        const statusText =
          lang === "uz" ? `Buyurtma ${order.id}: ${order.status}\nJami: ${formatPrice(lang, order.total)}`
          : lang === "ru" ? `Заказ ${order.id}: ${order.status}\nИтого: ${formatPrice(lang, order.total)}`
          : `Order ${order.id}: ${order.status}\nTotal: ${formatPrice(lang, order.total)}`;
        const delivery =
          lang === "uz" ? `Yetkazib berish: ${order.estimatedDelivery}`
          : lang === "ru" ? `Доставка: ${order.estimatedDelivery}`
          : `Delivery: ${order.estimatedDelivery}`;
        const response: ChatResponse = {
          message: `${s.orderIntro}\n${statusText}\n${delivery}`,
          suggestedActions: s.actions,
        };
        updateContext(chatId, message, response, lang);
        return response;
      }
    } catch {}
    return { message: s.noOrders, suggestedActions: s.actions };
  }

  // Symptom-based recommendation
  if (resolvedIntent.type === "symptom" && resolvedIntent.entities.length > 0) {
    const primarySymptom = resolvedIntent.entities[0];
    const symptomMeds = SYMPTOM_MEDS[primarySymptom]?.[lang] || SYMPTOM_MEDS[primarySymptom]?.["en"] || [];
    const found = symptomMeds.length > 0 ? findMedicines(symptomMeds.join(" "), lang, 4, userProfile) : findMedicines(resolvedIntent.entities.join(" "), lang, 4, userProfile);

    let message = s.symptom;

    // Check interactions
    if (userProfile?.medications && found.length > 0) {
      const warnings = checkInteractions(found.map(m => m.name), userProfile.medications);
      if (warnings.length > 0) {
        message += "\n\n" + warnings.join("\n");
      }
    }

    // Allergy warning
    if (userProfile?.allergies && found.length > 0) {
      const allergyMeds = found.filter(m =>
        userProfile!.allergies.some(a => fuzzyMatch(a, m.name, 0.5))
      );
      if (allergyMeds.length > 0) {
        message += "\n\n" + s.allergyWarning(userProfile.allergies);
      }
    }

    const response: ChatResponse = {
      message,
      suggestedMedicines: found,
      suggestedActions: s.actions,
      followUpQuestions: generateFollowUpQuestions(primarySymptom, lang),
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Price query
  if (resolvedIntent.type === "price") {
    const query = resolvedIntent.entities.length > 0 ? resolvedIntent.entities.join(" ") : message;
    const found = findMedicines(query, lang, 4, userProfile);
    const response: ChatResponse = {
      message: (s.priceResults as string) + "\n" + (s.medicineFound as (n: number) => string)(found.length),
      suggestedMedicines: found.map(m => ({
        ...m,
        name: m.price > 0 ? `${m.name} — ${formatPrice(lang, m.price)}` : m.name,
      })),
      suggestedActions: s.actions,
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Dosage query
  if (resolvedIntent.type === "dosage") {
    const query = resolvedIntent.entities.length > 0 ? resolvedIntent.entities.join(" ") : message;
    const found = findMedicines(query, lang, 2, userProfile);
    if (found.length > 0) {
      const med = found[0];
      const medData = medicines.find(m => m.name === med.name);
      let dosageText = `${s.dosageInfo}\n`;
      if (medData) {
        dosageText += `• ${medData.name}: ${medData.dosage || "1-2 tabletka, kuniga 3 marta"}\n`;
        dosageText += `• ${medData.form}: ${medData.strength || ""}\n`;
        if (medData.sideEffects && medData.sideEffects.length > 0) {
          dosageText += `\n${s.sideEffectsInfo} ${medData.sideEffects.slice(0, 3).join(", ")}`;
        }
      }
      const response: ChatResponse = {
        message: dosageText,
        suggestedMedicines: found,
        suggestedActions: s.actions,
      };
      updateContext(chatId, message, response, lang);
      return response;
    }
  }

  // Side effects query
  if (resolvedIntent.type === "side_effects") {
    const query = resolvedIntent.entities.length > 0 ? resolvedIntent.entities.join(" ") : message;
    const found = findMedicines(query, lang, 2, userProfile);
    if (found.length > 0) {
      const medData = medicines.find(m => m.name === found[0].name);
      let seText = `${s.sideEffectsInfo}\n`;
      if (medData && medData.sideEffects) {
        medData.sideEffects.forEach(se => { seText += `• ${se}\n`; });
      } else {
        seText += "Nojo'ya ta'sirlar haqida shifokorga murojaat qiling.";
      }
      const response: ChatResponse = {
        message: seText,
        suggestedMedicines: found,
        suggestedActions: s.actions,
      };
      updateContext(chatId, message, response, lang);
      return response;
    }
  }

  // Interaction check
  if (resolvedIntent.type === "interaction_check") {
    if (userProfile?.medications && resolvedIntent.entities.length > 0) {
      const warnings = checkInteractions(resolvedIntent.entities, userProfile.medications);
      if (warnings.length > 0) {
        const response: ChatResponse = {
          message: s.interactionWarning + "\n\n" + warnings.join("\n"),
          interactionWarning: warnings.join("\n"),
          suggestedActions: s.actions,
        };
        updateContext(chatId, message, response, lang);
        return response;
      } else {
        const response: ChatResponse = {
          message: "Xavfsiz ko'rinadi, lekin shifokor bilan maslahatlashing.",
          suggestedActions: s.actions,
        };
        updateContext(chatId, message, response, lang);
        return response;
      }
    }
  }

  // Category search
  if (resolvedIntent.type === "category" && resolvedIntent.entities.length > 0) {
    const catName = resolvedIntent.entities[0];
    const found = medicines
      .filter(m => fuzzyMatch(normalize(m.category), normalize(catName), 0.5))
      .slice(0, 6)
      .map(m => ({
        slug: m.slug,
        name: m.name,
        price: cheapestPrice(m.id),
        dosage: m.dosage,
      }));
    const response: ChatResponse = {
      message: `${s.categoryResults}\n${(s.medicineFound as (n: number) => string)(found.length)}`,
      suggestedMedicines: found,
      suggestedActions: s.actions,
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Alternative search
  if (resolvedIntent.type === "alternative" && resolvedIntent.entities.length > 0) {
    const query = resolvedIntent.entities.join(" ");
    const found = findMedicines(query, lang, 6, userProfile);
    if (found.length > 0) {
      const response: ChatResponse = {
        message: s.alternativeFound as string,
        suggestedMedicines: found,
        suggestedActions: s.actions,
      };
      updateContext(chatId, message, response, lang);
      return response;
    }
  }

  // Medicine search
  if (resolvedIntent.type === "medicine_search") {
    const query = resolvedIntent.entities.length > 0 ? resolvedIntent.entities.join(" ") : message;
    const found = findMedicines(query, lang, 4, userProfile);

    let messageText = (s.medicineFound as (n: number) => string)(found.length);

    // Check interactions
    if (userProfile?.medications && found.length > 0) {
      const warnings = checkInteractions(found.map(m => m.name), userProfile.medications);
      if (warnings.length > 0) {
        messageText += "\n\n" + warnings.join("\n");
      }
    }

    // Allergy check
    if (userProfile?.allergies && found.length > 0) {
      const allergyMeds = found.filter(m =>
        userProfile!.allergies.some(a => fuzzyMatch(a, m.name, 0.5))
      );
      if (allergyMeds.length > 0) {
        messageText += "\n\n" + s.allergyWarning(userProfile.allergies);
      }
    }

    const response: ChatResponse = {
      message: messageText,
      suggestedMedicines: found.map(m => ({
        ...m,
        name: m.price > 0 ? `${m.name} — ${formatPrice(lang, m.price)}` : m.name,
      })),
      suggestedActions: s.actions,
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Context follow-up
  if (isFollowUp && context.lastMedicines.length > 0) {
    const response: ChatResponse = {
      message: `${s.contextFollowUp}\nAvval ${context.lastMedicines[0]} haqida gaplashdik. Boshqa nimani bilmoqchisiz?`,
      suggestedActions: ["Narxi qancha?", "Dozasi qanday?", "Nojo'ya ta'sirlari?", "Alternativ dori?"],
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  // Fallback — try general search
  const found = findMedicines(message, lang, 3, userProfile);
  if (found.length > 0) {
    const response: ChatResponse = {
      message: (s.medicineFound as (n: number) => string)(found.length),
      suggestedMedicines: found.map(m => ({
        ...m,
        name: m.price > 0 ? `${m.name} — ${formatPrice(lang, m.price)}` : m.name,
      })),
      suggestedActions: s.actions,
    };
    updateContext(chatId, message, response, lang);
    return response;
  }

  const response: ChatResponse = {
    message: s.fallback as string,
    suggestedActions: s.actions,
    followUpQuestions: [
      lang === "uz" ? "Bosh og'rig'i" : lang === "ru" ? "Головная боль" : "Headache",
      lang === "uz" ? "Isitma" : lang === "ru" ? "Температура" : "Fever",
      lang === "uz" ? "Vitaminlar" : lang === "ru" ? "Витамины" : "Vitamins",
    ],
  };
  updateContext(chatId, message, response, lang);
  return response;
}

function isFollowUpQuestion(text: string, lang: Lang): boolean {
  const lower = normalize(text);
  const followUpPatterns = /(^shu|oldingi|avvalgi|haqida|nima|qancha|qanday|boshqa|alternativ|doz|narx|ta'sir)/i;
  return followUpPatterns.test(lower) && lower.split(" ").length < 5;
}

function generateFollowUpQuestions(symptom: string, lang: Lang): string[] {
  const questions: Record<string, string[]> = {
    uz: [
      "Dozasi qanday?",
      "Narxi qancha?",
      "Nojo'ya ta'sirlari bormi?",
      "Boshqa dori bormi?",
    ],
    ru: [
      "Какая дозировка?",
      "Сколько стоит?",
      "Есть побочные эффекты?",
      "Есть альтернатива?",
    ],
    en: [
      "What's the dosage?",
      "How much does it cost?",
      "Any side effects?",
      "Any alternatives?",
    ],
  };
  return questions[lang] || questions.en;
}

// ─── Symptom Analysis (for /symptom-checker) ──────────────────────

export async function analyzeSymptoms(symptoms: string): Promise<{
  possibleConditions: string[];
  recommendedAction: string;
  urgency: "low" | "medium" | "high" | "emergency";
  bodySystem: string;
  suggestedMedicines: SuggestedMedicine[];
}> {
  const lang = detectLang(symptoms);
  const result = detectSymptoms(normalize(symptoms), lang);

  const conditionNames: Record<string, Record<Lang, string>> = {
    headache: { uz: "Bosh og'rig'i", ru: "Головная боль", en: "Headache" },
    fever: { uz: "Isitma", ru: "Лихорадка", en: "Fever" },
    cough: { uz: "Yo'tal", ru: "Кашель", en: "Cough" },
    sore_throat: { uz: "Tomog' og'rig'i", ru: "Боль в горле", en: "Sore throat" },
    runny_nose: { uz: "Burun oqishi", ru: "Насморк", en: "Runny nose" },
    allergy: { uz: "Allergiya", ru: "Аллергия", en: "Allergy" },
    nausea: { uz: "Ko'ngil aynish", ru: "Тошнота", en: "Nausea" },
    vomiting: { uz: "Qusish", ru: "Рвота", en: "Vomiting" },
    diarrhea: { uz: "Ish chalkashishi", ru: "Диарея", en: "Diarrhea" },
    heartburn: { uz: "Oshqozon yonishi", ru: "Изжога", en: "Heartburn" },
    stomachache: { uz: "Qorin og'rig'i", ru: "Боль в животе", en: "Stomach ache" },
    joint_pain: { uz: "Bo'g'im og'rig'i", ru: "Боль в суставах", en: "Joint pain" },
    back_pain: { uz: "Bel og'rig'i", ru: "Боль в спине", en: "Back pain" },
    dizziness: { uz: "Bosh aylanish", ru: "Головокружение", en: "Dizziness" },
    chest_pain: { uz: "Ko'krak og'rig'i", ru: "Боль в груди", en: "Chest pain" },
    high_blood_pressure: { uz: "Yuqori qon bosim", ru: "Высокое давление", en: "High blood pressure" },
    shortness_of_breath: { uz: "Nafas qisilishi", ru: "Одышка", en: "Shortness of breath" },
    uti: { uz: "Siydik infektsiyasi", ru: "Инфекция мочевых путей", en: "Urinary tract infection" },
    anxiety: { uz: "Tashvish", ru: "Тревога", en: "Anxiety" },
    insomnia: { uz: "Uyqusizlik", ru: "Бессонница", en: "Insomnia" },
  };

  const possibleConditions = result.symptoms.map(s => conditionNames[s]?.[lang] || conditionNames[s]?.["en"] || s);
  if (possibleConditions.length === 0) {
    possibleConditions.push(lang === "uz" ? "Aniqlanmagan simptomlar" : lang === "ru" ? "Неопределённые симптомы" : "Unspecified symptoms");
  }

  const recommendedAction =
    result.severity === "emergency"
      ? lang === "uz" ? "Zudlik bilan tez yordam chaqiring (103)!" : lang === "ru" ? "Немедленно вызовите скорую (103)!" : "Call emergency services (103)!"
      : result.severity === "high"
        ? lang === "uz" ? "Shifokorga murojaat qilish tavsiya etiladi" : lang === "ru" ? "Рекомендуется обратиться к врачу" : "Consultation with a doctor is recommended"
        : lang === "uz" ? "Shifokor bilan maslahatlashish tavsiya etiladi" : lang === "ru" ? "Рекомендуется проконсультироваться с врачом" : "Consultation with a doctor is recommended";

  // Find medicines for symptoms
  const symptomTerms = result.symptoms.flatMap(s => SYMPTOM_MEDS[s]?.[lang] || SYMPTOM_MEDS[s]?.["en"] || []);
  const suggestedMedicines = symptomTerms.length > 0 ? findMedicines(symptomTerms.join(" "), lang, 4) : [];

  return { possibleConditions, recommendedAction, urgency: result.severity, bodySystem: result.bodySystem, suggestedMedicines };
}

// ─── Clear Context ────────────────────────────────────────────────

export function clearContext(chatId: string): void {
  conversationStore.delete(chatId);
}
