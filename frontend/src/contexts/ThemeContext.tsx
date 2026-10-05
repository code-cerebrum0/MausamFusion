import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { palettes, type Palette, type Theme } from '../utils/palette';

interface ThemeValue {
  theme: Theme;
  toggle: () => void;
  palette: Palette;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem('mf-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {

    /* ignore */}
  return 'dark';
}

export function ThemeProvider({ children }: {children: React.ReactNode;}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('mf-theme', theme);
    } catch {

      /* ignore */}
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => t === 'dark' ? 'light' : 'dark'), []);
  const value = useMemo(() => ({ theme, toggle, palette: palettes[theme] }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}