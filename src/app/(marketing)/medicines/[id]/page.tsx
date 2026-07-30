"use client";

import { useState, useMemo, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Pill,
  Star,
  Truck,
  Award,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Clock,
  MessageSquare,
  ChevronRight,
  Package,
  Scale,
  Info,
  Store,
  BadgeCheck,
  Timer,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice, slugify } from "@/lib/utils";
import { medicines, medicinePrices } from "@/lib/data";
import { useCart } from "@/store/cart";
import type { Medicine, MedicinePrice } from "@/types";

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

function getFormLabel(form: string): string {
  if (!form) return "";
  return form.charAt(0).toUpperCase() + form.slice(1);
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const medicine = useMemo(() => medicines.find((m) => m.slug === id), [id]);

  const prices = useMemo(() => {
    if (!medicine) return [];
    return medicinePrices[medicine.id] ?? [];
  }, [medicine]);

  const availablePrices = useMemo(
    () => [...prices].filter((p) => p.isAvailable).sort((a, b) => a.price + a.deliveryFee - (b.price + b.deliveryFee)),
    [prices]
  );

  const unavailablePrices = useMemo(() => prices.filter((p) => !p.isAvailable), [prices]);

  const cheapestPrice = availablePrices.length > 0 ? availablePrices[0] : null;

  const selectedPrice = useMemo(() => {
    if (!selectedPharmacyId) return cheapestPrice;
    return availablePrices.find((p) => p.pharmacyId === selectedPharmacyId) ?? cheapestPrice;
  }, [selectedPharmacyId, availablePrices, cheapestPrice]);

  const alternativeMedicines = useMemo(() => {
    if (!medicine) return [];
    return medicines.filter(
      (m) =>
        m.id !== medicine.id &&
        medicine.alternatives.some(
          (alt) => m.name.toLowerCase().includes(alt.toLowerCase()) || alt.toLowerCase().includes(m.name.toLowerCase())
        )
    );
  }, [medicine]);

  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!medicine || !selectedPrice) return;
    addItem({
      medicineId: medicine.id,
      medicineName: medicine.name,
      medicineImage: medicine.image,
      dosage: medicine.dosage,
      pharmacyId: selectedPrice.pharmacyId,
      pharmacyName: selectedPrice.pharmacyName,
      unitPrice: selectedPrice.price,
      quantity,
      prescriptionRequired: medicine.prescriptionRequired,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!medicine) {
    return <NotFound />;
  }

  return (
    <div className="overflow-hidden">
      <Breadcrumb medicineName={medicine.name} />

      <section className="section-padding relative pt-6 md:pt-8">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-40 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <HeroSection medicine={medicine} cheapestPrice={cheapestPrice} />

              <MedicineInfo medicine={medicine} />

              <PriceComparisonSection
                medicine={medicine}
                availablePrices={availablePrices}
                unavailablePrices={unavailablePrices}
                selectedPrice={selectedPrice}
                onSelectPharmacy={setSelectedPharmacyId}
              />

              {alternativeMedicines.length > 0 && (
                <AlternativesSection medicines={alternativeMedicines} />
              )}

              <ReviewsPlaceholder />
            </div>

            <div className="lg:col-span-1">
              <Sidebar
                medicine={medicine}
                selectedPrice={selectedPrice}
                cheapestPrice={cheapestPrice}
                availablePrices={availablePrices}
                unavailablePrices={unavailablePrices}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                addedToCart={addedToCart}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center mx-auto mb-6 border border-destructive/20">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Medicine not found</h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          The medicine you are looking for does not exist or may have been removed. Please check the URL or browse our
          medicine catalog.
        </p>
        <Link href="/medicines">
          <Button variant="primary" size="lg">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Medicines
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

function Breadcrumb({ medicineName }: { medicineName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="container-custom pt-24 md:pt-28"
    >
      <nav className="flex items-center gap-2 text-sm text-muted-foreground py-3">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/medicines" className="hover:text-foreground transition-colors">
          Medicines
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{medicineName}</span>
      </nav>
    </motion.div>
  );
}

function HeroSection({
  medicine,
  cheapestPrice,
}: {
  medicine: Medicine;
  cheapestPrice: MedicinePrice | null;
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-72 lg:w-80 shrink-0 relative h-56 md:h-auto gradient-primary flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Pill className="w-24 h-24 text-white/60" />
            </motion.div>
            {medicine.discount && medicine.discount > 0 && (
              <Badge
                variant="warning"
                className="absolute top-4 right-4 text-xs font-bold px-3 py-1"
              >
                -{medicine.discount}%
              </Badge>
            )}
          </div>

          <div className="flex-1 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {medicine.prescriptionRequired && (
                    <Badge variant="destructive" className="text-[10px] font-bold px-2 py-0.5">
                      Prescription Required
                    </Badge>
                  )}
                  <Badge
                    variant={formVariantMap[medicine.form] ?? "outline"}
                    className="text-[10px] px-2 py-0.5"
                  >
                    {getFormLabel(medicine.form)}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{medicine.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{medicine.genericName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(cheapestPrice?.price ?? medicine.unitPrice)}
                </span>
                {(medicine.discount ?? 0) > 0 && medicine.basePrice > (cheapestPrice?.price ?? medicine.unitPrice) && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(medicine.basePrice)}
                  </span>
                )}
              </div>
              {(medicine.discount ?? 0) > 0 && (
                <Badge variant="success" className="text-xs font-semibold">
                  Save {medicine.discount}%
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" />
                {medicine.manufacturer}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-primary" />
                {medicine.dosage} · {getFormLabel(medicine.form)}
              </span>
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-primary" />
                {medicine.strength}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function MedicineInfo({ medicine }: { medicine: Medicine }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          About this medicine
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{medicine.description}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <DetailRow label="Generic Name" value={medicine.genericName} />
          <DetailRow label="Manufacturer" value={medicine.manufacturer} />
          <DetailRow label="Category" value={medicine.category} />
          <DetailRow label="Dosage" value={medicine.dosage} />
          <DetailRow label="Strength" value={medicine.strength} />
          <DetailRow label="Form" value={getFormLabel(medicine.form)} />
          <DetailRow
            label="Prescription"
            value={medicine.prescriptionRequired ? "Required" : "Not Required"}
            valueClass={medicine.prescriptionRequired ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}
          />
          <DetailRow
            label="Stock"
            value={medicine.isAvailable ? `In Stock (${medicine.stockQuantity} units)` : "Out of Stock"}
            valueClass={medicine.isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}
          />
        </div>

        {medicine.sideEffects.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-primary" />
              Possible Side Effects
            </h3>
            <div className="flex flex-wrap gap-2">
              {medicine.sideEffects.map((effect) => (
                <Badge key={effect} variant="outline" className="text-[11px] px-2.5 py-1">
                  {effect}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className={cn("text-sm font-semibold text-right", valueClass)}>{value}</span>
    </div>
  );
}

function PriceComparisonSection({
  medicine,
  availablePrices,
  unavailablePrices,
  selectedPrice,
  onSelectPharmacy,
}: {
  medicine: Medicine;
  availablePrices: MedicinePrice[];
  unavailablePrices: MedicinePrice[];
  selectedPrice: MedicinePrice | null;
  onSelectPharmacy: (id: string | null) => void;
}) {
  const sortedByTotal = useMemo(
    () => [...availablePrices].sort((a, b) => a.price + a.deliveryFee - (b.price + b.deliveryFee)),
    [availablePrices]
  );

  const cheapestTotal = sortedByTotal.length > 0 ? sortedByTotal[0].price + sortedByTotal[0].deliveryFee : null;

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Store className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Price Comparison</h2>
          {sortedByTotal.length > 0 && (
            <Badge variant="secondary" className="text-[10px] font-normal">
              {sortedByTotal.length} {sortedByTotal.length === 1 ? "pharmacy" : "pharmacies"}
            </Badge>
          )}
        </div>

        {sortedByTotal.length === 0 && unavailablePrices.length === 0 && (
          <div className="text-center py-10">
            <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No pricing data available for this medicine yet.</p>
          </div>
        )}

        {sortedByTotal.length > 0 && (
          <div className="space-y-3">
            {sortedByTotal.map((price, i) => {
              const totalPrice = price.price + price.deliveryFee;
              const isCheapest = i === 0;
              const isSelected = selectedPrice?.pharmacyId === price.pharmacyId;

              return (
                <motion.div
                  key={price.pharmacyId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onSelectPharmacy(isSelected ? null : price.pharmacyId)}
                  className={cn(
                    "relative rounded-xl border p-4 transition-all duration-200 cursor-pointer",
                    isSelected && "ring-2 ring-primary",
                    isCheapest && !isSelected && "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm shadow-emerald-500/10",
                    !isCheapest && !isSelected && "border-border bg-card/50 hover:border-primary/30"
                  )}
                >
                  {isCheapest && (
                    <div className="absolute -top-2.5 right-3">
                      <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5 gap-1">
                        <Award className="w-3 h-3" />
                        Best Price
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 border border-border">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{price.pharmacyName}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span>{price.pharmacyRating}</span>
                          </div>
                          <span>·</span>
                          <span>{price.deliveryTime}</span>
                          {price.distance !== undefined && (
                            <>
                              <span>·</span>
                              <span>{price.distance.toFixed(1)} mi</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold">{formatPrice(price.price)}</div>
                      {price.originalPrice && price.originalPrice > price.price && (
                        <div className="text-xs text-muted-foreground line-through">{formatPrice(price.originalPrice)}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {price.deliveryFee === 0 ? "Free delivery" : `${formatPrice(price.deliveryFee)} delivery`}
                      </span>
                      <span className="flex items-center gap-1">
                        {price.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            In stock
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-destructive" />
                            Out of stock
                          </>
                        )}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">Total: {formatPrice(totalPrice)}</span>
                  </div>

                  {i > 0 && cheapestTotal !== null && totalPrice - cheapestTotal > 0 && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {formatPrice(totalPrice - cheapestTotal)} more than the best price
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
              Unavailable at these pharmacies:
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
                    Unavailable
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function AlternativesSection({ medicines: altMedicines }: { medicines: Medicine[] }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Scale className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Alternative Medicines</h2>
          <Badge variant="secondary" className="text-[10px] font-normal">
            {altMedicines.length} {altMedicines.length === 1 ? "option" : "options"}
          </Badge>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
          {altMedicines.map((alt) => {
            const altPrices = medicinePrices[alt.id];
            const cheapestAlt = altPrices
              ? [...altPrices].filter((p) => p.isAvailable).sort((a, b) => a.price - b.price)[0]
              : null;

            return (
              <motion.div key={alt.id} variants={fadeUp}>
                <Link href={`/medicines/${alt.slug}`}>
                  <div className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <Pill className="w-6 h-6 text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                        {alt.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{alt.dosage}</span>
                        <span>·</span>
                        <Badge
                          variant={formVariantMap[alt.form] ?? "outline"}
                          className="text-[9px] leading-none px-1.5 py-0.5"
                        >
                          {getFormLabel(alt.form)}
                        </Badge>
                        {alt.prescriptionRequired && (
                          <>
                            <span>·</span>
                            <span className="text-destructive">Rx</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm">
                        {cheapestAlt ? formatPrice(cheapestAlt.price) : formatPrice(alt.unitPrice)}
                      </div>
                      {alt.discount && alt.discount > 0 && (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0.5 mt-0.5">
                          -{alt.discount}%
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Card>
    </motion.div>
  );
}

function ReviewsPlaceholder() {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Reviews</h2>
        </div>

        <div className="text-center py-10">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4 border border-border"
          >
            <MessageSquare className="w-7 h-7 text-primary/60" />
          </motion.div>
          <p className="text-sm font-medium text-foreground mb-1">Reviews coming soon</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Patient reviews and ratings for this medicine will be available in a future update.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

function Sidebar({
  medicine,
  selectedPrice,
  cheapestPrice,
  availablePrices,
  unavailablePrices,
  quantity,
  onQuantityChange,
  onAddToCart,
  addedToCart,
}: {
  medicine: Medicine;
  selectedPrice: MedicinePrice | null;
  cheapestPrice: MedicinePrice | null;
  availablePrices: MedicinePrice[];
  unavailablePrices: MedicinePrice[];
  quantity: number;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
  addedToCart: boolean;
}) {
  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Add to Cart
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Pharmacy
              </label>
              {selectedPrice ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{selectedPrice.pharmacyName}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{formatPrice(selectedPrice.price)}</span>
                      {selectedPrice.deliveryFee > 0 && (
                        <span>+ {formatPrice(selectedPrice.deliveryFee)} delivery</span>
                      )}
                    </div>
                  </div>
                  {cheapestPrice?.pharmacyId === selectedPrice.pharmacyId && (
                    <Badge variant="success" className="text-[9px] px-1.5 py-0.5 gap-0.5 shrink-0">
                      <Award className="w-2.5 h-2.5" />
                      Best
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground">
                    {availablePrices.length === 0
                      ? "No pharmacies available"
                      : "Select a pharmacy from the price comparison below"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-input bg-background flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-lg font-bold tabular-nums">{quantity}</span>
                </div>
                <button
                  onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
                  disabled={quantity >= 99}
                  className="w-10 h-10 rounded-lg border border-input bg-background flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedPrice && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold">{formatPrice(selectedPrice.price * quantity)}</span>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!selectedPrice || quantity < 1 || quantity > 99}
              onClick={onAddToCart}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Added to Cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Available Pharmacies
          </h3>

          {availablePrices.length === 0 && unavailablePrices.length === 0 && (
            <div className="text-center py-6">
              <Store className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No pharmacies listed yet</p>
            </div>
          )}

          <div className="space-y-3">
            {availablePrices.map((price, i) => (
              <div
                key={price.pharmacyId}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  i === 0
                    ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "border-border/60 bg-card/30"
                )}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 border border-border">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{price.pharmacyName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{formatPrice(price.price)}</span>
                    {i === 0 && (
                      <Badge variant="success" className="text-[8px] px-1.5 py-0 gap-0.5">
                        <Award className="w-2 h-2" />
                        Best
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  {price.pharmacyRating}
                </div>
              </div>
            ))}

            {unavailablePrices.map((price) => (
              <div
                key={price.pharmacyId}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/20 opacity-60"
              >
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-muted-foreground">{price.pharmacyName}</p>
                  <p className="text-xs text-muted-foreground">Currently unavailable</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary" />
            Delivery Estimate
          </h3>

          {cheapestPrice ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/50">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{cheapestPrice.deliveryTime}</p>
                  <p className="text-xs text-muted-foreground">Estimated delivery time</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/50">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {cheapestPrice.deliveryFee === 0
                      ? "Free Delivery"
                      : `${formatPrice(cheapestPrice.deliveryFee)} delivery fee`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    From {cheapestPrice.pharmacyName}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Truck className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Delivery info unavailable</p>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure payment &amp; encrypted checkout</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
