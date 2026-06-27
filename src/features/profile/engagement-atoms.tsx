// engagement-atoms.tsx — small glyphs for the engagement record (life-area
// icons + the life-area health pill), ported from features.jsx.
import type { CSSProperties } from 'react';

export type AreaKind = 'personal' | 'family' | 'work' | 'spiritual' | 'prayer';
export type StatusTone = 'good' | 'steady' | 'watch' | 'info';

/** Life-area glyph (simple shapes only). */
export function AreaIcon({ kind, color, size = 15 }: { kind: AreaKind; color: string; size?: number }) {
  const s: CSSProperties = { width: size, height: size, display: 'block' };
  switch (kind) {
    case 'personal':
      return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="8" cy="5.4" r="2.5" /><path d="M3.4 13c0-2.3 2-3.7 4.6-3.7s4.6 1.4 4.6 3.7" strokeLinecap="round" /></svg>;
    case 'family':
      return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="5.6" cy="5.6" r="2" /><circle cx="10.8" cy="6.2" r="1.6" /><path d="M2.3 12.6c0-1.9 1.5-3.1 3.3-3.1 1.1 0 2 .4 2.6 1.1M9.2 12.6c.2-1.5 1.2-2.4 2.7-2.4" strokeLinecap="round" /></svg>;
    case 'work':
      return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="2.4" y="5.2" width="11.2" height="7.6" rx="1.4" /><path d="M6 5.2V4a1 1 0 011-1h2a1 1 0 011 1v1.2M2.4 8.6h11.2" strokeLinecap="round" /></svg>;
    case 'spiritual':
      return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 2.4v11.2M4.6 6.2h6.8" strokeLinecap="round" /></svg>;
    case 'prayer':
      return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 13.2s-4.3-2.7-4.3-6A2.55 2.55 0 018 4.5a2.55 2.55 0 014.3 2.7c0 3.3-4.3 6-4.3 6z" strokeLinejoin="round" /></svg>;
    default:
      return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="3" y="3" width="10" height="10" rx="2" /></svg>;
  }
}

/** Status pill for life-area health (good / steady / watch / info). */
export function StatusPill({ tone, label }: { tone: StatusTone; label: string }) {
  const tones: Record<StatusTone, { bg: string; fg: string }> = {
    good: { bg: '#e3f3ea', fg: '#1f6b46' },
    steady: { bg: '#e8eef9', fg: '#3a5da8' },
    watch: { bg: '#fbefdd', fg: '#8a5a16' },
    info: { bg: '#eef0f4', fg: '#6b7280' },
  };
  const c = tones[tone] ?? tones.info;
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 999, background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>{label}</span>;
}
