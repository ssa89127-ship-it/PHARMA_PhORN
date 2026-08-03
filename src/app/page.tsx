"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
  Search,
  ArrowRight,
  Shield,
  Truck,
  Clock,
  Star,
  Heart,
  Phone,
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
  Brain,
  Eye,
  Smile,
  Leaf,
  Dumbbell,
  FlaskConical,
  Home,
  PawPrint,
  Bone,
  Zap,
  Check,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Bot,
  GraduationCap,
  Video,
  MessageSquareText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  doctors,
} from "@/lib/data";

const spring = { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.8 };
const gentleSpring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };
const bouncySpring = { type: "spring" as const, stiffness: 300, damping: 20 };

const smoothFadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" }, transition: { ...spring, duration: 0.8 } };

function SmoothCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ ...spring, delay }}
      whileHover={{ y: -6, scale: 1.02, transition: { ...gentleSpring } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SmoothIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: 5, transition: bouncySpring }}
      whileTap={{ scale: 0.9 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const { t, tArray } = useLanguage();

  return (
    <div className="overflow-hidden scroll-smooth">
      <HeroSection t={t} />
      <LiveMedicineCounter t={t} />
      <StatsSection t={t} />
      <CategoriesSection t={t} />
      <FeaturedPharmacies t={t} />
      <PopularMedicines t={t} />
      <DoctorsSection t={t} />
      <WhyChooseUs t={t} />
      <TestimonialsSection t={t} />
      <HowItWorks t={t} />
      <FAQSection t={t} tArray={tArray} />
      <PartnerLogos t={t} />
      <CTASection t={t} />
    </div>
  );
}

const HeroSection = memo(function HeroSection({ t }: { t: (path: string) => string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.92]);
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <section className="relative min-h-[95vh] flex items-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/8 to-blue-500/4 blur-[120px]"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -2, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-secondary/8 to-purple-500/4 blur-[100px]"
          style={{ willChange: "transform" }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -25, 0], rotate: [0, 90, 180], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 10 + i * 3, repeat: Infinity, delay: i * 2, ease: "easeInOut" }}
            className="absolute"
            style={{ left: `${20 + i * 15}%`, top: `${25 + (i % 3) * 20}%`, willChange: "transform" }}
          >
            <div className={cn(
              "w-6 h-6 rounded-full border-2",
              i % 3 === 0 ? "border-primary/20 bg-primary/3" :
              i % 3 === 1 ? "border-blue-400/20 bg-blue-400/3" :
              "border-green-400/20 bg-green-400/3"
            )} />
          </motion.div>
        ))}
      </div>

      <motion.div style={{ y: springY, opacity, scale }} className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...bouncySpring, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {t("hero.badge")}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
              {t("hero.title1")}{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("hero.title2")}
              </span>
              <br />
              <span className="text-foreground/70">{t("hero.title3")}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.3, duration: 0.8 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link href="/medicines">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group relative overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                  <span className="relative z-10 flex items-center">
                    {t("hero.cta")}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              <Link href="/consultation">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2">
                  <Phone className="w-4 h-4 mr-2" />
                  {t("hero.cta2")}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.5 }}
              className="relative max-w-xl"
            >
              <div className="glass-card rounded-2xl p-1 flex items-center gap-2 shadow-lg shadow-black/5">
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
                    className="text-xs px-3 py-1 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-6 mt-8"
            >
              {[
                { icon: Shield, text: t("whyChooseUs.authentic.title") },
                { icon: Truck, text: t("liveStats.delivery") },
                { icon: Clock, text: "24/7" },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <badge.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.3, duration: 1.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-primary/15 to-blue-500/15 rounded-full blur-3xl" />
              <motion.div
                whileHover={{ y: -4, transition: gentleSpring }}
                className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/10 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("quickOrder.title")}</h3>
                    <p className="text-xs text-muted-foreground">{t("quickOrder.subtitle")}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {medicines.slice(0, 4).map((med, i) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...spring, delay: 0.5 + i * 0.1 }}
                      whileHover={{ x: 4, transition: gentleSpring }}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
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
                          <p className="text-xs text-green-600 dark:text-green-400">-{med.discount}%</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link href="/medicines">
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground hover:text-primary">
                    {t("medicines.viewAll")}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-card rounded-2xl p-4 shadow-xl shadow-black/10 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">+2,500</p>
                    <p className="text-[10px] text-muted-foreground">{t("quickOrder.deliveredToday")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ ...bouncySpring, delay: 1.8 }}
                className="absolute -top-4 -left-8 bg-white dark:bg-card rounded-2xl p-3 shadow-xl shadow-black/10 border border-white/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{t("quickOrder.orderConfirmed")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("quickOrder.timeAgo")}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

