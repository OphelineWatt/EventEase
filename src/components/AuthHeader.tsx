import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "./Logo";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { t } from "@/i18n";

/** Nombre de plis dessinés dans le rideau */
const FOLDS = 12;

/** Bandeau « rideau de théâtre » en haut des écrans de connexion et d'inscription */
export function AuthHeader() {
  // Marge de sécurité en haut (encoche, barre d'état)
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      {/* Plis du rideau : bandes verticales foncé → clair → foncé */}
      <View style={styles.folds}>
        {Array.from({ length: FOLDS }, (_, i) => (
          <LinearGradient
            key={i}
            colors={[colors.primaryDark, colors.curtainLight, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fold}
          />
        ))}
      </View>
      {/* Voile sombre en bas pour que le texte reste lisible */}
      <LinearGradient colors={["transparent", colors.overlay]} style={StyleSheet.absoluteFill} />

      <Logo />
      <View style={styles.texts}>
        <Text style={styles.kicker}>{t("auth.header.kicker").toUpperCase()}</Text>
        <Text style={styles.title}>{t("common.appName")}</Text>
        <Text style={styles.subtitle}>{t("auth.header.tagline")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 300, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, justifyContent: "space-between", overflow: "hidden" },
  folds: { ...StyleSheet.absoluteFill, flexDirection: "row" },
  fold: { flex: 1 },
  texts: { gap: spacing.xs },
  kicker: { fontFamily: fonts.bodyBold, fontSize: fontSize.xs, letterSpacing: 2, color: colors.accent },
  title: { fontFamily: fonts.title, fontSize: fontSize.xxl, color: colors.textOnPrimary },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textOnPrimary },
});
