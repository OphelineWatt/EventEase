import { createContext, ReactNode, useEffect, useState } from "react";
import { clearSession, getSession, getUsers, saveSession, saveUsers } from "@/services/storage";
import type { User } from "@/types/user";

/** Ce que le contexte d'authentification met à disposition de toute l'application */
export type AuthContextValue = {
  /** Utilisateur connecté, ou null si personne n'est connecté */
  user: User | null;
  /** true pendant la relecture de la session au démarrage de l'app */
  isLoading: boolean;
  /** Crée un compte puis connecte l'utilisateur. Lève une erreur si l'email est déjà pris. */
  register: (name: string, email: string, password: string) => Promise<void>;
  /** Connecte un utilisateur existant. Lève une erreur si les identifiants sont faux. */
  login: (email: string, password: string) => Promise<void>;
  /** Déconnecte l'utilisateur et efface la session. */
  logout: () => Promise<void>;
};

/** Le contexte vaut null tant qu'aucun AuthProvider ne l'a rempli */
export const AuthContext = createContext<AuthContextValue | null>(null);

/** Fournit l'état d'authentification à tous les composants enfants */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage : on relit la session et on retrouve l'utilisateur correspondant
  useEffect(() => {
    async function restoreSession() {
      const email = await getSession();
      if (email) {
        const users = await getUsers();
        setUser(users.find((u) => u.email === email) ?? null);
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  /** Inscription : vérifie que l'email est libre, enregistre le compte et ouvre la session */
  async function register(name: string, email: string, password: string) {
    // « Camille@Mail.fr  » et « camille@mail.fr » doivent désigner le même compte
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();

    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error("Un compte existe déjà avec cette adresse e-mail.");
    }

    const newUser: User = { name: name.trim(), email: normalizedEmail, password };
    await saveUsers([...users, newUser]);
    await saveSession(normalizedEmail);
    setUser(newUser);
  }

  /** Connexion : retrouve le compte correspondant aux identifiants et ouvre la session */
  async function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();
    const found = users.find((u) => u.email === normalizedEmail && u.password === password);

    if (!found) {
      throw new Error("Adresse e-mail ou mot de passe incorrect.");
    }

    await saveSession(found.email);
    setUser(found);
  }

  /** Déconnexion : efface la session enregistrée puis vide l'utilisateur courant */
  async function logout() {
    await clearSession();
    setUser(null);
  }

  return (
    <AuthContext value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext>
  );
}
