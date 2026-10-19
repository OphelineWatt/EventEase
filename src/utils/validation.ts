/**
 * Règles de validation des formulaires.
 * Chaque fonction renvoie un message d'erreur, ou undefined si la valeur est correcte.
 */

/** Longueur minimale d'un mot de passe (indiquée sur la maquette) */
export const PASSWORD_MIN_LENGTH = 8;

/** Format simple : du texte, un @, du texte, un point, du texte (ex. nom@domaine.fr) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name: string): string | undefined {
  if (!name.trim()) return "Le prénom est obligatoire.";
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "L'adresse e-mail est obligatoire.";
  if (!EMAIL_REGEX.test(email.trim())) return "L'adresse e-mail n'est pas valide.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Le mot de passe est obligatoire.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`;
  }
  return undefined;
}
