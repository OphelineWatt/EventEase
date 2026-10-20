import { useEffect } from "react";
import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// Import graisse par graisse : seuls les 4 fichiers de police utilisés sont embarqués dans l'app
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display/700Bold";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { RootNavigator } from "@/navigation/RootNavigator";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { colors } from "@/constants/theme";

// On garde le splash screen affiché tant que les polices ne sont pas chargées
SplashScreen.preventAutoHideAsync();

/** Thème React Navigation aligné sur nos couleurs (fond crème, bordeaux) */
const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  // Dès que les polices sont prêtes (ou en cas d'erreur), on masque le splash screen
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Évite un « flash » avec la police système
  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      {/* EventsProvider est DANS AuthProvider car il a besoin de l'utilisateur connecté */}
      <EventsProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </EventsProvider>
    </AuthProvider>
  );
}
