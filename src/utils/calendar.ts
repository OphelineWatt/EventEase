import type { CalendarProps } from "react-native-calendars";
import { colors } from "@/constants/theme";
import type { Event } from "@/types/event";

/** Format attendu par le calendrier : { "2026-10-22": { marked: true, … }, … } */
type MarkedDates = NonNullable<CalendarProps["markedDates"]>;

/**
 * Clé de jour "AAAA-MM-JJ" dans le fuseau horaire du téléphone.
 * ⚠️ On ne peut pas simplement couper la date ISO (iso.slice(0, 10)), car elle est en heure UTC :
 * un événement le 22 octobre à 0h30 à Paris correspond au 21 octobre à 22h30 en UTC.
 */
export function toDateKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() commence à 0 (janvier)
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Inverse de toDateKey : "2026-10-22" → Date du 22 octobre à minuit, heure du téléphone */
export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Clé de mois "AAAA-MM" : sert à ne garder que les événements du mois affiché */
export function toMonthKey(value: string | Date): string {
  return toDateKey(value).slice(0, 7);
}

/**
 * Construit les marquages du calendrier :
 * - un point doré sous chaque jour qui a au moins un événement ;
 * - un rond bordeaux sur le jour sélectionné (s'il y en a un).
 */
export function buildMarkedDates(events: Event[], selectedDay?: string): MarkedDates {
  const marked: MarkedDates = {};

  for (const event of events) {
    marked[toDateKey(event.date)] = { marked: true, dotColor: colors.accent };
  }

  if (selectedDay) {
    // On garde le point éventuel du jour et on ajoute la sélection par-dessus
    marked[selectedDay] = { ...marked[selectedDay], selected: true, selectedColor: colors.primary };
  }

  return marked;
}
