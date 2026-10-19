import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import type { RootStackScreenProps } from "@/navigation/types";

/** Écran de connexion (contenu temporaire pour tester la navigation) */
export function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Button title="Se connecter (test)" onPress={() => navigation.replace("MainTabs", { screen: "Events" })} />
      <Button title="Créer un compte" variant="link" onPress={() => navigation.navigate("Register")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
});
