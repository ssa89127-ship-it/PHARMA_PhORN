"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  Truck,
  Clock,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PrescriptionsSection } from "@/components/shared/prescriptions-section";
import { useLanguage } from "@/i18n/LanguageProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const steps: { icon: React.ElementType; key: string }[] = [
  { icon: UploadCloud, key: "prescriptions.how.step1" },
  { icon: ShieldCheck, key: "prescriptions.how.step2" },
  { icon: Clock, key: "prescriptions.how.step3" },
  { icon: Truck, key: "prescriptions.how.step4" },
];

export default function RetseptPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-10">
        <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 gap-1">
            <ShieldCheck className="h-3 w-3" />
            {t("prescriptions.subtitle")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("prescriptions.uploadTitle")}</h1>
          <p className="mt-3 text-muted-foreground">{t("prescriptions.subtitle")}</p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <PrescriptionsSection />
        </motion.div>

        <motion.div variants={fadeUp}>
          <h2 className="mb-4 text-center text-lg font-semibold">{t("prescriptions.howTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Card key={step.key}>
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">{t(step.key)}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="text-center">
          <Card className="mx-auto max-w-xl">
            <CardContent className="flex flex-col items-center gap-3 p-8">
              <CheckCircle2 className="h-10 w-10 text-primary" />
              <h3 className="font-semibold">{t("prescriptions.verificationHint")}</h3>
              <p className="text-sm text-muted-foreground">{t("prescriptions.verificationDesc")}</p>
              <Link href="/dashboard/patient">
                <Button>
                  {t("prescriptions.trackTitle")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
