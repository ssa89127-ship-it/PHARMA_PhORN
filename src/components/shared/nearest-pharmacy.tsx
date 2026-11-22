"use client";
import { TrText } from "@/components/shared/tr-text";
import { useLanguage } from "@/i18n/LanguageProvider";

import { useState, useEffect, useMemo } from "react";
import { MapPin, Navigation, Phone, Clock, Truck, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import dynamic from "next/dynamic";

const PharmacyMap = dynamic(() => import("@/components/shared/pharmacy-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted/30 rounded-xl flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <MapPin className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2 animate-pulse" />
        <p className="text-xs text-muted-foreground"><TrText k="ui.loadingMap" /></p>
      </div>
    </div>
  ),
});

interface PharmacyWithDistance {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  is24hours: boolean;
  deliveryTime?: string;
  distance?: number;
  distanceText?: string;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

function getWalkingTime(km: number): string {
  const walkingSpeedKmH = 5;
  const minutes = Math.round((km / walkingSpeedKmH) * 60);
  if (minutes < 60) return `${minutes} daqiqa piyoda`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} soat ${remainingMinutes} daqiqa`;
}

function getDrivingTime(km: number): string {
  const drivingSpeedKmH = 30;
  const minutes = Math.round((km / drivingSpeedKmH) * 60);
  if (minutes < 60) return `${minutes} daqiqa avtoulida`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} soat ${remainingMinutes} daqiqa`;
}

interface NearestPharmacyProps {
  pharmacies: PharmacyWithDistance[];
  maxShow?: number;
  showMap?: boolean;
}

export default function NearestPharmacy({ pharmacies, maxShow = 5, showMap = true }: NearestPharmacyProps) {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t("ui.geoUnsupported"));
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(t("ui.geoDenied"));
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(t("ui.geoUnavailable"));
            break;
          case error.TIMEOUT:
            setLocationError(t("ui.geoTimeout"));
            break;
          default:
            setLocationError(t("ui.geoUnknown"));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const pharmaciesWithDistance = useMemo(() => {
    if (!userLocation) return [];

    return pharmacies
      .map((p) => {
        const dist = haversineDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
        return {
          ...p,
          distance: dist,
          distanceText: formatDistance(dist),
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxShow);
  }, [userLocation, pharmacies, maxShow]);

  const nearestThree = pharmaciesWithDistance.slice(0, 3);

  return (
    <div className="space-y-4">
      {!userLocation ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t("ui.findNearest")}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t("ui.findNearestHint")}
              </p>
            </div>
            {locationError && (
              <p className="text-xs text-destructive">{locationError}</p>
            )}
            <Button onClick={requestLocation} disabled={loading} className="gap-2">
              <Navigation className="w-4 h-4" />
              {loading ? t("ui.detecting") : t("ui.detectLocation")}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {showMap && nearestThree.length > 0 && (
            <Card className="overflow-hidden">
              <PharmacyMap
                pharmacies={nearestThree.map((p) => ({
                  id: p.id,
                  name: p.name,
                  address: p.address,
                  city: p.city,
                  phone: p.phone,
                  lat: p.lat,
                  lng: p.lng,
                  isOpen: p.isOpen,
                }))}
                height="200px"
              />
            </Card>
          )}

          <div className="space-y-2">
            {pharmaciesWithDistance.map((pharmacy, index) => (
              <Card
                key={pharmacy.id}
                className={cn(
                  "p-3 transition-all hover:shadow-md cursor-pointer",
                  index === 0 && "border-primary/50 bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{pharmacy.name}</p>
                      {pharmacy.isOpen ? (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0 shrink-0">{t("ui.open")}</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">{t("ui.closed")}</Badge>
                      )}
                      {pharmacy.is24hours && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">{t("ui.hours24")}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{pharmacy.address}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <MapPin className="w-3 h-3" />
                        {pharmacy.distanceText}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {getWalkingTime(pharmacy.distance)}
                      </span>
                      {pharmacy.deliveryTime && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Truck className="w-3 h-3" />
                          {pharmacy.deliveryTime}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1">
                        <Navigation className="w-3 h-3" />
                        {t("ui.directions")}
                      </Button>
                    </a>
                    {pharmacy.phone && (
                      <a href={`tel:${pharmacy.phone}`} onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 px-2">
                          <Phone className="w-3 h-3" />
                          {t("ui.call")}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {pharmaciesWithDistance.length === 0 && (
            <Card className="p-6 text-center text-sm text-muted-foreground">
              {t("ui.noNearby")}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
