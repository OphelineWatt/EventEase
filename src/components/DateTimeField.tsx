import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { formatShortDate, formatTime } from "@/utils/date";

type DateTimeFieldProps = {
  label: string;
  /** "date" pour choisir le jour, "time" pour choisir l'heure */
  mode: "date" | "time";
  value: Date;
  onChange: (date: Date) => void;
};

/**
 * Champ de saisie d'une date ou d'une heure, avec le sélecteur natif du téléphone.
 * - iOS : sélecteur compact affiché directement dans le formulaire.
 * - Android : champ cliquable qui ouvre la boîte de dialogue native (API recommandée par la librairie).
 */
export function DateTimeField({ label, mode, value, onChange }: DateTimeFieldProps) {
  /**
   * Le sélecteur renvoie une Date complète : on ne garde que la partie modifiée
   * (le jour en mode "date", l'heure en mode "time") pour ne pas écraser l'autre.
   */
  function handlePicked(picked: Date) {
    const next = new Date(value);
    if (mode === "date") {
      next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
    } else {
      next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    }
    onChange(next);
  }

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value,
      mode,
      is24Hour: true,
      onValueChange: (_event, picked) => handlePicked(picked),
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {Platform.OS === "ios" ? (
        <DateTimePicker
          value={value}
          mode={mode}
          display="compact"
          locale="fr-FR"
          accentColor={colors.primary}
          onValueChange={(_event, picked) => handlePicked(picked)}
          style={styles.iosPicker}
        />
      ) : (
        <Pressable onPress={openAndroidPicker} accessibilityRole="button" accessibilityLabel={label} style={styles.field}>
          <Ionicons name={mode === "date" ? "calendar-outline" : "time-outline"} size={18} color={colors.accent} />
          <Text style={styles.value}>{mode === "date" ? formatShortDate(value) : formatTime(value)}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.xs + 2 },
  label: { fontFamily: fonts.bodyBold, fontSize: fontSize.sm, color: colors.text },
  iosPicker: { alignSelf: "flex-start" },
  field: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  value: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.text },
});
