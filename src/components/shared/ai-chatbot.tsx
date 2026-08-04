"use client";

import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Pill,
  AlertTriangle, Info, ArrowRight, Clock, Shield, RefreshCw,
} from "lucide-react";
import { getChatResponse, clearContext, type ChatMessage, type SuggestedMedicine } from "@/lib/chatbot";
import { useLanguage } from "@/i18n/LanguageProvider";
import Link from "next/link";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.8 };

export function AIChatbot() {
  const { t, tArray, language } = useLanguage();
  const chatId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMedicines, setSuggestedMedicines] = useState<SuggestedMedicine[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
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
      setSuggestedActions(tArray("chatbot.actions"));
    }
  }, [language]);

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
    setSuggestedActions([]);
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
      if (response.suggestedActions) setSuggestedActions(response.suggestedActions);
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
    setSuggestedActions(tArray("chatbot.actions"));
    setFollowUpQuestions([]);
    setInteractionWarning(null);
    setUrgency(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl gradient-primary shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label={t("chatbot.title")}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={spring}
              className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-6rem)] glass border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="gradient-primary p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{t("chatbot.title")}</h3>
                    <p className="text-white/70 text-xs">VitaHub AI v2</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleClear} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="New chat">
                    <RefreshCw className="w-4 h-4 text-white/70" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-muted/50 text-foreground rounded-tl-sm border border-border/30"
                      )}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i < msg.content.split("\n").length - 1 ? "mb-1" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Urgency Badge */}
                {urgency && urgency !== "low" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium",
                      urgency === "emergency" && "bg-red-500/10 text-red-600 border border-red-200",
                      urgency === "high" && "bg-orange-500/10 text-orange-600 border border-orange-200",
                      urgency === "medium" && "bg-yellow-500/10 text-yellow-600 border border-yellow-200",
                    )}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {urgency === "emergency" ? "Emergency — Call 103!" : urgency === "high" ? "Consult a doctor" : "Monitor symptoms"}
                  </motion.div>
                )}

                {/* Interaction Warning */}
                {interactionWarning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-200 text-xs"
                  >
                    <Shield className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700">{interactionWarning}</p>
                  </motion.div>
                )}

                {/* Suggested Medicines */}
                {suggestedMedicines.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5" />
                      Recommended medicines
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
                          <div className="min-w-0 flex-1">
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
                            {med.warning && (
                              <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {med.warning}
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5">
                    {followUpQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Loading */}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 border border-border/30">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Analyzing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggested Actions */}
                {suggestedActions.length > 0 && !isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5">
                    {suggestedActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleSend(action)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50 shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={t("chatbot.placeholder")}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    aria-label={t("chatbot.send")}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
                  {t("chatbot.disclaimer")}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
