export interface UserAccount {
  id: string;
  name: string;
  role: string;
  pin: string;
  avatarBg: string;
}

export const PRESET_USERS: UserAccount[] = [
  { id: 'usr_vikram', name: 'Vikram', role: 'Operations Director', pin: '1234', avatarBg: 'bg-blue-500' },
  { id: 'usr_anjali', name: 'Anjali Goel', role: 'Quality Assurance Lead', pin: '1234', avatarBg: 'bg-purple-500' },
  { id: 'usr_test1', name: 'Test 1', role: 'Shift Operator', pin: '1234', avatarBg: 'bg-emerald-500' },
  { id: 'usr_test2', name: 'Test 2', role: 'EHS Manager', pin: '1234', avatarBg: 'bg-amber-500' },
];

const CURRENT_USER_KEY = 'koya_active_user_id';

export function getActiveUser(): UserAccount {
  if (typeof window === 'undefined') return PRESET_USERS[0];
  try {
    const savedId = localStorage.getItem(CURRENT_USER_KEY);
    const found = PRESET_USERS.find((u) => u.id === savedId);
    if (found) return found;
  } catch {
    // fallback
  }
  return PRESET_USERS[0];
}

export function setActiveUser(user: UserAccount): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
  } catch (err) {
    console.warn('Failed to save active user:', err);
  }
}
