"use client";

import { useState, useRef, useEffect, memo, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, User, Sparkles, Loader2, Pill, Stethoscope, Brain,
  Heart, Shield, ArrowRight, MessageCircle, Clock, AlertTriangle,
  RefreshCw, Zap, Activity, Thermometer,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getChatResponse, clearContext, type ChatMessage, type SuggestedMedicine } from "@/lib/chatbot";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const quickActions = [
  { icon: Pill, key: "aiConsult.quickActions.medicines", query: "Dori qidirish" },
  { icon: Stethoscope, key: "aiConsult.quickActions.symptoms", query: "Simptomlar" },
  { icon: Brain, key: "aiConsult.quickActions.aiAnalysis", query: "AI tahlil" },
  { icon: Heart, key: "aiConsult.quickActions.healthTips", query: "Sog'liq maslahatlari" },
  { icon: Zap, key: "aiConsult.quickActions.interactions", query: "O'zaro ta'sir tekshirish" },
  { icon: Activity, key: "aiConsult.quickActions.dosage", query: "Dozani bilish" },
];

const conversationStarters = {
  uz: [
    "Boshim og'riyapti, nima qilishim kerak?",
    "Vitaminlar haqida ma'lumot bering",
    "Gripp uchun dori toping",
    "Qandli diabet uchun dori narxlari",
    "Allergiya uchun dori",
    "Mening allergiyam bor, menga nima mos keladi?",
    "Ibuprofen va paratsetamolni birga ichsam bo'ladimi?",
    "Oshqozon og'rig'i uchun dori",
  ],
  ru: [
    "У меня болит голова, что мне принять?",
    "Расскажите о витаминах",
    "Найдите лекарство от гриппа",
    "Цены на лекарства от диабета",
    "Лекарство от аллергии",
    "У меня аллергия, что мне подойдёт?",
    "Можно ли принимать ибупрофен и парацетамол вместе?",
    "Лекарство от боли в животе",
  ],
  en: [
    "I have a headache, what should I take?",
    "Tell me about vitamins",
    "Find medicine for flu",
    "Diabetes medicine prices",
    "Allergy medicine",
    "I have allergies, what can I take?",
    "Can I take ibuprofen and paracetamol together?",
    "Medicine for stomach ache",
  ],
};

const features = [
  { icon: Brain, gradient: "from-blue-500 to-indigo-600", titleKey: "aiConsult.features.ai", descKey: "aiConsult.features.aiDesc" },
  { icon: Shield, gradient: "from-green-500 to-emerald-600", titleKey: "aiConsult.features.verified", descKey: "aiConsult.features.verifiedDesc" },
  { icon: Clock, gradient: "from-purple-500 to-pink-600", titleKey: "aiConsult.features.instant", descKey: "aiConsult.features.instantDesc" },
];

