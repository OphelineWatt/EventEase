import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import type { RootStackScreenProps } from "@/navigation/types";

/** Détail d'un événement (contenu temporaire pour tester la navigation) */
export function EventDetailScreen({ navigation, route }: RootStackScreenProps<"EventDetail">) {
  const { eventId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Détail de l’événement</Text>
      <Text style={styles.text}>id reçu : {eventId}</Text>
      <Button title="Modifier" variant="outline" onPress={() => navigation.navigate("EventForm", { eventId })} />
      <Button title="Retour" variant="link" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
  text: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
});
