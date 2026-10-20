import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

/** Hauteur actuelle du clavier en pixels (0 quand il est fermé) */
export function useKeyboardHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // Le système prévient l'app à chaque ouverture et fermeture du clavier
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => setHeight(event.endCoordinates.height));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return height;
}
