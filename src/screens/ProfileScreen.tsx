import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import type { MainTabScreenProps } from "@/navigation/types";

/** Profil du membre connecté (contenu temporaire pour tester la navigation) */
export function ProfileScreen({ navigation }: MainTabScreenProps<"Profile">) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>
      <Button title="Se déconnecter (test)" variant="outline" onPress={() => navigation.replace("Login")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
});
