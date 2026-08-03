"use client";

import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
  RotateCcw,
  Home,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatPrice } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const PaymentResultPage = memo(function PaymentResultPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const success = searchParams.get("status") === "success";
  const orderId = searchParams.get("orderId") || `ORD-${Date.now().toString(36).toUpperCase()}`;
  const amount = searchParams.get("amount") || "0";
  const provider = searchParams.get("provider") || "";
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [success]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                  y: -20,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: typeof window !== "undefined" ? window.innerHeight + 20 : 1000,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#059669", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...spring, delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              success
                ? "bg-green-500/10"
                : "bg-red-500/10"
            }`}
          >
            {success ? (
              <CheckCircle2 className="w-14 h-14 text-green-500" />
            ) : (
              <XCircle className="w-14 h-14 text-red-500" />
            )}
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">
            {success ? t("payment.successTitle") : t("payment.failedTitle")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {success
              ? t("payment.successDesc")
              : t("payment.failedDesc")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("payment.orderId")}</span>
                <span className="font-mono font-bold text-sm">{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("payment.amount")}</span>
                <span className="font-bold">{formatPrice(parseInt(amount))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("payment.method")}</span>
                <span className="text-sm font-medium capitalize">{provider}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("payment.status")}</span>
                <span
                  className={`text-sm font-medium ${
                    success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {success ? t("payment.completed") : t("payment.failed")}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {success ? (
            <>
              <Link href="/delivery" className="flex-1">
                <Button className="w-full" size="lg">
                  <Package className="w-4 h-4 mr-2" />
                  {t("payment.trackOrder")}
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  {t("payment.backHome")}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/cart" className="flex-1">
                <Button className="w-full" size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("payment.tryAgain")}
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="w-4 h-4 mr-2" />
                  {t("payment.backHome")}
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
});

export default PaymentResultPage;
