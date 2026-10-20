import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { InfoRow } from "./InfoRow";
import { Input } from "./Input";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { useAddressSuggestions } from "@/hooks/useAddressSuggestions";
import { t } from "@/i18n";
import type { AddressSuggestion } from "@/services/geocoding";

type AddressFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  /** true si l'adresse affichée a été choisie dans les suggestions (donc a des coordonnées GPS) */
  isLocated: boolean;
  onChangeText: (text: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  /** Prévient le parent quand le champ prend / perd le focus (ex. pour faire défiler le formulaire) */
  onFocus?: () => void;
  onBlur?: () => void;
};

/** Champ d'adresse avec suggestions de l'API de géocodage pendant la frappe */
export function AddressField({
  label,
  placeholder,
  value,
  isLocated,
  onChangeText,
  onSelect,
  onFocus,
  onBlur,
}: AddressFieldProps) {
  // Inutile de chercher si l'adresse vient d'être choisie dans la liste
  const { suggestions, isLoading, error } = useAddressSuggestions(value, !isLocated);

  return (
    <View style={styles.container}>
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCorrect={false}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {isLocated && <InfoRow icon="checkmark-circle" text={t("location.located")} />}
      {!isLocated && value.trim().length > 0 && <Text style={styles.hint}>{t("location.hint")}</Text>}
      {isLoading && <ActivityIndicator color={colors.primary} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {suggestions.length > 0 && (
        <View style={styles.list}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={`${suggestion.label}-${suggestion.latitude}`}
              onPress={() => onSelect(suggestion)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <Ionicons name="location-outline" size={18} color={colors.accent} />
              <Text style={styles.itemText}>{suggestion.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  hint: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary },
  error: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.danger },
  list: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  item: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  itemPressed: { backgroundColor: colors.primaryLight },
  itemText: { flex: 1, fontFamily: fonts.body, fontSize: fontSize.md, color: colors.text },
});
