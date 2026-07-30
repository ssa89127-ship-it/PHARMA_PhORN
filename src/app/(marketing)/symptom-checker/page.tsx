"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Activity,
  AlertTriangle,
  Stethoscope,
  Pill,
  Scan,
  Search,
  Heart,
  Loader2,
  Clock,
  ChevronRight,
  Shield,
  Sparkles,
  ArrowRight,
  Bone,
  Wind,
  Monitor,
  Ear,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analyzeSymptoms, type ChatMessage } from "@/lib/chatbot";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

type UrgencyLevel = "low" | "medium" | "high" | "emergency";

interface SymptomResult {
  possibleConditions: { name: string; probability: number }[];
  recommendedAction: string;
  urgency: UrgencyLevel;
  suggestedMedicines?: string[];
}

interface HistoryItem {
  id: string;
  symptoms: string;
  date: string;
  urgency: UrgencyLevel;
  conditions: string[];
}

interface BodyPart {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  icon: React.ElementType;
  commonSymptoms: string[];
  color: string;
}

const bodyParts: BodyPart[] = [
  {
    id: "bosh",
    nameUz: "Bosh",
    nameRu: "Голова",
    nameEn: "Head",
    icon: Brain,
    commonSymptoms: [
      "Bosh og'rig'i", "Bosh aylanishi", "Migren",
      "Boshdagi bosim", "Ko'zlar og'rig'i",
    ],
    color: "from-violet-500/20 to-violet-600/10",
  },
  {
    id: "koksak",
    nameUz: "Ko'krak",
    nameRu: "Грудная клетка",
    nameEn: "Chest",
    icon: Heart,
    commonSymptoms: [
      "Ko'krak og'rig'i", "Yurak urishi tezlashishi",
      "Nafas qisilishi", "Yo'tal",
    ],
    color: "from-rose-500/20 to-rose-600/10",
  },
  {
    id: "qorin",
    nameUz: "Qorin",
    nameRu: "Живот",
    nameEn: "Stomach",
    icon: Activity,
    commonSymptoms: [
      "Qorin og'rig'i", "Ko'ngil aynishi",
      "Ich ketishi", "Qabziyat", "Shishish",
    ],
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    id: "bogimlar",
    nameUz: "Bo'g'imlar",
    nameRu: "Суставы",
    nameEn: "Joints",
    icon: Bone,
    commonSymptoms: [
      "Bo'g'im og'rig'i", "Bo'g'im shishishi",
      "Harakat cheklanishi", "Qattiqlik",
    ],
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    id: "tomoq",
    nameUz: "Tomoq",
    nameRu: "Горло",
    nameEn: "Throat",
    icon: Wind,
    commonSymptoms: [
      "Tomoq og'rig'i", "Tomoq qurishi",
      "Yo'tal", "Ovoz halqumi",
    ],
    color: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    id: "teri",
    nameUz: "Teri",
    nameRu: "Кожа",
    nameEn: "Skin",
    icon: Monitor,
    commonSymptoms: [
      "Teri toshmasi", "Qichishish",
      "Teri qizarishi", "Teri quruqligi",
    ],
    color: "from-pink-500/20 to-pink-600/10",
  },
];

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    symptoms: "Bosh og'rig'i, ko'ngil aynishi, yorug'likka sezgirlik",
    date: "2024-03-15",
    urgency: "medium",
    conditions: ["Migren", "Kuchlanish bosh og'rig'i"],
  },
  {
    id: "2",
    symptoms: "Tomoq og'rig'i, yo'tal, isitma 38°C",
    date: "2024-03-10",
    urgency: "low",
    conditions: ["O'tkir respirator infeksiya"],
  },
  {
    id: "3",
    symptoms: "Ko'krak og'rig'i, nafas qisilishi",
    date: "2024-02-28",
    urgency: "high",
    conditions: ["Bronxit", "Pnevmoniya shubhasi"],
  },
];

