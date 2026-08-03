"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Upload,
  MapPin,
  CreditCard,
  Ticket,
  ArrowLeft,
  Shield,
  CheckCircle2,
  Pill,
  AlertCircle,
  ChevronRight,
  Package,
  Building2,
  Heart,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { cn, formatPrice } from "@/lib/utils";
import { savedAddresses } from "@/lib/data";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCart } from "@/store/cart";
import { PaymentSelector } from "@/components/payment/payment-selector";
import type { PaymentProvider } from "@/lib/payments";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function CartPage() {
  const {
    items,
    subtotal,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const toast = useToast();
  const { t } = useLanguage();

  const [selectedAddress, setSelectedAddress] = useState<string>(
    savedAddresses.find((a) => a.isDefault)?.id ?? ""
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentProvider | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const deliveryFee = 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }
    setIsPlacingOrder(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsPlacingOrder(false);
      // Redirect to payment result page
      window.location.href = `/payment/result?status=success&orderId=ORD-${Date.now().toString(36).toUpperCase()}&amount=${total}&provider=${selectedPayment}`;
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="overflow-hidden">
        <section className="relative min-h-[70vh] flex items-center pt-24 pb-12 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />

          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 border border-border">
                <ShoppingCart className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <h1 className="heading-md mb-3">
                {t("cart.empty")}
              </h1>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                {t("cart.emptyDesc")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/medicines">
                  <Button variant="primary" size="lg">
                    <Pill className="w-4 h-4 mr-2" />
                    {t("cart.browse")}
                  </Button>
                </Link>
                <Link href="/pharmacies">
                  <Button variant="outline" size="lg">
                    <Building2 className="w-4 h-4 mr-2" />
                    Find Pharmacies
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-40 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-3">
                <ShoppingCart className="w-3.5 h-3.5" />
                {t("cart.title")} ({items.length})
              </div>
              <h1 className="heading-md">
                {t("cart.checkout")}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              {t("cart.clearAll")}
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  {t("cart.title")}
                </h2>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.medicineId}
                        layout
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                      >
                        <Card className="group">
                          <div className="p-4 sm:p-5">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                                <Pill className="w-6 h-6 text-white" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-sm truncate">
                                      {item.medicineName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.dosage} &middot; {item.pharmacyName}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive -mr-2 -mt-2"
                                    onClick={() => removeItem(item.medicineId)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                      <button
                                        onClick={() =>
                                          updateQuantity(
                                            item.medicineId,
                                            Math.max(1, item.quantity - 1)
                                          )
                                        }
                                        className="p-2 hover:bg-muted transition-colors"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="w-10 text-center text-sm font-medium border-x border-border">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() =>
                                          updateQuantity(item.medicineId, item.quantity + 1)
                                        }
                                        className="p-2 hover:bg-muted transition-colors"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <p className="font-bold text-sm">
                                      {formatPrice(item.unitPrice * item.quantity)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatPrice(item.unitPrice)} / unit
                                    </p>
                                  </div>
                                </div>

                                {item.prescriptionRequired && (
                                  <div className="mt-3 pt-3 border-t border-border/50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-xs text-muted-foreground">
                                          {t("medicines.prescription")}
                                        </span>
                                      </div>
                                      <Button variant="outline" size="sm" className="text-xs">
                                        <Upload className="w-3 h-3 mr-1" />
                                        {t("dashboard.patient.upload")}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t("delivery.deliveryAddress")}
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  {savedAddresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => setSelectedAddress(address.id)}
                      className={cn(
                        "relative rounded-xl border p-4 text-left transition-all duration-200",
                        selectedAddress === address.id
                          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                          : "border-border bg-card/50 hover:border-primary/30 hover:bg-muted/30"
                      )}
                    >
                      {selectedAddress === address.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-[10px] leading-none">
                          {address.label}
                        </Badge>
                        {address.isDefault && (
                          <Badge variant="primary" className="text-[10px] leading-none">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">{address.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{address.phone}</p>
                    </button>
                  ))}

                  <button className="rounded-xl border border-dashed border-border p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-200 min-h-[120px]">
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-medium">Add new address</span>
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {t("payment.method")}
                </h2>

                <PaymentSelector
                  amount={total}
                  selectedProvider={selectedPayment}
                  onSelect={(provider) => setSelectedPayment(provider)}
                />
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="lg:sticky lg:top-24 space-y-4"
              >
                <Card>
                  <div className="p-5">
                    <h3 className="font-semibold text-sm mb-4">{t("cart.title")}</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("cart.delivery")}</span>
                        <span className="font-medium">
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                          ) : (
                            formatPrice(deliveryFee)
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          -{formatPrice(discount)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{t("cart.total")}</span>
                        <span className="text-lg font-bold">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-5">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-primary" />
                      {t("cart.promoCode")}
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("cart.promoPlaceholder")}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm" className="shrink-0">
                        {t("cart.apply")}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePlaceOrder}
                  loading={isPlacingOrder}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t("cart.placeOrder")}
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Shield className="w-3.5 h-3.5" />
                  Secure checkout &middot; Your data is protected
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
