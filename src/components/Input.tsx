import { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";

type InputProps = TextInputProps & {
  label: string;
  /** Message d'erreur affiché sous le champ (validation du formulaire) */
  error?: string;
};

/** Champ de saisie avec libellé, état « focus » et message d'erreur. */
export function Input({ label, error, multiline, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        multiline={multiline}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={label}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.focused,
          !!error && styles.inputError,
          style,
        ]}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs + 2 },
  label: { fontFamily: fonts.bodyBold, fontSize: fontSize.sm, color: colors.text },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.text,
  },
  multiline: { minHeight: 90, paddingTop: spacing.md, textAlignVertical: "top" },
  focused: { borderColor: colors.focus, borderWidth: 2 },
  inputError: { borderColor: colors.danger },
  error: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.danger },
});
