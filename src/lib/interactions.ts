/**
 * Medicine Interaction Checker
 * Checks for dangerous drug interactions
 */

export interface Interaction {
  id: string;
  medicine1: string;
  medicine2: string;
  severity: "mild" | "moderate" | "severe" | "dangerous";
  description: string;
  descriptionRu: string;
  descriptionEn: string;
  recommendation: string;
  recommendationRu: string;
  recommendationEn: string;
}

type Lang = "uz" | "ru" | "en";

// Known drug interactions database
const interactionsDB: Omit<Interaction, "id">[] = [
  {
    medicine1: "warfarin",
    medicine2: "aspirin",
    severity: "dangerous",
    description: "Warfarin va aspirin birga qo'llash qon ketishi xavfini oshiradi",
    descriptionRu: "Одновременное применение варфарина и аспирина увеличивает риск кровотечения",
    descriptionEn: "Taking warfarin together with aspirin increases bleeding risk",
    recommendation: "Shifokor bilan maslahatlashing! Ikki dori birga qo'llash xavfli",
    recommendationRu: "Обратитесь к врачу! Совместное применение опасно",
    recommendationEn: "Consult a doctor! Taking both medicines together is dangerous",
  },
  {
    medicine1: "metformin",
    medicine2: "alcohol",
    severity: "severe",
    description: "Metformin va alkogol birga qo'llash laktikatsidoz xavfini oshiradi",
    descriptionRu: "Совместное применение метформина и алкоголя увеличивает риск лактатацидоза",
    descriptionEn: "Taking metformin with alcohol increases risk of lactic acidosis",
    recommendation: "Alkogolni cheklash yoki to'xtatish kerak",
    recommendationRu: "Необходимо ограничить или прекратить употребление алкоголя",
    recommendationEn: "You should limit or stop alcohol consumption",
  },
  {
    medicine1: "ibuprofen",
    medicine2: "aspirin",
    severity: "moderate",
    description: "Ibuprofen aspirinning samaratorligini kamaytirishi mumkin",
    descriptionRu: "Ибупрофен может снижать эффективность аспирина",
    descriptionEn: "Ibuprofen may reduce the effectiveness of aspirin",
    recommendation: "Ibuprofen aspirindan 30 daqiqa oldin yoki 8 soat keyin qabul qilish kerak",
    recommendationRu: "Ибупрофен следует принимать за 30 минут до аспирина или через 8 часов",
    recommendationEn: "Take ibuprofen 30 minutes before aspirin or 8 hours after",
  },
  {
    medicine1: "amoxicillin",
    medicine2: "metronidazole",
    severity: "moderate",
    description: "Amoksitsillin va metronidazol birga qo'llash mumkin, lekin shifokor nazoratida",
    descriptionRu: "Амоксициллин и метронидазол могут применяться вместе, но под наблюдением врача",
    descriptionEn: "Amoxicillin and metronidazole can be taken together, but under doctor supervision",
    recommendation: "Shifokor nazoratida qo'llash kerak",
    recommendationRu: "Применять под наблюдением врача",
    recommendationEn: "Use under doctor supervision",
  },
  {
    medicine1: "omeprazole",
    medicine2: "clopidogrel",
    severity: "severe",
    description: "Omeprazol klopidogrelning samaratorligini kamaytirishi mumkin",
    descriptionRu: "Омепразол может снижать эффективность клопидогрела",
    descriptionEn: "Omeprazole may reduce the effectiveness of clopidogrel",
    recommendation: "Omeprazol o'rniga pantoprazol ishlatish tavsiya etiladi",
    recommendationRu: "Рекомендуется заменить омепразол на пантопразол",
    recommendationEn: "Consider replacing omeprazole with pantoprazole",
  },
  {
    medicine1: "lisinopril",
    medicine2: "potassium",
    severity: "moderate",
    description: "Lisinopril va kaltsiy preparatlari birga qo'llash giperkalemiiaga olib kelishi mumkin",
    descriptionRu: "Лизиноприл и калийсодержащие препараты могут привести к гиперкалиемии",
    descriptionEn: "Lisinopril and potassium supplements may lead to hyperkalemia",
    recommendation: "Qon tarkibidagi kaltsiy darajasini nazorat qilish kerak",
    recommendationRu: "Необходимо контролировать уровень калия в крови",
    recommendationEn: "Monitor blood potassium levels regularly",
  },
  {
    medicine1: "simvastatin",
    medicine2: "clarithromycin",
    severity: "dangerous",
    description: "Simvastatin va klaritromitsin birga qo'llash mushak toqimalariga zarar yetkazishi mumkin",
    descriptionRu: "Совместное применение симвастатина и кларитромицина может повредить мышечную ткань",
    descriptionEn: "Taking simvastatin with clarithromycin may cause muscle damage",
    recommendation: "Shifokor bilan maslahatlashing! Klaritromitsin vaqtincha to'xtatilishi kerak",
    recommendationRu: "Обратитесь к врачу! Кларитромицин следует временно отменить",
    recommendationEn: "Consult a doctor! Clarithromycin should be temporarily stopped",
  },
  {
    medicine1: "metformin",
    medicine2: "contrast dye",
    severity: "severe",
    description: "Metformin va kontrast moddasi birga qo'llash buyrak shikastlanishiga olib kelishi mumkin",
    descriptionRu: "Метформин и контрастное вещество могут привести к повреждению почек",
    descriptionEn: "Metformin with contrast dye may cause kidney damage",
    recommendation: "KT/MRI dan oldin va keyin metforminni to'xtatish kerak",
    recommendationRu: "Метформин следует отменить до и после КТ/МРТ",
    recommendationEn: "Stop metformin before and after CT/MRI scans",
  },
];

// Search for interactions between medicines
export function findInteractions(medicineNames: string[]): Interaction[] {
  const normalizedNames = medicineNames.map(name => name.toLowerCase().trim());
  const found: Interaction[] = [];

  for (const interaction of interactionsDB) {
    const med1 = interaction.medicine1.toLowerCase();
    const med2 = interaction.medicine2.toLowerCase();

    for (let i = 0; i < normalizedNames.length; i++) {
      for (let j = i + 1; j < normalizedNames.length; j++) {
        const name1 = normalizedNames[i];
        const name2 = normalizedNames[j];

        if (
          (name1.includes(med1) && name2.includes(med2)) ||
          (name1.includes(med2) && name2.includes(med1))
        ) {
          found.push({
            id: `int-${found.length + 1}`,
            ...interaction,
          });
        }
      }
    }
  }

  return found;
}

// Get interaction description in language
export function getInteractionText(interaction: Interaction, lang: Lang): string {
  switch (lang) {
    case "ru": return interaction.descriptionRu;
    case "en": return interaction.descriptionEn;
    default: return interaction.description;
  }
}

// Get recommendation in language
export function getInteractionRecommendation(interaction: Interaction, lang: Lang): string {
  switch (lang) {
    case "ru": return interaction.recommendationRu;
    case "en": return interaction.recommendationEn;
    default: return interaction.recommendation;
  }
}

// Severity colors
export const severityColors = {
  mild: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  moderate: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  severe: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  dangerous: "bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300",
};

export const severityLabels = {
  uz: { mild: "Yengil", moderate: "O'rtacha", severe: "Og'ir", dangerous: "Xavfli" },
  ru: { mild: "Лёгкая", moderate: "Средняя", severe: "Тяжёлая", dangerous: "Опасная" },
  en: { mild: "Mild", moderate: "Moderate", severe: "Severe", dangerous: "Dangerous" },
};
