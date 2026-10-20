import { t } from "@/i18n";
import type { EventCategory } from "@/types/event";

/** Liste des catégories, dans l'ordre d'affichage (filtres et formulaire) */
export const CATEGORIES: EventCategory[] = ["conference", "atelier", "sortie"];

/**
 * Libellé traduit d'une catégorie : getCategoryLabel("atelier") → "Atelier" / "Workshop".
 * On stocke le code ("atelier"), on ne traduit qu'à l'affichage.
 */
export function getCategoryLabel(category: EventCategory): string {
  return t(`categories.${category}`);
}
