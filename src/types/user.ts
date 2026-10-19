/**
 * Un membre ou bénévole de l'association.
 * ⚠️ Prototype : le mot de passe est stocké en clair en local.
 * En production, l'authentification passerait par un backend avec mots de passe hachés.
 */
export type User = {
  name: string;
  /** Sert d'identifiant unique */
  email: string;
  password: string;
};
