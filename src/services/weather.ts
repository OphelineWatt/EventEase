import { t } from "@/i18n";

/** API de prévisions Open-Meteo : gratuite, sans clé d'API */
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/** Nombre de jours à l'avance pour lesquels l'API fournit une prévision */
export const FORECAST_DAYS = 15;

/** Météo d'une journée, déjà simplifiée pour l'affichage */
export type DailyWeather = {
  /** Code météo international WMO (0 = ciel dégagé, 61 = pluie faible…) */
  code: number;
  minTemperature: number;
  maxTemperature: number;
  /** Risque de pluie maximal sur la journée, en % */
  precipitationProbability: number;
};

/** Forme (simplifiée) de la réponse : une liste de valeurs par jour (ici un seul jour) */
type ForecastResponse = {
  daily: {
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

/**
 * Prévision météo d'une journée à un endroit.
 * @param day jour au format "AAAA-MM-JJ" (calculé avec toDateKey, dans le fuseau du téléphone)
 * @param signal permet d'annuler la requête si l'utilisateur quitte l'écran
 */
export async function getDailyForecast(
  latitude: number,
  longitude: number,
  day: string,
  signal?: AbortSignal,
): Promise<DailyWeather> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto", // les journées sont découpées selon le fuseau horaire du lieu
    start_date: day,
    end_date: day,
  });

  const response = await fetch(`${FORECAST_URL}?${params}`, { signal });
  if (!response.ok) {
    throw new Error(t("weather.errors.unavailable"));
  }

  const { daily }: ForecastResponse = await response.json();
  return {
    code: daily.weather_code[0],
    minTemperature: Math.round(daily.temperature_2m_min[0]),
    maxTemperature: Math.round(daily.temperature_2m_max[0]),
    precipitationProbability: daily.precipitation_probability_max[0],
  };
}
