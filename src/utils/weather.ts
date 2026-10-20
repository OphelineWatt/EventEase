import type { IconName } from "@/components/IconButton";
import { t } from "@/i18n";

/** Les 8 situations météo affichées dans l'app */
type WeatherCondition = "clear" | "partlyCloudy" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

/**
 * Regroupe les codes météo WMO (une trentaine) en 8 situations simples.
 * Référence des codes : documentation d'Open-Meteo, section « WMO Weather interpretation codes ».
 */
function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code <= 2) return "partlyCloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy"; // code inconnu : on affiche une valeur neutre plutôt que rien
}

/** Icône Ionicons de chaque situation */
const WEATHER_ICONS: Record<WeatherCondition, IconName> = {
  clear: "sunny-outline",
  partlyCloudy: "partly-sunny-outline",
  cloudy: "cloud-outline",
  fog: "cloudy-outline",
  drizzle: "rainy-outline",
  rain: "rainy-outline",
  snow: "snow-outline",
  storm: "thunderstorm-outline",
};

/** Icône à afficher pour un code WMO */
export function getWeatherIcon(code: number): IconName {
  return WEATHER_ICONS[getWeatherCondition(code)];
}

/** Libellé traduit pour un code WMO : "Pluie" / "Rain" */
export function getWeatherLabel(code: number): string {
  return t(`weather.conditions.${getWeatherCondition(code)}`);
}
