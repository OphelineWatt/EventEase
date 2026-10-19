import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

type ScreenTitleProps = {
  /** Petit titre en majuscules au-dessus (ex. « BIENVENUE ») */
  kicker?: string;
  title: string;
  subtitle?: string;
};

/** Bloc de titre réutilisé en haut des écrans */
export function ScreenTitle({ kicker, title, subtitle }: ScreenTitleProps) {
  return (
    <View style={styles.container}>
      {kicker && <Text style={styles.kicker}>{kicker.toUpperCase()}</Text>}
      <Text style={styles.title} accessibilityRole="header">{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  kicker: { fontFamily: fonts.bodyBold, fontSize: fontSize.xs, letterSpacing: 2, color: colors.primary },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
});
