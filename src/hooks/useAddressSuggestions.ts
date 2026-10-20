import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { AddressSuggestion, MIN_QUERY_LENGTH, searchAddresses } from "@/services/geocoding";

/** Délai d'attente après la dernière frappe avant d'interroger l'API */
const DEBOUNCE_MS = 350;

/**
 * Suggestions d'adresses pour le texte saisi, mises à jour pendant la frappe.
 * @param enabled false pour ne rien chercher (par exemple quand une adresse vient d'être choisie)
 */
export function useAddressSuggestions(query: string, enabled: boolean) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // La recherche n'a de sens qu'avec au moins 3 caractères (exigence de l'API)
  const active = enabled && query.trim().length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!active) return;

    const controller = new AbortController();

    // On attend une pause dans la frappe avant d'appeler l'API (debounce)
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        setSuggestions(await searchAddresses(query, controller.signal));
        setError(undefined);
      } catch {
        // Requête annulée : une recherche plus récente l'a remplacée, ce n'est pas une erreur
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setError(t("location.errors.searchFailed"));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    // Nettoyage à chaque nouvelle frappe : on annule le minuteur ET la requête éventuellement en cours
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, active]);

  // Quand la recherche est inactive, on n'affiche rien (sans effacer l'état pour autant)
  return {
    suggestions: active ? suggestions : [],
    isLoading: active && isLoading,
    error: active ? error : undefined,
  };
}
