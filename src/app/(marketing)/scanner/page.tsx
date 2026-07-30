"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  Camera,
  Barcode,
  Pill,
  History,
  Loader2,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";

interface ScanResult {
  name: string;
  dosage: string;
  manufacturer: string;
  price: number;
  genericName: string;
  form: string;
}

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  dosage: string;
}

const mockResult: ScanResult = {
  name: "Paracetamol",
  dosage: "500mg",
  manufacturer: "Zentiva",
  price: 15000,
  genericName: "Acetaminophen",
  form: "tablet",
};

const mockHistoryData: HistoryItem[] = [
  { id: "1", name: "Ibuprofen", date: "2024-03-15", dosage: "400mg" },
  { id: "2", name: "Amoxicillin", date: "2024-03-10", dosage: "500mg" },
  { id: "3", name: "Vitamin C", date: "2024-03-05", dosage: "1000mg" },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function ScannerPage() {
  const { language, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(mockHistoryData);
  const [showHistory, setShowHistory] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const tScanner = (uz: string, ru: string, en: string) => {
    return language === "uz" ? uz : language === "ru" ? ru : en;
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage(ev.target?.result as string);
      setResult(null);
      startScan();
    };
    reader.readAsDataURL(file);
  }, []);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => {
        setIsScanning(false);
        setResult(mockResult);
        setHistory((prev) => [
          { id: generateId(), name: mockResult.name, date: new Date().toISOString(), dosage: mockResult.dosage },
          ...prev,
        ]);
      }, 400);
    }, 3000);
  }, []);

  const handleBarcodeSearch = () => {
    if (!barcodeInput.trim()) return;
    setIsBarcodeScanning(true);
    setTimeout(() => {
      setIsBarcodeScanning(false);
      setResult(mockResult);
      setBarcodeInput("");
    }, 1500);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/[0.03] to-secondary/[0.03] blur-[150px]" />

        <div className="container-custom relative w-full">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
            >
              <Scan className="w-4 h-4" />
              {tScanner("AI bilan skanerlash", "AI сканирование", "AI-Powered Scanning")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Scan className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="heading-xl mb-1 leading-tight">
                  {tScanner("Dori skaneri", "Сканер лекарств", "Medicine Scanner")}
                </h1>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            >
              {tScanner(
                "Dori nomini, dozajini va narxini bilish uchun qadoqni skanerlang yoki shtrix-kodni kiriting.",
                "Отсканируйте упаковку или введите штрих-код, чтобы узнать название, дозировку и цену лекарства.",
                "Scan the package or enter the barcode to identify the medicine name, dosage, and price."
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <div className="space-y-6">
                <div
                  className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.02] overflow-hidden cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 grid-pattern opacity-20" />

                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <Camera className="w-10 h-10 text-primary/60" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {tScanner("Kamerani yo'naltiring", "Наведите камеру", "Point your camera")}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {tScanner(
                          "yoki suratni yuklash uchun bosing",
                          "или нажмите для загрузки изображения",
                          "or click to upload an image"
                        )}
                      </p>
                    </div>
                  )}

                  <div className="absolute left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none">
                    <motion.div
                      ref={scanLineRef}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"
                      animate={
                        isScanning
                          ? { top: ["0%", "100%", "0%"] }
                          : selectedImage && !result
                          ? { top: ["0%", "100%", "0%"] }
                          : {}
                      }
                      transition={
                        isScanning || (selectedImage && !result)
                          ? { duration: 2, repeat: Infinity, ease: "linear" }
                          : {}
                      }
                    />
                  </div>

                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg pointer-events-none" />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:flex-1 h-12 text-base font-semibold"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {tScanner("Kamerani ochish", "Открыть камеру", "Open Camera")}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="w-5 h-5" />
                  </Button>
                </div>

                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          {tScanner("Skanerlanmoqda...", "Сканируется...", "Scanning...")}
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {Math.min(100, Math.round(scanProgress))}%
                        </span>
                      </div>
                      <Progress value={Math.min(100, scanProgress)} className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {result && !isScanning && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="space-y-4"
                    >
                      <Separator />

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-semibold">
                          {tScanner("Natija", "Результат", "Result")}
                        </h3>
                      </div>

                      <Card className="border-primary/10 overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <Pill className="w-6 h-6 text-white" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-lg font-bold leading-tight">{result.name}</h4>
                                <p className="text-sm text-muted-foreground">{result.genericName}</p>
                              </div>
                            </div>
                            <Badge variant="primary" className="shrink-0">
                              {result.dosage}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                              <p className="text-xs text-muted-foreground font-medium mb-1">
                                {tScanner("Ishlab chiqaruvchi", "Производитель", "Manufacturer")}
                              </p>
                              <p className="text-sm font-semibold">{result.manufacturer}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                              <p className="text-xs text-muted-foreground font-medium mb-1">
                                {tScanner("Shakl", "Форма", "Form")}
                              </p>
                              <p className="text-sm font-semibold capitalize">{result.form}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                            <span className="text-sm font-medium text-foreground">
                              {tScanner("Taxminiy narx", "Примерная цена", "Estimated Price")}
                            </span>
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(result.price)}
                            </span>
                          </div>

                          <Button variant="primary" size="lg" className="w-full h-12 text-base font-semibold" asChild>
                            <a href={`/medicines?search=${encodeURIComponent(result.name)}`}>
                              <Search className="w-5 h-5 mr-2" />
                              {tScanner("Batafsil ko'rish", "Подробнее", "View Details")}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {tScanner("Shtrix-kodni kiriting", "Введите штрих-код", "Enter Barcode")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="e.g. 4780102010316"
                      icon={<Barcode className="w-4 h-4" />}
                      onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()}
                    />
                    <Button
                      variant="primary"
                      className="h-10 shrink-0"
                      onClick={handleBarcodeSearch}
                      disabled={!barcodeInput.trim() || isBarcodeScanning}
                    >
                      {isBarcodeScanning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Scan className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showHistory && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="container-custom pb-8">
              <Card className="border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">
                        {tScanner("Skanerlar tarixi", "История сканирований", "Scan History")}
                      </h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                          <Pill className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.dosage} &middot; {item.date}
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          <Scan className="w-3 h-3 mr-1" />
                          {tScanner("Skanerlangan", "Отсканировано", "Scanned")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.02] p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    {tScanner("Qanday ishlaydi", "Как это работает", "How it works")}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tScanner(
                      "Kamerani dori qadoqidagi shtrix-kodga yo'naltiring yoki suratga oling. Bizning AI yordamimizda dori nomi, dozaji va narxini aniqlaymiz. Shtrix-kodni qo'lda ham kiritishingiz mumkin.",
                      "Наведите камеру на штрих-код на упаковке лекарства или сфотографируйте его. Наш ИИ определит название, дозировку и цену. Вы также можете ввести штрих-код вручную.",
                      "Point your camera at the barcode on the medicine package or take a photo. Our AI will identify the name, dosage, and price. You can also enter the barcode manually."
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
