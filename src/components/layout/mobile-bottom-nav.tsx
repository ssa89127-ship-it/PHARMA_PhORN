"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, Building2, ShoppingCart, User } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

/** App-style bottom tab bar, phones only (hidden from md / tablet up). */
export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const { t } = useLanguage();
  const { totalItems, toggleCart } = useCart();

  const items = [
    { href: "/", label: t("nav.home"), icon: Home, match: (p: string) => p === "/" },
    { href: "/medicines", label: t("nav.medicines"), icon: Pill, match: (p: string) => p.startsWith("/medicines") },
    { href: "/pharmacies", label: t("nav.pharmacies"), icon: Building2, match: (p: string) => p.startsWith("/pharmacies") },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5 h-16">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span className="truncate max-w-[72px]">{label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={toggleCart}
            className="relative flex h-full w-full flex-col items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute top-2 left-1/2 ml-1.5 min-w-[18px] h-[18px] rounded-full bg-primary px-1 text-[10px] leading-[18px] text-primary-foreground">
                {totalItems}
              </span>
            )}
            <span>{t("nav.cart")}</span>
          </button>
        </li>
        <li>
          <Link
            href="/dashboard/patient"
            className={cn(
              "flex h-full flex-col items-center justify-center gap-1 text-[10px] font-medium",
              pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="truncate max-w-[72px]">{t("nav.dashboard")}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default MobileBottomNav;
