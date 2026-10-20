import { Alert } from "react-native";
import { t } from "@/i18n";

/** Demande une confirmation avant de supprimer un événement */
export function confirmDelete(eventTitle: string, onConfirm: () => void) {
  Alert.alert(t("events.deleteConfirm.title"), t("events.deleteConfirm.message", { title: eventTitle }), [
    { text: t("common.cancel"), style: "cancel" },
    { text: t("events.deleteConfirm.confirm"), style: "destructive", onPress: onConfirm },
  ]);
}

/** Affiche le message d'une erreur levée par un contexte (ex. échec d'enregistrement) */
export function showError(error: unknown) {
  const message = error instanceof Error ? error.message : t("common.unknownError");
  Alert.alert(t("common.errorTitle"), message);
}
