// src/components/collab/NotifBell.tsx
// Header notification bell for the current identity (ported from collab.jsx).
// Notifications fan out from teammates' actions; you never get notified of your own.

import { useEffect, useRef, useState } from 'react';
import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import { useCollab } from '@/store/collab';

export function NotifBell({ theme: t }: { theme: Theme }) {
  const me = useCollab((s) => s.me);
  const notifs = useCollab((s) => s.notifs);
  const markRead = useCollab((s) => s.markRead);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const mine = notifs.filter((n) => n.toId === me);
  const unread = mine.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const toggle = () =>
    setOpen((o) => {
      const nx = !o;
      if (nx && unread) markRead(me);
      return nx;
    });

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={toggle}
        aria-label="Notifications"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 38,
          height: 38,
          borderRadius: 10,
          border: `1px solid ${t.line}`,
          background: t.bg,
          color: t.sub,
          cursor: 'pointer',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            d="M9 2.5a4.5 4.5 0 0 0-4.5 4.5c0 3-1 4-1.5 4.6h12c-.5-.6-1.5-1.6-1.5-4.6A4.5 4.5 0 0 0 9 2.5zM7.2 14.5a1.8 1.8 0 0 0 3.6 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              minWidth: 15,
              height: 15,
              padding: '0 4px',
              borderRadius: 999,
              background: '#b3402f',
              color: '#fff',
              fontSize: 9.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: UI,
            }}
          >
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 80,
            width: 312,
            maxHeight: 380,
            overflowY: 'auto',
            background: t.bg,
            border: `1px solid ${t.line}`,
            borderRadius: 14,
            boxShadow: '0 16px 44px rgba(15,20,32,.22)',
            padding: 6,
            fontFamily: UI,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: t.faint,
              padding: '8px 10px 9px',
            }}
          >
            Notifications
          </div>
          {mine.length === 0 ? (
            <div style={{ padding: '14px 10px 18px', fontSize: 12.5, color: t.faint }}>
              Nothing assigned to you yet. When a teammate hands off a relationship or follow-up, it shows up here.
            </div>
          ) : (
            mine.map((n) => (
              <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px', borderRadius: 9, alignItems: 'flex-start' }}>
                <span
                  style={{
                    marginTop: 1,
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: t.accentSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.6">
                    <path d="M3 8.2l2.2 2.2L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: t.ink, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2, lineHeight: 1.4 }}>
                    {n.sub} · {n.createdAt}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </span>
  );
}
