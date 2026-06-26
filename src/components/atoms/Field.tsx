// src/components/atoms/Field.tsx
// Label-over-value field (ported from kit.jsx).

import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';

export function Field({
  label,
  value,
  theme: t,
  mono,
}: {
  label: string;
  value?: React.ReactNode;
  theme: Theme;
  mono?: boolean;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontFamily: UI,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: t.faint,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: UI,
          fontSize: 14.5,
          fontWeight: 500,
          color: t.ink,
          lineHeight: 1.3,
          fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
        }}
      >
        {value ?? '—'}
      </div>
    </div>
  );
}
