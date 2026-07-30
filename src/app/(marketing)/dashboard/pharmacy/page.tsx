"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Pill,
  ShoppingBag,
  DollarSign,
  Users,
  Truck,
  FileText,
  BarChart3,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  LogOut,
  Package,
  ShoppingCart,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Percent,
  Settings,
  CircleDollarSign,
  Store,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  X,
  Download,
  RefreshCw,
  Filter,
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
} from "recharts";
import { cn, formatPrice, formatDate, formatDateTime, getStatusColor } from "@/lib/utils";
import {
  pharmacies,
  medicines,
  orders,
  dashboardStats,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import type { Order, Medicine } from "@/types";

type PharmacyTab = "overview" | "inventory" | "orders" | "pricing" | "employees" | "delivery" | "reports" | "sales-analytics";

const sidebarItems: { id: PharmacyTab; icon: React.ElementType }[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "inventory", icon: Pill },
  { id: "orders", icon: ShoppingBag },
  { id: "pricing", icon: DollarSign },
  { id: "employees", icon: Users },
  { id: "delivery", icon: Truck },
  { id: "reports", icon: FileText },
  { id: "sales-analytics", icon: BarChart3 },
];

const tabLabelKeys: Record<PharmacyTab, string> = {
  overview: "dashboard.pharmacy.overview",
  inventory: "dashboard.pharmacy.inventory",
  orders: "dashboard.pharmacy.orders",
  pricing: "dashboard.pharmacy.pricing",
  employees: "dashboard.pharmacy.employees",
  delivery: "dashboard.pharmacy.delivery",
  reports: "dashboard.pharmacy.reports",
  "sales-analytics": "dashboard.pharmacy.salesAnalytics",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CHART_COLORS = ["#059669", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const pharmacy = pharmacies[0];

function StatusDot({ stock, threshold }: { stock: number; threshold?: number }) {
  const t = threshold || 50;
  const color = stock > 100 ? "bg-green-500" : stock > t ? "bg-yellow-500" : "bg-red-500";
  return <span className={cn("inline-block h-2 w-2 rounded-full shrink-0", color)} />;
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors = getStatusColor(status);
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", colors.bg, colors.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
      {status === "in-transit" ? "In Transit" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-xl">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" && entry.name.toLowerCase().includes("revenue") || entry.name === "Sales" ? formatPrice(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function TabContent({ tab }: { tab: PharmacyTab }) {
  const components: Record<PharmacyTab, React.ElementType> = {
    overview: OverviewTab,
    inventory: InventoryTab,
    orders: OrdersTabSection,
    pricing: PricingTab,
    employees: EmployeesTab,
    delivery: DeliveryTab,
    reports: ReportsTab,
    "sales-analytics": SalesAnalyticsTab,
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

function StatCard({ title, value, icon: Icon, trend, trendValue, color, subtitle }: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className={cn("absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full opacity-10 blur-2xl", color)} />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</CardDescription>
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
              <span className={trend === "up" ? "text-emerald-500" : "text-red-500"}>{trendValue}</span>
              {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OverviewTab() {
  const { t } = useLanguage();
  const pharmacyOrders = orders.filter(o => o.pharmacyId === pharmacy.id);
  const todayOrders = pharmacyOrders.length;
  const pendingOrders = pharmacyOrders.filter(o => o.status === "pending" || o.status === "confirmed" || o.status === "preparing").length;
  const lowStockItems = medicines.filter(m => m.stockQuantity <= 100).length;

  const salesOverviewData = [
    { day: "Mon", sales: 4200 },
    { day: "Tue", sales: 3800 },
    { day: "Wed", sales: 5100 },
    { day: "Thu", sales: 4600 },
    { day: "Fri", sales: 5900 },
    { day: "Sat", sales: 5300 },
    { day: "Sun", sales: 4800 },
  ];

  return (
    <div className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.pharmacy.overview")}</h1>
          <p className="text-muted-foreground">{t("dashboard.pharmacy.overview")}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t("common.loading")}: {formatDate(new Date().toISOString())}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-2xl font-bold shadow-lg shadow-emerald-500/20 shrink-0">
                <Store className="h-10 w-10" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h2 className="text-xl font-bold">{pharmacy.name}</h2>
                  {pharmacy.isOpen ? (
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
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {pharmacy.address}, {pharmacy.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {pharmacy.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {pharmacy.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {pharmacy.rating} ({pharmacy.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{pharmacy.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t("dashboard.pharmacy.todayOrders")} value={todayOrders.toString()} icon={ShoppingCart} trend="up" trendValue="+12%" subtitle={t("dashboard.pharmacy.overview")} color="bg-blue-500" />
        <StatCard title={t("dashboard.pharmacy.totalRevenue")} value={formatPrice(dashboardStats.totalRevenue)} icon={CircleDollarSign} trend="up" trendValue="+8.3%" subtitle={t("dashboard.pharmacy.reports")} color="bg-emerald-500" />
        <StatCard title={t("dashboard.pharmacy.pendingOrders")} value={pendingOrders.toString()} icon={Package} trend={pendingOrders > 5 ? "up" : "down"} trendValue={pendingOrders > 5 ? "+2" : "-1"} subtitle={t("dashboard.pharmacy.overview")} color="bg-amber-500" />
        <StatCard title={t("dashboard.pharmacy.lowStock")} value={lowStockItems.toString()} icon={AlertCircle} trend="up" trendValue="+3" subtitle={t("dashboard.pharmacy.inventory")} color="bg-rose-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle className="text-lg">{t("dashboard.patient.recentOrders")}</CardTitle>
                <CardDescription>{t("dashboard.pharmacy.orders")}</CardDescription>
              </div>
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {orders.slice(0, 2).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium font-mono">{order.id}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(order.createdAt)}</span>
                      <span>•</span>
                      <span>{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">{t("common.noResults")}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle className="text-lg">{t("dashboard.pharmacy.salesAnalytics")}</CardTitle>
                <CardDescription>{t("dashboard.pharmacy.salesAnalytics")}</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesOverviewData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2.5} dot={{ fill: "#059669", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#059669" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function InventoryTab() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const { success } = useToast();

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { label: t("medicines.inStock"), color: "text-green-600", dot: "bg-green-500" };
    if (stock > 50) return { label: t("dashboard.pharmacy.lowStock"), color: "text-yellow-600", dot: "bg-yellow-500" };
    return { label: t("medicines.outOfStock"), color: "text-red-600", dot: "bg-red-500" };
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.pharmacy.inventory")}</h2>
          <p className="text-muted-foreground">{t("dashboard.pharmacy.inventory")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5 shrink-0">
            <RefreshCw className="h-4 w-4" />
            {t("common.loading")}
          </Button>
          <Button className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" />
            {t("dashboard.admin.add")} {t("dashboard.admin.medicines")}
          </Button>
        </div>
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
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.medicines")}</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.categories")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("dashboard.pharmacy.lowStock")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("medicines.priceComparison.price")}</th>
                  <th className="text-center font-medium text-muted-foreground px-4 py-3">{t("pharmacies.open")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("common.edit")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((med) => {
                  const status = getStockStatus(med.stockQuantity);
                  return (
                    <tr key={med.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <Pill className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-xs text-muted-foreground">{med.dosage} • {med.form}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">{med.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <StatusDot stock={med.stockQuantity} />
                          <span className={cn("font-medium", status.color)}>
                            {med.stockQuantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{formatPrice(med.discountedPrice || med.unitPrice)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", status.dot === "bg-green-500" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : status.dot === "bg-yellow-500" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedMedicine(med);
                              setUpdateDialogOpen(true);
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.pharmacy.updateStock")}</DialogTitle>
            <DialogDescription>
              {selectedMedicine?.name} - {t("dashboard.pharmacy.lowStock")}: {selectedMedicine?.stockQuantity}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-stock">{t("dashboard.pharmacy.updateStock")}</Label>
              <Input id="new-stock" type="number" placeholder={t("common.search")} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>{t("common.close")}</Button>
            <Button onClick={() => { success(t("dashboard.pharmacy.updateStock")); setUpdateDialogOpen(false); }}>{t("dashboard.pharmacy.updateStock")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrdersTabSection() {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { success } = useToast();

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const updateStatus = (orderId: string, newStatus: string) => {
    success(t("dashboard.pharmacy.orders"));
  };

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.pharmacy.orders")}</h2>
          <p className="text-muted-foreground">{t("dashboard.pharmacy.orders")}</p>
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("common.search")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("dashboard.pharmacy.orders")}</SelectItem>
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
                      <p className="font-semibold font-mono text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.pharmacyName}</p>
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
                  <OrderStatusBadge status={order.status} />
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
                        <Package className="h-4 w-4" />
                        {t("delivery.orderDetails")}
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{item.medicineName}</span>
                              <span className="text-muted-foreground">x{item.quantity}</span>
                            </div>
                            <span className="font-medium">{formatPrice(item.totalPrice)}</span>
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
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium mt-1",
                          order.paymentStatus === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        )}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", order.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500")} />
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-wrap gap-2">
                      {order.status === "pending" && (
                        <Button size="sm" className="gap-1.5" onClick={() => updateStatus(order.id, "confirmed")}>
                          <CheckCircle2 className="h-4 w-4" />
                          {t("delivery.status.confirmed")}
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button size="sm" className="gap-1.5" onClick={() => updateStatus(order.id, "preparing")}>
                          <Package className="h-4 w-4" />
                          {t("delivery.status.preparing")}
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button size="sm" className="gap-1.5" onClick={() => updateStatus(order.id, "picked-up")}>
                          <Truck className="h-4 w-4" />
                          {t("delivery.status.pickedUp")}
                        </Button>
                      )}
                      {order.status === "picked-up" && (
                        <Button size="sm" className="gap-1.5" onClick={() => updateStatus(order.id, "in-transit")}>
                          <Truck className="h-4 w-4" />
                          {t("delivery.status.inTransit")}
                        </Button>
                      )}
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

function PricingTab() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(medicines.map(m => [m.id, m.discountedPrice || m.unitPrice]))
  );
  const [discounts, setDiscounts] = useState<Record<string, number>>(
    Object.fromEntries(medicines.map(m => [m.id, m.discount || 0]))
  );
  const { success } = useToast();

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.pharmacy.pricing")}</h2>
          <p className="text-muted-foreground">{t("dashboard.pharmacy.pricing")}</p>
        </div>
        <Button className="gap-1.5" onClick={() => success(t("dashboard.pharmacy.saveChanges"))}>
          <CheckCircle2 className="h-4 w-4" />
          {t("dashboard.pharmacy.saveChanges")}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.medicines")}</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.categories")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("medicines.priceComparison.price")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("dashboard.pharmacy.pricing")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("dashboard.admin.discounts")}</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-3">{t("common.edit")}</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <Pill className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium">{med.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{med.category}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatPrice(med.basePrice)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            className="pl-5 h-9 text-right text-sm font-mono"
                            value={prices[med.id]}
                            onChange={(e) => setPrices(prev => ({ ...prev, [med.id]: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <div className="relative w-20">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            className="pr-6 h-9 text-right text-sm font-mono"
                            value={discounts[med.id]}
                            onChange={(e) => setDiscounts(prev => ({ ...prev, [med.id]: parseFloat(e.target.value) || 0 }))}
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs">
                          <Percent className="h-3 w-3" />
                          {t("dashboard.admin.discounts")}
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

function EmployeesTab() {
  const { t } = useLanguage();
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.pharmacy.employees")}</h2>
          <p className="text-muted-foreground">{t("dashboard.pharmacy.employees")}</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-16 text-center">
          <Users className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-xl font-semibold">{t("dashboard.pharmacy.employees")}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {t("dashboard.admin.comingSoon")}
          </p>
          <Button className="mt-6 gap-1.5" disabled>
            <Plus className="h-4 w-4" />
            {t("dashboard.admin.add")} {t("dashboard.pharmacy.employees")}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DeliveryTab() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.pharmacy.delivery")}</h2>
          <p className="text-muted-foreground">{t("dashboard.pharmacy.delivery")}</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.pharmacy.delivery")}</CardTitle>
            <CardDescription>{t("dashboard.pharmacy.delivery")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.filter(o => o.status === "in-transit" || o.status === "picked-up").length > 0 ? (
              orders.filter(o => o.status === "in-transit" || o.status === "picked-up").map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <Truck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} items • {formatDateTime(order.createdAt)}</p>
                    </div>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Truck className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">{t("common.noResults")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("dashboard.pharmacy.delivery")}</CardTitle>
              <CardDescription>{t("dashboard.pharmacy.delivery")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 rounded-lg bg-muted/30 border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <MapPin className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">{t("dashboard.pharmacy.delivery")}</p>
                  <p className="text-xs">{t("dashboard.admin.comingSoon")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("dashboard.pharmacy.delivery")}</CardTitle>
              <CardDescription>{t("dashboard.pharmacy.delivery")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 rounded-lg bg-muted/30 border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">{t("dashboard.pharmacy.delivery")}</p>
                  <p className="text-xs">{t("dashboard.admin.comingSoon")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const { t } = useLanguage();
  const todayRevenue = 4820;
  const weekRevenue = 34200;
  const monthRevenue = 128450;
  const yearRevenue = 1420000;

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("dashboard.pharmacy.reports")}</h2>
          <p className="text-muted-foreground">{t("dashboard.pharmacy.reports")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" />
            {t("dashboard.pharmacy.exportCSV")}
          </Button>
          <Button className="gap-1.5">
            <FileText className="h-4 w-4" />
            {t("dashboard.pharmacy.generateReport")}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-950/10 border-blue-200/50 dark:border-blue-800/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-700 dark:text-blue-400 font-medium">{t("dashboard.pharmacy.overview")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatPrice(todayRevenue)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+5.2%</span>
                <span className="text-muted-foreground">{t("dashboard.pharmacy.overview")}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-950/10 border-emerald-200/50 dark:border-emerald-800/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-emerald-700 dark:text-emerald-400 font-medium">{t("dashboard.pharmacy.overview")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatPrice(weekRevenue)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+8.7%</span>
                <span className="text-muted-foreground">{t("dashboard.pharmacy.reports")}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/20 dark:to-violet-950/10 border-violet-200/50 dark:border-violet-800/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-violet-700 dark:text-violet-400 font-medium">{t("dashboard.pharmacy.reports")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{formatPrice(monthRevenue)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+12.3%</span>
                <span className="text-muted-foreground">{t("dashboard.pharmacy.reports")}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-950/10 border-amber-200/50 dark:border-amber-800/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-700 dark:text-amber-400 font-medium">{t("dashboard.pharmacy.reports")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{formatPrice(yearRevenue)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+22.1%</span>
                <span className="text-muted-foreground">{t("dashboard.pharmacy.reports")}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.pharmacy.reports")}</CardTitle>
            <CardDescription>{t("dashboard.pharmacy.salesAnalytics")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.monthlyRevenue.map((val, i) => ({
                  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
                  Revenue: val,
                }))} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Revenue" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function SalesAnalyticsTab() {
  const { t } = useLanguage();
  const revenue7Days = [
    { day: "Mon", revenue: 4200 },
    { day: "Tue", revenue: 3800 },
    { day: "Wed", revenue: 5100 },
    { day: "Thu", revenue: 4600 },
    { day: "Fri", revenue: 5900 },
    { day: "Sat", revenue: 5300 },
    { day: "Sun", revenue: 4800 },
  ];

  const topMedicines = dashboardStats.popularMedicines.slice(0, 5);

  const ordersByHour = [
    { hour: "6AM", orders: 5 },
    { hour: "8AM", orders: 18 },
    { hour: "10AM", orders: 32 },
    { hour: "12PM", orders: 28 },
    { hour: "2PM", orders: 35 },
    { hour: "4PM", orders: 42 },
    { hour: "6PM", orders: 38 },
    { hour: "8PM", orders: 22 },
    { hour: "10PM", orders: 12 },
  ];

  return (
    <div className="space-y-4">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold">{t("dashboard.pharmacy.salesAnalytics")}</h2>
        <p className="text-muted-foreground">{t("dashboard.pharmacy.salesAnalytics")}</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle className="text-lg">{t("dashboard.pharmacy.totalRevenue")}</CardTitle>
                <CardDescription>{t("dashboard.pharmacy.salesAnalytics")}</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenue7Days} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} dot={{ fill: "#059669", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#059669" }} />
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
                <CardTitle className="text-lg">{t("dashboard.admin.medicines")}</CardTitle>
                <CardDescription>{t("dashboard.pharmacy.orders")}</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topMedicines} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                    <YAxis type="category" dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#059669" radius={[0, 6, 6, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <div>
              <CardTitle className="text-lg">{t("dashboard.pharmacy.orders")}</CardTitle>
              <CardDescription>{t("dashboard.pharmacy.orders")}</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByHour} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PharmacyDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<PharmacyTab>("overview");
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
            <Store className="h-4 w-4" />
          </div>
          <span className="font-semibold">{t("nav.dashboard")}</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">PM</AvatarFallback>
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
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold leading-tight">{pharmacy.name}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.pharmacy.employees")}</p>
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
