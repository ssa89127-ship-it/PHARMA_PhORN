"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Copy,
  Check,
  Users,
  Share2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getReferralCode,
  getReferralStats,
  addReferral,
  REFERRAL_REWARD,
  type Referral,
} from "@/lib/referral";
import { useLanguage } from "@/i18n/LanguageProvider";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const ReferralPage = memo(function ReferralPage() {
  const { t } = useLanguage();
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState({ total: 0, completed: 0, totalRewards: 0 });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setReferralCode(getReferralCode());
    setStats(getReferralStats());
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (!email.trim()) return;
    addReferral(email);
    setStats(getReferralStats());
    setEmail("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const shareUrl = `https://pharma-ph-orn-pe1d.vercel.app/ref?code=${referralCode}`;

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
            <Gift className="w-3 h-3 mr-1" />
            {t("referral.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("referral.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("referral.desc")}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {REFERRAL_REWARD.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("referral.perReferral")}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <code className="bg-background px-4 py-2 rounded-lg text-lg font-mono font-bold">
                    {referralCode}
                  </code>
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Share2 className="w-5 h-5 text-primary" />
                  {t("referral.inviteFriend")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("referral.emailPlaceholder")}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  />
                  <Button onClick={handleInvite}>
                    {t("referral.sendInvite")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                {showSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600"
                  >
                    {t("referral.sent")}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">{t("referral.invited")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground">{t("referral.registered")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Gift className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalRewards.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{t("referral.pointsEarned")}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("referral.howItWorks")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["1", "2", "3"].map((step) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-bold">
                        {step}
                      </div>
                      <div>
                        <h4 className="font-medium">{t(`referral.step${step}.title`)}</h4>
                        <p className="text-sm text-muted-foreground">{t(`referral.step${step}.desc`)}</p>
                      </div>
                    </div>
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

export default ReferralPage;
