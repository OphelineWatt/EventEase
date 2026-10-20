import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthHeader } from "@/components/AuthHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ScreenTitle } from "@/components/ScreenTitle";
import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/i18n";
import { PASSWORD_MIN_LENGTH, validateEmail } from "@/utils/validation";
import type { RootStackScreenProps } from "@/navigation/types";

/** Écran de connexion */
export function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const { login } = useAuth();

  // Valeurs saisies dans les champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Erreurs affichées sous chaque champ
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  // Erreur générale (identifiants refusés), affichée au-dessus du bouton
  const [formError, setFormError] = useState<string>();
  // true pendant la tentative de connexion (affiche un indicateur dans le bouton)
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    // 1. Vérification des champs avant d'interroger le stockage
    const newErrors = {
      email: validateEmail(email),
      password: password ? undefined : t("validation.passwordRequired"),
    };
    setErrors(newErrors);
    setFormError(undefined);
    if (newErrors.email || newErrors.password) return;

    // 2. Tentative de connexion
    setSubmitting(true);
    try {
      await login(email, password);
      // Succès : rien à faire ici, la navigation bascule toute seule vers les onglets (étape 9)
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
            kicker={t("auth.login.kicker")}
            title={t("auth.login.title")}
            subtitle={t("auth.login.subtitle")}
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
            autoComplete="current-password"
            error={errors.password}
          />

          {formError && <Text style={styles.formError}>{formError}</Text>}

          <Button title={t("auth.login.submit")} onPress={handleSubmit} loading={submitting} />
          <Button
            title={t("auth.login.toRegister")}
            variant="link"
            onPress={() => navigation.navigate("Register")}
          />

          <View style={styles.note}>
            <Text style={styles.noteText}>
              {t("auth.login.prototypeNote")}
            </Text>
          </View>
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
  note: { backgroundColor: colors.accentLight, borderRadius: radius.md, padding: spacing.md },
  noteText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textSecondary },
});
