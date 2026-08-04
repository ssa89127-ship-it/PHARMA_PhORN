"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Pill,
  X,
  Star,
  Activity,
  Shield,
  Droplet,
  Heart,
  Wind,
  Stethoscope,
  Apple,
  Building2,
  CheckCircle2,
  AlertCircle,
  Store,
  Award,
  Truck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn, formatPrice } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Medicine, Category, MedicinePrice } from "@/types";
import { useDataLoader } from "@/lib/data-loader";

const categoryFilterMap: Record<string, string[]> = {
  "Og'riq qoldiruvchi": ["Og'riq qoldiruvchi"],
  Antibiotiklar: ["Antibiotiklar"],
  "Yurak-qon tomir": ["Yurak-qon tomir"],
  "Qandli diabet": ["Qandli diabet"],
  "Allergiyaga qarshi": ["Allergiyaga qarshi"],
  "Ovqat hazm qilish": ["Ovqat hazm qilish"],
  Vitaminlar: ["Vitaminlar"],
  "Nafas olish": ["Nafas olish"],
};

const slugToTransKey: Record<string, string> = {
  "pain-relief": "painRelief",
  antibiotics: "antibiotics",
  cardiovascular: "heartHealth",
  diabetes: "diabetes",
  allergy: "allergies",
  digestive: "digestive",
  vitamins: "vitamins",
  respiratory: "respiratory",
};

const categoryIconMap: Record<string, React.ElementType> = {
  Activity,
  Shield,
  Droplet,
  Heart,
  Wind,
  Stethoscope,
  Apple,
};

const formVariantMap: Record<string, "primary" | "secondary" | "warning" | "destructive" | "outline"> = {
  tablet: "primary",
  capsule: "secondary",
  syrup: "warning",
  cream: "outline",
  injection: "destructive",
  drops: "primary",
  inhaler: "secondary",
  spray: "warning",
  patch: "outline",
  ointment: "outline",
};

function getFormLabel(form: string, t: (p: string) => string): string {
  if (!form) return "";
  return t(`medicines.formLabels.${form}`);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function MedicinesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceModalMedicine, setPriceModalMedicine] = useState<Medicine | null>(null);
  const { data, isLoading } = useDataLoader();

  const medicines = data?.medicines ?? [];
  const categories = data?.categories ?? [];
  const medicinePrices = data?.medicinePrices ?? {};

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      const mapped = categoryFilterMap[cat.name];
      if (mapped) {
        counts[cat.name] = medicines.filter((m) => mapped.includes(m.category)).length;
      }
    }
    return counts;
  }, [categories, medicines]);

  const filteredMedicines = useMemo(() => {
    let result = [...medicines];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.manufacturer.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.dosage.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      const mapped = categoryFilterMap[selectedCategory];
      if (mapped) {
        result = result.filter((m) => mapped.includes(m.category));
      }
    }

    return result;
  }, [searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <HeroSection t={t} searchQuery={searchQuery} onSearchChange={setSearchQuery} totalCount={medicines.length} />

      <section className="section-padding relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-40 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container-custom relative">
          <CategoryFilterPills
            t={t}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            categoryCounts={categoryCounts}
            totalResults={filteredMedicines.length}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {filteredMedicines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <Pill className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("common.noResults")}</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {t("common.error")}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  {t("pharmacies.filters.clear")}
                </Button>
              </motion.div>
            ) : (
              filteredMedicines.map((medicine, i) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  index={i}
                  t={t}
                  onComparePrices={() => setPriceModalMedicine(medicine)}
                  medicinePrices={medicinePrices}
                />
              ))
            )}
          </motion.div>
        </div>
      </section>

      <PriceComparisonModal
        t={t}
        medicine={priceModalMedicine}
        open={priceModalMedicine !== null}
        onOpenChange={(open) => {
          if (!open) setPriceModalMedicine(null);
        }}
        medicinePrices={medicinePrices}
      />
    </div>
  );
}

