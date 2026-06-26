// src/components/responsive/useViewport.ts
// One source of truth for width (ported from kit.jsx). Components branch on BP.

import { useEffect, useState } from 'react';

export function useViewport(): number {
  const get = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [w, setW] = useState<number>(get);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setW(get()));
    };
    window.addEventListener('resize', on);
    on();
    return () => {
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return w;
}
