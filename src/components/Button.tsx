import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  /** primary = fond bordeaux, outline = fond blanc bordé, link = simple texte */
  variant?: "primary" | "outline" | "link";
  /** Icône facultative affichée à côté du texte */
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

/** Bouton réutilisable de l'application, aux couleurs du thème. */
export function Button({ title, onPress, variant = "primary", icon, loading, disabled }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.textOnPrimary : colors.primary} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, variant === "primary" ? styles.textPrimary : styles.textDark]}>
            {title}
          </Text>
          {icon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52, // zone tactile confortable (accessibilité)
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
    // Ombre douce sous le bouton principal
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  outline: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  link: {
    backgroundColor: "transparent",
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  text: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  textPrimary: { color: colors.textOnPrimary },
  textDark: { color: colors.primary },
});
