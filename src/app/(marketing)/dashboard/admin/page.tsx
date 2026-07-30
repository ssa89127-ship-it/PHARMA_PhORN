"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Pill,
  Stethoscope,
  Building2,
  Grid3X3,
  Users,
  CalendarClock,
  ShoppingBag,
  Percent,
  Ticket,
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  LogOut,
  DollarSign,
  Package,
  ShoppingCart,
  HeartPulse,
  X,
  Eye,
  MoreHorizontal,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  ArrowUpRight,
  Activity,
  CircleDollarSign,
  WalletCards,
  Store,
  ShieldCheck,
  Droplets,
  Heart,
  Apple,
  Wind as WindIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import {
  dashboardStats,
  medicines,
  doctors,
  pharmacies,
  categories,
  orders,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { Order } from "@/types";

type AdminTab = "dashboard" | "medicines" | "doctors" | "pharmacies" | "categories" | "users" | "appointments" | "orders" | "discounts" | "coupons";

const sidebarItems: { id: AdminTab; icon: React.ElementType }[] = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "medicines", icon: Pill },
  { id: "doctors", icon: Stethoscope },
  { id: "pharmacies", icon: Building2 },
  { id: "categories", icon: Grid3X3 },
  { id: "users", icon: Users },
  { id: "appointments", icon: CalendarClock },
  { id: "orders", icon: ShoppingBag },
  { id: "discounts", icon: Percent },
  { id: "coupons", icon: Ticket },
];

