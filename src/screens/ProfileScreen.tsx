import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/Button";
import { EventRow } from "@/components/EventRow";
import { ScreenTitle } from "@/components/ScreenTitle";
import { TabHeader } from "@/components/TabHeader";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { t } from "@/i18n";
import type { MainTabScreenProps } from "@/navigation/types";

/** Profil du membre connecté : avatar, statistiques, mes participations, déconnexion */
export function ProfileScreen({ navigation }: MainTabScreenProps<"Profile">) {
  const { user, logout } = useAuth();
  const { events } = useEvents();

  // L'écran n'est accessible que connecté : ce cas ne sert qu'à rassurer TypeScript
  if (!user) return null;

  // Événements auxquels je participe (déjà triés par date par le contexte)
  const myEvents = events.filter((e) => e.participants.includes(user.email));

  // Statistiques calculées à partir des événements (rien n'est stocké en plus)
  const participationsCount = myEvents.length;
  const createdCount = events.filter((e) => e.createdBy === user.email).length;

  // Initiale affichée dans l'avatar : "Camille" → "C"
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TabHeader title={t("profile.headerTitle")} />
        <ScreenTitle kicker={t("profile.kicker")} title={t("profile.title")} />

        {/* Carte membre : avatar, nom, statistiques */}
        <View style={styles.card}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.member}>{t("profile.member")}</Text>

          <View style={styles.stats}>
            <Stat value={participationsCount} label={t("profile.participations", { count: participationsCount })} />
            <View style={styles.statDivider} />
            <Stat value={createdCount} label={t("profile.created", { count: createdCount })} />
          </View>
        </View>

        {/* Mes participations : un raccourci vers chaque événement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.myEvents")}</Text>
          {myEvents.length === 0 ? (
            <Text style={styles.empty}>{t("profile.noEvents")}</Text>
          ) : (
            myEvents.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onPress={() => navigation.navigate("EventDetail", { eventId: event.id })}
              />
            ))
          )}
        </View>

        <Button
          title={t("profile.logout")}
          variant="outline"
          icon={<Ionicons name="log-out-outline" size={20} color={colors.primary} />}
          onPress={logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/** Une statistique : grand chiffre + libellé (accordé par i18n) */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  card: {
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  avatarRing: { padding: 4, borderRadius: 48, backgroundColor: colors.primaryLight, marginBottom: spacing.sm },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.textOnPrimary },
  name: { fontFamily: fonts.title, fontSize: fontSize.xl, color: colors.text },
  member: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary },
  stats: {
    alignSelf: "stretch",
    flexDirection: "row",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  statValue: { fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.primary },
  statLabel: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center" },
  section: { gap: spacing.sm },
  sectionTitle: { fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.text },
  empty: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
});
