import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import type { RootStackScreenProps } from "@/navigation/types";

/** Écran d'inscription (contenu temporaire pour tester la navigation) */
export function RegisterScreen({ navigation }: RootStackScreenProps<"Register">) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <Button title="Déjà membre ? Se connecter" variant="link" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
});
