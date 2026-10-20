import { Linking, Platform } from "react-native";
import type { EventLocation } from "@/types/event";

/**
 * Ouvre l'itinéraire vers le lieu dans l'application de cartes du téléphone
 * (Plans sur iPhone, Google Maps sur Android). Utilise les coordonnées GPS si on les a, sinon l'adresse.
 */
export function openDirections(location: EventLocation): Promise<void> {
  const destination =
    location.latitude !== undefined && location.longitude !== undefined
      ? `${location.latitude},${location.longitude}`
      : location.address;

  const url = Platform.select({
    ios: `https://maps.apple.com/?daddr=${encodeURIComponent(destination)}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
  });

  return Linking.openURL(url);
}
