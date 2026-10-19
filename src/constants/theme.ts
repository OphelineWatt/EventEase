/**
 * Thème global d'EventEase, inspiré de l'univers du théâtre (rideau rouge, crème, doré).
 * Toutes les couleurs, espacements et polices sont centralisés ici :
 * aucun écran n'écrit de valeur « en dur ».
 */

/** Palette de couleurs */
export const colors = {
  // Bordeaux : couleur principale (boutons, onglet actif, logo)
  primary: "#6E1A2C",
  primaryDark: "#4A0F1C", // dégradé du bandeau et du rideau
  primaryLight: "#F6E3E6", // fond des pastilles « Conférence », des initiales, etc.
  curtainLight: "#9B2C3F", // reflet clair des plis du rideau
  overlay: "rgba(30, 5, 10, 0.85)", // voile sombre sous le texte du bandeau

  // Doré : accent (petits titres « PROGRAMMATION », icônes horloge/lieu, points du calendrier)
  accent: "#B8862F",
  accentLight: "#F6E9D4", // encadré « Un accueil pour toutes et tous »

  // Fonds
  background: "#F9F5F0", // crème de toutes les pages
  card: "#FFFCF8", // cartes légèrement plus claires que le fond
  border: "#E8DFD6",
  focus: "#D99A3A", // bordure orangée du champ sélectionné

  // Textes
  text: "#1F1A1C",
  textSecondary: "#6B6466",
  textOnPrimary: "#FFFFFF", // texte sur fond bordeaux

  // États
  success: "#2F6B4F", // événement auquel on participe
  danger: "#B42318", // suppression, messages d'erreur
} as const;

/**
 * Couleurs de chaque catégorie d'événement (pastilles et bloc date des cartes).
 * Conférence = bordeaux, Atelier = doré, Sortie = vert, comme sur la maquette.
 */
export const categoryColors = {
  conference: { background: "#F6E3E6", text: "#6E1A2C" },
  atelier: { background: "#F8EBD3", text: "#8A5A14" },
  sortie: { background: "#E6F0EA", text: "#2F6B4F" },
} as const;

/** Polices : titres en serif élégant, texte courant en sans-serif lisible */
export const fonts = {
  title: "PlayfairDisplay_700Bold",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodyBold: "DMSans_700Bold",
} as const;

/** Espacements (marges, paddings) sur une échelle de 4 px */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Rayons d'arrondi (cartes, boutons, champs, pastilles) */
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999, // pastilles de catégorie, entièrement arrondies
} as const;

/** Tailles de police */
export const fontSize = {
  xs: 11, // petits titres en majuscules (« BIENVENUE »)
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36, // « EventEase », « Le calendrier »
} as const;
