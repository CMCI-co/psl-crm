// src/components/atoms/Tag.tsx
// Stage tag, status dot, and uppercase micro-label (ported from kit.jsx).

import type { StageKey, Theme } from '@/theme/tokens';
import { STAGES, UI } from '@/theme/tokens';

export function Tag({ stage, size = 'md', theme: t }: { stage: StageKey; size?: 'sm' | 'md'; theme: Theme }) {
  const pal = (t?.stages || STAGES)[stage] || (t?.stages || STAGES).member;
  const pad = size === 'sm' ? '2px 8px' : '4px 11px';
  const fs = size === 'sm' ? 11 : 12.5;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: pad,
        borderRadius: 999,
        background: pal.bg,
        color: pal.fg,
        fontFamily: UI,
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: 0.1,
        whiteSpace: 'nowrap',
      }}
    >
      {pal.label}
    </span>
  );
}

export function Dot({ active }: { active: boolean }) {
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: active ? '#3aa563' : '#c4b9b9',
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}

export function Eyebrow({
  children,
  theme: t,
  style,
}: {
  children: React.ReactNode;
  theme: Theme;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: UI,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        color: t.faint,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
