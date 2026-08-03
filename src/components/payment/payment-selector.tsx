"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  Shield,
  Lock,
  AlertCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getPaymentMethods,
  calculateFee,
  type PaymentProvider,
  type PaymentMethod,
} from "@/lib/payments";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn, formatPrice } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const providerIcons: Record<string, any> = {
  payme: Smartphone,
  click: Smartphone,
  uzcard: CreditCard,
  visa: CreditCard,
  mastercard: CreditCard,
  cash: Banknote,
};

interface PaymentSelectorProps {
  amount: number;
  selectedProvider: PaymentProvider | null;
  onSelect: (provider: PaymentProvider) => void;
  onPhoneChange?: (phone: string) => void;
  onCardChange?: (cardNumber: string, expiry: string, cvv: string) => void;
}

export const PaymentSelector = memo(function PaymentSelector({
  amount,
  selectedProvider,
  onSelect,
  onPhoneChange,
  onCardChange,
}: PaymentSelectorProps) {
  const { t, language } = useLanguage();
  const methods = getPaymentMethods();
  const [phone, setPhone] = useState("+998 ");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const getName = (m: PaymentMethod) =>
    language === "ru" ? m.nameRu : language === "en" ? m.nameEn : m.name;
  const getDesc = (m: PaymentMethod) =>
    language === "ru" ? m.descriptionRu : language === "en" ? m.descriptionEn : m.description;

  const needsPhone = selectedProvider === "payme" || selectedProvider === "click";
  const needsCard = selectedProvider === "visa" || selectedProvider === "mastercard" || selectedProvider === "uzcard";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-600 font-medium">{t("payment.secure")}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {methods.map((method, i) => {
          const Icon = providerIcons[method.provider] || CreditCard;
          const isSelected = selectedProvider === method.provider;
          const fee = calculateFee(amount, method.provider);

          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
            >
              <button
                onClick={() => onSelect(method.provider)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden group",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/50 hover:border-primary/30 hover:bg-accent/30"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{getName(method)}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {getDesc(method)}
                    </p>
                  </div>
                </div>

                {fee > 0 && (
                  <Badge variant="outline" className="text-[9px] mt-1">
                    +{fee.toLocaleString()} {t("payment.fee")}
                  </Badge>
                )}
                {fee === 0 && method.provider !== "cash" && (
                  <Badge variant="success" className="text-[9px] mt-1">
                    {t("payment.noFee")}
                  </Badge>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {needsPhone && selectedProvider && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-medium">
                    {t("payment.phoneNumber")}
                  </Label>
                </div>
                <Input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    onPhoneChange?.(e.target.value);
                  }}
                  placeholder="+998 90 123 45 67"
                  type="tel"
                />
                <p className="text-xs text-muted-foreground">
                  {selectedProvider === "payme"
                    ? t("payment.paymeInstruction")
                    : t("payment.clickInstruction")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {needsCard && selectedProvider && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-medium">{t("payment.cardDetails")}</Label>
                </div>
                <Input
                  value={cardNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    const formatted = v.replace(/(\d{4})/g, "$1 ").trim();
                    setCardNumber(formatted);
                  }}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                      setCardExpiry(v);
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  <Input
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="CVV"
                    type="password"
                    maxLength={3}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>{t("payment.encrypted")}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedProvider && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
        >
          <span className="text-sm text-muted-foreground">{t("payment.totalWithFee")}</span>
          <span className="font-bold text-lg">
            {formatPrice(amount + calculateFee(amount, selectedProvider))}
          </span>
        </motion.div>
      )}
    </div>
  );
});
