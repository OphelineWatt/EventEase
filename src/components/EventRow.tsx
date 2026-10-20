import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { categoryColors, colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { t } from "@/i18n";
import { formatDay, formatMonthShort, formatTime } from "@/utils/date";
import type { Event } from "@/types/event";

type EventRowProps = {
  event: Event;
  onPress: () => void;
};

/** Ligne compacte d'un événement (liste sous le calendrier, participations du profil) */
export function EventRow({ event, onPress }: EventRowProps) {
  const palette = categoryColors[event.category];
  // "18:30 · Théâtre des Célestins" (le lieu est facultatif)
  const details = [formatTime(event.date), event.location?.address].filter(Boolean).join(" · ");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("events.card.open", { title: event.title })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.day, { backgroundColor: palette.background }]}>
        <Text style={[styles.dayText, { color: palette.text }]}>{formatDay(event.date)}</Text>
        <Text style={[styles.monthText, { color: palette.text }]}>{formatMonthShort(event.date)}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.details} numberOfLines={1}>
          {details}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pressed: { opacity: 0.85 },
  day: { width: 48, paddingVertical: spacing.xs, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  dayText: { fontFamily: fonts.title, fontSize: fontSize.lg },
  monthText: { fontFamily: fonts.bodyBold, fontSize: fontSize.xs - 1 },
  texts: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.text },
  details: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary },
});
