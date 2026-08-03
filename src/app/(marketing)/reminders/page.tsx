"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  Pill,
  Calendar,
  CheckCircle2,
  X,
  Edit2,
  AlertCircle,
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
  getReminders,
  addReminder,
  deleteReminder,
  toggleReminder,
  dayLabels,
  allDays,
  type Reminder,
} from "@/lib/reminders";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const RemindersPage = memo(function RemindersPage() {
  const { t, language } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medicineName: "",
    dosage: "",
    times: ["08:00"],
    days: [...allDays],
    notes: "",
  });

  useEffect(() => {
    setReminders(getReminders());
  }, []);

  const handleAdd = () => {
    if (!newReminder.medicineName.trim() || !newReminder.dosage.trim()) return;
    addReminder({
      ...newReminder,
      isActive: true,
      startDate: new Date().toISOString(),
    });
    setReminders(getReminders());
    setShowAddDialog(false);
    setNewReminder({
      medicineName: "",
      dosage: "",
      times: ["08:00"],
      days: [...allDays],
      notes: "",
    });
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
    setReminders(getReminders());
  };

  const handleToggle = (id: string) => {
    toggleReminder(id);
    setReminders(getReminders());
  };

  const addTime = () => {
    if (newReminder.times.length < 6) {
      setNewReminder({ ...newReminder, times: [...newReminder.times, "12:00"] });
    }
  };

  const updateTime = (index: number, value: string) => {
    const times = [...newReminder.times];
    times[index] = value;
    setNewReminder({ ...newReminder, times });
  };

  const removeTime = (index: number) => {
    if (newReminder.times.length > 1) {
      setNewReminder({
        ...newReminder,
        times: newReminder.times.filter((_, i) => i !== index),
      });
    }
  };

  const toggleDay = (day: string) => {
    const days = newReminder.days.includes(day)
      ? newReminder.days.filter((d) => d !== day)
      : [...newReminder.days, day];
    setNewReminder({ ...newReminder, days });
  };

  const days = dayLabels[language] || dayLabels.uz;

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
            <Bell className="w-3 h-3 mr-1" />
            {t("reminders.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("reminders.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("reminders.desc")}
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
              {t("reminders.addNew")}
            </Button>
          </motion.div>

          {reminders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...spring, delay: 0.2 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t("reminders.empty")}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {t("reminders.emptyDesc")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {reminders.map((reminder, i) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ ...spring, delay: i * 0.05 }}
                  >
                    <Card className={cn(
                      "hover:shadow-lg transition-all duration-300",
                      !reminder.isActive && "opacity-60"
                    )}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                              reminder.isActive
                                ? "bg-gradient-to-br from-primary to-blue-600"
                                : "bg-muted"
                            )}>
                              <Pill className={cn(
                                "w-6 h-6",
                                reminder.isActive ? "text-white" : "text-muted-foreground"
                              )} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{reminder.medicineName}</h3>
                              <p className="text-sm text-muted-foreground">{reminder.dosage}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {reminder.times.join(", ")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                {allDays.map((day) => (
                                  <span
                                    key={day}
                                    className={cn(
                                      "text-[10px] px-1.5 py-0.5 rounded",
                                      reminder.days.includes(day)
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground/50"
                                    )}
                                  >
                                    {days[day as keyof typeof days]}
                                  </span>
                                ))}
                              </div>
                              {reminder.notes && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {reminder.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={reminder.isActive}
                              onCheckedChange={() => handleToggle(reminder.id)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(reminder.id)}
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
              {t("reminders.addTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("reminders.medicineName")} *</Label>
              <Input
                value={newReminder.medicineName}
                onChange={(e) => setNewReminder({ ...newReminder, medicineName: e.target.value })}
                placeholder={t("reminders.medicinePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("reminders.dosage")} *</Label>
              <Input
                value={newReminder.dosage}
                onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                placeholder={t("reminders.dosagePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("reminders.times")}</Label>
              <div className="space-y-2">
                {newReminder.times.map((time, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateTime(i, e.target.value)}
                      className="flex-1"
                    />
                    {newReminder.times.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTime(i)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTime}>
                  <Plus className="w-3 h-3 mr-1" />
                  {t("reminders.addTime")}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("reminders.days")}</Label>
              <div className="flex flex-wrap gap-2">
                {allDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      newReminder.days.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {days[day as keyof typeof days]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("reminders.notes")}</Label>
              <Input
                value={newReminder.notes}
                onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                placeholder={t("reminders.notesPlaceholder")}
              />
            </div>
            <Button onClick={handleAdd} className="w-full">
              {t("reminders.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default RemindersPage;
