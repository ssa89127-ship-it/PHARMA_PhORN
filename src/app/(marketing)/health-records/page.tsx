"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  Pill,
  TestTube,
  StickyNote,
  Stethoscope,
  X,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getHealthRecords,
  addHealthRecord,
  deleteHealthRecord,
  recordTypes,
  type HealthRecord,
} from "@/lib/health-records";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const iconMap: Record<string, any> = {
  allergy: AlertCircle,
  condition: Stethoscope,
  medication: Pill,
  test: TestTube,
  note: StickyNote,
};

const colorMap: Record<string, string> = {
  allergy: "text-orange-500",
  condition: "text-red-500",
  medication: "text-blue-500",
  test: "text-green-500",
  note: "text-purple-500",
};

const bgMap: Record<string, string> = {
  allergy: "bg-orange-500/10",
  condition: "bg-red-500/10",
  medication: "bg-blue-500/10",
  test: "bg-green-500/10",
  note: "bg-purple-500/10",
};

const HealthRecordsPage = memo(function HealthRecordsPage() {
  const { t, language } = useLanguage();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<HealthRecord, "id" | "createdAt">>({
    type: "medication",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    doctor: "",
  });

  useEffect(() => {
    setRecords(getHealthRecords());
  }, []);

  const handleAdd = () => {
    if (!newRecord.title.trim()) return;
    addHealthRecord(newRecord);
    setRecords(getHealthRecords());
    setShowAddDialog(false);
    setNewRecord({
      type: "medication",
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      doctor: "",
    });
  };

  const handleDelete = (id: string) => {
    deleteHealthRecord(id);
    setRecords(getHealthRecords());
  };

  const types = recordTypes[language] || recordTypes.uz;
  const typeKeys = Object.keys(types) as (keyof typeof types)[];

  const grouped = typeKeys.reduce((acc, type) => {
    acc[type] = records.filter((r) => r.type === type);
    return acc;
  }, {} as Record<string, HealthRecord[]>);

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
            <FileText className="w-3 h-3 mr-1" />
            {t("health.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("health.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("health.desc")}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <Button onClick={() => setShowAddDialog(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {t("health.addRecord")}
            </Button>
          </motion.div>

          {records.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...spring, delay: 0.2 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t("health.empty")}</h3>
                  <p className="text-sm text-muted-foreground text-center">{t("health.emptyDesc")}</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {typeKeys.map((type) => {
                const items = grouped[type];
                if (items.length === 0) return null;
                const Icon = iconMap[type] || FileText;
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Icon className={cn("w-5 h-5", colorMap[type])} />
                          {types[type]}
                          <Badge variant="outline" className="ml-auto">
                            {items.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <AnimatePresence>
                            {items.map((record) => (
                              <motion.div
                                key={record.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={spring}
                                className={cn(
                                  "p-3 rounded-xl border flex items-start justify-between gap-3",
                                  bgMap[type]
                                )}
                              >
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium">{record.title}</h4>
                                  {record.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {record.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span>{record.date}</span>
                                    {record.doctor && <span>Dr. {record.doctor}</span>}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(record.id)}
                                  className="text-destructive hover:bg-destructive/10 shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t("health.addTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("health.type")} *</Label>
              <Select
                value={newRecord.type}
                onValueChange={(value) => setNewRecord({ ...newRecord, type: value as HealthRecord["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {types[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("health.recordTitle")} *</Label>
              <Input
                value={newRecord.title}
                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                placeholder={t("health.titlePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("health.description")}</Label>
              <Textarea
                value={newRecord.description}
                onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                placeholder={t("health.descPlaceholder")}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("health.date")}</Label>
              <Input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("health.doctor")}</Label>
              <Input
                value={newRecord.doctor}
                onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
                placeholder={t("health.doctorPlaceholder")}
              />
            </div>
            <Button onClick={handleAdd} className="w-full">
              {t("health.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default HealthRecordsPage;
