import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import type { WeatherState } from "@/hooks/useEventWeather";
import { t } from "@/i18n";
import { FORECAST_DAYS } from "@/services/weather";
import { getWeatherIcon, getWeatherLabel } from "@/utils/weather";

/** Encart météo du détail d'un événement (affiche chacun des états possibles) */
export function WeatherCard({ state }: { state: WeatherState }) {
  // Pas de lieu localisé (ou événement trop ancien) : rien à montrer
  if (state.status === "hidden") return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("weather.title")}</Text>

      {state.status === "loading" && (
        <View style={styles.row}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.muted}>{t("weather.loading")}</Text>
        </View>
      )}

      {state.status === "tooFar" && <Text style={styles.muted}>{t("weather.tooFar", { days: FORECAST_DAYS })}</Text>}

      {state.status === "error" && <Text style={styles.muted}>{t("weather.errors.unavailable")}</Text>}

      {state.status === "loaded" && (
        <View style={styles.row}>
          <Ionicons name={getWeatherIcon(state.weather.code)} size={44} color={colors.accent} />
          <View style={styles.texts}>
            <Text style={styles.condition}>{getWeatherLabel(state.weather.code)}</Text>
            <Text style={styles.temperatures}>
              {state.weather.minTemperature}° / {state.weather.maxTemperature}°
            </Text>
            <Text style={styles.muted}>
              {t("weather.rainChance", { value: state.weather.precipitationProbability })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  title: { fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.text },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  texts: { flex: 1, gap: 2 },
  condition: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: colors.text },
  temperatures: { fontFamily: fonts.title, fontSize: fontSize.lg, color: colors.primary },
  muted: { flexShrink: 1, fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary },
});
