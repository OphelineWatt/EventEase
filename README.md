# EventEase

Application mobile de l'association **EventEase** : les membres et bénévoles consultent la programmation (conférences, ateliers, sorties), créent des événements et indiquent ceux auxquels ils participent.

Projet réalisé en 4 jours dans le cadre d'un cours de développement mobile — Ophéline Wattier.

## Fonctionnalités

**Demandées par le cahier des charges**
- Inscription et connexion simplifiées (sans serveur), session conservée au redémarrage
- Liste des événements (titre, description, date), avec recherche et filtres par catégorie
- Création, modification et suppression d'un événement (avec confirmation)
- Participation à un événement (« Participer » / « Je participe »)
- Persistance locale des données avec AsyncStorage

**Bonus**
- Calendrier des événements (react-native-calendars), jours d'événements marqués, filtre par jour
- Adresse du lieu avec suggestions automatiques (API Géoplateforme de l'IGN)
- Distance entre l'utilisateur et l'événement (géolocalisation) et bouton « Itinéraire »
- Météo prévue le jour de l'événement (API Open-Meteo)
- Profil : statistiques et liste de mes participations
- Design sur mesure (thème « théâtre » bordeaux et or, polices, icônes, icône d'application et splash screen)
- Application traduite en français et en anglais selon la langue du téléphone

## Lancer le projet

Prérequis : Node.js 20 ou plus récent, et l'application **Expo Go** (SDK 57) sur un téléphone.

```bash
npm install
npx expo start
```

Scanner ensuite le QR code avec Expo Go (Android) ou l'appareil photo (iPhone). Le téléphone et l'ordinateur doivent être sur le même réseau Wi-Fi. Si le réseau bloque la connexion (réseau d'école), utiliser `npx expo start --tunnel`.

Vérifications de qualité :

```bash
npx tsc --noEmit   # typage TypeScript
npx expo lint      # règles ESLint
npx expo-doctor    # configuration Expo
```

## Architecture

```
index.ts                 Point d'entrée (registerRootComponent)
src/
  App.tsx                Polices, Providers, NavigationContainer
  navigation/            Stack principal, onglets, typage des écrans
  screens/               Un fichier par écran (affichage uniquement)
  components/            Composants réutilisables (Button, Input, EventCard, WeatherCard…)
  context/               État global et règles métier (AuthContext, EventsContext)
  hooks/                 Accès aux contextes et logique réutilisable (useAuth, useEvents, useUserLocation…)
  services/              Accès extérieurs : stockage local, géocodage, météo
  utils/                 Fonctions pures (dates, distance, validation, calendrier…)
  i18n/                  Traductions français / anglais
  constants/             Thème, catégories, configuration du calendrier
  types/                 Types TypeScript (Event, User)
```

## Document technique

1. Application React Native développée avec **Expo SDK 57** et **TypeScript** en mode strict, testée sur téléphone avec Expo Go.
2. La navigation utilise **React Navigation 7** : un Stack natif qui contient trois onglets (Découvrir, Calendrier, Profil), avec des écrans et des paramètres typés.
3. La navigation est conditionnelle : les écrans de connexion ou les onglets sont affichés selon l'utilisateur connecté.
4. L'état global est géré par deux **Context React** (`AuthContext`, `EventsContext`), utilisés par les écrans via les hooks `useAuth` et `useEvents`.
5. La persistance est locale avec **AsyncStorage**, isolée dans `services/storage.ts` : chaque action écrit d'abord sur le disque, puis met à jour l'affichage.
6. Le code est découpé par responsabilité : les écrans affichent, les contextes décident, les services communiquent avec l'extérieur, les utilitaires calculent.
7. Deux **API externes sans clé** sont utilisées : la Géoplateforme de l'IGN pour les suggestions d'adresses, Open-Meteo pour la météo.
8. La géolocalisation (`expo-location`) permet de calculer la distance aux événements avec la formule de Haversine et d'ouvrir l'itinéraire.
9. Le calendrier repose sur **react-native-calendars** ; l'application est traduite en français et en anglais avec `i18n-js` et `expo-localization`.
10. Le thème (couleurs, polices, espacements) est centralisé dans `constants/theme.ts` ; la qualité est contrôlée par TypeScript, ESLint et expo-doctor.

## Bibliothèques principales

| Bibliothèque | Utilisation |
|---|---|
| `@react-navigation/native-stack`, `@react-navigation/bottom-tabs` | Navigation entre les écrans |
| `@react-native-async-storage/async-storage` | Enregistrement local des comptes, de la session et des événements |
| `react-native-calendars` | Onglet Calendrier |
| `@react-native-community/datetimepicker` | Choix de la date et de l'heure d'un événement |
| `expo-location` | Position de l'utilisateur pour la distance |
| `expo-localization`, `i18n-js` | Traduction français / anglais |
| `expo-linear-gradient`, `@expo-google-fonts/*`, `@expo/vector-icons` | Design : dégradés, polices, icônes |

## Limites du prototype

- Pas de serveur : les données sont propres à chaque téléphone et ne sont pas partagées entre membres.
- Les mots de passe sont stockés en clair sur le téléphone (acceptable pour un prototype, jamais en production).
- La météo n'est disponible que dans les 15 jours précédant l'événement, et seulement pour les adresses choisies dans les suggestions.
- Les suggestions d'adresses couvrent uniquement la France.
- L'icône et le splash screen ne sont visibles que dans une version installée de l'application, pas dans Expo Go.
