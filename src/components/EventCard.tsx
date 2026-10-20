import { Pressable, StyleSheet, Text, View } from "react-native";
import { CategoryBadge } from "./CategoryBadge";
import { DateBlock } from "./DateBlock";
import { IconButton } from "./IconButton";
import { InfoRow } from "./InfoRow";
import { ParticipateButton } from "./ParticipateButton";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { t } from "@/i18n";
import { formatTime } from "@/utils/date";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  /** true si l'utilisateur connecté participe à cet événement */
  isParticipating: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleParticipation: () => void;
};

/**
 * Carte d'un événement dans la liste « À l'affiche ».
 * Composant d'affichage uniquement : toutes les actions sont fournies par l'écran parent.
 */
export function EventCard({ event, isParticipating, onPress, onEdit, onDelete, onToggleParticipation }: EventCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("events.card.open", { title: event.title })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <DateBlock date={event.date} category={event.category} />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <CategoryBadge category={event.category} />
            <View style={styles.actions}>
              <IconButton icon="create-outline" label={t("events.card.edit")} onPress={onEdit} />
              <IconButton icon="trash-outline" label={t("events.card.delete")} onPress={onDelete} />
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>

          <InfoRow icon="time-outline" text={formatTime(event.date)} />
          {event.location && <InfoRow icon="location-outline" text={event.location.address} />}
        </View>
      </View>

      <ParticipateButton active={isParticipating} onPress={onToggleParticipation} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pressed: { opacity: 0.9 },
  row: { flexDirection: "row", gap: spacing.md },
  content: { flex: 1, gap: spacing.xs + 2 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  actions: { flexDirection: "row", gap: spacing.xs },
  title: { fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.text },
  description: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary },
});
