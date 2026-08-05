"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Plus,
  X,
  Search,
  CheckCircle2,
  Info,
  Pill,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findInteractions, getInteractionText, getInteractionRecommendation, severityColors, severityLabels, type Interaction } from "@/lib/interactions";
import { useDataLoader } from "@/lib/data-loader";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const InteractionsPage = memo(function InteractionsPage() {
  const { t, language } = useLanguage();
  const { data } = useDataLoader();
  const medicines = data?.medicines ?? [];
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [showResults, setShowResults] = useState(false);

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedMedicines.includes(med.name) &&
      selectedMedicines.length < 5
  );

  const addMedicine = (name: string) => {
    if (selectedMedicines.length < 5 && !selectedMedicines.includes(name)) {
      setSelectedMedicines([...selectedMedicines, name]);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const removeMedicine = (name: string) => {
    setSelectedMedicines(selectedMedicines.filter((m) => m !== name));
    setInteractions([]);
    setShowResults(false);
  };

  const checkInteractions = () => {
    const found = findInteractions(selectedMedicines);
    setInteractions(found);
    setShowResults(true);
  };

  const severityOrder = { dangerous: 0, severe: 1, moderate: 2, mild: 3 };
  const sortedInteractions = [...interactions].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-center mb-8"
        >
          <Badge variant="primary" className="mb-4">
            <Shield className="w-3 h-3 mr-1" />
            {t("interactions.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("interactions.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("interactions.desc")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Pill className="w-5 h-5 text-primary" />
                  {t("interactions.selectTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(e.target.value.length > 0);
                    }}
                    onFocus={() => setSearchQuery.length > 0 && setShowResults(true)}
                    placeholder={t("interactions.searchPlaceholder")}
                    className="pl-10"
                  />
                  {showResults && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {filteredMedicines.slice(0, 8).map((med) => (
                        <button
                          key={med.id}
                          onClick={() => addMedicine(med.name)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors text-left cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                            <Pill className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{med.name}</p>
                            <p className="text-xs text-muted-foreground">{med.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  <AnimatePresence>
                    {selectedMedicines.map((name) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={spring}
                      >
                        <Badge variant="secondary" className="flex items-center gap-1 pr-1">
                          {name}
                          <button
                            onClick={() => removeMedicine(name)}
                            className="ml-1 p-0.5 rounded-full hover:bg-destructive/20 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {selectedMedicines.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t("interactions.noMedicines")}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {selectedMedicines.length}/5 {t("interactions.medicinesSelected")}
                  </p>
                  <Button
                    onClick={checkInteractions}
                    disabled={selectedMedicines.length < 2}
                  >
                    {t("interactions.check")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={spring}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {interactions.length > 0 ? (
                        <>
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          {t("interactions.foundTitle")}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          {t("interactions.safeTitle")}
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {interactions.length === 0 ? (
                      <div className="text-center py-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                          className="mb-4"
                        >
                          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                          </div>
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2">
                          {t("interactions.safeTitle")}
                        </h3>
                        <p className="text-muted-foreground">
                          {t("interactions.safeDesc")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                          <Info className="w-5 h-5 text-orange-500 shrink-0" />
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            {t("interactions.warning")}
                          </p>
                        </div>

                        {sortedInteractions.map((interaction, i) => (
                          <motion.div
                            key={interaction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...spring, delay: i * 0.1 }}
                            className="border rounded-xl p-4 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Badge className={cn(severityColors[interaction.severity])}>
                                  {severityLabels[language][interaction.severity]}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {interaction.medicine1} + {interaction.medicine2}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getInteractionText(interaction, language)}
                            </p>
                            <div className="bg-primary/5 rounded-lg p-3">
                              <p className="text-sm font-medium text-primary">
                                {t("interactions.recommendation")}:
                              </p>
                              <p className="text-sm">
                                {getInteractionRecommendation(interaction, language)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export default InteractionsPage;
