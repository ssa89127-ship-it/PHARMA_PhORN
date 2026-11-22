"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageProvider";
import { LoginForm, type SessionUser } from "./login-form";

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  /** Opens the login dialog; `then` runs after a successful login. */
  requireLogin: (then?: () => void) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const after = useRef<(() => void) | null>(null);

  useEffect(() => {
    fetch("/api/account/session")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const requireLogin = useCallback(
    (then?: () => void) => {
      if (user) return then?.();
      after.current = then ?? null;
      setOpen(true);
    },
    [user]
  );

  const logout = useCallback(async () => {
    await fetch("/api/account/session", { method: "DELETE" }).catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, requireLogin, logout }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("auth2.loginTitle")}</DialogTitle>
            <DialogDescription>{t("auth2.loginSubtitle")}</DialogDescription>
          </DialogHeader>
          <LoginForm
            onSuccess={(u) => {
              setUser(u);
              setOpen(false);
              const fn = after.current;
              after.current = null;
              setTimeout(() => fn?.(), 0);
            }}
          />
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