const urgencyConfig: Record<UrgencyLevel, { labelUz: string; labelRu: string; labelEn: string; color: string; badgeVariant: "success" | "warning" | "destructive" | "primary" }> = {
  low: {
    labelUz: "Past",
    labelRu: "Низкий",
    labelEn: "Low",
    color: "text-emerald-600 dark:text-emerald-400",
    badgeVariant: "success",
  },
  medium: {
    labelUz: "O'rtacha",
    labelRu: "Средний",
    labelEn: "Medium",
    color: "text-amber-600 dark:text-amber-400",
    badgeVariant: "warning",
  },
  high: {
    labelUz: "Yuqori",
    labelRu: "Высокий",
    labelEn: "High",
    color: "text-orange-600 dark:text-orange-400",
    badgeVariant: "destructive",
  },
  emergency: {
    labelUz: "Favqulodda",
    labelRu: "Чрезвычайный",
    labelEn: "Emergency",
    color: "text-red-600 dark:text-red-400",
    badgeVariant: "destructive",
  },
};

const conditionColor = (index: number) => {
  const colors = [
    "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20",
    "bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20",
    "bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/20",
    "bg-gradient-to-r from-rose-500/10 to-rose-500/5 border-rose-500/20",
  ];
  return colors[index % colors.length];
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function SymptomCheckerPage() {
  const { language, t } = useLanguage();
  const [symptomText, setSymptomText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleBodyPartClick = (part: BodyPart) => {
    setSelectedBodyPart(part.id);
    const name = language === "uz" ? part.nameUz : language === "ru" ? part.nameRu : part.nameEn;
    const prefix = `${name}: `;
    if (!symptomText.includes(prefix)) {
      setSymptomText((prev) => (prev ? `${prev}\n${prefix}` : prefix));
    }
    setShowSuggestions(true);
  };

  const handleSymptomSelect = (symptom: string) => {
    setSymptomText((prev) => {
      if (prev) {
        const lines = prev.split("\n");
        const lastLine = lines[lines.length - 1];
        if (lastLine && !lastLine.startsWith(" ")) {
          return `${prev}, ${symptom.toLowerCase()}`;
        }
        return `${prev}${symptom.toLowerCase()}`;
      }
      return symptom;
    });
    setShowSuggestions(false);
  };

  const handleAnalyze = async () => {
    if (!symptomText.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const data = await analyzeSymptoms(symptomText);
      const conditions = data.possibleConditions.map((name, i) => ({
        name,
        probability: Math.max(15, 85 - i * (25 + Math.floor(Math.random() * 15))),
      }));
      const mockResult: SymptomResult = {
        possibleConditions: conditions.length > 0
          ? conditions
          : [
              { name: "O'tkir respirator infeksiya", probability: 72 },
              { name: "Allergik reaksiya", probability: 48 },
              { name: "Vitamin yetishmasligi", probability: 25 },
            ],
        recommendedAction: data.recommendedAction || "Shifokor bilan maslahatlashish tavsiya etiladi",
        urgency: data.urgency || "low",
        suggestedMedicines: ["Paratsetamol 500mg", "Vitamin C 500mg"],
      };
      setResult(mockResult);

      setHistory((prev) => [
        {
          id: generateId(),
          symptoms: symptomText,
          date: new Date().toISOString(),
          urgency: mockResult.urgency,
          conditions: mockResult.possibleConditions.map((c) => c.name).slice(0, 2),
        },
        ...prev,
      ]);
    } catch {
      setResult({
        possibleConditions: [
          { name: "Tahlil qilishda xatolik", probability: 0 },
        ],
        recommendedAction: "Iltimos, qayta urinib ko'ring yoki shifokor bilan bog'laning",
        urgency: "low",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const selectedPart = bodyParts.find((p) => p.id === selectedBodyPart);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[60vh] md:min-h-[65vh] flex items-center pt-24 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/[0.03] to-secondary/[0.03] blur-[150px]" />

        <div className="container-custom relative w-full">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {language === "uz"
                ? "AI bilan ishlaydigan tahlil"
                : language === "ru"
                  ? "Анализ на базе ИИ"
                  : "AI-Powered Analysis"}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="heading-xl mb-1 leading-tight">
                  {language === "uz"
                    ? "Simptomlarni tekshirish"
                    : language === "ru"
                      ? "Проверка симптомов"
                      : "Symptom Checker"}
                </h1>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            >
              {language === "uz"
                ? "Simptomlaringizni tavsiflang, bizning AI tahlilchimiz mumkin bo'lgan tashhislarni aniqlaydi va keyingi qadamlarni taklif qiladi."
                : language === "ru"
                  ? "Опишите свои симптомы, и наш ИИ-анализатор определит возможные диагнозы и предложит следующие шаги."
                  : "Describe your symptoms and our AI analyzer will identify possible conditions and suggest next steps."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === "uz"
                      ? "Simptomlaringizni tavsiflang"
                      : language === "ru"
                        ? "Опишите ваши симптомы"
                        : "Describe your symptoms"}
                  </label>
                  <div className="relative">
                    <textarea
                      value={symptomText}
                      onChange={(e) => setSymptomText(e.target.value)}
                      placeholder={
                        language === "uz"
                          ? "Misol: Boshim og'riyapti, isitmam bor va tomog'im qichishyapti..."
                          : language === "ru"
                            ? "Пример: У меня болит голова, температура и першит в горле..."
                            : "E.g., I have a headache, fever, and a sore throat..."
                      }
                      rows={5}
                      className="flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 resize-none"
                    />
                    {symptomText && (
                      <button
                        onClick={() => {
                          setSymptomText("");
                          setResult(null);
                        }}
                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <span className="sr-only">Clear</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {language === "uz"
                      ? "Tana qismini tanlang"
                      : language === "ru"
                        ? "Выберите часть тела"
                        : "Select a body part"}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {bodyParts.map((part) => {
                      const Icon = part.icon;
                      const isActive = selectedBodyPart === part.id;
                      const name = language === "uz" ? part.nameUz : language === "ru" ? part.nameRu : part.nameEn;
                      return (
                        <motion.button
                          key={part.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBodyPartClick(part)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                            isActive
                              ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                              : "bg-background/50 border-border/60 hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isActive ? "gradient-primary text-white" : "bg-muted/50 text-muted-foreground"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={cn(
                            "text-xs font-medium transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}>
                            {name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {selectedPart && showSuggestions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/40">
                          {selectedPart.commonSymptoms.map((symptom) => (
                            <button
                              key={symptom}
                              onClick={() => handleSymptomSelect(symptom)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors"
                            >
                              <ChevronRight className="w-3 h-3" />
                              {symptom}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 h-12 text-base font-semibold"
                    disabled={!symptomText.trim() || isAnalyzing}
                    onClick={handleAnalyze}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {language === "uz"
                          ? "Tahlil qilinmoqda..."
                          : language === "ru"
                            ? "Анализируется..."
                            : "Analyzing..."}
                      </>
                    ) : (
                      <>
                        <Scan className="w-5 h-5 mr-2" />
                        {language === "uz"
                          ? "Tahlil qilish"
                          : language === "ru"
                            ? "Анализировать"
                            : "Analyze"}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <Clock className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showHistory && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="container-custom pb-8">
              <Card className="border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">
                        {language === "uz"
                          ? "Tekshirishlar tarixi"
                          : language === "ru"
                            ? "История проверок"
                            : "Check History"}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {history.map((item) => {
                      const urg = urgencyConfig[item.urgency];
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className={cn(
                            "w-2 h-full min-h-[40px] rounded-full mt-1 shrink-0",
                            item.urgency === "low" && "bg-emerald-400",
                            item.urgency === "medium" && "bg-amber-400",
                            item.urgency === "high" && "bg-orange-400",
                            item.urgency === "emergency" && "bg-red-400",
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.symptoms}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.date} &middot; {item.conditions.join(", ")}
                            </p>
                          </div>
                          <Badge variant={urg.badgeVariant} className="shrink-0 text-[10px]">
                            {language === "uz" ? urg.labelUz : language === "ru" ? urg.labelRu : urg.labelEn}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.section
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-padding pt-0"
          >
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="heading-sm">
                    <span className="text-gradient">
                      {language === "uz"
                        ? "Tahlil natijalari"
                        : language === "ru"
                          ? "Результаты анализа"
                          : "Analysis Results"}
                    </span>
                  </h2>
                </div>

                <div className="space-y-5">
                  <Card className="border-primary/10 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">
                            {language === "uz"
                              ? "Shoshilinchlik darajasi"
                              : language === "ru"
                                ? "Уровень срочности"
                                : "Urgency Level"}
                          </h3>
                        </div>
                        <Badge
                          variant={urgencyConfig[result.urgency].badgeVariant}
                          className="text-sm px-4 py-1.5"
                        >
                          {language === "uz"
                            ? urgencyConfig[result.urgency].labelUz
                            : language === "ru"
                              ? urgencyConfig[result.urgency].labelRu
                              : urgencyConfig[result.urgency].labelEn}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.recommendedAction}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/10 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">
                          {language === "uz"
                            ? "Mumkin bo'lgan tashxislar"
                            : language === "ru"
                              ? "Возможные диагнозы"
                              : "Possible Conditions"}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {result.possibleConditions.map((condition, index) => (
                          <motion.div
                            key={condition.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              "p-4 rounded-xl border",
                              conditionColor(index)
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{condition.name}</span>
                              <span className="text-xs font-semibold text-primary">
                                {condition.probability}%
                              </span>
                            </div>
                            <Progress value={condition.probability} className="h-2" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {result.suggestedMedicines && result.suggestedMedicines.length > 0 && (
                    <Card className="border-primary/10 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Pill className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">
                            {language === "uz"
                              ? "Tavsiya etilgan dorilar"
                              : language === "ru"
                                ? "Рекомендуемые лекарства"
                                : "Suggested Medicines"}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.suggestedMedicines.map((medicine) => (
                            <Badge
                              key={medicine}
                              variant="outline"
                              className="px-3 py-1.5 text-sm border-primary/20 text-foreground bg-primary/[0.03]"
                            >
                              <Pill className="w-3.5 h-3.5 mr-1.5 text-primary" />
                              {medicine}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1 h-12 text-base font-semibold"
                      asChild
                    >
                      <a href="/consultation">
                        <Stethoscope className="w-5 h-5 mr-2" />
                        {language === "uz"
                          ? "Shifokor bilan maslahatlashish"
                          : language === "ru"
                            ? "Проконсультироваться с врачом"
                            : "Consult a Doctor"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="flex-1 h-12 text-base font-semibold"
                      asChild
                    >
                      <a href="/medicines">
                        <Search className="w-5 h-5 mr-2" />
                        {language === "uz"
                          ? "Dorilarni topish"
                          : language === "ru"
                            ? "Найти лекарства"
                            : "Find Medicines"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    {language === "uz"
                      ? "Muhim eslatma"
                      : language === "ru"
                        ? "Важное примечание"
                        : "Important Disclaimer"}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "uz"
                      ? "Ushbu AI simptom tekshiruvchisi faqat ma'lumot olish uchun mo'ljallangan va professional tibbiy maslahat, tashxis yoki davolanish o'rnini bosa olmaydi. Agar shoshilinch tibbiy yordam kerak bo'lsa, darhol tez yordam xizmatiga murojaat qiling (103)."
                      : language === "ru"
                        ? "Этот AI-проверщик симптомов предназначен только для информационных целей и не заменяет профессиональную медицинскую консультацию, диагностику или лечение. При необходимости неотложной медицинской помощи немедленно обратитесь в службу скорой помощи (103)."
                        : "This AI symptom checker is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. If you need emergency medical assistance, call emergency services immediately (103)."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
