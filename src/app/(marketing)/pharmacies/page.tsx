"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Truck,
  Phone,
  Filter,
  X,
  ChevronDown,
  Building2,
  Navigation,
  Maximize2,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";
import { pharmacies } from "@/lib/data";
import type { MapPharmacy } from "@/components/shared/pharmacy-map";

const PharmacyMap = dynamic(() => import("@/components/shared/pharmacy-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center rounded-xl border border-border/50 bg-muted/20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
});

type FilterType = "nearest" | "cheapest" | "highest-rated" | "24-7" | "free-delivery" | "open-now" | null;

const filterKeys: { value: FilterType; key: string }[] = [
  { value: "nearest", key: "pharmacies.filters.nearest" },
  { value: "cheapest", key: "pharmacies.filters.cheapest" },
  { value: "highest-rated", key: "pharmacies.filters.highestRated" },
  { value: "24-7", key: "pharmacies.filters.24/7" },
  { value: "free-delivery", key: "pharmacies.filters.freeDelivery" },
  { value: "open-now", key: "pharmacies.filters.openNow" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

export default function PharmaciesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mapPharmacy, setMapPharmacy] = useState<MapPharmacy | null>(null);
  const [showFullMap, setShowFullMap] = useState(false);

  const filteredPharmacies = useMemo(() => {
    let result = [...pharmacies];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    switch (activeFilter) {
      case "nearest":
        result.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
        break;
      case "cheapest":
        result.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      case "highest-rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "24-7":
        result = result.filter((p) => p.is24hours);
        break;
      case "free-delivery":
        result = result.filter((p) => p.freeDelivery);
        break;
      case "open-now":
        result = result.filter((p) => p.isOpen);
        break;
    }

    return result;
  }, [searchQuery, activeFilter]);

  const filterOptions = useMemo(() =>
    filterKeys.map((f) => ({ value: f.value, label: t(f.key) })),
  [t]);

  return (
    <div className="overflow-hidden">
      <HeroSection t={t} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <section className="section-padding relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-40 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container-custom relative">
          <FilterBar
            t={t}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            filterOptions={filterOptions}
            showMobileFilters={showMobileFilters}
            onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
            resultCount={filteredPharmacies.length}
          />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-5"
            >
              {filteredPharmacies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t("common.noResults")}</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {t("common.error")}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter(null);
                    }}
                  >
                    {t("pharmacies.filters.clear")}
                  </Button>
                </motion.div>
              ) : (
                filteredPharmacies.map((pharmacy, i) => (
                  <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} index={i} t={t} onViewMap={() => setMapPharmacy(pharmacy)} />
                ))
              )}
            </motion.div>

            <div className="hidden lg:block space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PharmacyMapCard
                  t={t}
                  pharmacies={filteredPharmacies}
                  onExpand={() => setShowFullMap(true)}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {mapPharmacy && (
          <MapModal
            pharmacy={mapPharmacy}
            onClose={() => setMapPharmacy(null)}
            t={t}
          />
        )}
        {showFullMap && (
          <FullMapModal
            pharmacies={filteredPharmacies}
            onClose={() => setShowFullMap(false)}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroSection({
  t,
  searchQuery,
  onSearchChange,
}: {
  t: (path: string) => string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
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
            <Building2 className="w-4 h-4" />
            {pharmacies.length} {t("stats.pharmacies").toLowerCase()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-xl mb-4 leading-tight"
          >
            {t("pharmacies.title")}
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

function FilterBar({
  t,
  activeFilter,
  onFilterChange,
  filterOptions,
  showMobileFilters,
  onToggleMobileFilters,
  resultCount,
}: {
  t: (path: string) => string;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  filterOptions: { value: FilterType; label: string }[];
  showMobileFilters: boolean;
  onToggleMobileFilters: () => void;
  resultCount: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="heading-sm">
            {t("pharmacies.title")}
          </h2>
          <Badge variant="secondary" className="text-xs font-normal">
            {resultCount} {resultCount === 1 ? t("common.currency") === "$" ? "result" : "natija" : t("common.currency") === "$" ? "results" : "natija"}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={onToggleMobileFilters}
        >
          <Filter className="w-4 h-4 mr-2" />
          {t("common.search")}
          <ChevronDown className={cn(
            "w-3 h-3 ml-1 transition-transform duration-200",
            showMobileFilters && "rotate-180"
          )} />
        </Button>
      </div>

      <div className={cn(
        "flex flex-wrap gap-2",
        "lg:flex",
        showMobileFilters ? "flex" : "hidden"
      )}>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              onFilterChange(activeFilter === option.value ? null : option.value)
            }
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
              activeFilter === option.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground hover:bg-muted/50"
            )}
          >
            {option.label}
          </button>
        ))}

        {activeFilter && (
          <button
            onClick={() => onFilterChange(null)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            {t("pharmacies.filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}

function PharmacyCard({
  pharmacy,
  index,
  t,
  onViewMap,
}: {
  pharmacy: (typeof pharmacies)[number];
  index: number;
  t: (path: string) => string;
  onViewMap: () => void;
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="group relative overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-5 md:p-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <Building2 className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {pharmacy.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        pharmacy.isOpen ? "bg-emerald-500" : "bg-red-500"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        pharmacy.isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                      )}>
                        {pharmacy.isOpen ? t("pharmacies.open") : t("pharmacies.closed")}
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-sm text-muted-foreground">
                        {pharmacy.deliveryTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-sm">{pharmacy.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({pharmacy.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{pharmacy.address}, {pharmacy.city}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                  {pharmacy.distance !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Navigation className="w-3 h-3" />
                      <span>{pharmacy.distance.toFixed(1)} km</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{pharmacy.deliveryTime}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Truck className="w-3 h-3" />
                    <span>
                      {pharmacy.freeDelivery
                        ? t("pharmacies.freeDelivery")
                        : `${formatPrice(pharmacy.deliveryFee)} ${t("pharmacies.deliveryFee")}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{pharmacy.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/50">
              {pharmacy.is24hours && (
                <Badge variant="primary" className="text-[10px] leading-none">
                  24/7
                </Badge>
              )}
              {pharmacy.isVerified && (
                <Badge variant="success" className="text-[10px] leading-none">
                  {t("whyChooseUs.authentic.title")}
                </Badge>
              )}
              {pharmacy.freeDelivery && (
                <Badge variant="success" className="text-[10px] leading-none">
                  {t("pharmacies.freeDelivery")}
                </Badge>
              )}
              {pharmacy.isOpen && (
                <Badge variant="success" className="text-[10px] leading-none">
                  {t("pharmacies.open")}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                className="ml-auto text-xs"
                onClick={onViewMap}
              >
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {t("pharmacies.map")}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
  );
}

function PharmacyMapCard({
  t,
  pharmacies: list,
  onExpand,
}: {
  t: (path: string) => string;
  pharmacies: (typeof pharmacies)[number][];
  onExpand: () => void;
}) {
  return (
    <Card className="sticky top-24 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">{t("pharmacies.map")}</h3>
          </div>
          <button
            onClick={onExpand}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label={t("pharmacies.mapExpand")}
          >
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <PharmacyMap
          pharmacies={list.map((p) => ({
            id: p.id,
            name: p.name,
            address: p.address,
            city: p.city,
            phone: p.phone,
            lat: p.lat,
            lng: p.lng,
            isOpen: p.isOpen,
            deliveryTime: p.deliveryTime,
          }))}
          height="340px"
        />
      </div>
    </Card>
  );
}

function MapModal({
  pharmacy,
  onClose,
  t,
}: {
  pharmacy: MapPharmacy;
  onClose: () => void;
  t: (path: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-background rounded-2xl border border-border shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div>
            <h3 className="font-semibold">{pharmacy.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pharmacy.address}
              {pharmacy.city ? `, ${pharmacy.city}` : ""}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <PharmacyMap pharmacies={[pharmacy]} height="420px" />
        <div className="p-5 flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="sm"
            asChild
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-4 h-4 mr-1.5" />
              {t("pharmacies.directions")}
            </a>
          </Button>
          {pharmacy.phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${pharmacy.phone}`}>
                <Phone className="w-4 h-4 mr-1.5" />
                {pharmacy.phone}
              </a>
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FullMapModal({
  pharmacies: list,
  onClose,
  t,
}: {
  pharmacies: (typeof pharmacies)[number][];
  onClose: () => void;
  t: (path: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-5xl h-[80vh] bg-background rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">
              {t("pharmacies.map")} ({list.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1">
          <PharmacyMap
            pharmacies={list.map((p) => ({
              id: p.id,
              name: p.name,
              address: p.address,
              city: p.city,
              phone: p.phone,
              lat: p.lat,
              lng: p.lng,
              isOpen: p.isOpen,
              deliveryTime: p.deliveryTime,
            }))}
            height="100%"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
