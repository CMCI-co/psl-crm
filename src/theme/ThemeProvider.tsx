// src/theme/ThemeProvider.tsx
// Resolves the active theme from persisted brand + dark-mode choices and
// exposes them (plus density) app-wide. Replaces the prototype's window.PSLTheme
// and the tweaks-panel wiring with real React context + localStorage.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BrandKey, Theme, getTheme } from './tokens';

export type Density = 'comfortable' | 'compact';

interface ThemeCtx {
  theme: Theme;
  brand: BrandKey;
  dark: boolean;
  density: Density;
  setBrand: (b: BrandKey) => void;
  setDark: (v: boolean) => void;
  toggleDark: () => void;
  setDensity: (d: Density) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

const LS = {
  brand: 'psl.brand',
  dark: 'psl.dark',
  density: 'psl.density',
};

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrandState] = useState<BrandKey>(() => read<BrandKey>(LS.brand, 'navy'));
  const [dark, setDarkState] = useState<boolean>(() => read<boolean>(LS.dark, false));
  const [density, setDensityState] = useState<Density>(() => read<Density>(LS.density, 'comfortable'));

  const setBrand = useCallback((b: BrandKey) => {
    setBrandState(b);
    localStorage.setItem(LS.brand, JSON.stringify(b));
  }, []);
  const setDark = useCallback((v: boolean) => {
    setDarkState(v);
    localStorage.setItem(LS.dark, JSON.stringify(v));
  }, []);
  const toggleDark = useCallback(() => setDark(!dark), [dark, setDark]);
  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    localStorage.setItem(LS.density, JSON.stringify(d));
  }, []);

  const theme = useMemo(() => getTheme(brand, dark), [brand, dark]);

  // Reflect the canvas color + scheme on the document for native form controls
  // and to avoid white flashes between routes.
  useEffect(() => {
    document.documentElement.style.background = theme.panel;
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    document.body.style.background = theme.panel;
  }, [theme, dark]);

  const value: ThemeCtx = { theme, brand, dark, density, setBrand, setDark, toggleDark, setDensity };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme must be used within ThemeProvider');
  return v;
}
