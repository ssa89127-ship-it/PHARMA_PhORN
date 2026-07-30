/**
 * Google Maps integration placeholder.
 * Replace with actual Google Maps API key in production.
 */

export const mapsConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  defaultCenter: { lat: 41.2995, lng: 69.2401 },
  defaultZoom: 12,
  language: "uz",
  region: "UZ",
};

export interface MapLocation {
  lat: number;
  lng: number;
  address: string;
  name: string;
}

export async function getDirections(origin: MapLocation, destination: MapLocation) {
  // Placeholder: In production, call Google Maps Directions API
  console.log("[Maps Placeholder] Getting directions from", origin.name, "to", destination.name);
  return {
    distance: `${(Math.random() * 10 + 1).toFixed(1)} km`,
    duration: `${Math.floor(Math.random() * 30 + 10)} min`,
    polyline: "",
  };
}

export async function searchPlaces(query: string) {
  // Placeholder: In production, call Google Maps Places API
  console.log("[Maps Placeholder] Searching places:", query);
  return [];
}

export function getMapEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/embed/v1/place?key=${mapsConfig.apiKey}&q=${lat},${lng}&language=uz`;
}
