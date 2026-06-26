// src/components/atoms/OfficeChip.tsx
// Leadership/office chip (ported from kit.jsx). Current offices render gold-filled
// (active tenure); past offices render as a muted outlined "former" label that
// stays on the record permanently.

import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import type { OfficeRole } from '@/types/domain';

export function OfficeChip({ role, theme: t, size = 'md' }: { role?: OfficeRole | null; theme: Theme; size?: 'sm' | 'md' }) {
  if (!role) return null;
  const gold = t.gold || '#a9852f';
  const pad = size === 'sm' ? '2px 8px' : '3px 10px';
  const fs = size === 'sm' ? 10.5 : 11.5;

  if (role.current) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: pad,
          borderRadius: 999,
          background: 'rgba(169,133,47,.14)',
          color: gold,
          fontFamily: UI,
          fontSize: fs,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <svg width={fs} height={fs} viewBox="0 0 16 16" fill="none" stroke={gold} strokeWidth="1.5">
          <path d="M2.5 5l3 2.4L8 3.5l2.5 3.9 3-2.4-1 6.5h-9z" strokeLinejoin="round" />
        </svg>
        {role.title}
        {role.term ? ` · ${role.term}` : ''}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: pad,
        borderRadius: 999,
        background: 'transparent',
        color: t.faint,
        border: `1px solid ${t.line}`,
        fontFamily: UI,
        fontSize: fs,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <svg width={fs - 1} height={fs - 1} viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.4">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Former {role.title}
      {role.term ? ` · ${role.term}` : ''}
    </span>
  );
}