const tabLabelKeys: Record<AdminTab, string> = {
  dashboard: "dashboard.admin.dashboard",
  medicines: "dashboard.admin.medicines",
  doctors: "dashboard.admin.doctors",
  pharmacies: "dashboard.admin.pharmacies",
  categories: "dashboard.admin.categories",
  users: "dashboard.admin.users",
  appointments: "dashboard.admin.appointments",
  orders: "dashboard.admin.orders",
  discounts: "dashboard.admin.discounts",
  coupons: "dashboard.admin.coupons",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CHART_COLORS = ["#059669", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const PIE_COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7"];

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
    paid: "success",
    failed: "destructive",
  };
  return (
    <Badge variant={variants[status] || "outline"}>
      {status === "in-transit" ? "In Transit" : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendValue, color }: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  color: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className={cn("absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full opacity-10 blur-2xl", color)} />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </CardDescription>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", color.replace("opacity-10", "opacity-15").replace("blur-2xl", ""))}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {trend && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={trend === "up" ? "text-emerald-500" : "text-red-500"}>
                {trendValue}
              </span>
              <span className="text-muted-foreground">{t("dashboard.admin.dashboard")}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-xl">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Revenue" ? formatPrice(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function DashboardTab() {
  const { t } = useLanguage();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const revenueData = dashboardStats.monthlyRevenue.map((val, i) => ({
    month: months[i],
    Revenue: val,
  }));

  const ordersData = dashboardStats.monthlyOrders.map((val, i) => ({
    month: months[i],
    Orders: val,
  }));

  const popularMeds = dashboardStats.popularMedicines;
  const pharmacyRevenue = dashboardStats.revenueByPharmacy;

  return (
    <div className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.admin.dashboard")}</h1>
          <p className="text-muted-foreground">
            {t("dashboard.admin.dashboard")}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t("common.loading")}: {formatDate(new Date().toISOString())}</span>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title={t("dashboard.admin.totalRevenue")}
          value={formatPrice(dashboardStats.totalRevenue)}
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
          color="bg-emerald-500"
        />
        <StatCard
          title={t("dashboard.admin.totalOrders")}
          value={dashboardStats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="+8.2%"
          color="bg-blue-500"
        />
        <StatCard
          title={t("dashboard.admin.totalCustomers")}
          value={dashboardStats.totalCustomers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+15.3%"
          color="bg-violet-500"
        />
        <StatCard
          title={t("dashboard.admin.totalDoctors")}
          value={dashboardStats.totalDoctors.toString()}
          icon={Stethoscope}
          trend="up"
          trendValue="+2"
          color="bg-amber-500"
        />
        <StatCard
          title={t("dashboard.admin.totalMedicines")}
          value={dashboardStats.totalMedicines.toLocaleString()}
          icon={Pill}
          trend="up"
          trendValue="+45"
          color="bg-rose-500"
        />
        <StatCard
          title={t("dashboard.admin.totalPharmacies")}
          value={dashboardStats.totalPharmacies.toString()}
          icon={Store}
          trend="up"
          trendValue="+3"
          color="bg-cyan-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle className="text-lg">{t("dashboard.admin.totalRevenue")}</CardTitle>
                <CardDescription>{t("dashboard.admin.totalRevenue")}</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="Revenue" stroke="#059669" strokeWidth={2.5} dot={{ fill: "#059669", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#059669" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle className="text-lg">{t("dashboard.admin.totalOrders")}</CardTitle>
                <CardDescription>{t("dashboard.admin.totalOrders")}</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Orders" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("dashboard.admin.medicines")}</CardTitle>
              <CardDescription>{t("dashboard.admin.medicines")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularMeds} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                    <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#059669" radius={[0, 6, 6, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("dashboard.admin.pharmacies")}</CardTitle>
              <CardDescription>{t("dashboard.admin.pharmacies")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pharmacyRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="revenue"
                      strokeWidth={0}
                    >
                      {pharmacyRevenue.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {pharmacyRevenue.map((pharm, i) => (
                  <div key={pharm.name} className="flex items-center gap-2 rounded-lg border p-2 text-xs">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground truncate">{pharm.name}</span>
                    <span className="ml-auto font-medium">{formatPrice(pharm.revenue)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function MedicinesTab() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.medicines")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.medicines")}</p>
        </div>
        <Button className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")} {t("dashboard.admin.medicines")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("medicines.priceComparison.pharmacy")}</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("medicines.manufacturer")}</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.categories")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("medicines.priceComparison.price")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("dashboard.pharmacy.lowStock")}</th>
                  <th className="text-center font-medium text-muted-foreground px-4 py-3">{t("pharmacies.open")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("common.edit")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((med) => (
                  <tr key={med.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <Pill className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium">{med.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{med.manufacturer}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">{med.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(med.discountedPrice || med.unitPrice)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn(
                        "font-medium",
                        med.stockQuantity > 100 ? "text-emerald-600" : med.stockQuantity > 50 ? "text-amber-600" : "text-red-600"
                      )}>
                        {med.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {med.isAvailable ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {t("medicines.inStock")}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          {t("medicines.outOfStock")}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function DoctorsTab() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.doctors")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.doctors")}</p>
        </div>
        <Button className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")} {t("dashboard.admin.doctors")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("medicines.priceComparison.pharmacy")}</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.doctors")}</th>
                  <th className="text-center font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.doctors")}</th>
                  <th className="text-center font-medium text-muted-foreground px-4 py-3">{t("pharmacies.rating")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("consultation.consultationFee")}</th>
                  <th className="text-center font-medium text-muted-foreground px-4 py-3">{t("medicines.inStock")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("common.edit")}</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-primary/20">
                          <AvatarImage src={doc.photo} alt={doc.name} />
                          <AvatarFallback>{doc.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">{doc.specialty}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{doc.experience} yrs</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{doc.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(doc.consultationFee)}</td>
                    <td className="px-4 py-3 text-center">
                      {doc.isAvailableToday ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {t("medicines.inStock")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          {t("medicines.outOfStock")}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function PharmaciesTab() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.pharmacies")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.pharmacies")}</p>
        </div>
        <Button className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")} {t("dashboard.admin.pharmacies")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("medicines.priceComparison.pharmacy")}</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("pharmacies.address")}</th>
                  <th className="text-center font-medium text-muted-foreground px-4 py-3">{t("pharmacies.rating")}</th>
                  <th className="text-center font-medium text-muted-foreground px-4 py-3">{t("pharmacies.open")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("pharmacies.deliveryFee")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("common.edit")}</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.map((ph) => (
                  <tr key={ph.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                          <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium">{ph.name}</p>
                          <p className="text-xs text-muted-foreground">{ph.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[200px]">{ph.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{ph.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ph.isOpen ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {t("pharmacies.open")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          {t("pharmacies.closed")}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {ph.freeDelivery ? (
                        <span className="text-emerald-600">{t("pharmacies.freeDelivery")}</span>
                      ) : (
                        formatPrice(ph.deliveryFee)
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function CategoriesTab() {
  const { t } = useLanguage();
  const iconMap: Record<string, React.ElementType> = {
    Activity,
    Shield: ShieldCheck,
    Droplet: Droplets,
    Heart,
    Wind: WindIcon,
    Stethoscope,
    Apple,
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.categories")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.categories")}</p>
        </div>
        <Button className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")} {t("dashboard.admin.categories")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Activity;
          return (
            <Card key={cat.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <CardContent className="p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 group-hover:from-emerald-500/30 group-hover:to-emerald-500/20 transition-all">
                  <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Package className="mr-1 h-3 w-3" />
                    {cat.medicineCount} {t("dashboard.admin.medicines")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>
    </div>
  );
}

function UsersTab() {
  const { t } = useLanguage();
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.users")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.users")}</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">{t("dashboard.admin.users")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.comingSoon")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AppointmentsTab() {
  const { t } = useLanguage();
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.appointments")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.appointments")}</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">{t("dashboard.admin.appointments")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.comingSoon")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OrdersTabSection() {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.orders")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.orders")}</p>
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("common.search")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("dashboard.admin.orders")}</SelectItem>
              <SelectItem value="pending">{t("delivery.status.pending")}</SelectItem>
              <SelectItem value="confirmed">{t("delivery.status.confirmed")}</SelectItem>
              <SelectItem value="preparing">{t("delivery.status.preparing")}</SelectItem>
              <SelectItem value="picked-up">{t("delivery.status.pickedUp")}</SelectItem>
              <SelectItem value="in-transit">{t("delivery.status.inTransit")}</SelectItem>
              <SelectItem value="delivered">{t("delivery.status.delivered")}</SelectItem>
              <SelectItem value="cancelled">{t("delivery.status.cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden transition-all hover:shadow-md">
            <div
              className="cursor-pointer p-4 sm:p-5 transition-colors hover:bg-muted/20"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{order.pharmacyName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5" />
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
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

              <div className="mt-3 flex flex-wrap gap-1.5">
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
                  <div className="p-4 sm:p-5 space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        {t("delivery.orderDetails")}
                      </h4>
                      <div className="relative space-y-0 pl-6">
                        <div className="absolute left-[7px] top-1 h-full w-0.5 bg-border" />
                        {order.tracking.map((step, i) => (
                          <div key={step.status} className="relative pb-3 last:pb-0">
                            <div className={cn(
                              "absolute -left-[23px] mt-1.5 h-3 w-3 rounded-full border-2",
                              i === order.tracking.length - 1
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30 bg-background"
                            )} />
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium capitalize">{step.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(step.timestamp).toLocaleString()}
                                {step.location && ` • ${step.location}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <span className="text-xs text-muted-foreground">{t("delivery.deliveryAddress")}</span>
                        <p className="text-sm font-medium">{order.deliveryAddress.street}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">{t("cart.total")}</span>
                        <p className="text-sm font-medium">{order.paymentMethod}</p>
                        <StatusBadge status={order.paymentStatus} />
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

function DiscountsTab() {
  const { t } = useLanguage();
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.discounts")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.discounts")}</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")}
        </Button>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <Percent className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">{t("dashboard.admin.comingSoon")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.comingSoon")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CouponsTab() {
  const { t } = useLanguage();
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.admin.coupons")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.coupons")}</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("dashboard.admin.add")}
        </Button>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <Ticket className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">{t("dashboard.admin.comingSoon")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.comingSoon")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const tabComponents: Record<AdminTab, React.ElementType> = {
  dashboard: DashboardTab,
  medicines: MedicinesTab,
  doctors: DoctorsTab,
  pharmacies: PharmaciesTab,
  categories: CategoriesTab,
  users: UsersTab,
  appointments: AppointmentsTab,
  orders: OrdersTabSection,
  discounts: DiscountsTab,
  coupons: CouponsTab,
};

function TabContent({ tab }: { tab: AdminTab }) {
  const Component = tabComponents[tab];
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

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 backdrop-blur-xl px-4 h-14 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-xs font-bold shadow">
            A
          </div>
          <span className="font-semibold">{t("dashboard.admin.dashboard")}</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">AD</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex">
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

        <aside
          className={cn(
            "fixed lg:sticky top-0 lg:top-0 z-40 h-screen w-64 shrink-0 border-r bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="hidden lg:flex items-center gap-3 border-b px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20">
                A
              </div>
              <div>
                <p className="font-semibold leading-tight">{t("dashboard.admin.dashboard")}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.admin.dashboard")}</p>
              </div>
            </div>

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
                          ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
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

            <div className="border-t p-4">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <LogOut className="h-4 w-4" />
                {t("nav.signOut")}
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
                  activeTab === item.id ? "text-emerald-500" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-[10px] font-medium truncate w-full text-center">
                  {t(tabLabelKeys[item.id])}
                </span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 left-1/4 right-1/4 h-0.5 rounded-full bg-emerald-500"
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
            <span className="text-[10px] font-medium">{t("common.viewAll")}</span>
          </button>
        </div>
      </nav>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
