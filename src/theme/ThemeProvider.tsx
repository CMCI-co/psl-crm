import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getTheme, type BrandKey, type Density, type Mode } from './tokens';
import { ThemeContext } from './theme-context';

const LS_KEY = 'psl.theme.v1';

interface Persisted { brand: BrandKey; mode: Mode; density: Density; }

function load(): Persisted {
  const fallback: Persisted = { brand: 'navy', mode: 'light', density: 'comfortable' };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return { ...fallback, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    /* ignore */
  }
  // First visit: honor the OS dark-mode preference.
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) fallback.mode = 'dark';
  return fallback;
}

/** Push the resolved palette onto <html> as CSS variables for global styling. */
function applyCssVars(brand: BrandKey, mode: Mode, density: Density) {
  const t = getTheme(brand, mode);
  const root = document.documentElement;
  const set = (k: string, v: string) => root.style.setProperty(k, v);
  set('--ink', t.ink); set('--sub', t.sub); set('--faint', t.faint);
  set('--bg', t.bg); set('--panel', t.panel); set('--panel2', t.panel2); set('--line', t.line);
  set('--chrome', t.chrome); set('--chrome-line', t.chromeLine);
  set('--accent', t.accent); set('--accent-deep', t.accentDeep);
  set('--accent-soft', t.accentSoft); set('--on-accent', t.onAccent);
  set('--gold', t.gold);
  root.dataset.brand = brand;
  root.dataset.mode = mode;
  root.dataset.density = density;
  root.style.colorScheme = mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [{ brand, mode, density }, setState] = useState<Persisted>(load);

  useEffect(() => {
    applyCssVars(brand, mode, density);
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify({ brand, mode, density }));
    } catch {
      /* ignore */
    }
  }, [brand, mode, density]);

  const setBrand = useCallback((b: BrandKey) => setState((s) => ({ ...s, brand: b })), []);
  const setMode = useCallback((m: Mode) => setState((s) => ({ ...s, mode: m })), []);
  const toggleMode = useCallback(
    () => setState((s) => ({ ...s, mode: s.mode === 'dark' ? 'light' : 'dark' })),
    [],
  );
  const setDensity = useCallback((d: Density) => setState((s) => ({ ...s, density: d })), []);

  const value = useMemo(
    () => ({ t: getTheme(brand, mode), brand, mode, density, setBrand, setMode, toggleMode, setDensity }),
    [brand, mode, density, setBrand, setMode, toggleMode, setDensity],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
