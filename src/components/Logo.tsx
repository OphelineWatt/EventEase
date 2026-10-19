import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "@/constants/theme";

/** Logo EventEase : un « E » dans un losange bordeaux */
export function Logo({ size = 44 }: { size?: number }) {
  return (
    <View style={[styles.diamond, { width: size, height: size }]} accessibilityLabel="EventEase">
      <Text style={[styles.letter, { fontSize: size * 0.5 }]}>E</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Un carré tourné de 45° devient un losange…
  diamond: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm / 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
  },
  // …et on tourne la lettre dans l'autre sens pour qu'elle reste droite
  letter: { fontFamily: fonts.title, color: colors.textOnPrimary, transform: [{ rotate: "-45deg" }] },
});
