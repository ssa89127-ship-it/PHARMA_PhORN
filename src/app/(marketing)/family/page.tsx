"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  Heart,
  User,
  Calendar,
  AlertCircle,
  Pill,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  getFamilyMembers,
  addFamilyMember,
  deleteFamilyMember,
  relationshipLabels,
  type FamilyMember,
} from "@/lib/family";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const FamilyPage = memo(function FamilyPage() {
  const { t, language } = useLanguage();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "spouse",
    dateOfBirth: "",
    allergies: [] as string[],
    conditions: [] as string[],
    medications: [] as string[],
  });
  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [medicationInput, setMedicationInput] = useState("");

  useEffect(() => {
    setMembers(getFamilyMembers());
  }, []);

  const handleAdd = () => {
    if (!newMember.name.trim()) return;
    addFamilyMember(newMember);
    setMembers(getFamilyMembers());
    setShowAddDialog(false);
    setNewMember({
      name: "",
      relationship: "spouse",
      dateOfBirth: "",
      allergies: [],
      conditions: [],
      medications: [],
    });
  };

  const handleDelete = (id: string) => {
    deleteFamilyMember(id);
    setMembers(getFamilyMembers());
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !newMember.allergies.includes(allergyInput.trim())) {
      setNewMember({ ...newMember, allergies: [...newMember.allergies, allergyInput.trim()] });
      setAllergyInput("");
    }
  };

  const addCondition = () => {
    if (conditionInput.trim() && !newMember.conditions.includes(conditionInput.trim())) {
      setNewMember({ ...newMember, conditions: [...newMember.conditions, conditionInput.trim()] });
      setConditionInput("");
    }
  };

  const addMedication = () => {
    if (medicationInput.trim() && !newMember.medications.includes(medicationInput.trim())) {
      setNewMember({ ...newMember, medications: [...newMember.medications, medicationInput.trim()] });
      setMedicationInput("");
    }
  };

  const relationships = relationshipLabels[language] || relationshipLabels.uz;
  const relationshipKeys = Object.keys(relationships) as (keyof typeof relationships)[];

  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-emerald-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ];

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
            <Users className="w-3 h-3 mr-1" />
            {t("family.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("family.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("family.desc")}
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
              {t("family.addMember")}
            </Button>
          </motion.div>

          {members.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...spring, delay: 0.2 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t("family.empty")}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {t("family.emptyDesc")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {members.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ ...spring, delay: i * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br",
                              colors[i % colors.length]
                            )}>
                              <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{member.name}</h3>
                              <p className="text-sm text-primary">
                                {relationships[member.relationship as keyof typeof relationships]}
                              </p>
                              {member.dateOfBirth && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {member.dateOfBirth}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(member.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {(member.allergies.length > 0 || member.conditions.length > 0 || member.medications.length > 0) && (
                          <div className="mt-4 space-y-3">
                            {member.allergies.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  <AlertCircle className="w-3 h-3 inline mr-1 text-orange-500" />
                                  {t("family.allergies")}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {member.allergies.map((a) => (
                                    <Badge key={a} variant="outline" className="text-[10px]">
                                      {a}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {member.conditions.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  <Heart className="w-3 h-3 inline mr-1 text-red-500" />
                                  {t("family.conditions")}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {member.conditions.map((c) => (
                                    <Badge key={c} variant="outline" className="text-[10px]">
                                      {c}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {member.medications.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  <Pill className="w-3 h-3 inline mr-1 text-primary" />
                                  {t("family.medications")}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {member.medications.map((m) => (
                                    <Badge key={m} variant="secondary" className="text-[10px]">
                                      {m}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t("family.addTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("family.name")} *</Label>
              <Input
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder={t("family.namePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("family.relationship")}</Label>
              <Select
                value={newMember.relationship}
                onValueChange={(value) => setNewMember({ ...newMember, relationship: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {relationshipKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {relationships[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("family.dateOfBirth")}</Label>
              <Input
                type="date"
                value={newMember.dateOfBirth}
                onChange={(e) => setNewMember({ ...newMember, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("family.allergies")}</Label>
              <div className="flex gap-2">
                <Input
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                  placeholder={t("family.allergyPlaceholder")}
                />
                <Button variant="outline" onClick={addAllergy}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {newMember.allergies.map((a) => (
                  <Badge key={a} variant="secondary" className="flex items-center gap-1">
                    {a}
                    <button onClick={() => setNewMember({ ...newMember, allergies: newMember.allergies.filter((x) => x !== a) })}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("family.conditions")}</Label>
              <div className="flex gap-2">
                <Input
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCondition()}
                  placeholder={t("family.conditionPlaceholder")}
                />
                <Button variant="outline" onClick={addCondition}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {newMember.conditions.map((c) => (
                  <Badge key={c} variant="secondary" className="flex items-center gap-1">
                    {c}
                    <button onClick={() => setNewMember({ ...newMember, conditions: newMember.conditions.filter((x) => x !== c) })}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("family.medications")}</Label>
              <div className="flex gap-2">
                <Input
                  value={medicationInput}
                  onChange={(e) => setMedicationInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMedication()}
                  placeholder={t("family.medicationPlaceholder")}
                />
                <Button variant="outline" onClick={addMedication}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {newMember.medications.map((m) => (
                  <Badge key={m} variant="secondary" className="flex items-center gap-1">
                    {m}
                    <button onClick={() => setNewMember({ ...newMember, medications: newMember.medications.filter((x) => x !== m) })}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={handleAdd} className="w-full">
              {t("family.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default FamilyPage;
