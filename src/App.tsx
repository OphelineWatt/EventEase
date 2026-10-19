import { useEffect } from "react";
import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { RootNavigator } from "@/navigation/RootNavigator";
import { AuthProvider } from "@/context/AuthContext";
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
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
