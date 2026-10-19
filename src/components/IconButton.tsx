import { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, spacing } from "@/constants/theme";

/** Nom d'une icône Ionicons (ex. "trash-outline") */
export type IconName = ComponentProps<typeof Ionicons>["name"];

type IconButtonProps = {
  icon: IconName;
  /** Texte lu par les lecteurs d'écran (l'icône seule n'est pas compréhensible) */
  label: string;
  onPress: () => void;
  color?: string;
  size?: number;
};

/** Petit bouton composé uniquement d'une icône (modifier, supprimer, fermer, retour…) */
export function IconButton({ icon, label, onPress, color = colors.textSecondary, size = 22 }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8} // agrandit la zone tactile autour de la petite icône
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: spacing.xs },
  pressed: { opacity: 0.5 },
});
