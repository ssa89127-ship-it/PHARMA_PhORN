"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Trophy,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLoyaltyPoints,
  getLoyaltyHistory,
  getLoyaltyTier,
  earnPoints,
  addLoyaltyTransaction,
  TIER_LABELS,
} from "@/lib/loyalty";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const LoyaltyPage = memo(function LoyaltyPage() {
  const { t, language } = useLanguage();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [tier, setTier] = useState({ name: "Bronze", color: "from-orange-300 to-orange-500", discount: 2 });
  const [showRedeem, setShowRedeem] = useState(false);

  useEffect(() => {
    setPoints(getLoyaltyPoints());
    setHistory(getLoyaltyHistory());
    setTier(getLoyaltyTier());
  }, []);

  const handleRedeem = (amount: number) => {
    if (points >= amount) {
      addLoyaltyTransaction("spend", amount, `${amount} ball sarflandi`);
      setPoints(getLoyaltyPoints());
      setHistory(getLoyaltyHistory());
      setShowRedeem(false);
    }
  };

  const tierLabels = TIER_LABELS[language] || TIER_LABELS.uz;

  const nextTierThresholds = [500, 2000, 5000, 10000];
  const currentThreshold = nextTierThresholds.find((t) => points < t) || 10000;
  const prevThreshold = nextTierThresholds[nextTierThresholds.indexOf(currentThreshold) - 1] || 0;
  const progress = ((points - prevThreshold) / (currentThreshold - prevThreshold)) * 100;

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
            <Star className="w-3 h-3 mr-1" />
            {t("loyalty.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("loyalty.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("loyalty.desc")}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <Card className={cn("bg-gradient-to-br text-white", tier.color)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm">{t("loyalty.tier")}</p>
                    <h2 className="text-3xl font-bold">{tierLabels[tier.name as keyof typeof tierLabels]}</h2>
                  </div>
                  <Trophy className="w-12 h-12 text-white/80" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{points.toLocaleString()} {t("loyalty.points")}</span>
                    <span>{tier.discount}% {t("loyalty.discount")}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-white/70">
                    {t("loyalty.nextTier")} {currentThreshold.toLocaleString()} {t("loyalty.points")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{points.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{t("loyalty.totalPoints")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {history.filter((h) => h.type === "earn").reduce((sum, h) => sum + h.points, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">{t("loyalty.earned")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingDown className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {history.filter((h) => h.type === "spend").reduce((sum, h) => sum + h.points, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">{t("loyalty.spent")}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {t("loyalty.history")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {t("loyalty.noHistory")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.slice(0, 10).map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          {item.type === "earn" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-orange-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{item.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={cn(
                          "font-mono font-bold text-sm",
                          item.type === "earn" ? "text-green-600" : "text-orange-600"
                        )}>
                          {item.type === "earn" ? "+" : "-"}{item.points.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("loyalty.redeem")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[100, 500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleRedeem(amount)}
                      disabled={points < amount}
                      className="h-auto py-4"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">{amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{t("loyalty.points")}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default LoyaltyPage;
