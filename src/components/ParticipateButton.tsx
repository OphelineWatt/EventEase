import { Pressable, StyleSheet, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { t } from "@/i18n";

type ParticipateButtonProps = {
  /** true si l'utilisateur connecté participe déjà */
  active: boolean;
  onPress: () => void;
};

/** Bouton bascule « Participer » / « Je participe » (vert quand on participe) */
export function ParticipateButton({ active, onPress }: ParticipateButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.base, active && styles.active, pressed && styles.pressed]}
    >
      <Ionicons
        name={active ? "checkmark-circle" : "checkmark-circle-outline"}
        size={20}
        color={active ? colors.textOnPrimary : colors.text}
      />
      <Text style={[styles.text, active && styles.textActive]}>{active ? t("events.participate.joined") : t("events.participate.join")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  active: { backgroundColor: colors.success, borderColor: colors.success },
  pressed: { opacity: 0.8 },
  text: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.text },
  textActive: { color: colors.textOnPrimary },
});
