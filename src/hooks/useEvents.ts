import { useContext } from "react";
import { EventsContext } from "@/context/EventsContext";

/**
 * Donne accès aux événements et aux actions du CRUD.
 * Exemple : const { events, addEvent } = useEvents();
 */
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents doit être utilisé à l'intérieur de <EventsProvider>");
  }
  return context;
}
