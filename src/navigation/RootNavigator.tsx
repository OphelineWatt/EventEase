import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { MainTabs } from "./MainTabs";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { EventDetailScreen } from "@/screens/EventDetailScreen";
import { EventFormScreen } from "@/screens/EventFormScreen";
import { useAuth } from "@/hooks/useAuth";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navigateur principal : les écrans disponibles dépendent de la connexion.
 * Connecté → onglets + détail + formulaire ; non connecté → connexion + inscription.
 */
export function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Pendant la relecture de la session (quelques millisecondes), on n'affiche rien
  if (isLoading) return null;

  return (
    // Pas d'en-tête natif : chaque écran affiche son propre titre (comme sur la maquette)
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          {/* Le formulaire s'ouvre en feuille glissante depuis le bas (maquette « Nouvel événement ») */}
          <Stack.Screen
            name="EventForm"
            component={EventFormScreen}
            options={{ presentation: "formSheet", sheetAllowedDetents: [0.9], sheetCornerRadius: 24 }}
          />
        </>
      ) : (
        <>
          {/* Animation « retour » quand on arrive ici après une déconnexion */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ animationTypeForReplace: "pop" }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
