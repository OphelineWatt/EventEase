import { i18n } from "@/i18n";
import type { Event } from "@/types/event";

/** Un point GPS (événement ou utilisateur) */
type Point = { latitude: number; longitude: number };

/** Rayon moyen de la Terre en kilomètres */
const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Distance « à vol d'oiseau » en kilomètres entre deux points GPS (formule de Haversine).
 * Elle tient compte de la courbure de la Terre, contrairement à un simple Pythagore sur les coordonnées.
 */
export function distanceInKm(from: Point, to: Point): number {
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Distance (km) entre l'utilisateur et un événement, ou undefined si l'un des deux n'a pas de position */
export function getEventDistance(event: Event, userCoords?: Point): number | undefined {
  const location = event.location;
  if (!userCoords || location?.latitude === undefined || location.longitude === undefined) {
    return undefined;
  }
  return distanceInKm(userCoords, { latitude: location.latitude, longitude: location.longitude });
}

/** Distance lisible dans la langue de l'app : "850 m", "2,3 km" (FR) / "2.3 km" (EN), "42 km" */
export function formatDistance(km: number): string {
  if (km < 1) {
    // En dessous d'un kilomètre : en mètres, arrondi à la dizaine
    return `${Math.round((km * 1000) / 10) * 10} m`;
  }
  // Une décimale sous 10 km, aucune au-delà (la précision du GPS ne justifie pas plus)
  const value = km.toLocaleString(i18n.locale, { maximumFractionDigits: km < 10 ? 1 : 0 });
  return `${value} km`;
}