const LiveMedicineCounter = memo(function LiveMedicineCounter({ t }: { t: (path: string) => string }) {
  const [count, setCount] = useState(30000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative -mt-1 py-6 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 border-y border-primary/10">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="flex items-center gap-2"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <span className="text-sm font-medium">
              <AnimatedCounter target={30000} suffix="+" /> {t("liveStats.medicines")}
            </span>
          </motion.div>
          <div className="w-px h-4 bg-border" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              <AnimatedCounter target={152} /> {t("liveStats.pharmacies")}
            </span>
          </motion.div>
          <div className="w-px h-4 bg-border" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              <AnimatedCounter target={15} /> {t("liveStats.cities")}
            </span>
          </motion.div>
          <div className="w-px h-4 bg-border" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{t("liveStats.delivery")}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

const StatsSection = memo(function StatsSection({ t }: { t: (path: string) => string }) {
  const stats = [
    { icon: Building2, value: 152, suffix: "+", label: t("stats.pharmacies"), color: "from-blue-500 to-indigo-600" },
    { icon: Package, value: 30000, suffix: "+", label: t("stats.medicines"), color: "from-emerald-500 to-green-600" },
    { icon: Users, value: 100000, suffix: "+", label: t("stats.patients"), color: "from-purple-500 to-pink-600" },
    { icon: Award, value: 4.9, suffix: "", label: t("stats.rating"), color: "from-orange-500 to-red-600" },
  ];

  return (
    <section className="py-16 relative">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <SmoothCard key={stat.label} delay={i * 0.1}>
              <div className="relative bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-primary/20 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
                <SmoothIcon className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 shadow-lg",
                  stat.color
                )}>
                  <stat.icon className="w-7 h-7 text-white" />
                </SmoothIcon>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  );
});

const CategoriesSection = memo(function CategoriesSection({ t }: { t: (path: string) => string }) {
  const getCategoryIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      Activity: <Activity className="w-6 h-6" />,
      Shield: <Shield className="w-6 h-6" />,
      Droplet: <Droplets className="w-6 h-6" />,
      Heart: <Heart className="w-6 h-6" />,
      Wind: <Wind className="w-6 h-6" />,
      Stethoscope: <Stethoscope className="w-6 h-6" />,
      Apple: <Apple className="w-6 h-6" />,
      Brain: <Brain className="w-6 h-6" />,
      Eye: <Eye className="w-6 h-6" />,
      Smile: <Smile className="w-6 h-6" />,
      Leaf: <Leaf className="w-6 h-6" />,
      Dumbbell: <Dumbbell className="w-6 h-6" />,
      FlaskConical: <FlaskConical className="w-6 h-6" />,
      Home: <Home className="w-6 h-6" />,
      PawPrint: <PawPrint className="w-6 h-6" />,
      Bone: <Bone className="w-6 h-6" />,
      Package: <Package className="w-6 h-6" />,
      Sparkles: <Sparkles className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      Droplets: <Droplets className="w-6 h-6" />,
    };
    return icons[icon] || <Pill className="w-6 h-6" />;
  };

  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-green-600",
    "from-purple-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-pink-600",
    "from-yellow-500 to-orange-600",
    "from-teal-500 to-cyan-600",
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-green-500 to-emerald-600",
    "from-blue-400 to-indigo-500",
  ];

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...smoothFadeUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("categories.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("categories.subtitle")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("categories.desc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.slice(0, 18).map((cat, i) => (
            <SmoothCard key={cat.id} delay={i * 0.03}>
              <Link href={`/medicines?category=${cat.slug}`}>
                <div className="group relative bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:border-primary/30 transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                  <SmoothIcon className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mx-auto mb-3 shadow-md text-white",
                    gradients[i % gradients.length]
                  )}>
                    {getCategoryIcon(cat.icon)}
                  </SmoothIcon>
                  <h3 className="font-medium text-xs mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">{cat.medicineCount} ta</p>
                </div>
              </Link>
            </SmoothCard>
          ))}
        </div>

        <motion.div {...smoothFadeUp} className="text-center mt-8">
          <Link href="/medicines">
            <Button variant="outline" size="sm">
              {t("common.viewAll")} ({categories.length})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

