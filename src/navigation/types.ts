import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

/** Onglets de la barre du bas */
export type MainTabParamList = {
  Events: undefined;
  Calendar: undefined;
  Profile: undefined;
};

/** Écrans du Stack principal et leurs paramètres */
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EventDetail: { eventId: string };
  /** Sans eventId = création, avec eventId = modification */
  EventForm: { eventId?: string } | undefined;
};

/** Props d'un écran du Stack (navigation + route typées) */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/** Props d'un onglet : il peut aussi naviguer vers les écrans du Stack parent */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;
