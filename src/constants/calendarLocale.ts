import { LocaleConfig } from "react-native-calendars";
import { i18n, t } from "@/i18n";
import { getMonthNames, getWeekdayNames } from "@/utils/date";

/**
 * Configure react-native-calendars dans la langue de l'application.
 * Les noms de mois et de jours sont générés par le téléphone (API Intl) : aucun n'est écrit à la main.
 * Ce fichier est importé une seule fois par l'écran Calendrier.
 */
LocaleConfig.locales[i18n.locale] = {
  monthNames: getMonthNames("long"),
  monthNamesShort: getMonthNames("short"),
  dayNames: getWeekdayNames("long"),
  dayNamesShort: getWeekdayNames("narrow"), // une lettre, comme sur la maquette : L M M J V S D
  today: t("calendar.today"),
};

LocaleConfig.defaultLocale = i18n.locale;
