"use client";

import Link from "next/link";
import { Pill, Heart, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const footerSections = [
  { key: "company", links: [
    { key: "about", href: "#" },
    { key: "careers", href: "#" },
    { key: "press", href: "#" },
    { key: "blog", href: "#" },
    { key: "partners", href: "#" },
  ]},
  { key: "services", links: [
    { key: "medicineDelivery", href: "/delivery" },
    { key: "onlineConsultation", href: "/consultation" },
    { key: "aiConsultation", href: "/ai-consultation" },
    { key: "pharmacyDirectory", href: "/pharmacies" },
    { key: "priceComparison", href: "/medicines" },
    { key: "drugInteractions", href: "/interactions" },
  ]},
  { key: "support", links: [
    { key: "helpCenter", href: "#" },
    { key: "contactUs", href: "#" },
    { key: "privacyPolicy", href: "#" },
    { key: "termsOfService", href: "#" },
    { key: "familyAccounts", href: "/family" },
    { key: "loyaltyProgram", href: "/loyalty" },
  ]},
  { key: "topCategories", isCategories: true, links: [
    { key: "painRelief", href: "#" },
    { key: "antibiotics", href: "#" },
    { key: "diabetes", href: "#" },
    { key: "heartHealth", href: "#" },
    { key: "vitamins", href: "#" },
  ]},
];

const sectionHeaderKeys: Record<string, string> = {
  company: "footer.company",
  services: "footer.services",
  support: "footer.support",
  topCategories: "categories.title",
};

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="container-custom relative">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="relative w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gradient">Pharma</span>
                <span className="text-foreground">Hub</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              {t("brand.description")}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>Amir Temur ko'chasi 108, Toshkent, O'zbekiston</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span>+998 90 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span>info@vitahub.uz</span>
              </div>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.key}>
              <h4 className="font-semibold text-sm mb-4">
                {section.isCategories
                  ? t("categories.title")
                  : t(sectionHeaderKeys[section.key])}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                      {section.isCategories
                        ? t(`categories.${link.key}`)
                        : t(`footer.${link.key}`)}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VitaHub. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t("footer.madeWith")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
