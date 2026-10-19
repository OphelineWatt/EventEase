import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { MainTabs } from "./MainTabs";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { EventDetailScreen } from "@/screens/EventDetailScreen";
import { EventFormScreen } from "@/screens/EventFormScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navigateur principal de l'application.
 * Étape 9 : les écrans seront affichés selon que l'utilisateur est connecté ou non.
 */
export function RootNavigator() {
  return (
    // Pas d'en-tête natif : chaque écran affiche son propre titre (comme sur la maquette)
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      {/* Le formulaire s'ouvre en feuille glissante depuis le bas (maquette « Nouvel événement ») */}
      <Stack.Screen
        name="EventForm"
        component={EventFormScreen}
        options={{ presentation: "formSheet", sheetAllowedDetents: [0.9], sheetCornerRadius: 24 }}
      />
    </Stack.Navigator>
  );
}
