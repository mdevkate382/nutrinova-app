import type { User, AppSettings } from '@/types';

const PREFIX = 'nutrinova_';

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage might be full or unavailable
  }
}

function remove(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export const storage = {
  getUser: (): User | null => get<User | null>('user', null),
  setUser: (user: User | null) => (user ? set('user', user) : remove('user')),

  isAuthed: (): boolean => get<boolean>('authed', false),
  setAuthed: (v: boolean) => set('authed', v),

  getSettings: (): AppSettings =>
    get<AppSettings>('settings', {
      theme: 'light',
      units: 'metric',
      notifications: {
        waterReminders: true,
        mealReminders: true,
        workoutReminders: true,
        goalReminders: true,
        progressUpdates: true,
      },
      privacy: {
        profileVisible: true,
        shareProgress: false,
      },
    }),
  setSettings: (s: AppSettings) => set('settings', s),

  get: <T>(key: string, fallback: T): T => get(key, fallback),
  set: <T>(key: string, value: T): void => set(key, value),
  remove: (key: string): void => remove(key),
  clearAll: (): void => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};
