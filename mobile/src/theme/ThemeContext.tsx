import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPalette, Palette, ThemeMode } from './colors';

const STORAGE_KEY = '@nexo_theme_mode';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: Palette;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          setModeState(saved);
        }
      } catch (e) {
        console.log('Erro ao carregar tema salvo:', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((e) => console.log('Erro ao salvar tema:', e));
  };

  const toggleTheme = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const colors = useMemo(() => getPalette(mode), [mode]);

  if (!hydrated) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark: mode === 'dark', toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme deve ser usado dentro de ThemeProvider');
  }
  return ctx;
}