const AIConsultationPage = memo(function AIConsultationPage() {
  const { t, language } = useLanguage();
  const chatId = useId();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMedicines, setSuggestedMedicines] = useState<SuggestedMedicine[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [interactionWarning, setInteractionWarning] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t("chatbot.welcome"),
          timestamp: new Date(),
        },
      ]);
    }
  }, [language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, suggestedMedicines]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setSuggestedMedicines([]);
    setFollowUpQuestions([]);
    setInteractionWarning(null);
    setUrgency(null);

    try {
      const response = await getChatResponse(content, chatId);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (response.suggestedMedicines) setSuggestedMedicines(response.suggestedMedicines);
      if (response.followUpQuestions) setFollowUpQuestions(response.followUpQuestions);
      if (response.interactionWarning) setInteractionWarning(response.interactionWarning);
      if (response.urgency) setUrgency(response.urgency);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          role: "assistant",
          content: t("common.error"),
          timestamp: new Date(),
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    clearContext(chatId);
    setMessages([
      {
        id: "welcome-fresh",
        role: "assistant",
        content: t("chatbot.welcome"),
        timestamp: new Date(),
      },
    ]);
    setSuggestedMedicines([]);
    setFollowUpQuestions([]);
    setInteractionWarning(null);
    setUrgency(null);
  };

  const starters = conversationStarters[language] || conversationStarters.uz;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container-custom py-8 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-center mb-8"
        >
          <Badge variant="primary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            {t("aiConsult.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("aiConsult.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("aiConsult.desc")}
          </p>
        </motion.div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="lg:w-72 shrink-0 space-y-4"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {t("aiConsult.quickTitle")}
                </h3>
                <div className="space-y-1.5">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ x: 4, transition: spring }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(action.query)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <action.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{t(action.key)}</span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  {t("aiConsult.startersTitle")}
                </h3>
                <div className="space-y-1.5">
                  {starters.map((starter, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ x: 4, transition: spring }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(starter)}
                      className="w-full text-left p-2.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      &ldquo;{starter}&rdquo;
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  {t("aiConsult.capabilities.title")}
                </h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <p>{t("aiConsult.capabilities.medicines")}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <p>{t("aiConsult.capabilities.interactions")}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <p>{t("aiConsult.capabilities.allergies")}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <p>{t("aiConsult.capabilities.dosage")}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <p>{t("aiConsult.capabilities.symptoms")}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <p>{t("aiConsult.capabilities.context")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <Card className="flex-1 flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="gradient-primary p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{t("chatbot.title")}</h3>
                    <p className="text-white/70 text-xs">VitaHub AI v2 — {t("aiConsult.status")}</p>
                  </div>
                </div>
                <button onClick={handleClear} className="group p-2 rounded-lg hover:bg-white/10 transition-colors" title={t("aiConsult.newConversation")}>
                  <RefreshCw className="w-4 h-4 text-white/70 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[400px] max-h-[500px]">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={spring}
                      className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20"
                            : "bg-muted/50 text-foreground rounded-tl-sm border border-border/30"
                        )}
                      >
                        {msg.content.split("\n").map((line, i) => (
                          <p key={i} className={i < msg.content.split("\n").length - 1 ? "mb-2" : ""}>
                            {line}
                          </p>
                        ))}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Urgency Badge */}
                {urgency && urgency !== "low" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
                      urgency === "emergency" && "bg-red-500/10 text-red-600 border border-red-200 dark:border-red-800",
                      urgency === "high" && "bg-orange-500/10 text-orange-600 border border-orange-200 dark:border-orange-800",
                      urgency === "medium" && "bg-yellow-500/10 text-yellow-600 border border-yellow-200 dark:border-yellow-800",
                    )}
                  >
                    <AlertTriangle className="w-5 h-5" />
                    {urgency === "emergency" ? "Emergency — Call 103 immediately!" : urgency === "high" ? "Consult a doctor soon" : "Monitor your symptoms"}
                  </motion.div>
                )}

                {/* Interaction Warning */}
                {interactionWarning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-200 dark:border-red-800 text-sm ml-13"
                  >
                    <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700">{interactionWarning}</p>
                  </motion.div>
                )}

                {/* Suggested Medicines */}
                {suggestedMedicines.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    className="space-y-2 ml-13"
                  >
                    <p className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5" />
                      {t("aiConsult.suggestedMeds")}
                    </p>
                    {suggestedMedicines.map((med, i) => (
                      <motion.div
                        key={med.slug + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={`/medicines/${med.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                            <Pill className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {med.name}
                            </p>
                            {med.dosage && (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {med.dosage}
                              </p>
                            )}
                            {med.sideEffects && med.sideEffects.length > 0 && (
                              <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate">
                                Side effects: {med.sideEffects.join(", ")}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Follow-up Questions */}
                {followUpQuestions.length > 0 && !isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5 ml-13">
                    {followUpQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-[1.02] border border-border/30 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Loading */}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-5 py-3 border border-border/30">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">{t("aiConsult.analyzing")}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/50 shrink-0">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={t("chatbot.placeholder")}
                    className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    size="lg"
                    className="px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
                  {t("chatbot.disclaimer")}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
            <Card key={i} className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 text-center">
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-3 shadow-lg", f.gradient)}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{t(f.titleKey)}</h3>
                <p className="text-xs text-muted-foreground">{t(f.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

export default AIConsultationPage;
