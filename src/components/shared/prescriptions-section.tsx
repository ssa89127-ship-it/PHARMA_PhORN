"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  Prescription,
  PrescriptionStatus,
  createPrescription,
  getPrescriptions,
  getStatusIndex,
  removePrescription,
} from "@/lib/prescriptions";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, FileText, ShieldCheck, Trash2, UploadCloud } from "lucide-react";

const statusSteps: PrescriptionStatus[] = ["pending", "verified", "preparing", "ready", "completed"];

export function PrescriptionsSection() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<Prescription[]>(() => getPrescriptions());
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const stepsLabels = useMemo(
    () => statusSteps.map((s) => t(`prescriptions.status.${s}`)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language]
  );

  const submit = () => {
    if (!medicineName.trim() || !dosage.trim()) return;
    createPrescription({
      medicineName: medicineName.trim(),
      dosage: dosage.trim(),
      doctorName: doctorName.trim() || undefined,
      pharmacyName: pharmacyName.trim() || t("prescriptions.anyPharmacy"),
      notes: notes.trim() || undefined,
      imageUrl: image,
    });
    setItems(getPrescriptions());
    setMedicineName("");
    setDosage("");
    setDoctorName("");
    setPharmacyName("");
    setNotes("");
    setImage(undefined);
  };

  const handleFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onRemove = (id: string) => {
    removePrescription(id);
    setItems(getPrescriptions());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UploadCloud className="h-5 w-5 text-primary" />
            {t("prescriptions.uploadTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
            )}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="prescription" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">{t("prescriptions.dragDrop")}</p>
                <p className="text-xs text-muted-foreground">{t("prescriptions.fileHint")}</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rx-medicine">{t("prescriptions.medicineName")} *</Label>
              <Input
                id="rx-medicine"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder={t("prescriptions.medicinePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rx-dosage">{t("prescriptions.dosage")} *</Label>
              <Input
                id="rx-dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder={t("prescriptions.dosagePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rx-doctor">{t("prescriptions.doctorName")}</Label>
              <Input
                id="rx-doctor"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder={t("prescriptions.doctorPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rx-pharmacy">{t("prescriptions.pharmacyName")}</Label>
              <Input
                id="rx-pharmacy"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                placeholder={t("prescriptions.anyPharmacy")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rx-notes">{t("prescriptions.notes")}</Label>
            <textarea
              id="rx-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("prescriptions.notesPlaceholder")}
              rows={2}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t("prescriptions.verificationHint")}
            </p>
            <Button onClick={submit} disabled={!medicineName.trim() || !dosage.trim()}>
              {t("prescriptions.submit")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          {t("prescriptions.listTitle")}
        </h3>
        <Badge variant="secondary">{items.length}</Badge>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("prescriptions.empty")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((rx) => (
              <motion.div
                key={rx.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{rx.medicineName}</p>
                          <Badge variant="outline">{rx.dosage}</Badge>
                          <StatusPill status={rx.status} />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("prescriptions.pharmacyName")}: {rx.pharmacyName}
                          {rx.doctorName && ` • ${rx.doctorName}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(rx.createdAt).toLocaleDateString(language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-GB")}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => onRemove(rx.id)} aria-label={t("prescriptions.delete")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {rx.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rx.imageUrl} alt={rx.medicineName} className="mt-3 max-h-36 rounded-lg object-contain" />
                    )}

                    {rx.status !== "rejected" ? (
                      <div className="mt-5">
                        <div className="flex items-center justify-between">
                          {stepsLabels.map((label, i) => (
                            <div key={statusSteps[i]} className="flex flex-1 items-center">
                              <div className="flex flex-col items-center gap-1.5">
                                <div
                                  className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                                    i <= getStatusIndex(rx.status)
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-muted-foreground/30 text-muted-foreground"
                                  )}
                                >
                                  {i < getStatusIndex(rx.status) || rx.status === "completed" && i === getStatusIndex(rx.status) ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Clock className="h-3.5 w-3.5" />
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "hidden text-[10px] font-medium sm:block",
                                    i <= getStatusIndex(rx.status) ? "text-primary" : "text-muted-foreground"
                                  )}
                                >
                                  {label}
                                </span>
                              </div>
                              {i < stepsLabels.length - 1 && (
                                <div
                                  className={cn(
                                    "mx-1 h-0.5 flex-1 rounded",
                                    i < getStatusIndex(rx.status) ? "bg-primary" : "bg-muted"
                                  )}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between sm:hidden">
                          {stepsLabels.map((label, i) => (
                            <span
                              key={statusSteps[i]}
                              className={cn(
                                "text-[10px]",
                                i === getStatusIndex(rx.status) ? "font-semibold text-primary" : "text-muted-foreground"
                              )}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="destructive" className="mt-3">
                        {t("prescriptions.status.rejected")}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: PrescriptionStatus }) {
  const { t } = useLanguage();
  const styles: Record<PrescriptionStatus, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    preparing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    ready: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {t(`prescriptions.status.${status}`)}
    </span>
  );
}
