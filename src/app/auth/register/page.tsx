"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import { Pill, Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor" | "pharmacy">("patient");
  const [password, setPassword] = useState("");

  const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
    if (!pw) return { label: "", color: "bg-gray-200", width: "w-0" };
    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
    const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (pw.length < 6) return { label: t("auth.register.weak"), color: "bg-red-500", width: "w-1/4" };
    if (score < 2) return { label: t("auth.register.weak"), color: "bg-red-500", width: "w-1/4" };
    if (score < 3) return { label: t("auth.register.medium"), color: "bg-yellow-500", width: "w-2/4" };
    if (score < 4) return { label: t("auth.register.strong"), color: "bg-green-500", width: "w-3/4" };
    return { label: t("auth.register.veryStrong"), color: "bg-emerald-500", width: "w-full" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Account created! Redirecting...");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Pill className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Join PharmaHub</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Create your account and start ordering medicines, consulting doctors, and managing your health all in one place.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {["50K+ Medicines", "100K+ Patients", "500+ Pharmacies"].map((stat) => (
              <div key={stat} className="bg-white/10 rounded-xl p-3 text-white text-sm font-medium">
                {stat}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("nav.back")}
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gradient">Pharma</span>Hub
              </span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">{t("auth.register.title")}</h1>
            <p className="text-muted-foreground">{t("auth.register.subtitle")}</p>
          </div>

          <div className="flex gap-2 mb-6">
            {(["patient", "doctor", "pharmacy"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  role === r
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {r === "patient" ? t("auth.register.patient") : r === "doctor" ? t("auth.register.doctor") : t("auth.register.pharmacy")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t("auth.register.fullName")}
              placeholder="John Doe"
              leftIcon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label={t("auth.register.email")}
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label={t("auth.register.phone")}
              type="tel"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
            <div>
              <Input
                label={t("auth.register.password")}
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      className={`h-full rounded-full ${strength.color}`}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{strength.label}</p>
                </div>
              )}
            </div>
            <Input
              label={t("auth.register.confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat your password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <div className="flex items-center gap-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                {t("auth.register.agree")}
              </label>
            </div>

            <Button variant="primary" size="lg" className="w-full" loading={isLoading} type="submit">
              {isLoading ? t("common.loading") : t("auth.register.createAccount")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("auth.login.orContinueWith")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="md" disabled className="opacity-50">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>
            <Button variant="outline" size="md" disabled className="opacity-50">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.register.hasAccount")}{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              {t("auth.register.signIn")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
