import type { EventCategory } from "@/types/event";

/** Libellé affiché pour chaque catégorie */
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  conference: "Conférence",
  atelier: "Atelier",
  sortie: "Sortie",
};

/** Liste des catégories, dans l'ordre d'affichage (filtres et formulaire) */
export const CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[];
