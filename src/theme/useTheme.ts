import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from './theme-context';

/** Access the active theme. Returns the resolved token object `t` plus controls. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
