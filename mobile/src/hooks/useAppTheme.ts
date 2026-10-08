import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme deve ser usado dentro de ThemeProvider');
  }
  return ctx;
}
