// src/components/collab/OwnerMenu.tsx
// Person-picker popover + owner chip (ported from collab.jsx). Wraps any trigger;
// opens an "Assign to" list of the leadership team.

import { useEffect, useRef, useState } from 'react';
import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import { TEAM } from '@/data/mockData';
import { useCollab } from '@/store/collab';
import { MiniA } from '@/components/atoms/Avatar';

export function OwnerMenu({
  theme: t,
  current,
  onPick,
  children,
  align = 'left',
  title = 'Assign to',
}: {
  theme: Theme;
  current: string;
  onPick: (name: string) => void;
  children: React.ReactNode;
  align?: 'left' | 'right';
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const me = useCollab((s) => s.me);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex', minWidth: 0, maxWidth: '100%' }}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        style={{ display: 'inline-flex', cursor: 'pointer', minWidth: 0, maxWidth: '100%' }}
      >
        {children}
      </span>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align]: 0,
            zIndex: 80,
            minWidth: 224,
            background: t.bg,
            border: `1px solid ${t.line}`,
            borderRadius: 12,
            boxShadow: '0 14px 40px rgba(15,20,32,.2)',
            padding: 6,
            fontFamily: UI,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              color: t.faint,
              padding: '6px 9px 7px',
            }}
          >
            {title}
          </div>
          {TEAM.map((m) => {
            const on = m.name === current;
            return (
              <div
                key={m.name}
                onClick={() => {
                  onPick(m.name);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 9px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: on ? t.accentSoft : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!on) (e.currentTarget as HTMLDivElement).style.background = t.panel;
                }}
                onMouseLeave={(e) => {
                  if (!on) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <MiniA name={m.name} theme={t} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>
                    {m.name}
                    {m.name === me ? ' (you)' : ''}
                  </div>
                  <div style={{ fontSize: 11, color: t.faint }}>{m.role}</div>
                </div>
                {on && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.9">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </span>
  );
}

export function OwnerChip({
  theme: t,
  owner,
  onPick,
  size = 20,
}: {
  theme: Theme;
  owner: string;
  onPick: (name: string) => void;
  size?: number;
}) {
  const me = useCollab((s) => s.me);
  const isMe = owner === me;
  return (
    <OwnerMenu theme={t} current={owner} onPick={onPick}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '3px 9px 3px 3px',
          borderRadius: 999,
          border: `1px solid ${t.line}`,
          background: t.bg,
          minWidth: 0,
          maxWidth: '100%',
        }}
        title={`Owner: ${owner} — click to reassign`}
      >
        <MiniA name={owner} theme={t} size={size} />
        <span
          style={{
            fontSize: 12,
            color: isMe ? t.ink : t.sub,
            fontWeight: isMe ? 600 : 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {isMe ? 'You' : owner.split(' ')[0]}
        </span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.faint} strokeWidth="1.5" style={{ flexShrink: 0 }}>
          <path d="M3 4.5L6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </OwnerMenu>
  );
}
