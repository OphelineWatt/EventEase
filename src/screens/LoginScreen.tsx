import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import type { RootStackScreenProps } from "@/navigation/types";

/** Écran de connexion (contenu temporaire, remplacé à l'étape 10) */
export function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const { login, register } = useAuth();

  // TEST (temporaire, remplacé à l'étape 10) : connexion au compte de test, créé s'il n'existe pas
  async function handleTestLogin() {
    try {
      await login("test@eventease.fr", "motdepasse");
    } catch {
      await register("Test", "test@eventease.fr", "motdepasse");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Button title="Se connecter (test)" onPress={handleTestLogin} />
      <Button title="Créer un compte" variant="link" onPress={() => navigation.navigate("Register")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
});
