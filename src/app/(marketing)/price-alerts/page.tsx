"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown,
  Bell,
  Plus,
  Trash2,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Pill,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getPriceAlerts,
  addPriceAlert,
  deletePriceAlert,
  togglePriceAlert,
  type PriceAlert,
} from "@/lib/price-alerts";
import { useDataLoader } from "@/lib/data-loader";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn, formatPrice } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const PriceAlertsPage = memo(function PriceAlertsPage() {
  const { t } = useLanguage();
  const { data } = useDataLoader();
  const medicines = data?.medicines ?? [];
  const medicinePrices = data?.medicinePrices ?? {};
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<typeof medicines[0] | null>(null);
  const [targetPrice, setTargetPrice] = useState("");

  useEffect(() => {
    setAlerts(getPriceAlerts());
  }, []);

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      searchQuery.length > 0
  ).slice(0, 8);

  const getCurrentPrice = (medicineId: string): number => {
    const prices = medicinePrices[medicineId];
    if (!prices || prices.length === 0) return 0;
    return Math.min(...prices.map((p) => p.price));
  };

  const handleAdd = () => {
    if (!selectedMedicine || !targetPrice) return;
    const currentPrice = getCurrentPrice(selectedMedicine.id);
    addPriceAlert({
      medicineId: selectedMedicine.id,
      medicineName: selectedMedicine.name,
      currentPrice,
      targetPrice: parseInt(targetPrice),
      isActive: true,
    });
    setAlerts(getPriceAlerts());
    setShowAddDialog(false);
    setSelectedMedicine(null);
    setTargetPrice("");
    setSearchQuery("");
  };

  const handleDelete = (id: string) => {
    deletePriceAlert(id);
    setAlerts(getPriceAlerts());
  };

  const handleToggle = (id: string) => {
    togglePriceAlert(id);
    setAlerts(getPriceAlerts());
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-center mb-8"
        >
          <Badge variant="primary" className="mb-4">
            <TrendingDown className="w-3 h-3 mr-1" />
            {t("priceAlerts.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("priceAlerts.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("priceAlerts.desc")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <Button onClick={() => setShowAddDialog(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {t("priceAlerts.addNew")}
            </Button>
          </motion.div>

          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...spring, delay: 0.2 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingDown className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t("priceAlerts.empty")}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {t("priceAlerts.emptyDesc")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {alerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ ...spring, delay: i * 0.05 }}
                  >
                    <Card className={cn(
                      "hover:shadow-lg transition-all duration-300",
                      !alert.isActive && "opacity-60"
                    )}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                              alert.isActive
                                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                : "bg-muted"
                            )}>
                              <ArrowDown className={cn(
                                "w-6 h-6",
                                alert.isActive ? "text-white" : "text-muted-foreground"
                              )} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{alert.medicineName}</h3>
                              <div className="flex items-center gap-4 mt-1">
                                <div>
                                  <p className="text-xs text-muted-foreground">{t("priceAlerts.currentPrice")}</p>
                                  <p className="text-sm font-medium">{formatPrice(alert.currentPrice)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">{t("priceAlerts.targetPrice")}</p>
                                  <p className="text-sm font-medium text-primary">{formatPrice(alert.targetPrice)}</p>
                                </div>
                              </div>
                              {alert.currentPrice <= alert.targetPrice && (
                                <Badge variant="success" className="mt-2">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  {t("priceAlerts.priceReached")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={() => handleToggle(alert.id)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(alert.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {t("priceAlerts.addTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("priceAlerts.selectMedicine")}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("priceAlerts.searchPlaceholder")}
                  className="pl-10"
                />
                {searchQuery && !selectedMedicine && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {filteredMedicines.map((med) => {
                      const price = getCurrentPrice(med.id);
                      return (
                        <button
                          key={med.id}
                          onClick={() => {
                            setSelectedMedicine(med);
                            setSearchQuery(med.name);
                          }}
                          className="w-full flex items-center justify-between p-3 hover:bg-primary/5 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Pill className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{med.name}</p>
                              <p className="text-xs text-muted-foreground">{med.category}</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-primary">
                            {formatPrice(price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {selectedMedicine && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-primary/5 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("priceAlerts.currentPrice")}</span>
                  <span className="font-medium">{formatPrice(getCurrentPrice(selectedMedicine.id))}</span>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label>{t("priceAlerts.targetPrice")} *</Label>
              <Input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder={t("priceAlerts.targetPlaceholder")}
              />
            </div>

            <Button
              onClick={handleAdd}
              disabled={!selectedMedicine || !targetPrice}
              className="w-full"
            >
              {t("priceAlerts.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default PriceAlertsPage;
