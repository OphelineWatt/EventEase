import { t } from "@/i18n";

/**
 * Règles de validation des formulaires.
 * Chaque fonction renvoie un message d'erreur (traduit), ou undefined si la valeur est correcte.
 */

/** Longueur minimale d'un mot de passe (indiquée sur la maquette) */
export const PASSWORD_MIN_LENGTH = 8;

/** Format simple : du texte, un @, du texte, un point, du texte (ex. nom@domaine.fr) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Champ obligatoire : renvoie `message` si la valeur est vide (ou ne contient que des espaces) */
export function validateRequired(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

export function validateName(name: string): string | undefined {
  if (!name.trim()) return t("validation.nameRequired");
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return t("validation.emailRequired");
  if (!EMAIL_REGEX.test(email.trim())) return t("validation.emailInvalid");
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return t("validation.passwordRequired");
  if (password.length < PASSWORD_MIN_LENGTH) {
    return t("validation.passwordTooShort", { count: PASSWORD_MIN_LENGTH });
  }
  return undefined;
}
