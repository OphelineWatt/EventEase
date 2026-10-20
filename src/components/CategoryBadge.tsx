import { StyleSheet, Text, View } from "react-native";
import { getCategoryLabel } from "@/constants/categories";
import { categoryColors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import type { EventCategory } from "@/types/event";

/** Pastille colorée indiquant la catégorie d'un événement (« CONFÉRENCE », « ATELIER »…) */
export function CategoryBadge({ category }: { category: EventCategory }) {
  const palette = categoryColors[category];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <Text style={[styles.text, { color: palette.text }]}>{getCategoryLabel(category).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm / 2 },
  text: { fontFamily: fonts.bodyBold, fontSize: fontSize.xs - 1, letterSpacing: 1 },
});
