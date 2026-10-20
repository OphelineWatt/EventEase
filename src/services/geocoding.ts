import { t } from "@/i18n";

/**
 * Service de géocodage de la Géoplateforme (IGN), qui remplace l'ancienne « API Adresse » du gouvernement.
 * Gratuit, sans clé d'API, limité à 50 requêtes par seconde.
 */
const GEOCODING_URL = "https://data.geopf.fr/geocodage/search";

/** Nombre minimal de caractères exigé par l'API */
export const MIN_QUERY_LENGTH = 3;

/** Une adresse proposée à l'utilisateur */
export type AddressSuggestion = {
  /** Texte complet, ex. "4 Rue Charles Dullin 69002 Lyon" */
  label: string;
  latitude: number;
  longitude: number;
};

/** Forme (simplifiée) de la réponse GeoJSON : on ne décrit que les champs utilisés */
type GeocodingResponse = {
  features: {
    geometry: { coordinates: [number, number] }; // ⚠️ ordre GeoJSON : [longitude, latitude]
    properties: { label: string };
  }[];
};

/**
 * Recherche les adresses françaises qui correspondent au texte saisi.
 * @param signal permet d'annuler la requête si l'utilisateur continue à taper
 */
export async function searchAddresses(query: string, signal?: AbortSignal): Promise<AddressSuggestion[]> {
  const text = query.trim();
  if (text.length < MIN_QUERY_LENGTH) return [];

  const params = new URLSearchParams({ q: text, limit: "5", autocomplete: "1" });
  const response = await fetch(`${GEOCODING_URL}?${params}`, { signal });

  if (!response.ok) {
    throw new Error(t("location.errors.searchFailed"));
  }

  const data: GeocodingResponse = await response.json();
  return data.features.map((feature) => ({
    label: feature.properties.label,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }));
}
