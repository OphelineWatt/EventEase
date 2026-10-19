import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { IconName } from "./IconButton";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

type InfoRowProps = {
  icon: IconName;
  text: string;
};

/** Ligne « icône dorée + texte » (heure, lieu, participants…) */
export function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={colors.accent} />
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2 },
  text: { flexShrink: 1, fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary },
});
