import { createContext } from 'react';
import type { BrandKey, Density, Mode, ThemeTokens } from './tokens';

export interface ThemeContextValue {
  /** Fully resolved token object — use in inline styles as `t.ink`, `t.accent`, … */
  t: ThemeTokens;
  brand: BrandKey;
  mode: Mode;
  density: Density;
  setBrand: (b: BrandKey) => void;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  setDensity: (d: Density) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
