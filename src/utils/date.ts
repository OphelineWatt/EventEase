import { i18n } from "@/i18n";

/**
 * Fonctions d'affichage des dates dans la langue de l'application.
 * Les dates sont stockées au format ISO (texte) : on les convertit en Date uniquement pour l'affichage.
 */

/** Une date ISO (comme dans Event.date) ou un objet Date (comme dans le formulaire) */
type DateLike = string | Date;

function toDate(value: DateLike): Date {
  return typeof value === "string" ? new Date(value) : value;
}

/** Jour du mois : "22" */
export function formatDay(value: DateLike): string {
  return toDate(value).toLocaleDateString(i18n.locale, { day: "numeric" });
}

/** Mois abrégé en majuscules : "OCT." */
export function formatMonthShort(value: DateLike): string {
  return toDate(value).toLocaleDateString(i18n.locale, { month: "short" }).toUpperCase();
}

/** Heure : "18:30" */
export function formatTime(value: DateLike): string {
  return toDate(value).toLocaleTimeString(i18n.locale, { hour: "2-digit", minute: "2-digit" });
}

/** Date courte : "22/10/2026" */
export function formatShortDate(value: DateLike): string {
  return toDate(value).toLocaleDateString(i18n.locale);
}

/** Date complète avec majuscule : "Jeudi 22 octobre 2026" */
export function formatLongDate(value: DateLike): string {
  const text = toDate(value).toLocaleDateString(i18n.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return capitalize(text);
}

/** Met la première lettre en majuscule : "octobre" → "Octobre" */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Les 12 mois dans la langue de l'app : ["Janvier", "Février", …] ou ["January", …] */
export function getMonthNames(format: "long" | "short"): string[] {
  return Array.from({ length: 12 }, (_, month) =>
    capitalize(new Date(2024, month, 1).toLocaleDateString(i18n.locale, { month: format })),
  );
}

/** Les 7 jours, du dimanche au samedi : ["Dimanche", "Lundi", …] ou, en "narrow", ["D", "L", "M", …] */
export function getWeekdayNames(format: "long" | "narrow"): string[] {
  // Le 7 janvier 2024 était un dimanche : on part de ce jour et on avance d'un jour à chaque fois
  return Array.from({ length: 7 }, (_, day) =>
    capitalize(new Date(2024, 0, 7 + day).toLocaleDateString(i18n.locale, { weekday: format })),
  );
}

/** Nombre de jours entre aujourd'hui et la date : 0 = aujourd'hui, 1 = demain, -1 = hier */
export function daysFromToday(value: DateLike): number {
  const target = toDate(value);
  const now = new Date();
  // On compare des jours entiers (à minuit), pas des heures
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Math.round absorbe les journées de 23 h / 25 h des changements d'heure
  return Math.round((targetDay.getTime() - today.getTime()) / 86_400_000);
}

/** Date proposée par défaut pour un nouvel événement : demain à 18h00 */
export function getDefaultEventDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(18, 0, 0, 0);
  return date;
}
