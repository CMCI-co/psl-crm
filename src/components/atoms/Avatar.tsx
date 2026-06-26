// src/components/atoms/Avatar.tsx
// Initials-on-tint avatar (ported from kit.jsx). Production supports an uploaded
// photo via avatarUrl with an initials fallback.

import type { Theme } from '@/theme/tokens';
import { SERIF, UI } from '@/theme/tokens';

export function initials(f: string, l: string) {
  return (f?.[0] ?? '') + (l?.[0] ?? '');
}

interface AvatarProps {
  f: string;
  l: string;
  size?: number;
  theme: Theme;
  ring?: boolean;
  src?: string;
}

export function Avatar({ f, l, size = 56, theme: t, ring, src }: AvatarProps) {
  const ringShadow = ring ? `0 0 0 3px ${t.bg}, 0 0 0 4px ${t.line}` : 'none';
  if (src) {
    return (
      <img
        src={src}
        alt={`${f} ${l}`}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, boxShadow: ringShadow }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: t.accentSoft,
        color: t.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SERIF,
        fontWeight: 500,
        fontSize: size * 0.4,
        letterSpacing: 0.2,
        boxShadow: ringShadow,
        userSelect: 'none',
      }}
    >
      {initials(f, l)}
    </div>
  );
}

/** Small initials chip for owners/assignees (ported from collab.jsx MiniA). */
export function MiniA({ name, theme: t, size = 22 }: { name: string; theme: Theme; size?: number }) {
  const init = (name || '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: t.accentSoft,
        color: t.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 700,
        flexShrink: 0,
        fontFamily: UI,
      }}
    >
      {init}
    </div>
  );
}
