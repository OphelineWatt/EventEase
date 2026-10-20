import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Chip } from "@/components/Chip";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { TabHeader } from "@/components/TabHeader";
import { CATEGORIES, getCategoryLabel } from "@/constants/categories";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { useUserLocation } from "@/hooks/useUserLocation";
import { t } from "@/i18n";
import { confirmDelete, showError } from "@/utils/alerts";
import { getEventDistance } from "@/utils/distance";
import type { MainTabScreenProps } from "@/navigation/types";
import type { Event, EventCategory } from "@/types/event";

/** Filtre de catégorie : une catégorie précise, ou toutes */
type CategoryFilter = EventCategory | "all";

/** Liste des événements « À l'affiche » : recherche, filtres, participation, modification, suppression */
export function EventsScreen({ navigation }: MainTabScreenProps<"Events">) {
  const { user } = useAuth();
  const { events, isLoading, deleteEvent, toggleParticipation } = useEvents();
  // Position de l'utilisateur, pour afficher la distance sur chaque carte
  const { coords: userCoords } = useUserLocation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CategoryFilter>("all");

  // Événements affichés : d'abord filtrés par catégorie, puis par le texte recherché
  const query = search.trim().toLowerCase();
  const visibleEvents = events.filter((event) => {
    if (filter !== "all" && event.category !== filter) return false;
    if (!query) return true;
    const searchableTexts = [event.title, event.description, event.location?.address ?? ""];
    return searchableTexts.some((text) => text.toLowerCase().includes(query));
  });

  function handleDelete(event: Event) {
    confirmDelete(event.title, () => {
      deleteEvent(event.id).catch(showError);
    });
  }

  function handleToggleParticipation(eventId: string) {
    toggleParticipation(eventId).catch(showError);
  }

  // Message affiché quand la liste est vide (aucun événement, ou aucun résultat de recherche)
  const emptyMessage =
    events.length === 0
      ? t("events.list.emptyNoEvents")
      : t("events.list.emptyNoResults");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={visibleEvents}
        keyExtractor={(event) => event.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        // En-tête passé comme élément (et non comme composant) : le champ de recherche garde le focus
        ListHeaderComponent={
          <View style={styles.header}>
            <TabHeader title={t("events.list.title")} />

            <LinearGradient
              colors={[colors.curtainLight, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <Text style={styles.heroTitle}>{t("events.list.heroTitle")}</Text>
              <Text style={styles.heroSubtitle}>{t("events.list.heroSubtitle")}</Text>
            </LinearGradient>

            <SearchBar value={search} onChangeText={setSearch} />

            <View style={styles.chips}>
              <Chip label={t("events.list.filterAll")} selected={filter === "all"} onPress={() => setFilter("all")} />
              {CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  label={getCategoryLabel(category)}
                  selected={filter === category}
                  onPress={() => setFilter(category)}
                />
              ))}
            </View>

            <View style={styles.countRow}>
              <Text style={styles.count}>
                <Text style={styles.countNumber}>{visibleEvents.length}</Text> {t("events.list.count", { count: visibleEvents.length })}
              </Text>
              <Text style={styles.countLabel}>{t("events.list.programme").toUpperCase()}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.empty}>{emptyMessage}</Text>
          )
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            distance={getEventDistance(item, userCoords)}
            isParticipating={!!user && item.participants.includes(user.email)}
            onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
            onEdit={() => navigation.navigate("EventForm", { eventId: item.id })}
            onDelete={() => handleDelete(item)}
            onToggleParticipation={() => handleToggleParticipation(item.id)}
          />
        )}
      />

      {/* Bouton flottant « + » pour créer un événement */}
      <Pressable
        onPress={() => navigation.navigate("EventForm")}
        accessibilityRole="button"
        accessibilityLabel={t("events.list.create")}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={30} color={colors.textOnPrimary} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: 110, gap: spacing.md },
  header: { gap: spacing.md },
  hero: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs },
  heroTitle: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.textOnPrimary },
  heroSubtitle: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.accentLight },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  countRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  count: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
  countNumber: { fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.text },
  countLabel: { fontFamily: fonts.bodyBold, fontSize: fontSize.xs, letterSpacing: 1.5, color: colors.accent },
  empty: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary, textAlign: "center", marginTop: spacing.lg },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabPressed: { opacity: 0.85 },
});
