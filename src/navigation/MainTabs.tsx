import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
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
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          title: "Découvrir",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "Calendrier",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
