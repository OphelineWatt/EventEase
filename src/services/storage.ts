import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Event } from "@/types/event";
import type { User } from "@/types/user";

/** Clés utilisées dans AsyncStorage (centralisées pour éviter les fautes de frappe) */
const KEYS = {
  users: "@eventease/users",
  session: "@eventease/session",
  events: "@eventease/events",
} as const;

/**
 * Lit une valeur JSON stockée sous `key`.
 * Renvoie `fallback` si rien n'est encore stocké ou si la lecture échoue.
 */
async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`Lecture impossible pour "${key}"`, error);
    return fallback;
  }
}

/** Enregistre `value` sous `key` après conversion en texte JSON. */
async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// ----- Utilisateurs -----

/** Renvoie la liste de tous les comptes créés sur ce téléphone (vide au premier lancement). */
export function getUsers(): Promise<User[]> {
  return readJson<User[]>(KEYS.users, []);
}

/** Remplace la liste des comptes enregistrés. */
export function saveUsers(users: User[]): Promise<void> {
  return writeJson(KEYS.users, users);
}

// ----- Session (utilisateur connecté) -----

/** Renvoie l'email de l'utilisateur connecté, ou null si personne n'est connecté. */
export function getSession(): Promise<string | null> {
  return readJson<string | null>(KEYS.session, null);
}

/** Mémorise l'utilisateur connecté (appelé après une connexion ou une inscription réussie). */
export function saveSession(email: string): Promise<void> {
  return writeJson(KEYS.session, email);
}

/** Efface la session (appelé à la déconnexion). */
export function clearSession(): Promise<void> {
  return AsyncStorage.removeItem(KEYS.session);
}

// ----- Événements -----

/** Renvoie tous les événements de l'association (vide au premier lancement). */
export function getEvents(): Promise<Event[]> {
  return readJson<Event[]>(KEYS.events, []);
}

/** Remplace la liste complète des événements (après un ajout, une modification, une suppression ou une participation). */
export function saveEvents(events: Event[]): Promise<void> {
  return writeJson(KEYS.events, events);
}
