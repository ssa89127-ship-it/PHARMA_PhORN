"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Clock, Truck } from "lucide-react";

function createIcon(color: string, label?: string) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center">
      <div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>
      ${label ? `<div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:${color};color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;white-space:nowrap;font-weight:600">${label}</div>` : ""}
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const pharmacyIcon = createIcon("#059669", "Dorixona");
const courierIcon = createIcon("#f97316", "Kuryer");
const destinationIcon = createIcon("#ef4444", "Manzil");

function FlyTo({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position && map) {
      map.flyTo(position, 15, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

interface DeliveryMapProps {
  pharmacyCoords: [number, number];
  destinationCoords: [number, number];
  courierCoords?: [number, number];
  pharmacyName?: string;
  destinationAddress?: string;
  height?: string;
  className?: string;
}

export default function DeliveryMap({
  pharmacyCoords,
  destinationCoords,
  courierCoords,
  pharmacyName = "Dorixona",
  destinationAddress = "Manzil",
  height = "100%",
  className = "",
}: DeliveryMapProps) {
  const [livePosition, setLivePosition] = useState<[number, number] | null>(courierCoords || null);

  useEffect(() => {
    if (courierCoords) {
      setLivePosition(courierCoords);
      return;
    }

    if (!pharmacyCoords || !destinationCoords) return;

    const steps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps) {
        clearInterval(interval);
        return;
      }
      const t = step / steps;
      const lat = pharmacyCoords[0] + (destinationCoords[0] - pharmacyCoords[0]) * t;
      const lng = pharmacyCoords[1] + (destinationCoords[1] - pharmacyCoords[1]) * t;
      setLivePosition([lat, lng]);
    }, 2000);

    return () => clearInterval(interval);
  }, [courierCoords, pharmacyCoords, destinationCoords]);

  const center: [number, number] = livePosition || pharmacyCoords || [41.2995, 69.2401];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border/50 ${className}`} style={{ height, minHeight: 300 }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {pharmacyCoords && (
          <Marker position={pharmacyCoords} icon={pharmacyIcon}>
            <Popup>
              <div className="text-xs min-w-[140px]">
                <p className="font-bold text-[13px] mb-0.5">{pharmacyName}</p>
                <p className="text-muted-foreground">Dorixona joylashuvi</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacyCoords[0]},${pharmacyCoords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
                >
                  <Navigation className="w-3 h-3" /> Yo'nalish
                </a>
              </div>
            </Popup>
          </Marker>
        )}

        {destinationCoords && (
          <Marker position={destinationCoords} icon={destinationIcon}>
            <Popup>
              <div className="text-xs min-w-[140px]">
                <p className="font-bold text-[13px] mb-0.5">{destinationAddress}</p>
                <p className="text-muted-foreground">Yetkazib berish manzili</p>
              </div>
            </Popup>
          </Marker>
        )}

        {livePosition && (
          <Marker position={livePosition} icon={courierIcon}>
            <Popup>
              <div className="text-xs min-w-[140px]">
                <p className="font-bold text-[13px] mb-0.5 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Kuryer
                </p>
                <p className="text-muted-foreground">Hozirgi joylashuv</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxminiy yetib kelish: 15-20 daqiqa
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {pharmacyCoords && destinationCoords && (
          <Polyline
            positions={[pharmacyCoords, destinationCoords]}
            pathOptions={{ color: "#059669", weight: 3, dashArray: "8,8", opacity: 0.7 }}
          />
        )}

        {livePosition && destinationCoords && (
          <Polyline
            positions={[livePosition, destinationCoords]}
            pathOptions={{ color: "#f97316", weight: 3, opacity: 0.9 }}
          />
        )}

        {livePosition && <FlyTo position={livePosition} />}
      </MapContainer>

      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-border/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-[11px] font-medium text-muted-foreground">
          {livePosition ? "Kuryer harakatlanmoqda..." : "Kuryer tayyorlanmoqda..."}
        </span>
      </div>
    </div>
  );
}
