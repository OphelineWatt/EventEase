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
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Date proposée par défaut pour un nouvel événement : demain à 18h00 */
export function getDefaultEventDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(18, 0, 0, 0);
  return date;
}
