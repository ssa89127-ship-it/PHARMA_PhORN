"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
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
  doctors,
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

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const { t, tArray } = useLanguage();

  return (
    <div className="overflow-hidden">
      <HeroSection t={t} />
      <LiveMedicineCounter />
      <StatsSection t={t} />
      <CategoriesSection t={t} />
      <FeaturedPharmacies t={t} />
      <PopularMedicines t={t} />
      <DoctorsSection t={t} />
      <WhyChooseUs t={t} />
      <TestimonialsSection t={t} />
      <HowItWorks t={t} />
      <FAQSection t={t} tArray={tArray} />
      <PartnerLogos />
      <CTASection t={t} />
    </div>
  );
}

function HeroSection({ t }: { t: (path: string) => string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <section className="relative min-h-[95vh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-blue-500/5 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -3, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-secondary/10 to-purple-500/5 blur-[100px]"
        />
      </div>

      {/* Floating pills decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <div className={cn(
              "w-8 h-8 rounded-full border-2 opacity-20",
              i % 3 === 0 ? "border-primary/30 bg-primary/5" :
              i % 3 === 1 ? "border-blue-400/30 bg-blue-400/5" :
              "border-green-400/30 bg-green-400/5"
            )} />
          </motion.div>
        ))}
      </div>

      <motion.div style={{ y, opacity, scale }} className="container-custom relative z-10">
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

            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/medicines">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group relative overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                  <span className="relative z-10 flex items-center">
                    {t("hero.cta")}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/consultation">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2">
                  <Phone className="w-4 h-4 mr-2" />
                  {t("hero.cta2")}
                </Button>
              </Link>
            </div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
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
                    className="text-xs px-3 py-1 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 mt-8"
            >
              {[
                { icon: Shield, text: "100% Haqiqiy" },
                { icon: Truck, text: "30 daqiqa" },
                { icon: Clock, text: "24/7" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <badge.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Quick Order Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl" />
              <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/10 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tezkor buyurtma</h3>
                    <p className="text-xs text-muted-foreground">30 daqiqada yetkazish</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {medicines.slice(0, 4).map((med, i) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group cursor-pointer border border-transparent hover:border-primary/10"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
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
              </div>

              {/* Floating delivery badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-card rounded-2xl p-4 shadow-xl shadow-black/10 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">+2,500</p>
                    <p className="text-[10px] text-muted-foreground">bugun yetkazildi</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -top-4 -left-8 bg-white dark:bg-card rounded-2xl p-3 shadow-xl shadow-black/10 border border-white/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Buyurtma tasdiqlandi</p>
                    <p className="text-[10px] text-muted-foreground">2 daqiqa oldin</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function LiveMedicineCounter() {
  const [count, setCount] = useState(30000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative -mt-1 py-6 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 border-y border-primary/10">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <span className="text-sm font-medium">
              <AnimatedCounter target={30000} suffix="+" /> dori mavjud
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              <AnimatedCounter target={152} /> dorixona
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              <AnimatedCounter target={15} /> shahar
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">30 daqiqada yetkazish</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ t }: { t: (path: string) => string }) {
  const stats = [
    { icon: Building2, value: 152, suffix: "+", label: t("stats.pharmacies"), color: "from-blue-500 to-indigo-600" },
    { icon: Package, value: 30000, suffix: "+", label: "Dorilar", color: "from-emerald-500 to-green-600" },
    { icon: Users, value: 100000, suffix: "+", label: t("stats.patients"), color: "from-purple-500 to-pink-600" },
    { icon: Award, value: 4.9, suffix: "", label: t("stats.rating"), color: "from-orange-500 to-red-600" },
  ];

  return (
    <section className="py-16 relative">
      <div className="container-custom">
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg",
                  stat.color
                )}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection({ t }: { t: (path: string) => string }) {
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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {categories.slice(0, 18).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/medicines?category=${cat.slug}`}>
                <div className="group relative bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md text-white",
                    gradients[i % gradients.length]
                  )}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h3 className="font-medium text-xs mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">{cat.medicineCount} ta</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeInUp} className="text-center mt-8">
          <Link href="/medicines">
            <Button variant="outline" size="sm">
              Barcha kategoriyalar ({categories.length})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
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
          {pharmacies.slice(0, 4).map((pharmacy, i) => (
            <motion.div
              key={pharmacy.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/pharmacies?id=${pharmacy.id}`}>
                <Card className="group relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full cursor-pointer hover:-translate-y-1 border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6 relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <img src={pharmacy.logo} alt="" className="w-8 h-8" />
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
                        Ko'rish
                        <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
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
                <Card className="group relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full cursor-pointer hover:-translate-y-1 border border-white/20">
                  <div className="absolute top-3 right-3 z-10">
                    {med.discount && (
                      <Badge variant="destructive" className="text-xs shadow-lg">
                        -{med.discount}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/5 to-blue-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                      <img src={med.image} alt="" className="w-full h-full object-cover" />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorsSection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container-custom">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">{t("consultation.title") || "Shifokorlar"}</Badge>
          <h2 className="heading-lg mb-4">
            Bizning <span className="text-gradient">mutaxassislarimiz</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            60+ yillik tajribaga ega malakali shifokorlar bilan onlayn maslahat oling
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/consultation?doctor=${doctor.id}`}>
                <Card className="group relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full cursor-pointer hover:-translate-y-1 border border-white/20">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-blue-50 group-hover:scale-105 transition-transform">
                          <img src={doctor.photo} alt="" className="w-full h-full object-cover" />
                        </div>
                        {doctor.isAvailableToday && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
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
                        <span>{doctor.experience} yillik tajriba</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span className="truncate">{doctor.education}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {doctor.availableForVideo && (
                        <Badge variant="secondary" className="text-[10px]">
                          <Video className="w-3 h-3 mr-1" /> Video
                        </Badge>
                      )}
                      {doctor.availableForChat && (
                        <Badge variant="secondary" className="text-[10px]">
                          <MessageSquareText className="w-3 h-3 mr-1" /> Chat
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(doctor.consultationFee)}
                      </span>
                      <Button variant="outline" size="sm" className="group/btn">
                        Band qilish
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
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
  const features = [
    {
      icon: TrendingUp,
      title: "Narx solishtirish",
      desc: "152+ dorixonada narxlarni solishtiring va eng arzonini toping",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      icon: Truck,
      title: "Tezkor yetkazish",
      desc: "30 daqiqada bepul yetkazib berish xizmati",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: "100% haqiqiy",
      desc: "Faqat sertifikatlangan va haqiqiy dorilar",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Clock,
      title: "24/7 xizmat",
      desc: "Kunduzi va kechasi biz bilan bog'laning",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Bot,
      title: "AI yordamchi",
      desc: "Sun'iy intellekt yordamida dori topish",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: Stethoscope,
      title: "Onlayn maslahat",
      desc: "Malakali shifokorlar bilan video maslahat",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <section className="section-padding relative">
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
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full cursor-pointer hover:-translate-y-1 border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg text-white",
                    feature.gradient
                  )}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ t }: { t: (path: string) => string }) {
  return (
    <section className="section-padding relative bg-gradient-to-b from-transparent via-muted/20 to-transparent">
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
              <Card className="relative p-6 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full border border-white/20">
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks({ t }: { t: (path: string) => string }) {
  const steps = [
    { icon: Search, title: "Dorini toping", desc: "Kerakli dorini qidirib, narxlarni solishtiring" },
    { icon: CheckCircle2, title: "Buyurtma bering", desc: "Eng yaxshi variantni tanlab, savatga qo'shing" },
    { icon: Truck, title: "Yetkazish", desc: "30 daqiqada eshigingizgacha yetkaziladi" },
    { icon: Heart, title: "Sog'liqni saqlang", desc: "Dorini qabul qilib, salomatligingizni mustahkamlang" },
  ];

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="primary" className="mb-4">Qanday ishlaydi?</Badge>
          <h2 className="heading-lg mb-4">
            Oddiy <span className="text-gradient">4 qadam</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connection line */}
          <div className="absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 hidden md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
                <step.icon className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary shadow-lg">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
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
              Ko'p so'raladigan <span className="text-gradient">savollar</span>
            </h2>
            <p className="text-muted-foreground">
              Platformamiz haqida bilishingiz kerak bo'lgan hamma narsa
            </p>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {tArray("faq").map((faq: { question: string; answer: string }, i: number) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 px-6"
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

function PartnerLogos() {
  const partners = [
    "Farmstandart", "Bayer", "Novartis", "Sanofi", "Pfizer",
    "GSK", "Cipla", "Teva", "Abdi Ibrahim", "R-pharm",
  ];

  return (
    <section className="py-12 border-y border-border/50">
      <div className="container-custom">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Ishtirokchi farmatsevtik kompaniyalar
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-50">
          {partners.map((partner, i) => (
            <div key={i} className="text-lg font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default">
              {partner}
            </div>
          ))}
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-purple-700 px-8 py-16 md:px-16 md:py-20 text-center"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-32 h-32 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-full"
          />

          <div className="relative">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/20 hover:bg-white/30">
              Hoziroq boshlang
            </Badge>
            <h2 className="heading-lg text-white mb-4">
              Sog'ligingiz uchun <br />eng yaxshi yechim
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
              30,000+ dori, 152+ dorixona, 60+ shifokor — bitta platformada
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 w-full sm:w-auto"
                >
                  Bepul ro'yxatdan o'tish
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/medicines">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Dorilarni ko'rish
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
