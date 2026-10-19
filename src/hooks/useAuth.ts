import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Donne accès à l'utilisateur connecté et aux actions d'authentification.
 * Exemple : const { user, login } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return context;
}
