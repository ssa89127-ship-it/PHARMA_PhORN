"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  CalendarClock,
  Heart,
  Bell,
  User,
  MapPin,
  CreditCard,
  FileText,
  Receipt,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Clock,
  MapPinned,
  Phone,
  Mail,
  Cake,
  Droplets,
  Stethoscope,
  Pill,
  Star,
  Award,
  TrendingUp,
  Video,
  Calendar,
  CircleCheck,
  Circle,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin as MapPinIcon,
  Smartphone,
  Monitor,
  Loader2,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  Menu,
  MoreHorizontal,
  Upload,
  CreditCard as CreditCardIcon,
  Heart as HeartIcon,
  HeartOff,
  Video as VideoIcon,
  CalendarPlus,
  Ban,
  ExternalLink,
} from "lucide-react";
import {
  orders,
  appointments,
  medicalRecords,
  medicines,
  savedAddresses,
  paymentMethods,
  loyaltyPoints,
  notifications as notificationsData,
} from "@/lib/data";
import { cn, formatPrice, formatDate, formatDateTime, getTimeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import type { Order, Notification } from "@/types";

type Tab = "overview" | "orders" | "appointments" | "saved-medicines" | "notifications" | "profile" | "addresses" | "payment-methods" | "medical-records" | "invoices";

const sidebarItems: { id: Tab; icon: React.ElementType }[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "orders", icon: Package },
  { id: "appointments", icon: CalendarClock },
  { id: "saved-medicines", icon: Heart },
  { id: "notifications", icon: Bell },
  { id: "profile", icon: User },
  { id: "addresses", icon: MapPin },
  { id: "payment-methods", icon: CreditCard },
  { id: "medical-records", icon: FileText },
  { id: "invoices", icon: Receipt },
];

const tabLabelKeys: Record<Tab, string> = {
  overview: "dashboard.patient.overview",
  orders: "dashboard.patient.orders",
  appointments: "dashboard.patient.appointments",
  "saved-medicines": "dashboard.patient.savedMedicines",
  notifications: "dashboard.patient.notifications",
  profile: "dashboard.patient.profile",
  addresses: "dashboard.patient.addresses",
  "payment-methods": "dashboard.patient.paymentMethods",
  "medical-records": "dashboard.patient.medicalRecords",
  invoices: "dashboard.patient.invoices",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "success" | "warning" | "primary" | "secondary" | "destructive" | "outline"> = {
    delivered: "success",
    cancelled: "destructive",
    returned: "destructive",
    "in-transit": "warning",
    preparing: "secondary",
    "picked-up": "secondary",
    confirmed: "primary",
    pending: "outline",
    completed: "success",
    scheduled: "primary",
    "in-progress": "warning",
    "no-show": "destructive",
  };
  return (
    <Badge variant={variants[status] || "outline"}>
      {status}
    </Badge>
  );
}

function AppointmentTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    video: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    chat: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "in-person": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", styles[type] || "")}>
      {type === "video" && <Video className="h-3 w-3" />}
      {type === "chat" && <MessageCircle className="h-3 w-3" />}
      {type === "in-person" && <User className="h-3 w-3" />}
      {type}
    </span>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TrackingTimeline({ tracking }: { tracking: Order["tracking"] }) {
  return (
    <div className="relative space-y-0 pl-6">
      <div className="absolute left-[7px] top-1 h-full w-0.5 bg-border" />
      {tracking.map((step, i) => (
        <motion.div
          key={step.status}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative pb-4 last:pb-0"
        >
          <div className={cn(
            "absolute -left-[23px] mt-1.5 h-3.5 w-3.5 rounded-full border-2",
            i === tracking.length - 1
              ? "border-primary bg-primary"
              : "border-muted-foreground/30 bg-background"
          )}>
            {i === tracking.length - 1 && (
              <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
            )}
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium capitalize">{step.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDateTime(step.timestamp)}</span>
              {step.location && (
                <>
                  <span>•</span>
                  <MapPinned className="h-3 w-3" />
                  <span>{step.location}</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function OverviewTab() {
  const { t } = useLanguage();
  const recentOrders = orders.slice(0, 2);
  const upcomingAppointments = appointments.filter(a => a.status === "scheduled");
  const savedMedsCount = medicines.filter(m => ["med-1", "med-3", "med-7", "med-9"].includes(m.id)).length;

  return (
    <div className="space-y-6">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold">{t("dashboard.patient.welcome")} back, John! 👋</h2>
        <p className="text-muted-foreground">{t("dashboard.patient.overview")}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              {t("dashboard.patient.totalOrders")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.length}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.patient.orders")}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              {t("dashboard.patient.upcomingAppointments")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.patient.appointments")}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {t("dashboard.patient.savedMedicinesCount")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{savedMedsCount}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.patient.savedMedicines")}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              {t("dashboard.patient.loyaltyPoints")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{loyaltyPoints.total}</p>
            <p className="text-xs text-muted-foreground capitalize">{loyaltyPoints.tier} {t("dashboard.patient.loyaltyPoints")}</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{t("dashboard.patient.recentOrders")}</CardTitle>
                <CardDescription>{t("dashboard.patient.orders")}</CardDescription>
              </div>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.pharmacyName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(order.createdAt)}</span>
                      <span>•</span>
                      <span>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{t("dashboard.patient.upcomingAppointments")}</CardTitle>
                <CardDescription>{t("dashboard.patient.appointments")}</CardDescription>
              </div>
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.length > 0 ? upcomingAppointments.map((apt) => (
                <div key={apt.id} className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{apt.doctorName}</p>
                    <AppointmentTypeBadge type={apt.type} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(apt.date)}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{apt.startTime} - {apt.endTime}</span>
                  </div>
                  {apt.type === "video" && apt.meetLink && (
                    <Button size="sm" variant="outline" className="mt-2 gap-1.5" asChild>
                      <a href={apt.meetLink} target="_blank" rel="noopener noreferrer">
                        <Video className="h-3.5 w-3.5" />
                        {t("dashboard.patient.joinCall")}
                      </a>
                    </Button>
                  )}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4 text-center">{t("common.noResults")}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{t("dashboard.patient.loyaltyPoints")}</CardTitle>
                <CardDescription>{t("dashboard.patient.loyaltyPoints")}</CardDescription>
              </div>
            </div>
            <Badge variant="warning" className="capitalize text-xs">
              <Award className="mr-1 h-3 w-3" />
              {loyaltyPoints.tier}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{loyaltyPoints.total}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.patient.loyaltyPoints")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {loyaltyPoints.pointsUntilNextTier} pts to next tier
                </p>
                <p className="text-xs text-muted-foreground">
                  Earned: {loyaltyPoints.earned} | Redeemed: {loyaltyPoints.redeemed}
                </p>
              </div>
            </div>
            <Progress
              value={((loyaltyPoints.earned) / (loyaltyPoints.earned + loyaltyPoints.pointsUntilNextTier)) * 100}
              className="h-2.5 bg-amber-200 dark:bg-amber-900/30"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function OrdersTab() {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold">{t("dashboard.patient.orders")}</h2>
        <p className="text-muted-foreground">{t("dashboard.patient.orders")}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div
              className="cursor-pointer p-4 transition-colors hover:bg-muted/30 sm:p-6"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{order.pharmacyName}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span>•</span>
                    <span>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                    <span>•</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                  </div>
                  {expandedId === order.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {order.items.map((item) => (
                  <Badge key={item.id} variant="secondary" className="text-xs">
                    {item.medicineName} x{item.quantity}
                  </Badge>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {expandedId === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t"
                >
                  <div className="p-4 sm:p-6">
                    <h4 className="mb-4 text-sm font-semibold flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {t("delivery.orderDetails")}
                    </h4>
                    <TrackingTimeline tracking={order.tracking} />
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t("delivery.deliveryAddress")}:</span>
                        <p className="font-medium">{order.deliveryAddress.street}</p>
                        <p className="text-xs text-muted-foreground">{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("cart.total")}:</span>
                        <p className="font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
      <path d="M12 14h.01" />
    </svg>
  );
}

function Truck({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function AppointmentsTab() {
  const { t } = useLanguage();
  const upcomingAppointments = appointments.filter(a => a.status !== "completed" && a.status !== "cancelled");
  const pastAppointments = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold">{t("dashboard.patient.appointments")}</h2>
        <p className="text-muted-foreground">{t("dashboard.patient.appointments")}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("dashboard.patient.upcoming")}</h3>
        {upcomingAppointments.length > 0 ? upcomingAppointments.map((apt) => (
          <Card key={apt.id} className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={apt.doctorPhoto} alt={apt.doctorName} />
                <AvatarFallback>{apt.doctorName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{apt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctorSpecialty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppointmentTypeBadge type={apt.type} />
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(apt.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {apt.startTime} - {apt.endTime}
                  </span>
                </div>
                <p className="text-sm">{apt.reason}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {apt.type === "video" && apt.meetLink && apt.status === "scheduled" && (
                    <Button size="sm" className="gap-1.5" asChild>
                      <a href={apt.meetLink} target="_blank" rel="noopener noreferrer">
                        <Video className="h-4 w-4" />
                        {t("dashboard.patient.joinCall")}
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <CalendarPlus className="h-4 w-4" />
                    {t("dashboard.patient.reschedule")}
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5 text-destructive">
                    <Ban className="h-4 w-4" />
                    {t("dashboard.patient.cancel")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )) : (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            {t("common.noResults")}
          </Card>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        <Separator />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">{t("delivery.orderHistory")}</h3>
        {pastAppointments.map((apt) => (
          <Card key={apt.id} className="p-4 opacity-75">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={apt.doctorPhoto} alt={apt.doctorName} />
                <AvatarFallback>{apt.doctorName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{apt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctorSpecialty}</p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(apt.date)}</span>
                  <span>•</span>
                  <span>{apt.startTime} - {apt.endTime}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

function SavedMedicinesTab() {
  const { t } = useLanguage();
  const savedIds = ["med-1", "med-3", "med-7", "med-9"];
  const savedMeds = medicines.filter(m => savedIds.includes(m.id));
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const displayMeds = savedMeds.filter(m => !removedIds.includes(m.id));

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold">{t("dashboard.patient.savedMedicines")}</h2>
        <p className="text-muted-foreground">{t("dashboard.patient.savedMedicinesCount")}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayMeds.map((med) => (
          <Card key={med.id} className="group relative overflow-hidden">
            <div className="absolute right-3 top-3 z-10">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setRemovedIds(prev => [...prev, med.id])}
              >
                <Heart className="h-4 w-4 fill-primary text-primary" />
              </Button>
            </div>
            <CardContent className="p-4 pt-12">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                <Pill className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">{med.name}</h3>
              <p className="text-sm text-muted-foreground">{med.dosage} • {med.form}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{formatPrice(med.discountedPrice || med.unitPrice)}</span>
                {med.discount && med.discount > 0 && (
                  <Badge variant="success">{med.discount}% off</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full gap-1.5"
                onClick={() => setRemovedIds(prev => [...prev, med.id])}
              >
                <HeartOff className="h-4 w-4" />
                {t("dashboard.patient.savedMedicines")}
              </Button>
            </CardContent>
          </Card>
        ))}
        {displayMeds.length === 0 && (
          <Card className="col-span-full p-6 text-center text-sm text-muted-foreground">
            {t("common.noResults")}
          </Card>
        )}
      </motion.div>
    </div>
  );
}

function NotificationsTab() {
  const { t } = useLanguage();
  const [notifs, setNotifs] = useState<Notification[]>(notificationsData);

  const markAsRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.patient.notifications")}</h2>
          <p className="text-muted-foreground">{t("dashboard.patient.notifications")}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllAsRead}>
          <CheckCircle2 className="h-4 w-4" />
          {t("common.save")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        {notifs.map((notif) => (
          <Card
            key={notif.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              !notif.isRead && "border-l-4 border-l-primary bg-primary/5"
            )}
            onClick={() => markAsRead(notif.id)}
          >
            <CardContent className="flex items-start gap-3 p-4">
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                !notif.isRead ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {notif.type === "order" && <Package className="h-4 w-4" />}
                {notif.type === "appointment" && <CalendarClock className="h-4 w-4" />}
                {notif.type === "promotion" && <Tag className="h-4 w-4" />}
                {notif.type === "reminder" && <Bell className="h-4 w-4" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm", !notif.isRead && "font-semibold")}>{notif.title}</p>
                  {!notif.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground">{getTimeAgo(notif.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

function Tag({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function ProfileTab() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (212) 555-1234",
    dob: "1990-05-15",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Asthma"],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const addAllergy = () => {
    if (newAllergy.trim() && !profile.allergies.includes(newAllergy.trim())) {
      setProfile(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy.trim()] }));
      setNewAllergy("");
    }
  };

  const addCondition = () => {
    if (newCondition.trim() && !profile.chronicConditions.includes(newCondition.trim())) {
      setProfile(prev => ({ ...prev, chronicConditions: [...prev.chronicConditions, newCondition.trim()] }));
      setNewCondition("");
    }
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold">{t("dashboard.patient.profile")}</h2>
        <p className="text-muted-foreground">{t("dashboard.patient.profile")}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.patient.profile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.register.fullName")}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  icon={<User className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("auth.register.phone")}</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">{t("consultation.selectDate")}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile(prev => ({ ...prev, dob: e.target.value }))}
                  icon={<Cake className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">{t("dashboard.patient.profile")}</Label>
                <Input
                  id="bloodType"
                  value={profile.bloodType}
                  onChange={(e) => setProfile(prev => ({ ...prev, bloodType: e.target.value }))}
                  icon={<Droplets className="h-4 w-4" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.patient.profile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy) => (
                <Badge key={allergy} variant="destructive" className="gap-1 px-3 py-1.5">
                  {allergy}
                  <button
                    onClick={() => setProfile(prev => ({ ...prev, allergies: prev.allergies.filter(a => a !== allergy) }))}
                    className="ml-1 hover:text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t("dashboard.patient.profile")}
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAllergy()}
              />
              <Button variant="outline" onClick={addAllergy}>{t("dashboard.admin.add")}</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.patient.profile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.chronicConditions.map((condition) => (
                <Badge key={condition} variant="warning" className="gap-1 px-3 py-1.5">
                  {condition}
                  <button
                    onClick={() => setProfile(prev => ({ ...prev, chronicConditions: prev.chronicConditions.filter(c => c !== condition) }))}
                    className="ml-1 hover:text-amber-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t("dashboard.patient.profile")}
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCondition()}
              />
              <Button variant="outline" onClick={addCondition}>{t("dashboard.admin.add")}</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button className="gap-2">
          <BadgeCheck className="h-4 w-4" />
          {t("dashboard.patient.save")}
        </Button>
      </motion.div>
    </div>
  );
}

function MedicalRecordsTab() {
  const { t } = useLanguage();
  const typeColors: Record<string, string> = {
    prescription: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    "lab-report": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    diagnosis: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    imaging: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.patient.medicalRecords")}</h2>
          <p className="text-muted-foreground">{t("dashboard.patient.medicalRecords")}</p>
        </div>
        <Button className="gap-1.5">
          <Upload className="h-4 w-4" />
          {t("dashboard.patient.upload")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {medicalRecords.map((record) => (
          <Card key={record.id} className="group transition-all hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-4">
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                typeColors[record.type]?.split(" ")[0] || "bg-muted"
              )}>
                {record.type === "prescription" && <FileText className="h-5 w-5" />}
                {record.type === "lab-report" && <Receipt className="h-5 w-5" />}
                {record.type === "diagnosis" && <Stethoscope className="h-5 w-5" />}
                {record.type === "imaging" && <Monitor className="h-5 w-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{record.title}</p>
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", typeColors[record.type] || "")}>
                    {record.type.replace("-", " ")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{record.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(record.date)}
                  </span>
                  {record.doctorName && (
                    <>
                      <span>•</span>
                      <span>{record.doctorName}</span>
                    </>
                  )}
                  {record.hospitalName && (
                    <>
                      <span>•</span>
                      <span>{record.hospitalName}</span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

function AddressesTab() {
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState(savedAddresses);

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.patient.addresses")}</h2>
          <p className="text-muted-foreground">{t("delivery.deliveryAddress")}</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {addresses.map((addr) => (
          <Card key={addr.id} className={cn(
            "transition-all",
            addr.isDefault && "border-primary/50 ring-1 ring-primary/20"
          )}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPinIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{addr.label}</p>
                  {addr.isDefault && (
                    <Badge variant="primary" className="text-[10px] px-1.5 py-0">{t("dashboard.patient.addresses")}</Badge>
                  )}
                </div>
                <p className="text-sm">{addr.fullName}</p>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-sm text-muted-foreground">{addr.phone}</p>
                <div className="flex gap-2 pt-2">
                  {!addr.isDefault && (
                    <Button size="sm" variant="outline" onClick={() => setDefault(addr.id)}>
                      {t("dashboard.patient.save")}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("common.delete")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

function PaymentMethodsTab() {
  const { t } = useLanguage();
  const [methods, setMethods] = useState(paymentMethods);

  const setDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const cardIcons: Record<string, string> = {
    Visa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Mastercard: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Amex: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.patient.paymentMethods")}</h2>
          <p className="text-muted-foreground">{t("dashboard.patient.paymentMethods")}</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {methods.map((method) => (
          <Card key={method.id} className={cn(
            "transition-all",
            method.isDefault && "border-primary/50 ring-1 ring-primary/20"
          )}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn(
                "flex h-12 w-16 items-center justify-center rounded-lg font-bold text-sm",
                cardIcons[method.type] || "bg-muted"
              )}>
                {method.type}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{method.type} ending in {method.lastFour}</p>
                  {method.isDefault && (
                    <Badge variant="primary" className="text-[10px] px-1.5 py-0">{t("dashboard.patient.paymentMethods")}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{t("medicines.manufacturer")} {method.expiryDate}</p>
              </div>
              {!method.isDefault && (
                <Button size="sm" variant="outline" onClick={() => setDefault(method.id)}>
                  {t("dashboard.patient.save")}
                </Button>
              )}
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

function InvoicesTab() {
  const { t } = useLanguage();
  const invoiceData = orders.map((order, i) => ({
    id: `inv-${i + 1}`,
    orderId: order.id,
    pharmacyName: order.pharmacyName,
    date: order.createdAt,
    total: order.total,
    status: order.paymentStatus === "paid" ? "paid" : "pending",
    invoiceNumber: `INV-${String(i + 1).padStart(4, "0")}`,
  }));

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold">{t("dashboard.patient.invoices")}</h2>
        <p className="text-muted-foreground">{t("dashboard.patient.invoices")}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {invoiceData.map((inv) => (
          <Card key={inv.id} className="transition-all hover:shadow-md">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{inv.invoiceNumber}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{inv.pharmacyName}</span>
                    <span>•</span>
                    <span>{formatDate(inv.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(inv.total)}</p>
                  <StatusBadge status={inv.status} />
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  const components: Record<Tab, React.ElementType> = {
    overview: OverviewTab,
    orders: OrdersTab,
    appointments: AppointmentsTab,
    "saved-medicines": SavedMedicinesTab,
    notifications: NotificationsTab,
    profile: ProfileTab,
    addresses: AddressesTab,
    "payment-methods": PaymentMethodsTab,
    "medical-records": MedicalRecordsTab,
    invoices: InvoicesTab,
  };

  const Component = components[tab];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Component />
      </motion.div>
    </AnimatePresence>
  );
}

export default function PatientDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 backdrop-blur-xl px-4 h-14 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold">
            P
          </div>
          <span className="font-semibold">{t("nav.dashboard")}</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - Desktop fixed, Mobile overlay */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 lg:top-0 z-40 h-screen w-64 shrink-0 border-r bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="hidden lg:flex items-center gap-3 border-b px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-bold shadow-lg">
                P
              </div>
              <div>
                <p className="font-semibold leading-tight">{t("nav.dashboard")}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.patient.welcome")}, John</p>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{t(tabLabelKeys[item.id])}</span>
                      {activeTab === item.id && (
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Sidebar Footer */}
            <div className="border-t p-4">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <LogOut className="h-4 w-4" />
                {t("nav.signOut")}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <TabContent tab={activeTab} />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-xl lg:hidden safe-area-inset-bottom">
        <div className="flex overflow-x-auto scrollbar-hide">
          {sidebarItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 px-1 min-w-0 transition-colors",
                  activeTab === item.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-[10px] font-medium truncate w-full text-center">
                  {t(tabLabelKeys[item.id])}
                </span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 left-1/4 right-1/4 h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 px-3 text-muted-foreground min-w-0"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Bottom spacer for mobile tab bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
