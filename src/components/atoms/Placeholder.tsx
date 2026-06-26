// src/components/atoms/Placeholder.tsx
// Striped placeholder for genuinely-absent content (ported from kit.jsx).

import type { Theme } from '@/theme/tokens';

export function Placeholder({
  label,
  w = '100%',
  h = 90,
  theme: t,
}: {
  label: string;
  w?: number | string;
  h?: number | string;
  theme: Theme;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 8,
        border: `1px dashed ${t.line}`,
        backgroundImage: `repeating-linear-gradient(45deg, ${t.panel}, ${t.panel} 6px, ${t.bg} 6px, ${t.bg} 12px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Mono', monospace",
        fontSize: 10.5,
        letterSpacing: 0.5,
        color: t.faint,
      }}
    >
      {label}
    </div>
  );
}
