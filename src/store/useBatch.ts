// src/store/useBatch.ts
// Per-list batch-selection state (ported from collab.jsx useBatch). Checkboxes
// are only visible while `selecting` is true; the floating BatchBar shows the
// count + the correct lifecycle action and applies it to the whole selection.

import { useState } from 'react';

export function useBatch() {
  const [selecting, setSelecting] = useState(false);
  const [sel, setSel] = useState<Set<string>>(() => new Set());

  const toggle = (k: string) =>
    setSel((s) => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });
  const setAll = (keys: string[], on: boolean) => setSel(on ? new Set(keys) : new Set());
  const clear = () => {
    setSel(new Set());
    setSelecting(false);
  };

  return { selecting, setSelecting, sel, toggle, setAll, clear };
}
