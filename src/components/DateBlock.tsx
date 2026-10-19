import { StyleSheet, Text, View } from "react-native";
import { categoryColors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { formatDay, formatMonthShort } from "@/utils/date";
import type { EventCategory } from "@/types/event";

type DateBlockProps = {
  /** Date ISO de l'événement */
  date: string;
  /** La couleur du bloc dépend de la catégorie */
  category: EventCategory;
};

/** Bloc « 22 / OCT. » affiché à gauche des cartes d'événement */
export function DateBlock({ date, category }: DateBlockProps) {
  const palette = categoryColors[category];

  return (
    <View style={[styles.block, { backgroundColor: palette.background, borderTopColor: palette.text }]}>
      <Text style={[styles.day, { color: palette.text }]}>{formatDay(date)}</Text>
      <Text style={[styles.month, { color: palette.text }]}>{formatMonthShort(date)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: 56,
    paddingVertical: spacing.sm,
    borderTopWidth: 3,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  day: { fontFamily: fonts.title, fontSize: fontSize.lg },
  month: { fontFamily: fonts.bodyBold, fontSize: fontSize.xs },
});