function HeroSection({
  t,
  searchQuery,
  onSearchChange,
  totalCount,
}: {
  t: (path: string) => string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
}) {
  return (
    <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-center pt-24 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

      <div className="container-custom relative w-full">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
          >
            <Pill className="w-4 h-4" />
            {totalCount} {t("stats.medicines").toLowerCase()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-xl mb-4 leading-tight"
          >
            {t("medicines.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed"
          >
            {t("brand.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-1 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder={t("nav.search")}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm py-3 placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Button variant="primary" size="md" className="shrink-0 mr-1">
                <Search className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t("hero.search")}</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoryFilterPills({
  t,
  categories: cats,
  selectedCategory,
  onSelect,
  categoryCounts,
  totalResults,
}: {
  t: (path: string) => string;
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
  categoryCounts: Record<string, number>;
  totalResults: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="heading-sm">
            {t("categories.subtitle")}
          </h2>
          <Badge variant="secondary" className="text-xs font-normal">
            {totalResults} {t("common.noResults").includes("Natija") ? "natija" : t("common.noResults").includes("Результатов") ? "результатов" : "results"}
          </Badge>
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap shrink-0",
            !selectedCategory
              ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
              : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Building2 className="w-4 h-4" />
          {t("common.viewAll")}
        </button>

        {cats.map((cat) => {
          const Icon = categoryIconMap[cat.icon];
          const count = categoryCounts[cat.name] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(selectedCategory === cat.name ? null : cat.name)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap shrink-0",
                selectedCategory === cat.name
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                  : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground hover:bg-muted/50"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {t(`categories.${slugToTransKey[cat.slug] || cat.slug}`)}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}

        {selectedCategory && (
          <button
            onClick={() => onSelect(null)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive transition-colors whitespace-nowrap shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            {t("pharmacies.filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}

function MedicineCard({
  medicine,
  index,
  onComparePrices,
  t,
  medicinePrices,
}: {
  medicine: Medicine;
  index: number;
  onComparePrices: () => void;
  t: (path: string) => string;
  medicinePrices: Record<string, MedicinePrice[]>;
}) {
  const prices = medicinePrices[medicine.id];
  const hasPrices = prices && prices.length > 0;
  const cheapestPrice = hasPrices
    ? [...prices].filter((p) => p.isAvailable).sort((a, b) => a.price - b.price)[0]
    : null;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={index}>
      <Card className="group overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
        <Link href={`/medicines/${medicine.slug}`} className="block">
          <div className="relative h-40 gradient-primary flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <Pill className="w-14 h-14 text-white/70 group-hover:scale-110 transition-transform duration-500" />
            {medicine.discount && medicine.discount > 0 && (
              <Badge
                variant="warning"
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5"
              >
                -{medicine.discount}%
              </Badge>
            )}
            {medicine.prescriptionRequired && (
              <Badge
                variant="destructive"
                className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5"
              >
                Rx
              </Badge>
            )}
          </div>
        </Link>

        <div className="p-5 flex flex-col flex-1">
          <Link href={`/medicines/${medicine.slug}`}>
            <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {medicine.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mt-0.5">{medicine.manufacturer}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{medicine.dosage}</span>
            <span className="text-muted-foreground/30">·</span>
            <Badge
              variant={formVariantMap[medicine.form] ?? "outline"}
              className="text-[10px] leading-none px-2 py-0.5"
            >
              {getFormLabel(medicine.form, t)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(medicine.unitPrice)}
            </span>
            {medicine.discount && medicine.discount > 0 && medicine.basePrice > medicine.unitPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(medicine.basePrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            {medicine.discount && medicine.discount > 0 && (
              <Badge variant="success" className="text-[10px] leading-none px-2 py-0.5">
                {medicine.discount}% {t("pharmacies.filters.nearest") === "Eng yaqin" ? "chegirma" : "off"}
              </Badge>
            )}
            {medicine.prescriptionRequired && (
              <Badge variant="outline" className="text-[10px] leading-none px-2 py-0.5 border-destructive/30 text-destructive">
                {t("medicines.prescription")}
              </Badge>
            )}
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={(e) => {
                e.preventDefault();
                onComparePrices();
              }}
            >
              <Store className="w-3.5 h-3.5 mr-1.5" />
              {t("medicines.compare")}
              {cheapestPrice && (
                <span className="ml-1 text-primary font-semibold">
                  {t("medicines.priceComparison.cheapest").toLowerCase() === "eng arzon" ? "dan" : t("medicines.priceComparison.cheapest").toLowerCase() === "самая дешёвая" ? "от" : "from"} {formatPrice(cheapestPrice.price)}
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function PriceComparisonModal({
  t,
  medicine,
  open,
  onOpenChange,
  medicinePrices,
}: {
  t: (path: string) => string;
  medicine: Medicine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicinePrices: Record<string, MedicinePrice[]>;
}) {
  const prices = medicine ? medicinePrices[medicine.id] ?? [] : [];

  const sortedPrices = useMemo(() => {
    return [...prices]
      .filter((p) => p.isAvailable)
      .sort((a, b) => a.price + a.deliveryFee - (b.price + b.deliveryFee));
  }, [prices]);

  const unavailablePrices = useMemo(() => {
    return prices.filter((p) => !p.isAvailable);
  }, [prices]);

  const cheapestTotal = sortedPrices.length > 0
    ? sortedPrices[0].price + sortedPrices[0].deliveryFee
    : null;

  if (!medicine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg">{medicine.name}</DialogTitle>
              <DialogDescription className="text-sm">
                {medicine.dosage} · {getFormLabel(medicine.form, t)} · {medicine.manufacturer}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">{t("medicines.priceComparison.title")}</h4>
          </div>

          {sortedPrices.length === 0 && unavailablePrices.length === 0 && (
            <div className="text-center py-10">
              <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {t("common.noResults")}
              </p>
            </div>
          )}

          {sortedPrices.length > 0 && (
            <div className="space-y-3">
              {sortedPrices.map((price, i) => {
                const totalPrice = price.price + price.deliveryFee;
                const isCheapest = i === 0 && sortedPrices.length > 0;
                const savings = i > 0 && cheapestTotal !== null
                  ? totalPrice - cheapestTotal
                  : null;

                return (
                  <motion.div
                    key={price.pharmacyId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "relative rounded-xl border p-4 transition-all",
                      isCheapest
                        ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm shadow-emerald-500/10"
                        : "border-border bg-card/50"
                    )}
                  >
                    {isCheapest && (
                      <div className="absolute -top-2.5 right-3">
                        <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5 gap-1">
                          <Award className="w-3 h-3" />
                          {t("medicines.bestPrice")}
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 border border-border">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{price.pharmacyName}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span>{price.pharmacyRating}</span>
                            </div>
                            <span>·</span>
                            <span>{price.deliveryTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold">
                          {formatPrice(price.price)}
                        </div>
                        {price.originalPrice && price.originalPrice > price.price && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatPrice(price.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {price.deliveryFee === 0 ? t("pharmacies.freeDelivery") : `${formatPrice(price.deliveryFee)} ${t("medicines.priceComparison.delivery")}`}
                        </span>
                        <span className="flex items-center gap-1">
                          {price.stockQuantity > 0 ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              {t("medicines.inStock")} ({price.stockQuantity})
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 text-destructive" />
                              {t("medicines.outOfStock")}
                            </>
                          )}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        {t("medicines.priceComparison.total")}: {formatPrice(totalPrice)}
                      </span>
                    </div>

                    {savings !== null && savings > 0 && (
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        {formatPrice(savings)} {t("medicines.priceComparison.save").toLowerCase()}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {unavailablePrices.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                {t("medicines.outOfStock")}
              </p>
              <div className="space-y-2">
                {unavailablePrices.map((price) => (
                  <div
                    key={price.pharmacyId}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{price.pharmacyName}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground shrink-0">
                      {t("medicines.outOfStock")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            {t("common.noResults")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
