// atoms.tsx — small presentational primitives for the team-collaboration layer,
// ported from collab.jsx / features.jsx. They read the active theme from context.
import type { CSSProperties } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI } from '@/theme/tokens';
import type { Channel, Priority, TaskStatus } from '@/types/domain';

const initialsOf = (name: string) =>
  (name || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/** Compact initials avatar (self-contained — no photos). */
export function MiniAvatar({ name, size = 22 }: { name: string; size?: number }) {
  const { t } = useTheme();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 700, flexShrink: 0, fontFamily: UI }}>
      {initialsOf(name)}
    </div>
  );
}

/** Channel glyph for the interaction log (call / text / email / visit). */
export function ChannelIcon({ kind, color, size = 12 }: { kind: Channel; color: string; size?: number }) {
  const s: CSSProperties = { width: size, height: size, display: 'block' };
  switch (kind) {
    case 'Call':
      return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><path d="M2.5 3c0 5 3.5 8.5 8.5 8.5l.8-2-2.3-1-1 1c-1.3-.6-2.4-1.7-3-3l1-1-1-2.3z" strokeLinejoin="round" /></svg>;
    case 'Text':
      return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><path d="M2 3.5h10v6H6l-2.5 2v-2H2z" strokeLinejoin="round" /></svg>;
    case 'Email':
      return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><rect x="1.8" y="3" width="10.4" height="8" rx="1.2" /><path d="M2.2 3.6L7 7.4l4.8-3.8" strokeLinecap="round" /></svg>;
    case 'Visit':
      return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><path d="M7 1.8c2.2 0 4 1.7 4 3.9 0 2.7-4 6.5-4 6.5S3 8.4 3 5.7c0-2.2 1.8-3.9 4-3.9z" strokeLinejoin="round" /><circle cx="7" cy="5.6" r="1.3" /></svg>;
    default:
      return null;
  }
}

/** Pill showing which channel an interaction used. */
export function ChannelBadge({ type }: { type: Channel }) {
  const { t } = useTheme();
  const map: Record<Channel, string> = { Call: t.accent, Visit: '#1f6b46', Email: t.faint, Text: '#8a5a16' };
  const c = map[type] ?? t.faint;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: t.panel, border: `1px solid ${t.line}`, fontSize: 11, fontWeight: 600, color: c }}>
      <ChannelIcon kind={type} color={c} />{type}
    </span>
  );
}

/** Linear-style status glyph for follow-up tasks (todo / doing / done). */
export function TaskStatusIcon({ status }: { status: TaskStatus }) {
  const { t } = useTheme();
  if (status === 'done') {
    return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#1f6b46" /><path d="M4.7 8.2l2.1 2.1 4.3-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (status === 'doing') {
    return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.6" fill="none" stroke={t.accent} strokeWidth="1.5" /><path d="M8 8 V1.4 A6.6 6.6 0 0 1 14.6 8 Z" fill={t.accent} /></svg>;
  }
  return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.6" fill="none" stroke={t.faint} strokeWidth="1.5" strokeDasharray="2.4 2.2" /></svg>;
}

/** Priority flag (high / med / low). */
export function PriorityFlag({ pri }: { pri: Priority }) {
  const map: Record<Priority, { c: string; l: string }> = {
    high: { c: '#b3402f', l: 'High' },
    med: { c: '#8a5a16', l: 'Med' },
    low: { c: '#8b91a0', l: 'Low' },
  };
  const p = map[pri];
  if (!p) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: p.c }}>
      <svg width="9" height="10" viewBox="0 0 9 10" fill="none" stroke={p.c} strokeWidth="1.3"><path d="M1.5 9V1h5l-1.3 2L7 5H1.5" strokeLinejoin="round" strokeLinecap="round" /></svg>{p.l}
    </span>
  );
}
