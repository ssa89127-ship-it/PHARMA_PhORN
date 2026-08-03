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

const spring = { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.8 };

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { ...spring, duration: 0.6 },
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
      <div className="space-y-10">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 gap-1">
            <ShieldCheck className="h-3 w-3" />
            {t("prescriptions.subtitle")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("prescriptions.uploadTitle")}</h1>
          <p className="mt-3 text-muted-foreground">{t("prescriptions.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...spring, delay: 0.1, duration: 0.7 }}
        >
          <PrescriptionsSection />
        </motion.div>

        <motion.div {...fadeUp}>
          <h2 className="mb-4 text-center text-lg font-semibold">{t("prescriptions.howTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
              >
                <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">{t(step.key)}</p>
                    {i < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.2 }}
          className="text-center"
        >
          <Card className="mx-auto max-w-xl hover:shadow-lg transition-shadow duration-300">
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
      </div>
    </div>
  );
}
