/**
 * Lieu associé à un événement (bonus géolocalisation).
 * Les coordonnées sont optionnelles : elles seront remplies par géocodage de l'adresse.
 */
export type EventLocation = {
  /** Adresse saisie par l'utilisateur, ex. "10 rue de Rivoli, Paris" */
  address: string;
  latitude?: number;
  longitude?: number;
};

/** Catégories proposées par l'association */
export type EventCategory = "conference" | "atelier" | "sortie";

/** Un événement organisé par l'association. */
export type Event = {
  /** Identifiant unique généré localement (pas de backend) */
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  /** Date au format ISO (ex. "2026-10-22T18:00:00.000Z"), sérialisable en JSON */
  date: string;
  /** Emails des membres qui participent à l'événement */
  participants: string[];
  /** Email du membre qui a créé l'événement */
  createdBy: string;
  /** Lieu optionnel (bonus) */
  location?: EventLocation;
};

/** Données saisies dans le formulaire (l'id, les participants et le créateur sont gérés automatiquement). */
export type EventInput = Omit<Event, "id" | "participants" | "createdBy">;
