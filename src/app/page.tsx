"use client";

import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Shield,
  Truck,
  Clock,
  Star,
  Heart,
  Phone,
  MessageCircle,
  ChevronRight,
  Pill,
  Activity,
  Droplets,
  Wind,
  Stethoscope,
  Apple,
  Sparkles,
  Award,
  Users,
  Package,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn, formatPrice } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  pharmacies,
  medicines,
  categories,
  testimonials,
} from "@/lib/data";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

const featureIcons = [Search, Truck, Shield, Clock, Heart, MessageCircle] as const;
const featureGradients = [
  "from-emerald-500 to-green-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-orange-500 to-red-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
] as const;

export default function HomePage() {
  const { t, tArray } = useLanguage();

  return (
    <div className="overflow-hidden">
      <HeroSection t={t} />
      <StatsSection t={t} />
      <CategoriesSection t={t} />
      <FeaturedPharmacies t={t} />
      <PopularMedicines t={t} />
      <WhyChooseUs t={t} />
      <TestimonialsSection t={t} />
      <FAQSection t={t} tArray={tArray} />
      <CTASection t={t} />
    </div>
  );
}

function HeroSection({ t }: { t: (path: string) => string }) {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-20 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
      
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {t("hero.badge")}
            </motion.div>

            <h1 className="heading-xl mb-6 leading-tight">
              {t("hero.title1")}{" "}
              <span className="text-gradient">{t("hero.title2")}</span>
              <br />
              <span className="text-foreground/80">{t("hero.title3")}</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/medicines">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    {t("hero.cta")}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/consultation">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="w-4 h-4 mr-2" />
                  {t("hero.cta2")}
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative max-w-xl"
            >
              <div className="glass-card rounded-2xl p-1 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder={t("hero.placeholder")}
                    className="w-full bg-transparent border-none outline-none text-sm py-3 placeholder:text-muted-foreground/60"
                  />
                </div>
                <Button variant="primary" size="md" className="shrink-0 mr-1">
                  <Search className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t("hero.search")}</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-muted-foreground">{t("nav.popular")}</span>
                {["Paracetamol", "Amoxicillin", "Vitamin D3", "Ibuprofen"].map((item) => (
                  <Link
                    key={item}
                    href={`/medicines?q=${item}`}
                    className="text-xs px-3 py-1 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
              <div className="relative glass-card rounded-3xl p-8 shadow-elevated">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Order</h3>
                    <p className="text-xs text-muted-foreground">Delivery in 30 min</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {medicines.slice(0, 4).map((med, i) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-10 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {med.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{formatPrice(med.unitPrice)}</p>
                        {med.discount && (
                          <p className="text-xs text-green-600 dark:text-green-400">-{med.discount}% off</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link href="/medicines">
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground">
                    {t("medicines.viewAll")}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                      >
                        {["S", "M", "J"][i - 1]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-medium">+2.5K orders</p>
                    <p className="text-[10px] text-muted-foreground">delivered today</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ t }: { t: (path: string) => string }) {
  const stats = [
    { icon: Building2, value: "500+", label: t("stats.pharmacies") },
    { icon: Package, value: "50K+", label: t("stats.medicines") },
    { icon: Users, value: "100K+", label: t("stats.patients") },
    { icon: Award, value: "4.9", label: t("stats.rating") },
  ];

  return (
    <section className="py-16 relative">
      <div className="container-custom">
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1 text-gradient">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("categories.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("categories.subtitle")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("categories.desc")}
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/medicines?category=${cat.slug}`}>
                <Card className="group relative overflow-hidden p-6 text-center hover:shadow-elevated transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.medicineCount} {t("medicines.inStock").toLowerCase().includes("mavjud") ? "ta" : t("medicines.inStock").toLowerCase().includes("наличии") ? "шт" : "items"}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function getCategoryIcon(icon: string) {
  const icons: Record<string, React.ReactNode> = {
    Activity: <Activity className="w-7 h-7 text-primary" />,
    Shield: <Shield className="w-7 h-7 text-primary" />,
    Droplet: <Droplets className="w-7 h-7 text-primary" />,
    Heart: <Heart className="w-7 h-7 text-primary" />,
    Wind: <Wind className="w-7 h-7 text-primary" />,
    Stethoscope: <Stethoscope className="w-7 h-7 text-primary" />,
    Apple: <Apple className="w-7 h-7 text-primary" />,
  };
  return icons[icon] || <Pill className="w-7 h-7 text-primary" />;
}

function FeaturedPharmacies({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-muted/20 to-transparent">
      <div className="container-custom">
        <motion.div {...fadeInUp} className="flex items-center justify-between mb-12">
          <div>
            <Badge variant="primary" className="mb-4">{t("pharmacies.title")}</Badge>
            <h2 className="heading-lg mb-2">
              {t("pharmacies.subtitle")}
            </h2>
            <p className="text-muted-foreground">{t("pharmacies.desc")}</p>
          </div>
          <Link href="/pharmacies">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              {t("pharmacies.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {pharmacies.map((pharmacy, i) => (
            <motion.div
              key={pharmacy.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden hover:shadow-elevated transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {pharmacy.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{pharmacy.rating}</span>
                        <span className="text-xs text-muted-foreground">({pharmacy.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        pharmacy.isOpen ? "bg-green-500" : "bg-red-500"
                      )} />
                      <span>{pharmacy.isOpen ? t("pharmacies.open") : t("pharmacies.closed")} · {pharmacy.deliveryTime}</span>
                    </div>
                    {pharmacy.freeDelivery && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{t("pharmacies.freeDelivery")}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/pharmacies?id=${pharmacy.id}`}>
                    <Button variant="outline" size="sm" className="w-full group/btn">
                      {t("pharmacies.viewProfile")}
                      <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeInUp} className="text-center mt-8 sm:hidden">
          <Link href="/pharmacies">
            <Button variant="outline">
              {t("pharmacies.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function PopularMedicines({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...fadeInUp} className="flex items-center justify-between mb-12">
          <div>
            <Badge variant="primary" className="mb-4">{t("medicines.title")}</Badge>
            <h2 className="heading-lg mb-2">
              {t("medicines.subtitle")}
            </h2>
            <p className="text-muted-foreground">{t("medicines.desc")}</p>
          </div>
          <Link href="/medicines">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              {t("medicines.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {medicines.slice(0, 8).map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/medicines/${med.slug}`}>
                <Card className="group relative overflow-hidden hover:shadow-elevated transition-all duration-300 h-full">
                  <div className="absolute top-3 right-3 z-10">
                    {med.discount && (
                      <Badge variant="destructive" className="text-xs">
                        -{med.discount}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/5 to-blue-10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-10 flex items-center justify-center">
                        <Pill className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <Badge variant="secondary" className="mb-2 text-[10px]">{med.category}</Badge>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {med.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">{med.manufacturer}</p>
                    <p className="text-xs text-muted-foreground mb-3">{med.dosage} · {med.form}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(med.unitPrice)}
                        </span>
                        {med.basePrice > med.unitPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(med.basePrice)}
                          </span>
                        )}
                      </div>
                      {med.requiresPrescription && (
                        <Badge variant="warning" className="text-[10px]">{t("medicines.prescription") === "Prescription Required" ? "Rx" : t("medicines.prescription").substring(0, 2)}</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs({ t }: { t: (path: string) => string }) {
  const featureKeys = ["priceComparison", "freeDelivery", "authentic", "service247", "reminders", "consultation"] as const;

  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container-custom">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("whyChooseUs.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("whyChooseUs.subtitle")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("whyChooseUs.desc")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((key, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group relative overflow-hidden p-6 hover:shadow-elevated transition-all duration-300 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent" />
                  <div className="relative">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300",
                      featureGradients[i]
                    )}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{t(`whyChooseUs.${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`whyChooseUs.${key}.desc`)}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("testimonials.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("testimonials.subtitle")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("testimonials.desc")}
          </p>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="relative p-6 group hover:shadow-elevated transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 text-primary/5">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
                    <path d="M0 30 C0 13.4 13.4 0 30 0 L30 30 L0 30 Z" />
                    <path d="M60 30 C60 46.6 46.6 60 30 60 L30 30 L60 30 Z" />
                  </svg>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={cn(
                          "w-4 h-4",
                          j < testimonial.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection({ t, tArray }: { t: (path: string) => string; tArray: (path: string) => any[] }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-muted/20 to-transparent">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="primary" className="mb-4">FAQ</Badge>
            <h2 className="heading-lg mb-4">
              {t("common.noResults").includes("Natija") ? "Ko'p so'raladigan" : t("common.noResults").includes("Результатов") ? "Часто задаваемые" : "Frequently Asked"}{" "}
              <span className="text-gradient">{t("common.noResults").includes("Natija") ? "Savollar" : t("common.noResults").includes("Результатов") ? "Вопросы" : "Questions"}</span>
            </h2>
            <p className="text-muted-foreground">
              {t("common.noResults").includes("Natija") ? "Platformamiz haqida bilishingiz kerak bo'lgan hamma narsa" : t("common.noResults").includes("Результатов") ? "Всё, что вам нужно знать о нашей платформе" : "Everything you need to know about our platform"}
            </p>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {tArray("faq").map((faq: { question: string; answer: string }, i: number) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass-card rounded-2xl overflow-hidden border border-border/50 px-6"
                >
                  <AccordionTrigger className="py-4 text-sm font-medium hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-primary px-8 py-16 md:px-16 md:py-20 text-center"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/20 hover:bg-white/30">
              {t("cta.cta")}
            </Badge>
            <h2 className="heading-lg text-white mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
              {t("cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 w-full sm:w-auto"
                >
                  {t("cta.cta")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/medicines">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {t("cta.cta2")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

