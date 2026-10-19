import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import type { RootStackScreenProps } from "@/navigation/types";

/** Formulaire de création / modification (contenu temporaire pour tester la navigation) */
export function EventFormScreen({ navigation, route }: RootStackScreenProps<"EventForm">) {
  // Pas d'eventId = création ; avec eventId = modification
  const eventId = route.params?.eventId;

  return (
    // View simple (pas de SafeAreaView) : l'écran est affiché dans une feuille, sous la barre d'état
    <View style={styles.container}>
      <Text style={styles.title}>{eventId ? "Modifier l’événement" : "Nouvel événement"}</Text>
      <Button title="Fermer" variant="link" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
});
