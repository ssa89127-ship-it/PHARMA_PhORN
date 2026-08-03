"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Tag,
  Package,
  TrendingUp,
  Clock,
  Lightbulb,
  Gift,
  Settings,
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  getNotificationHistory,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationPreference,
  type NotificationItem,
} from "@/lib/notifications";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.5 };

const typeIcons: Record<string, any> = {
  promo: Tag,
  order: Package,
  price: TrendingUp,
  reminder: Clock,
  tip: Lightbulb,
  referral: Gift,
};

const typeColors: Record<string, string> = {
  promo: "text-orange-500",
  order: "text-blue-500",
  price: "text-green-500",
  reminder: "text-purple-500",
  tip: "text-cyan-500",
  referral: "text-pink-500",
};

const NotificationsPage = memo(function NotificationsPage() {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [history, setHistory] = useState<NotificationItem[]>([]);
  const [tab, setTab] = useState("history");

  useEffect(() => {
    setPreferences(getNotificationPreferences());
    setHistory(getNotificationHistory());
  }, []);

  const togglePref = (id: string) => {
    const updated = preferences.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    setPreferences(updated);
    saveNotificationPreferences(updated);
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    setHistory(getNotificationHistory());
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setHistory(getNotificationHistory());
  };

  const unreadCount = history.filter((n) => !n.read).length;

  const prefLabels: Record<string, { title: string; desc: string }> = {
    promotions: { title: t("notif.pref.promotions.title"), desc: t("notif.pref.promotions.desc") },
    order_updates: { title: t("notif.pref.orderUpdates.title"), desc: t("notif.pref.orderUpdates.desc") },
    price_alerts: { title: t("notif.pref.priceAlerts.title"), desc: t("notif.pref.priceAlerts.desc") },
    reminders: { title: t("notif.pref.reminders.title"), desc: t("notif.pref.reminders.desc") },
    health_tips: { title: t("notif.pref.healthTips.title"), desc: t("notif.pref.healthTips.desc") },
    referrals: { title: t("notif.pref.referrals.title"), desc: t("notif.pref.referrals.desc") },
  };

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
            {t("notif.badge")}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("notif.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("notif.desc")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Tabs value={tab} onValueChange={setTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BellRing className="w-4 h-4" />
                {t("notif.history")}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t("notif.settings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              {unreadCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button variant="outline" onClick={handleMarkAllRead} className="w-full">
                    <CheckCheck className="w-4 h-4 mr-2" />
                    {t("notif.markAllRead")}
                  </Button>
                </motion.div>
              )}

              {history.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("notif.empty")}</h3>
                    <p className="text-sm text-muted-foreground text-center">{t("notif.emptyDesc")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {history.map((item, i) => {
                      const Icon = typeIcons[item.type] || Bell;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...spring, delay: i * 0.05 }}
                        >
                          <Card className={cn(
                            "transition-all duration-300",
                            !item.read && "border-primary/30 bg-primary/5"
                          )}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                  `bg-${typeColors[item.type]?.split('-')[1]}-500/10`
                                )}>
                                  <Icon className={cn("w-5 h-5", typeColors[item.type])} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm">{item.title}</h4>
                                    {!item.read && (
                                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(item.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                {!item.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleMarkRead(item.id)}
                                    className="shrink-0"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              {preferences.map((pref, i) => (
                <motion.div
                  key={pref.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            pref.enabled ? "bg-primary/10" : "bg-muted"
                          )}>
                            {pref.channel === "push" && <Smartphone className={cn("w-5 h-5", pref.enabled ? "text-primary" : "text-muted-foreground")} />}
                            {pref.channel === "email" && <Mail className={cn("w-5 h-5", pref.enabled ? "text-primary" : "text-muted-foreground")} />}
                            {pref.channel === "sms" && <MessageSquare className={cn("w-5 h-5", pref.enabled ? "text-primary" : "text-muted-foreground")} />}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{prefLabels[pref.id]?.title}</h4>
                            <p className="text-xs text-muted-foreground">{prefLabels[pref.id]?.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={pref.enabled}
                          onCheckedChange={() => togglePref(pref.id)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
});

export default NotificationsPage;
