import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthHeader } from "@/components/AuthHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ScreenTitle } from "@/components/ScreenTitle";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/i18n";
import { PASSWORD_MIN_LENGTH, validateEmail, validateName, validatePassword } from "@/utils/validation";
import type { RootStackScreenProps } from "@/navigation/types";

/** Écran d'inscription */
export function RegisterScreen({ navigation }: RootStackScreenProps<"Register">) {
  const { register } = useAuth();

  // Valeurs saisies dans les champs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Erreurs affichées sous chaque champ
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  // Erreur générale (email déjà utilisé), affichée au-dessus du bouton
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    // 1. Vérification des trois champs avec les règles de utils/validation.ts
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    setFormError(undefined);
    if (newErrors.name || newErrors.email || newErrors.password) return;

    // 2. Création du compte (connecte automatiquement l'utilisateur en cas de succès)
    setSubmitting(true);
    try {
      await register(name, email, password);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : t("common.unknownError"));
      setSubmitting(false);
    }
  }

  return (
    // Remonte le contenu quand le clavier s'ouvre, pour ne pas cacher les champs
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <AuthHeader />

        <View style={styles.body}>
          <ScreenTitle
            kicker={t("auth.register.kicker")}
            title={t("auth.register.title")}
            subtitle={t("auth.register.subtitle")}
          />

          <Input
            label={t("auth.fields.name")}
            value={name}
            onChangeText={setName}
            placeholder={t("auth.fields.namePlaceholder")}
            autoCapitalize="words"
            autoComplete="given-name"
            error={errors.name}
          />
          <Input
            label={t("auth.fields.email")}
            value={email}
            onChangeText={setEmail}
            placeholder={t("auth.fields.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label={t("auth.fields.password")}
            value={password}
            onChangeText={setPassword}
            placeholder={t("auth.fields.passwordPlaceholder", { count: PASSWORD_MIN_LENGTH })}
            secureTextEntry
            autoComplete="new-password"
            error={errors.password}
          />

          {formError && <Text style={styles.formError}>{formError}</Text>}

          <Button title={t("auth.register.submit")} onPress={handleSubmit} loading={submitting} />
          <Button title={t("auth.register.toLogin")} variant="link" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: spacing.xl },
  body: { padding: spacing.lg, gap: spacing.md },
  formError: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.danger, textAlign: "center" },
});
