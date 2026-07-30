"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Pill, Stethoscope } from "lucide-react";
import { getChatResponse, ChatMessage } from "@/lib/chatbot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Assalomu alaykum! PharmaHub AI yordamchisiga xush kelibsiz. Qanday yordam kerak?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setSuggestedActions([]);

    try {
      const response = await getChatResponse(userMsg.content);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (response.suggestedActions) setSuggestedActions(response.suggestedActions);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          role: "assistant",
          content: "Kechirasiz, xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
          timestamp: new Date(),
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl gradient-primary shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200",
          isOpen && "scale-0 opacity-0"
        )}
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
              className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] glass border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="gradient-primary p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">AI Yordamchi</h3>
                    <p className="text-white/70 text-xs">PharmaHub AI</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 border border-border/30">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  </motion.div>
                )}

                {suggestedActions.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
                    {suggestedActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/50 shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Simptomlaringizni yozing..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
                  Bu AI yordamchi tibbiy maslahat o'rnini bosmaydi. Shifokor bilan maslahatlashing.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
