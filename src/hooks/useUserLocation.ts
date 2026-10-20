import { useEffect, useState } from "react";
import * as Location from "expo-location";

/** Coordonnées GPS */
export type Coords = { latitude: number; longitude: number };

/** loading = recherche en cours, granted = position trouvée, denied = permission refusée, unavailable = GPS indisponible */
type LocationStatus = "loading" | "granted" | "denied" | "unavailable";

/**
 * Position actuelle de l'utilisateur, utilisée pour calculer la distance jusqu'aux événements.
 * La permission n'est demandée par le système qu'une seule fois ; ensuite la réponse est mémorisée.
 */
export function useUserLocation() {
  const [coords, setCoords] = useState<Coords>();
  const [status, setStatus] = useState<LocationStatus>("loading");

  useEffect(() => {
    // Évite de modifier l'état si l'écran a été quitté avant la fin de la recherche
    let cancelled = false;

    async function locate() {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
          if (!cancelled) setStatus("denied");
          return;
        }
        // Dernière position connue du téléphone (instantanée), sinon nouvelle mesure GPS
        const position =
          (await Location.getLastKnownPositionAsync()) ??
          (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));

        if (!cancelled) {
          setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setStatus("granted");
        }
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    }

    locate();
    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, status };
}
