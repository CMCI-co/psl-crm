// atoms.tsx — small presentational primitives ported from the prototype
// (kit.jsx). They read the active theme from context instead of taking a `t`
// prop, but the visual output is identical.
import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';
import { SERIF, UI, type Stage } from '@/theme/tokens';

export function initials(f: string, l: string): string {
  return (f[0] ?? '') + (l[0] ?? '');
}

export function Avatar({
  first, last, size = 56, ring, url,
}: { first: string; last: string; size?: number; ring?: boolean; url?: string | null }) {
  const { t } = useTheme();
  const base: CSSProperties = {
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    boxShadow: ring ? `0 0 0 3px ${t.bg}, 0 0 0 4px ${t.line}` : 'none',
    userSelect: 'none', objectFit: 'cover',
  };
  if (url) return <img src={url} alt={`${first} ${last}`} style={base} />;
  return (
    <div
      style={{
        ...base,
        background: t.accentSoft, color: t.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: SERIF, fontWeight: 500, fontSize: size * 0.4, letterSpacing: 0.2,
      }}
    >
      {initials(first, last)}
    </div>
  );
}

export function Tag({ stage, size = 'md' }: { stage: Stage; size?: 'sm' | 'md' }) {
  const { t } = useTheme();
  const s = t.stages[stage] ?? t.stages.member;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: size === 'sm' ? '2px 8px' : '4px 11px',
        borderRadius: 999, background: s.bg, color: s.fg,
        fontFamily: UI, fontSize: size === 'sm' ? 11 : 12.5, fontWeight: 600,
        letterSpacing: 0.1, whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

export function Dot({ active }: { active: boolean }) {
  return (
    <span
      style={{
        width: 7, height: 7, borderRadius: '50%',
        background: active ? '#3aa563' : '#c4b9b9',
        display: 'inline-block', flexShrink: 0,
      }}
    />
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const { t } = useTheme();
  return (
    <div style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: t.faint, ...style }}>
      {children}
    </div>
  );
}

export function Field({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  const { t } = useTheme();
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: UI, fontSize: 14.5, fontWeight: 500, color: t.ink, lineHeight: 1.3, fontVariantNumeric: mono ? 'tabular-nums' : 'normal' }}>
        {value}
      </div>
    </div>
  );
}

export interface OfficeLike { title: string; term: string | null; current: boolean }
export function OfficeChip({ office, size = 'md' }: { office: OfficeLike | null; size?: 'sm' | 'md' }) {
  const { t } = useTheme();
  if (!office) return null;
  const gold = t.gold;
  const pad = size === 'sm' ? '2px 8px' : '3px 10px';
  const fs = size === 'sm' ? 10.5 : 11.5;
  if (office.current) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: pad, borderRadius: 999, background: 'rgba(169,133,47,.14)', color: gold, fontFamily: UI, fontSize: fs, fontWeight: 700, whiteSpace: 'nowrap' }}>
        <svg width={fs} height={fs} viewBox="0 0 16 16" fill="none" stroke={gold} strokeWidth="1.5"><path d="M2.5 5l3 2.4L8 3.5l2.5 3.9 3-2.4-1 6.5h-9z" strokeLinejoin="round" /></svg>
        {office.title}{office.term ? ` · ${office.term}` : ''}
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: pad, borderRadius: 999, background: 'transparent', color: t.faint, border: `1px solid ${t.line}`, fontFamily: UI, fontSize: fs, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <svg width={fs - 1} height={fs - 1} viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.4"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Former {office.title}{office.term ? ` · ${office.term}` : ''}
    </span>
  );
}
