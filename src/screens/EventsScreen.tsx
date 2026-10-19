import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import type { MainTabScreenProps } from "@/navigation/types";

/** Liste des événements (contenu temporaire pour tester la navigation) */
export function EventsScreen({ navigation }: MainTabScreenProps<"Events">) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>À l’affiche</Text>
      <Button title="Voir un événement (test)" variant="outline" onPress={() => navigation.navigate("EventDetail", { eventId: "test" })} />
      <Button title="+ Nouvel événement" onPress={() => navigation.navigate("EventForm")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
});
