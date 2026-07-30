"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Heart,
  ChevronRight,
  CheckCircle2,
  Circle,
  Pill,
  Store,
  Phone,
  Map,
  Navigation,
  Repeat,
  ShoppingBag,
  Star,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice, formatDateTime, formatTime, formatDate, getStatusColor } from "@/lib/utils";
import { orders, medicines } from "@/lib/data";
import type { Order } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function DeliveryPage() {
  const activeOrder = orders.find((o) => o.status === "in-transit");
  const pastOrders = orders.filter((o) => o.id !== activeOrder?.id);
  const favoriteMedicines = medicines.slice(0, 4);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="overflow-hidden">
      <HeroSection hasActiveOrder={!!activeOrder} />

      <section className="section-padding relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-40 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container-custom relative">
          {activeOrder && <ActiveOrderTracking order={activeOrder} />}

          <OrderHistory
            orders={pastOrders}
            onSelect={(id) => setSelectedOrderId(id)}
            selectedId={selectedOrderId}
          />

          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setSelectedOrderId(null)}
            />
          )}

          <FavoriteMedicines medicines={favoriteMedicines} />
        </div>
      </section>
    </div>
  );
}

function HeroSection({ hasActiveOrder }: { hasActiveOrder: boolean }) {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[40vh] md:min-h-[45vh] flex items-center pt-24 pb-12 md:pb-16 overflow-hidden">
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
            <Truck className="w-4 h-4" />
            {hasActiveOrder ? t("delivery.liveTracking") : t("delivery.dashboard")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-xl mb-4 leading-tight"
          >
            {t("delivery.delivery")} &{" "}
            <span className="text-gradient">{t("delivery.orderTracking")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed"
          >
            {t("delivery.description")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function ActiveOrderTracking({ order }: { order: Order }) {
  const { t } = useLanguage();
  const estimatedTime = formatDateTime(order.estimatedDelivery);

  const statusLabels: Record<string, string> = {
    confirmed: t("delivery.status.confirmed"),
    preparing: t("delivery.status.preparing"),
    "picked-up": t("delivery.status.pickedUp"),
    "in-transit": t("delivery.status.inTransit"),
    delivered: t("delivery.status.delivered"),
  };

  const currentIndex = order.tracking.length - 1;
  const currentStatus = order.tracking[currentIndex];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="heading-sm">
            {t("delivery.active")} <span className="text-gradient">{t("delivery.delivery")}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("delivery.orderDetails")} #{order.id} &middot; {order.pharmacyName}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-primary/5 via-muted/30 to-secondary/5 flex items-center justify-center border-b border-border/50">
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-10 flex items-center justify-center mx-auto mb-3"
                  >
                    <MapPin className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("delivery.liveTracking")}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {t("delivery.mapComingSoon")}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t("delivery.estimatedArrival")}</span>
                </div>
                <span className="text-sm font-bold text-primary">{estimatedTime}</span>
              </div>

              <div className="relative pl-8">
                {order.tracking.map((update, i) => {
                  const isActive = i === currentIndex;
                  const isCompleted = i < currentIndex;
                  const colors = getStatusColor(update.status);

                  return (
                    <div key={i} className="relative pb-6 last:pb-0">
                      <div className="absolute left-[-24px] top-0 flex flex-col items-center">
                        {isActive ? (
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30"
                          />
                        ) : (
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full border-2",
                              isCompleted
                                ? "bg-emerald-500 border-emerald-500"
                                : "bg-muted border-muted-foreground/30"
                            )}
                          />
                        )}
                        {i < order.tracking.length - 1 && (
                          <div
                            className={cn(
                              "w-0.5 h-full -mt-0.5",
                              isCompleted ? "bg-emerald-400" : "bg-border"
                            )}
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              isActive ? "text-foreground" : isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                            )}
                          >
                            {update.description}
                          </span>
                          {isActive && (
                            <motion.div
                              animate={{ opacity: [1, 0.4, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-2 h-2 rounded-full bg-orange-500"
                            />
                          )}
                          {isCompleted && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(update.timestamp)}
                          </span>
                          {update.location && (
                            <>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {update.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">{t("delivery.orderDetails")}</h3>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{order.pharmacyName}</p>
                  <p className="text-xs text-muted-foreground">{t("delivery.pharmacy")}</p>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.medicineName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.dosage} &middot; {t("delivery.quantity")}: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("common.total")}</span>
                <span className="text-lg font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">{t("delivery.deliveryAddress")}</h3>
              </div>
              <p className="text-sm font-medium">{order.deliveryAddress.fullName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                {order.deliveryAddress.phone}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function OrderHistory({
  orders: pastOrders,
  onSelect,
  selectedId,
}: {
  orders: Order[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const { t } = useLanguage();
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="heading-sm">
            {t("delivery.order")} <span className="text-gradient">{t("delivery.history")}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {pastOrders.length} {t("delivery.orderHistory")}
          </p>
        </div>
      </div>

      {pastOrders.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("delivery.noOrders")}</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {t("delivery.noOrdersDescription")}
          </p>
          <Link href="/medicines">
            <Button variant="primary">
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t("delivery.startShopping")}
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {pastOrders.map((order, i) => (
            <motion.div key={order.id} variants={itemVariants} custom={i}>
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
                  selectedId === order.id && "ring-2 ring-primary"
                )}
                onClick={() => onSelect(order.id)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {order.pharmacyName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "success"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-[10px] shrink-0"
                    >
                      {(() => {
                        const key = order.status.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                        return t(`delivery.status.${key}`);
                      })()}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground line-clamp-1 mb-3">
                    {order.items.map((item) => item.medicineName).join(", ")}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold">{formatPrice(order.total)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(order.id);
                      }}
                    >
                      <Repeat className="w-3 h-3 mr-1" />
                      {t("delivery.repeatOrder")}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-lg max-h-[85vh] overflow-y-auto bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-background z-10 flex items-center justify-between p-5 border-b border-border/50">
            <div>
              <h3 className="font-semibold">{t("delivery.orderDetails")} #{order.id}</h3>
              <p className="text-xs text-muted-foreground">{order.pharmacyName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <h4 className="text-sm font-semibold mb-3">{t("delivery.items")}</h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.medicineName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.dosage} &middot; {t("delivery.quantity")}: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("delivery.subtotal")}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("pharmacies.deliveryFee")}</span>
                <span>{order.deliveryFee === 0 ? t("pharmacies.freeDelivery") : formatPrice(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("delivery.discount")}</span>
                  <span className="text-emerald-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between font-bold">
                <span>{t("common.total")}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold mb-2">{t("delivery.tracking")}</h4>
              <div className="space-y-3">
                {order.tracking.map((update, i) => {
                  const isLast = i === order.tracking.length - 1;
                  const colors = getStatusColor(update.status);

                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-2.5 h-2.5 rounded-full mt-1",
                            isLast ? colors.dot : "bg-emerald-500"
                          )}
                        />
                        {!isLast && <div className="w-0.5 h-full bg-border mt-1" />}
                      </div>
                      <div className="pb-3">
                        <p className="text-sm font-medium">{update.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(update.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FavoriteMedicines({ medicines: meds }: { medicines: typeof medicines }) {
  const { t } = useLanguage();
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="heading-sm">
            {t("delivery.favorite")} <span className="text-gradient">{t("delivery.medicines")}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{t("delivery.quickReorder")}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {meds.map((medicine, i) => (
          <motion.div key={medicine.id} variants={itemVariants} custom={i}>
            <Link href={`/medicines/${medicine.slug}`}>
              <Card className="group hover:-translate-y-0.5 transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                    {medicine.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {medicine.dosage} &middot; {medicine.manufacturer}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="font-bold text-sm">{formatPrice(medicine.unitPrice)}</span>
                    {medicine.discount && medicine.discount > 0 && (
                      <Badge variant="success" className="text-[10px] leading-none px-1.5 py-0.5">
                        -{medicine.discount}%
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
