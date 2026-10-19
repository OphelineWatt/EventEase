import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { DateBlock } from "@/components/DateBlock";
import { IconButton } from "@/components/IconButton";
import { InfoRow } from "@/components/InfoRow";
import { ParticipateButton } from "@/components/ParticipateButton";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { confirmDelete, showError } from "@/utils/alerts";
import { formatLongDate, formatTime } from "@/utils/date";
import type { RootStackScreenProps } from "@/navigation/types";

/** Texte du nombre de participants, accordé au singulier / pluriel */
function formatParticipants(count: number): string {
  if (count === 0) return "Aucun participant pour l’instant";
  return count === 1 ? "1 participant" : `${count} participants`;
}

/** Détail d'un événement : informations complètes, participation, modification, suppression */
export function EventDetailScreen({ navigation, route }: RootStackScreenProps<"EventDetail">) {
  const { eventId } = route.params;
  const { user } = useAuth();
  const { getEventById, deleteEvent, toggleParticipation } = useEvents();

  // Relu à chaque affichage : l'écran se met à jour après une modification ou une participation
  const event = getEventById(eventId);

  // L'événement n'existe plus (supprimé) : on l'indique au lieu de planter
  if (!event) {
    return (
      <SafeAreaView style={[styles.flex, styles.container]}>
        <Text style={styles.description}>Cet événement n’existe plus.</Text>
        <Button title="Retour" variant="outline" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isParticipating = !!user && event.participants.includes(user.email);

  // Fonction fléchée (et non `function`) : TypeScript sait ainsi que `event` existe forcément ici
  const handleDelete = () => {
    confirmDelete(event.title, async () => {
      try {
        await deleteEvent(event.id);
        navigation.goBack();
      } catch (error) {
        showError(error);
      }
    });
  };

  return (
    <SafeAreaView style={styles.flex} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <IconButton icon="arrow-back" label="Retour" color={colors.text} onPress={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <DateBlock date={event.date} category={event.category} />
          <View style={styles.headerTexts}>
            <CategoryBadge category={event.category} />
            <Text style={styles.title} accessibilityRole="header">
              {event.title}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="calendar-outline" text={formatLongDate(event.date)} />
          <InfoRow icon="time-outline" text={formatTime(event.date)} />
          {event.location && <InfoRow icon="location-outline" text={event.location.address} />}
          <InfoRow icon="people-outline" text={formatParticipants(event.participants.length)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.actions}>
          <ParticipateButton
            active={isParticipating}
            onPress={() => toggleParticipation(event.id).catch(showError)}
          />
          <Button
            title="Modifier"
            variant="outline"
            onPress={() => navigation.navigate("EventForm", { eventId: event.id })}
          />
          <Button title="Supprimer l’événement" variant="danger" onPress={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  container: { padding: spacing.lg, gap: spacing.lg },
  headerRow: { flexDirection: "row", gap: spacing.md },
  headerTexts: { flex: 1, gap: spacing.sm },
  title: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
  infoCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  section: { gap: spacing.sm },
  sectionTitle: { fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.text },
  description: { fontFamily: fonts.body, fontSize: fontSize.md, lineHeight: 24, color: colors.textSecondary },
  actions: { gap: spacing.sm },
});
