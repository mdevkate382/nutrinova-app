import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, AppSettings, ThemeMode } from '@/types';
import { storage } from '@/lib/storage';
import { getTodayKey } from '@/lib/health';

interface AppContextType {
  user: User | null;
  isAuthed: boolean;
  settings: AppSettings;
  login: (email: string, password: string) => boolean;
  signup: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  currentPage: string;
  navigate: (page: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [isAuthed, setIsAuthed] = useState<boolean>(() => storage.isAuthed());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const login = useCallback((email: string, password: string): boolean => {
    const storedUser = storage.getUser();
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      setIsAuthed(true);
      storage.setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((newUser: User) => {
    storage.setUser(newUser);
    setUser(newUser);
    setIsAuthed(true);
    storage.setAuthed(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthed(false);
    storage.setAuthed(false);
    setCurrentPage('dashboard');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      storage.setUser(updated);
      return updated;
    });
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      storage.setSettings(updated);
      return updated;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      const newTheme: ThemeMode = prev.theme === 'light' ? 'dark' : 'light';
      const updated = { ...prev, theme: newTheme };
      storage.setSettings(updated);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return updated;
    });
  }, []);

  const navigate = useCallback((page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthed,
        settings,
        login,
        signup,
        logout,
        updateUser,
        updateSettings,
        toggleTheme,
        currentPage,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
