"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";
import {
  Search,
  Star,
  Video,
  MessageSquareText,
  UserRound,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Shield,
  Award,
  GraduationCap,
  Globe,
  CheckCircle2,
  Stethoscope,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn, formatPrice, getInitials } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useDataLoader } from "@/lib/data-loader";
import type { Doctor, TimeSlot } from "@/types";

type TabValue = "all" | "available-today" | "video" | "chat";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ConsultationPage() {
  const { t } = useLanguage();
  const { data } = useDataLoader();
  const doctors = data?.doctors ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);

  const tabConfig: { value: TabValue; label: string }[] = [
    { value: "all", label: t("consultation.allDoctors") },
    { value: "available-today", label: t("consultation.availableToday") },
    { value: "video", label: t("consultation.videoConsult") },
    { value: "chat", label: t("consultation.chatConsult") },
  ];

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.languages.some((l) => l.toLowerCase().includes(q))
      );
    }

    switch (activeTab) {
      case "available-today":
        result = result.filter((d) => d.isAvailableToday);
        break;
      case "video":
        result = result.filter((d) => d.availableForVideo);
        break;
      case "chat":
        result = result.filter((d) => d.availableForChat);
        break;
    }

    return result;
  }, [searchQuery, activeTab]);

  return (
    <div className="overflow-hidden">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        doctorCount={doctors.length}
      />

      <section className="section-padding relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-40 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="container-custom relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h2 className="heading-sm">
                <span className="text-gradient">{t("consultation.subtitle")}</span>
              </h2>
              <Badge variant="secondary" className="text-xs font-normal">
                {filteredDoctors.length} doctors
              </Badge>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabValue)}
            className="mb-8"
          >
            <TabsList className="w-full sm:w-auto h-auto flex-wrap gap-1 bg-muted/50 p-1">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs sm:text-sm data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabConfig.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                <DoctorGrid
                  doctors={filteredDoctors}
                  expandedDoctorId={expandedDoctorId}
                  onToggleExpand={setExpandedDoctorId}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function HeroSection({
  searchQuery,
  onSearchChange,
  doctorCount,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  doctorCount: number;
}) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-center pt-24 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />

      <div className="container-custom relative w-full">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
          >
            <Stethoscope className="w-4 h-4" />
            {doctorCount} {t("consultation.subtitle")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-xl mb-4 leading-tight"
          >
            {t("consultation.title")}
            <br />
            <span className="text-gradient">{t("consultation.subtitle")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed"
          >
            {t("consultation.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-1 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder={t("nav.search")}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm py-3 placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Button variant="primary" size="md" className="shrink-0 mr-1">
                <Search className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t("hero.search")}</span>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{t("consultation.allDoctors")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{t("consultation.videoConsult")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{t("consultation.bookAppointment")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DoctorGrid({
  doctors: items,
  expandedDoctorId,
  onToggleExpand,
}: {
  doctors: Doctor[];
  expandedDoctorId: string | null;
  onToggleExpand: (id: string | null) => void;
}) {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <UserRound className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t("common.noResults")}</h3>
        <p className="text-muted-foreground text-sm mb-6">
          {t("nav.search")}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          isExpanded={expandedDoctorId === doctor.id}
          onToggleExpand={() =>
            onToggleExpand(
              expandedDoctorId === doctor.id ? null : doctor.id
            )
          }
        />
      ))}
    </motion.div>
  );
}

function DoctorCard({
  doctor,
  isExpanded,
  onToggleExpand,
}: {
  doctor: Doctor;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const { t } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedType, setPreselectedType] = useState<
    "video" | "chat" | "in-person"
  >("video");

  const handleBook = (type: "video" | "chat" | "in-person") => {
    setPreselectedType(type);
    setIsBookingOpen(true);
  };

  return (
    <>
      <motion.div variants={cardVariants}>
        <Card className="group relative overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-5 md:p-6 flex flex-col flex-1 relative">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 border-primary/20 shrink-0">
                <AvatarImage src={doctor.photo} alt={doctor.name} />
                <AvatarFallback className="rounded-2xl gradient-primary text-white text-lg font-semibold">
                  {getInitials(doctor.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {doctor.specialty}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-sm">{doctor.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({doctor.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{doctor.experience} {t("consultation.experience")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{doctor.languages[0]}</span>
                    {doctor.languages.length > 1 && (
                      <span>+{doctor.languages.length - 1}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {doctor.languages.map((lang) => (
                <Badge
                  key={lang}
                  variant="outline"
                  className="text-[10px] leading-none px-2 py-0.5 border-primary/20 text-primary"
                >
                  {lang}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {doctor.isAvailableToday && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                    </span>
                    {t("consultation.availableToday")}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(doctor.consultationFee)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {t("consultation.consultationFee")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              {doctor.availableForVideo && (
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 min-w-[100px] text-xs"
                  onClick={() => handleBook("video")}
                >
                  <Video className="w-3.5 h-3.5 mr-1.5" />
                  {t("consultation.bookVideo")}
                </Button>
              )}
              {doctor.availableForChat && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 min-w-[100px] text-xs"
                  onClick={() => handleBook("chat")}
                >
                  <MessageSquareText className="w-3.5 h-3.5 mr-1.5" />
                  {t("consultation.bookChat")}
                </Button>
              )}
              {doctor.availableForInPerson && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[100px] text-xs"
                  onClick={() => handleBook("in-person")}
                >
                  <UserRound className="w-3.5 h-3.5 mr-1.5" />
                  {t("consultation.inPerson")}
                </Button>
              )}
            </div>

            <button
              onClick={onToggleExpand}
              className="flex items-center justify-center gap-1 w-full mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  {t("consultation.hideProfile")}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  {t("consultation.viewProfile")}
                </>
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3 border-t border-border/50 mt-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {doctor.bio}
                    </p>

                    {doctor.qualifications.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                          <Shield className="w-3.5 h-3.5 text-primary" />
                          {t("consultation.experience")}
                        </div>
                        <ul className="space-y-1">
                          {doctor.qualifications.map((q) => (
                            <li
                              key={q}
                              className="text-xs text-muted-foreground flex items-start gap-1.5"
                            >
                              <span className="text-primary mt-0.5">•</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {doctor.awards.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                          <Award className="w-3.5 h-3.5 text-primary" />
                          {t("consultation.subtitle")}
                        </div>
                        <ul className="space-y-1">
                          {doctor.awards.map((a) => (
                            <li
                              key={a}
                              className="text-xs text-muted-foreground flex items-start gap-1.5"
                            >
                              <span className="text-primary mt-0.5">•</span>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      <BookingDialog
        doctor={doctor}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        initialType={preselectedType}
      />
    </>
  );
}

function BookingDialog({
  doctor,
  open,
  onOpenChange,
  initialType,
}: {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType: "video" | "chat" | "in-person";
}) {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [consultationType, setConsultationType] = useState<string>(initialType);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const consultationTypes = [
    { value: "video", label: t("consultation.videoConsult"), icon: Video },
    { value: "chat", label: t("consultation.chatConsult"), icon: MessageSquareText },
    { value: "in-person", label: t("consultation.inPerson"), icon: UserRound },
  ] as const;

  const dates = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i)),
    []
  );

  const availableSlotsForDate = useMemo(
    () =>
      doctor.availableSlots.filter(
        (slot) =>
          slot.date === selectedDate &&
          !slot.isBooked &&
          (consultationType === "video"
            ? slot.type === "video"
            : consultationType === "chat"
              ? slot.type === "chat"
              : slot.type === "in-person")
      ),
    [doctor.availableSlots, selectedDate, consultationType]
  );

  const handleBookAppointment = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsConfirmed(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedDate(format(new Date(), "yyyy-MM-dd"));
      setConsultationType(initialType);
      setSelectedSlot(null);
      setReasonForVisit("");
      setIsConfirmed(false);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {!isConfirmed ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("consultation.bookAppointment")}</DialogTitle>
              <DialogDescription>
                {t("consultation.desc")}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <Avatar className="w-12 h-12 rounded-xl border-2 border-primary/20">
                <AvatarImage src={doctor.photo} alt={doctor.name} />
                <AvatarFallback className="rounded-xl gradient-primary text-white font-semibold">
                  {getInitials(doctor.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-sm">{doctor.name}</h4>
                <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-medium">{doctor.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({doctor.reviewCount} {t("medicines.reviews")})
                  </span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-bold text-primary">
                  {formatPrice(doctor.consultationFee)}
                </p>
                <p className="text-[10px] text-muted-foreground">{t("consultation.consultationFee")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                  {t("consultation.selectDate")}
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {dates.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const isActive = selectedDate === dateStr;
                    const hasSlots = doctor.availableSlots.some(
                      (s) => s.date === dateStr && !s.isBooked
                    );
                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedSlot(null);
                        }}
                        disabled={!hasSlots}
                        className={cn(
                          "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border shrink-0 min-w-[60px]",
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                            : hasSlots
                              ? "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                              : "bg-muted/30 text-muted-foreground/40 border-border/50 cursor-not-allowed"
                        )}
                      >
                        <span className="text-[10px] uppercase">
                          {format(date, "EEE")}
                        </span>
                        <span className="text-sm font-semibold">
                          {format(date, "d")}
                        </span>
                        <span className="text-[10px] uppercase">
                          {format(date, "MMM")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  <Clock className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                  {t("consultation.selectTime")}
                </label>
                {availableSlotsForDate.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlotsForDate.map((slot) => {
                      const isActive =
                        selectedSlot?.startTime === slot.startTime &&
                        selectedSlot?.date === slot.date;
                      return (
                        <button
                          key={`${slot.date}-${slot.startTime}`}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 border text-center",
                            isActive
                              ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                              : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                          )}
                        >
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-3 text-center">
                    {t("common.noResults")}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("consultation.title")}
                </label>
                <Select
                  value={consultationType}
                  onValueChange={(v) => {
                    setConsultationType(v);
                    setSelectedSlot(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes
                      .filter((ct) => {
                        if (ct.value === "video") return doctor.availableForVideo;
                        if (ct.value === "chat") return doctor.availableForChat;
                        if (ct.value === "in-person")
                          return doctor.availableForInPerson;
                        return false;
                      })
                      .map((ct) => {
                        const Icon = ct.icon;
                        return (
                          <SelectItem key={ct.value} value={ct.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {ct.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("consultation.reason")}
                </label>
                <textarea
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder={t("consultation.reasonPlaceholder")}
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200 resize-none"
                />
              </div>

              <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t("consultation.consultationFee")}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("consultation.consultationFee")}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={!selectedSlot || !reasonForVisit.trim() || isSubmitting}
              loading={isSubmitting}
              onClick={handleBookAppointment}
            >
              {isSubmitting ? t("common.loading") : t("consultation.bookAppointment")}
            </Button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">{t("consultation.confirmBooking")}</h3>
            <p className="text-sm text-muted-foreground mb-1">
              {t("consultation.bookAppointment")} {t("consultation.title")}
            </p>
            {selectedSlot && (
              <p className="text-sm font-medium text-primary mb-6">
                {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")} at{" "}
                {selectedSlot.startTime}
              </p>
            )}
            <Button variant="primary" onClick={handleClose}>
              {t("common.close")}
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