const FeaturedPharmacies = memo(function FeaturedPharmacies({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-muted/20 to-transparent">
      <div className="container-custom">
        <motion.div {...smoothFadeUp} className="flex items-center justify-between mb-12">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pharmacies.slice(0, 4).map((pharmacy, i) => (
            <SmoothCard key={pharmacy.id} delay={i * 0.1}>
              <Link href={`/pharmacies?id=${pharmacy.id}`}>
                <Card className="group relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 h-full cursor-pointer border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-6 relative">
                    <div className="flex items-center gap-3 mb-4">
                      <SmoothIcon className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <img src={pharmacy.logo} alt="" className="w-8 h-8" />
                      </SmoothIcon>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors duration-300">
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
                          pharmacy.isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                        )} />
                        <span>{pharmacy.isOpen ? t("pharmacies.open") : t("pharmacies.closed")}</span>
                        <span className="text-xs">· {pharmacy.deliveryTime}</span>
                      </div>
                      {pharmacy.freeDelivery && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <Truck className="w-3.5 h-3.5" />
                          <span>{t("pharmacies.freeDelivery")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1 group/btn text-xs">
                        {t("common.viewAll")}
                        <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  );
});

const PopularMedicines = memo(function PopularMedicines({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...smoothFadeUp} className="flex items-center justify-between mb-12">
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
            <SmoothCard key={med.id} delay={i * 0.05}>
              <Link href={`/medicines/${med.slug}`}>
                <Card className="group relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 h-full cursor-pointer border border-white/20">
                  <div className="absolute top-3 right-3 z-10">
                    {med.discount && (
                      <Badge variant="destructive" className="text-xs shadow-lg">
                        -{med.discount}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/5 to-blue-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      <img src={med.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <Badge variant="secondary" className="mb-2 text-[10px]">{med.category}</Badge>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {med.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">{med.manufacturer}</p>
                    <p className="text-xs text-muted-foreground mb-3">{med.dosage} · {med.form}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(med.unitPrice)}
                        </span>
                        {'oldPrice' in med && (med as any).oldPrice > med.unitPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice((med as any).oldPrice)}
                          </span>
                        )}
                      </div>
                      {med.prescriptionRequired && (
                        <Badge variant="warning" className="text-[10px]">Rx</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  );
});

const DoctorsSection = memo(function DoctorsSection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container-custom">
        <motion.div {...smoothFadeUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("consultation.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("doctorSection.subtitle")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("doctorSection.desc")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, i) => (
            <SmoothCard key={doctor.id} delay={i * 0.1}>
              <Link href={`/consultation?doctor=${doctor.id}`}>
                <Card className="group relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 h-full cursor-pointer border border-white/20">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-blue-50 group-hover:scale-105 transition-transform duration-500">
                          <img src={doctor.photo} alt="" className="w-full h-full object-cover" />
                        </div>
                        {doctor.isAvailableToday && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors duration-300">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-primary">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-xs text-muted-foreground">({doctor.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.experience} {t("doctorSection.experience")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span className="truncate">{doctor.education}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {doctor.availableForVideo && (
                        <Badge variant="secondary" className="text-[10px]">
                          <Video className="w-3 h-3 mr-1" /> {t("consultation.videoConsult")}
                        </Badge>
                      )}
                      {doctor.availableForChat && (
                        <Badge variant="secondary" className="text-[10px]">
                          <MessageSquareText className="w-3 h-3 mr-1" /> {t("consultation.chatConsult")}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(doctor.consultationFee)}
                      </span>
                      <Button variant="outline" size="sm" className="group/btn">
                        {t("doctorSection.book")}
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  );
});

const WhyChooseUs = memo(function WhyChooseUs({ t }: { t: (path: string) => string }) {
  const features = [
    { icon: TrendingUp, titleKey: "whyChooseUs.priceComparison.title", descKey: "whyChooseUs.priceComparison.desc", gradient: "from-emerald-500 to-green-600" },
    { icon: Truck, titleKey: "whyChooseUs.freeDelivery.title", descKey: "whyChooseUs.freeDelivery.desc", gradient: "from-blue-500 to-indigo-600" },
    { icon: Shield, titleKey: "whyChooseUs.authentic.title", descKey: "whyChooseUs.authentic.desc", gradient: "from-purple-500 to-pink-600" },
    { icon: Clock, titleKey: "whyChooseUs.service247.title", descKey: "whyChooseUs.service247.desc", gradient: "from-orange-500 to-red-600" },
    { icon: Bot, titleKey: "whyChooseUs.aiAssistant.title", descKey: "whyChooseUs.aiAssistant.desc", gradient: "from-rose-500 to-pink-600" },
    { icon: Stethoscope, titleKey: "whyChooseUs.onlineConsult.title", descKey: "whyChooseUs.onlineConsult.desc", gradient: "from-cyan-500 to-blue-600" },
  ];

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...smoothFadeUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("whyChooseUs.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("whyChooseUs.subtitle")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("whyChooseUs.desc")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <SmoothCard key={i} delay={i * 0.1}>
              <Card className="group relative overflow-hidden p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 h-full cursor-pointer border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <SmoothIcon className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg text-white",
                    feature.gradient
                  )}>
                    <feature.icon className="w-7 h-7" />
                  </SmoothIcon>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                </div>
              </Card>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  );
});

const TestimonialsSection = memo(function TestimonialsSection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-muted/20 to-transparent">
      <div className="container-custom">
        <motion.div {...smoothFadeUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("testimonials.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("testimonials.subtitle")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("testimonials.desc")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <SmoothCard key={testimonial.id} delay={i * 0.1}>
              <Card className="relative p-6 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 h-full border border-white/20">
                <div className="absolute top-4 right-4 text-primary/10">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/>
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  );
});

const HowItWorks = memo(function HowItWorks({ t }: { t: (path: string, params?: Record<string, string | number>) => string }) {
  const steps = [
    { icon: Search, titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc" },
    { icon: CheckCircle2, titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc" },
    { icon: Truck, titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc" },
    { icon: Heart, titleKey: "howItWorks.step4.title", descKey: "howItWorks.step4.desc" },
  ];

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...smoothFadeUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("howItWorks.title")}</Badge>
          <h2 className="heading-lg mb-4">
            {t("howItWorks.subtitle", { count: 4 })}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 hidden md:block" />

          {steps.map((step, i) => (
            <SmoothCard key={i} delay={i * 0.15}>
              <div className="text-center relative">
                <SmoothIcon className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
                  <step.icon className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary shadow-lg">
                    {i + 1}
                  </div>
                </SmoothIcon>
                <h3 className="font-semibold mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </div>
            </SmoothCard>
          ))}
        </div>
      </div>
    </section>
  );
});

const FAQSection = memo(function FAQSection({ t, tArray }: { t: (path: string) => string; tArray: (path: string) => any[] }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-muted/20 to-transparent">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div {...smoothFadeUp} className="text-center mb-12">
            <Badge variant="primary" className="mb-4">FAQ</Badge>
            <h2 className="heading-lg mb-4">
              {t("faqSection.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("faqSection.desc")}
            </p>
          </motion.div>

          <motion.div {...smoothFadeUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {tArray("faq").map((faq: { question: string; answer: string }, i: number) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 px-6"
                >
                  <AccordionTrigger className="py-4 text-sm font-medium hover:text-primary transition-colors duration-300">
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
});

const PartnerLogos = memo(function PartnerLogos({ t }: { t: (path: string) => string }) {
  const partners = [
    "Farmstandart", "Bayer", "Novartis", "Sanofi", "Pfizer",
    "GSK", "Cipla", "Teva", "Abdi Ibrahim", "R-pharm",
  ];

  return (
    <section className="py-12 border-y border-border/50">
      <div className="container-custom">
        <p className="text-center text-sm text-muted-foreground mb-8">
          {t("partners.title")}
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-50">
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.05 }}
              whileHover={{ scale: 1.1, opacity: 1, transition: gentleSpring }}
              className="text-lg font-bold text-muted-foreground/50 cursor-default"
            >
              {partner}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

const CTASection = memo(function CTASection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ ...spring, duration: 1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-purple-700 px-8 py-16 md:px-16 md:py-20 text-center"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-32 h-32 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-full"
          />

          <div className="relative">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/20 hover:bg-white/30">
              {t("cta.badge")}
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
                  {t("cta.register")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/medicines">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {t("cta.viewMedicines")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
