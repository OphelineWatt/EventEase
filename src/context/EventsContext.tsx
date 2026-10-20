import { createContext, ReactNode, useEffect, useState } from "react";
import { getEvents, saveEvents } from "@/services/storage";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/i18n";
import type { Event, EventInput } from "@/types/event";

/** Ce que le contexte des événements met à disposition de toute l'application */
export type EventsContextValue = {
  /** Tous les événements, triés du plus proche au plus lointain */
  events: Event[];
  /** true pendant le chargement initial depuis le stockage */
  isLoading: boolean;
  /** Retrouve un événement par son identifiant (undefined s'il n'existe plus) */
  getEventById: (id: string) => Event | undefined;
  /** Crée un événement à partir des champs du formulaire et renvoie l'événement créé */
  addEvent: (input: EventInput) => Promise<Event>;
  /** Remplace les champs modifiables d'un événement existant */
  updateEvent: (id: string, input: EventInput) => Promise<void>;
  /** Supprime définitivement un événement */
  deleteEvent: (id: string) => Promise<void>;
  /** Ajoute l'utilisateur connecté aux participants, ou l'en retire s'il y est déjà */
  toggleParticipation: (id: string) => Promise<void>;
};

/** Le contexte vaut null tant qu'aucun EventsProvider ne l'a rempli */
export const EventsContext = createContext<EventsContextValue | null>(null);

/** Génère un identifiant unique sans serveur : horodatage + partie aléatoire (ex. "mgx3k2p1-4f9a2c") */
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Trie les événements du plus proche au plus lointain (sans modifier le tableau reçu) */
function sortByDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

/** Fournit la liste des événements et les actions du CRUD à tous les composants enfants */
export function EventsProvider({ children }: { children: ReactNode }) {
  // Utilisateur connecté : nécessaire pour savoir qui crée un événement ou y participe
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage : chargement des événements enregistrés sur le téléphone
  useEffect(() => {
    getEvents().then((stored) => {
      setEvents(sortByDate(stored));
      setIsLoading(false);
    });
  }, []);

  /**
   * Enregistre une nouvelle version de la liste : d'abord dans le stockage, puis dans l'état.
   * Toutes les actions du CRUD passeront par cette fonction.
   */
  async function persist(next: Event[]) {
    const sorted = sortByDate(next);
    await saveEvents(sorted);
    setEvents(sorted);
  }

  function getEventById(id: string) {
    return events.find((e) => e.id === id);
  }

  /** Création : complète les champs du formulaire puis enregistre le nouvel événement */
  async function addEvent(input: EventInput): Promise<Event> {
    if (!user) throw new Error(t("events.errors.loginRequiredToCreate"));

    const newEvent: Event = {
      ...input,
      id: generateId(),
      participants: [],
      createdBy: user.email,
    };
    await persist([...events, newEvent]);
    return newEvent;
  }

  /** Modification : remplace les champs du formulaire, en conservant id, participants et créateur */
  async function updateEvent(id: string, input: EventInput) {
    if (!events.some((e) => e.id === id)) {
      throw new Error(t("events.notFound"));
    }

    await persist(
      events.map((e) =>
        e.id === id
          ? // location est réécrit explicitement : si le lieu a été effacé, il doit disparaître
            { ...e, ...input, location: input.location }
          : e,
      ),
    );
  }

  /** Suppression : retire définitivement l'événement de la liste */
  async function deleteEvent(id: string) {
    await persist(events.filter((e) => e.id !== id));
  }

  /** Participation : ajoute ou retire l'utilisateur connecté de la liste des participants */
  async function toggleParticipation(id: string) {
    if (!user) throw new Error(t("events.errors.loginRequiredToParticipate"));

    await persist(
      events.map((e) => {
        if (e.id !== id) return e;

        const isParticipating = e.participants.includes(user.email);
        return {
          ...e,
          participants: isParticipating
            ? e.participants.filter((email) => email !== user.email) // on se retire
            : [...e.participants, user.email], // on s'ajoute
        };
      }),
    );
  }

  return (
    <EventsContext
      value={{ events, isLoading, getEventById, addEvent, updateEvent, deleteEvent, toggleParticipation }}
    >
      {children}
    </EventsContext>
  );
}
