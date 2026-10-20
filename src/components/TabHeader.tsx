import { StyleSheet, View } from "react-native";
import { Logo } from "./Logo";
import { ScreenTitle } from "./ScreenTitle";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/i18n";

/** En-tête des onglets : « BONJOUR CAMILLE » + titre de l'écran + logo à droite */
export function TabHeader({ title }: { title: string }) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ScreenTitle kicker={t("tabs.greeting", { name: user?.name ?? "" })} title={title} />
      <Logo size={36} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
