import "@/constants/calendarLocale"; // configure la langue du calendrier (import pour effet de bord)
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/Button";
import { EventRow } from "@/components/EventRow";
import { ScreenTitle } from "@/components/ScreenTitle";
import { TabHeader } from "@/components/TabHeader";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { useEvents } from "@/hooks/useEvents";
import { t } from "@/i18n";
import { buildMarkedDates, fromDateKey, toDateKey, toMonthKey } from "@/utils/calendar";
import { formatLongDate } from "@/utils/date";
import type { MainTabScreenProps } from "@/navigation/types";

/** Onglet Agenda : calendrier du mois avec les jours d'événements, et liste du mois ou du jour choisi */
export function CalendarScreen({ navigation }: MainTabScreenProps<"Calendar">) {
  const { events } = useEvents();

  // Mois affiché ("2026-10") et jour sélectionné ("2026-10-22", ou undefined = tout le mois)
  const [visibleMonth, setVisibleMonth] = useState(() => toMonthKey(new Date()));
  const [selectedDay, setSelectedDay] = useState<string>();

  // Événements listés sous le calendrier : ceux du jour choisi, sinon ceux du mois affiché
  const listedEvents = selectedDay
    ? events.filter((event) => toDateKey(event.date) === selectedDay)
    : events.filter((event) => toMonthKey(event.date) === visibleMonth);

  // Toucher un jour le sélectionne ; le toucher une deuxième fois revient au mois entier
  function handleDayPress(day: DateData) {
    setSelectedDay((current) => (current === day.dateString ? undefined : day.dateString));
  }

  // Changement de mois (flèches ou glissement) : on oublie le jour sélectionné
  function handleMonthChange(month: DateData) {
    setVisibleMonth(month.dateString.slice(0, 7));
    setSelectedDay(undefined);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TabHeader title={t("calendar.title")} />
        <ScreenTitle kicker={t("calendar.kicker")} title={t("calendar.heading")} />

        <View style={styles.calendarCard}>
          <Calendar
            firstDay={1} // la semaine commence le lundi
            enableSwipeMonths
            markedDates={buildMarkedDates(events, selectedDay)}
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            renderArrow={(direction) => (
              <Ionicons
                name={direction === "left" ? "chevron-back" : "chevron-forward"}
                size={20}
                color={colors.primary}
              />
            )}
            theme={calendarTheme}
          />
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {selectedDay ? formatLongDate(fromDateKey(selectedDay)) : t("calendar.monthEvents")}
          </Text>
          {selectedDay && (
            <Button title={t("calendar.showMonth")} variant="link" onPress={() => setSelectedDay(undefined)} />
          )}
        </View>

        {listedEvents.length === 0 ? (
          <Text style={styles.empty}>{selectedDay ? t("calendar.emptyDay") : t("calendar.emptyMonth")}</Text>
        ) : (
          listedEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              onPress={() => navigation.navigate("EventDetail", { eventId: event.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Couleurs et polices du calendrier, reprises du thème de l'app */
const calendarTheme = {
  calendarBackground: colors.card,
  monthTextColor: colors.text,
  textMonthFontFamily: fonts.title,
  textMonthFontSize: fontSize.lg,
  textSectionTitleColor: colors.textSecondary,
  textDayHeaderFontFamily: fonts.bodyBold,
  dayTextColor: colors.text,
  textDayFontFamily: fonts.body,
  textDisabledColor: colors.border,
  todayTextColor: colors.primary,
  arrowColor: colors.primary,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  calendarCard: {
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: spacing.sm },
  listTitle: { flexShrink: 1, fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.text },
  empty: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
});
