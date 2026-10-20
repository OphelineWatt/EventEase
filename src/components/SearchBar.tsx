import { StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IconButton } from "./IconButton";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { t } from "@/i18n";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

/** Champ de recherche avec loupe et bouton pour effacer */
export function SearchBar({ value, onChangeText, placeholder = t("events.list.searchPlaceholder") }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        style={styles.input}
      />
      {value.length > 0 && <IconButton icon="close-circle" label={t("events.list.clearSearch")} size={18} onPress={() => onChangeText("")} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  input: { flex: 1, fontFamily: fonts.body, fontSize: fontSize.md, color: colors.text },
});
