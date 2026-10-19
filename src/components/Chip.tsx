import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Puce sélectionnable (filtres « Tous / Conférence… » et choix de la catégorie) */
export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { opacity: 0.8 },
  text: { fontFamily: fonts.bodyBold, fontSize: fontSize.sm, color: colors.text },
  textSelected: { color: colors.textOnPrimary },
});
