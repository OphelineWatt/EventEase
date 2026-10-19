import { Alert } from "react-native";

/** Demande une confirmation avant de supprimer un événement */
export function confirmDelete(eventTitle: string, onConfirm: () => void) {
  Alert.alert("Supprimer l’événement ?", `« ${eventTitle} » sera définitivement supprimé.`, [
    { text: "Annuler", style: "cancel" },
    { text: "Supprimer", style: "destructive", onPress: onConfirm },
  ]);
}

/** Affiche le message d'une erreur levée par un contexte (ex. échec d'enregistrement) */
export function showError(error: unknown) {
  const message = error instanceof Error ? error.message : "Une erreur est survenue.";
  Alert.alert("Oups", message);
}
