"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Receipt,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPaymentHistory,
  getPaymentStats,
  type PaymentTransaction,
  type PaymentProvider,
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

const statusConfig: Record<string, { color: string; bg: string }> = {
  completed: { color: "text-green-600", bg: "bg-green-500/10" },
  pending: { color: "text-yellow-600", bg: "bg-yellow-500/10" },
  processing: { color: "text-blue-600", bg: "bg-blue-500/10" },
  failed: { color: "text-red-600", bg: "bg-red-500/10" },
  cancelled: { color: "text-gray-600", bg: "bg-gray-500/10" },
  refunded: { color: "text-purple-600", bg: "bg-purple-500/10" },
};

const PaymentHistoryPage = memo(function PaymentHistoryPage() {
  const { t, language } = useLanguage();
  const [history, setHistory] = useState<PaymentTransaction[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    totalSpent: 0,
    totalFees: 0,
    byProvider: [] as { provider: string; name: string; count: number }[],
  });
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setHistory(getPaymentHistory());
    setStats(getPaymentStats());
  }, []);

  const filtered =
    filter === "all"
      ? history
      : history.filter((tx) => tx.status === filter);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-center mb-8"
        >
          <Badge variant="primary" className="mb-4">
            <Receipt className="w-3 h-3 mr-1" />
            {t("paymentHistory.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("paymentHistory.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("paymentHistory.desc")}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Receipt className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">{t("paymentHistory.total")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground">{t("paymentHistory.completed")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">{t("paymentHistory.spent")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatPrice(stats.totalFees)}</div>
                  <p className="text-xs text-muted-foreground">{t("paymentHistory.fees")}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("paymentHistory.all")}</SelectItem>
                  <SelectItem value="completed">{t("paymentHistory.completed")}</SelectItem>
                  <SelectItem value="pending">{t("paymentHistory.pending")}</SelectItem>
                  <SelectItem value="failed">{t("paymentHistory.failed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...spring, delay: 0.3 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Receipt className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t("paymentHistory.empty")}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {t("paymentHistory.emptyDesc")}
                  </p>
                  <Link href="/medicines">
                    <Button>
                      {t("paymentHistory.shopNow")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((tx, i) => {
                  const Icon = providerIcons[tx.provider] || CreditCard;
                  const status = statusConfig[tx.status] || statusConfig.pending;
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ ...spring, delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", status.bg)}>
                              <Icon className={cn("w-6 h-6", status.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm capitalize">{tx.provider}</h4>
                                <Badge
                                  variant={tx.status === "completed" ? "success" : tx.status === "failed" ? "destructive" : "secondary"}
                                  className="text-[10px]"
                                >
                                  {t(`paymentHistory.status.${tx.status}`)}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {tx.cardLast4 ? `**** ${tx.cardLast4}` : tx.phone || tx.orderId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold">{formatPrice(tx.totalAmount)}</p>
                              {tx.fee > 0 && (
                                <p className="text-[10px] text-muted-foreground">
                                  +{formatPrice(tx.fee)} {t("paymentHistory.fee")}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default PaymentHistoryPage;
