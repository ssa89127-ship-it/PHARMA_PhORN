"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Pill,
  ChevronDown,
  User,
  LogOut,
  Settings,
  ClipboardList,
  Calendar,
  Heart,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useCart } from "@/store/cart";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "/" },
  { key: "pharmacies", href: "/pharmacies" },
  { key: "medicines", href: "/medicines" },
  { key: "prescriptions", href: "/retsept" },
];

const moreItems = [
  { key: "consultation", href: "/consultation" },
  { key: "aiConsultation", href: "/ai-consultation" },
  { key: "delivery", href: "/delivery" },
  { key: "interactions", href: "/interactions" },
  { key: "reminders", href: "/reminders" },
  { key: "priceAlerts", href: "/price-alerts" },
  { key: "family", href: "/family" },
  { key: "referral", href: "/referral" },
  { key: "loyalty", href: "/loyalty" },
  { key: "health", href: "/health-records" },
  { key: "notifications", href: "/notifications" },
  { key: "paymentHistory", href: "/payment/history" },
];

export function Navbar() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCart();

  const navLinks = navItems.map((item) => ({
    label: t(`nav.${item.key}`),
    href: item.href,
  }));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient">Vita</span>
              <span className="text-foreground">Hub</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-all duration-200">
                {t("nav.more") || "Ko'proq"}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card rounded-xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {moreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-lg transition-colors",
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/patient">
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10">
                <User className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative hover:bg-primary/10"
            >
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Menu className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass border-t border-border/50 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t("nav.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
              </div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-border/50">
                <p className="px-4 py-1 text-xs font-medium text-muted-foreground uppercase">
                  {t("nav.more") || "Ko'proq"}
                </p>
                {moreItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + i) * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-2">
                <Link href="/dashboard/patient">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    {t("nav.dashboard")}
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("nav.signIn")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
