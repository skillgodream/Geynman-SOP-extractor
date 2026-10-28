import { FeynmanDeck } from '../types/deck';

export function getUserDecksKey(userId: string): string {
  return `koya_decks_user_${userId}`;
}

export function loadUserDecks(userId: string, defaultDecks: FeynmanDeck[]): FeynmanDeck[] {
  if (typeof window === 'undefined') return defaultDecks;
  try {
    const raw = localStorage.getItem(getUserDecksKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Initialize user storage with default decks
    saveUserDecks(userId, defaultDecks);
    return defaultDecks;
  } catch (err) {
    console.warn('Failed to load user decks from localStorage:', err);
    return defaultDecks;
  }
}

export function saveUserDecks(userId: string, decks: FeynmanDeck[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getUserDecksKey(userId), JSON.stringify(decks));
  } catch (err) {
    console.warn('Failed to save user decks to localStorage:', err);
  }
}

export function addUserDeck(userId: string, newDeck: FeynmanDeck, currentDecks: FeynmanDeck[]): FeynmanDeck[] {
  // Prevent duplicate insertion
  const filtered = currentDecks.filter((d) => d.id !== newDeck.id);
  const updated = [newDeck, ...filtered];
  saveUserDecks(userId, updated);
  return updated;
}

export function deleteUserDeck(userId: string, deckId: string, currentDecks: FeynmanDeck[]): FeynmanDeck[] {
  const updated = currentDecks.filter((d) => d.id !== deckId);
  saveUserDecks(userId, updated);
  return updated;
}
