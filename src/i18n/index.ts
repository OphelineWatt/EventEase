import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { en } from "./en";
import { fr } from "./fr";

/** Toutes les traductions, rangées par code de langue */
const translations = { fr, en };
type Language = keyof typeof translations;

/** Renvoie la langue du téléphone si l'app la propose, sinon le français */
function detectLanguage(): Language {
  const deviceLanguage = getLocales()[0]?.languageCode;
  return deviceLanguage && deviceLanguage in translations ? (deviceLanguage as Language) : "fr";
}

export const i18n = new I18n(translations);
i18n.defaultLocale = "fr";
i18n.locale = detectLanguage();
// Si une clé manque dans une langue, on affiche la version française plutôt qu'un texte d'erreur
i18n.enableFallback = true;

/** Raccourci utilisé partout : t("auth.login.submit") */
export const t = i18n.t.bind(i18n);
