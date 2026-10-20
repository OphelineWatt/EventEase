import { useEffect, useState } from "react";
import { DailyWeather, FORECAST_DAYS, getDailyForecast } from "@/services/weather";
import { toDateKey } from "@/utils/calendar";
import { daysFromToday } from "@/utils/date";
import type { Event } from "@/types/event";

/** Ce que l'écran doit afficher pour la météo d'un événement */
export type WeatherState =
  | { status: "hidden" } // pas de coordonnées, ou événement trop ancien : on n'affiche rien
  | { status: "tooFar" } // plus de 15 jours à l'avance : pas encore de prévision
  | { status: "loading" }
  | { status: "error" }
  | { status: "loaded"; weather: DailyWeather };

/** Nombre de jours passés pour lesquels l'API garde encore les données */
const PAST_DAYS_LIMIT = 90;

/** Météo prévue le jour d'un événement, à l'adresse de l'événement */
export function useEventWeather(event: Event | undefined): WeatherState {
  const latitude = event?.location?.latitude;
  const longitude = event?.location?.longitude;
  const day = event ? toDateKey(event.date) : undefined;
  const daysAhead = event ? daysFromToday(event.date) : 0;

  const hasCoords = latitude !== undefined && longitude !== undefined;
  const inRange = daysAhead <= FORECAST_DAYS && daysAhead >= -PAST_DAYS_LIMIT;

  // Clé de la requête : change si le lieu ou la date de l'événement est modifié
  const requestKey = hasCoords && inRange && day ? `${latitude},${longitude},${day}` : undefined;

  // Dernier résultat reçu, associé à la clé de la requête qui l'a produit
  const [result, setResult] = useState<{ key: string; weather?: DailyWeather }>();

  useEffect(() => {
    if (!requestKey || latitude === undefined || longitude === undefined || !day) return;

    const controller = new AbortController();
    getDailyForecast(latitude, longitude, day, controller.signal)
      .then((weather) => setResult({ key: requestKey, weather }))
      .catch(() => {
        // Requête annulée (écran quitté) : rien à faire ; sinon on mémorise l'échec
        if (!controller.signal.aborted) setResult({ key: requestKey });
      });

    return () => controller.abort();
  }, [requestKey, latitude, longitude, day]);

  // L'état à afficher est déduit de la situation, sans état supplémentaire
  if (!hasCoords || daysAhead < -PAST_DAYS_LIMIT) return { status: "hidden" };
  if (daysAhead > FORECAST_DAYS) return { status: "tooFar" };
  // Pas encore de réponse, ou réponse d'une ancienne requête (lieu / date modifiés depuis)
  if (!result || result.key !== requestKey) return { status: "loading" };
  return result.weather ? { status: "loaded", weather: result.weather } : { status: "error" };
}
