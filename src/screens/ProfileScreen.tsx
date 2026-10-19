import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

/** Profil du membre connecté (contenu temporaire) */
export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>
      <Text style={styles.text}>Connecté en tant que {user?.name}</Text>
      <Button title="Se déconnecter" variant="outline" onPress={logout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
  text: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
});
