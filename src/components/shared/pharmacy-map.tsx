"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Phone, Navigation } from "lucide-react";

export interface MapPharmacy {
  id: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  lat: number;
  lng: number;
  isOpen?: boolean;
  price?: number;
  formatPrice?: string;
  deliveryTime?: string;
}

interface PharmacyMapProps {
  pharmacies: MapPharmacy[];
  height?: string;
  className?: string;
  center?: [number, number];
  zoom?: number;
  showLocateButton?: boolean;
  showDirections?: boolean;
}

function pinIcon(isOpen?: boolean, isPrice?: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center">
      <div style="width:22px;height:22px;border-radius:50%;background:${isPrice ? "#059669" : isOpen === false ? "#ef4444" : "#059669"};border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,.25)"></div>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

function FitBounds({ pharmacies }: { pharmacies: MapPharmacy[] }) {
  const map = useMap();
  useEffect(() => {
    if (!pharmacies.length || !map) return;
    const points = pharmacies.filter((p) => p.lat && p.lng);
    if (!points.length) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15);
    } else {
      map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])), {
        padding: [40, 40],
      });
    }
  }, [pharmacies, map]);
  return null;
}

function LocateButton() {
  const map = useMap();
  const locate = () => {
    if (!navigator.geolocation || !map) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 14);
        L.popup()
          .setLatLng([pos.coords.latitude, pos.coords.longitude])
          .setContent('<div style="font-size:12px;font-weight:600">📍 Sizning joylashuvingiz</div>')
          .openOn(map);
      },
      () => {}
    );
  };
  return (
    <button
      onClick={locate}
      className="absolute top-3 right-3 z-[1000] w-9 h-9 rounded-lg bg-white shadow-md border border-border flex items-center justify-center hover:scale-105 transition-transform"
      title="My location"
      aria-label="My location"
    >
      <Navigation className="w-4 h-4 text-primary" />
    </button>
  );
}

export default function PharmacyMap({
  pharmacies,
  height = "100%",
  className = "",
  center = [41.2995, 69.2401],
  zoom = 12,
  showLocateButton = true,
  showDirections = true,
}: PharmacyMapProps) {
  const hasCoords = pharmacies.some((p) => p.lat && p.lng);
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border/50 ${className}`} style={{ height, minHeight: 200 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {hasCoords && (
          <>
            <FitBounds pharmacies={pharmacies} />
            {pharmacies
              .filter((p) => p.lat && p.lng)
              .map((p) =>
                p.price !== undefined ? (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(p.isOpen, true)}>
                    <Popup>
                      <div className="text-xs min-w-[160px]">
                        <p className="font-bold text-[13px] mb-0.5">{p.name}</p>
                        <p className="text-muted-foreground mb-1">{p.address}</p>
                        {p.formatPrice && (
                          <p className="font-semibold text-primary mb-1">{p.formatPrice}</p>
                        )}
                        {showDirections && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <Navigation className="w-3 h-3" /> Route
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ) : (
                  <CircleMarker
                    key={p.id}
                    center={[p.lat, p.lng]}
                    radius={9}
                    pathOptions={{ color: "#ffffff", weight: 2, fillColor: p.isOpen === false ? "#ef4444" : "#059669", fillOpacity: 0.9 }}
                  >
                    <Popup>
                      <div className="text-xs min-w-[160px]">
                        <p className="font-bold text-[13px] mb-0.5">{p.name}</p>
                        <p className="text-muted-foreground mb-1">
                          {p.address}
                          {p.city ? `, ${p.city}` : ""}
                        </p>
                        {p.phone && (
                          <p className="flex items-center gap-1 mb-1">
                            <Phone className="w-3 h-3" /> {p.phone}
                          </p>
                        )}
                        {p.deliveryTime && (
                          <p className="text-muted-foreground mb-1">🚚 {p.deliveryTime}</p>
                        )}
                        {showDirections && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <Navigation className="w-3 h-3" /> Route
                          </a>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              )}
          </>
        )}
      </MapContainer>
      {showLocateButton && <LocateButton />}
    </div>
  );
}
