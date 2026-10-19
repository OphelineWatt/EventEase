import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";
import { EventsScreen } from "@/screens/EventsScreen";
import { CalendarScreen } from "@/screens/CalendarScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { colors, fonts } from "@/constants/theme";

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Barre d'onglets du bas : Découvrir / Calendrier / Profil */
export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.bodyBold },
      }}
    >
      <Tab.Screen name="Events" component={EventsScreen} options={{ title: "Découvrir" }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: "Calendrier" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}
