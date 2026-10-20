import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/i18n";

/** Profil du membre connecté (contenu temporaire) */
export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("profile.title")}</Text>
      <Text style={styles.text}>{t("profile.loggedInAs", { name: user?.name ?? "" })}</Text>
      <Button title={t("profile.logout")} variant="outline" onPress={logout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, justifyContent: "center" },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
  text: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
});
