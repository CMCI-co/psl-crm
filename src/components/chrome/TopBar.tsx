// src/components/chrome/TopBar.tsx
// App top bar (ported from directory.jsx). Desktop: brand + section tabs +
// search + context action + mode/notif/identity. Narrow: hamburger opens a
// Drawer with the same nav (+ an optional contextual sidebar). Navigation goes
// through React Router instead of the prototype's window.PSLNav.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Theme } from '@/theme/tokens';
import { SERIF, UI, BP } from '@/theme/tokens';
import { useViewport } from '@/components/responsive/useViewport';
import { Drawer } from '@/components/responsive/Drawer';
import { ModeToggle, IdentitySwitcher } from '@/components/collab/Chrome';
import { NotifBell } from '@/components/collab/NotifBell';

type Section = 'directory' | 'tracker' | 'resources';

const TABS: { id: Section; label: string; to: string }[] = [
  { id: 'directory', label: 'Directory', to: '/directory/active' },
  { id: 'tracker', label: 'Relationship Tracker', to: '/tracker' },
  { id: 'resources', label: 'Resources', to: '/resources' },
];

function TopNavIcon({ kind, color }: { kind: Section; color: string }) {
  const s: React.CSSProperties = { width: 15, height: 15, display: 'block' };
  if (kind === 'resources')
    return (
      <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="2" y="3" width="12" height="9.5" rx="1.5" />
        <path d="M6.6 6v4l3.2-2z" fill={color} stroke="none" />
      </svg>
    );
  if (kind === 'tracker')
    return (
      <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
        <circle cx="5.4" cy="5" r="2.2" />
        <path d="M1.6 12.6c0-2.1 1.7-3.4 3.8-3.4 1 0 1.9.3 2.6.9" strokeLinecap="round" />
        <circle cx="11" cy="10.6" r="3.2" />
        <path d="M11 9.2v1.4l1 .9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5">
      <rect x="2" y="2.5" width="5" height="5" rx="1" />
      <rect x="9" y="2.5" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  );
}

export function TopBar({
  theme: t,
  section = 'directory',
  sidebar = null,
  onAction,
}: {
  theme: Theme;
  section?: Section;
  sidebar?: React.ReactNode;
  onAction?: () => void;
}) {
  const navigate = useNavigate();
  const w = useViewport();
  const narrow = w < BP.tab;
  const [menu, setMenu] = useState(false);

  const onResources = section === 'resources';
  const onTracker = section === 'tracker';

  const go = (to: string) => {
    setMenu(false);
    navigate(to);
  };

  const actionLabel = onResources ? 'Upload resource' : onTracker ? 'Log interaction' : 'Generate report';
  const actionIcon = onResources ? (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 9.5V2.5M4.2 5.3L7 2.5l2.8 2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 9.5v2h9v-2" strokeLinecap="round" />
    </svg>
  ) : onTracker ? (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 2.5v9M2.5 7h9" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 1.5h5l3 3v8h-8z" strokeLinejoin="round" />
      <path d="M5 8h4M5 10h4" strokeLinecap="round" />
    </svg>
  );

  if (narrow) {
    const iconBtn: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: 10,
      border: `1px solid ${t.chromeLine || t.line}`,
      background: t.bg,
      color: t.sub,
      cursor: 'pointer',
      flexShrink: 0,
    };
    return (
      <>
        <div
          style={{
            height: 56,
            background: t.chrome || t.bg,
            borderBottom: `1px solid ${t.chromeLine || t.line}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button onClick={() => setMenu(true)} aria-label="Menu" style={iconBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M3 5h12M3 9h12M3 13h12" strokeLinecap="round" />
            </svg>
          </button>
          <div onClick={() => go('/directory/active')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 0 }}>
            <div
              style={{
                minWidth: 28,
                height: 26,
                padding: '0 5px',
                borderRadius: 6,
                background: t.accent,
                color: t.onAccent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: SERIF,
                fontSize: 13,
                letterSpacing: 1.2,
                flexShrink: 0,
              }}
            >
              ΦΣΛ
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.ink, letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Phi Sigma Lambda
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <ModeToggle theme={t} />
          <NotifBell theme={t} />
          <IdentitySwitcher theme={t} />
        </div>
        <Drawer theme={t} open={menu} onClose={() => setMenu(false)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '16px 16px 14px' }}>
            <div
              style={{
                minWidth: 30,
                height: 28,
                padding: '0 6px',
                borderRadius: 7,
                background: t.accent,
                color: t.onAccent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: SERIF,
                fontSize: 14,
                letterSpacing: 1.5,
              }}
            >
              ΦΣΛ
            </div>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: t.ink }}>Phi Sigma Lambda</span>
            <span onClick={() => setMenu(false)} style={{ marginLeft: 'auto', color: t.faint, cursor: 'pointer', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <div style={{ height: 1, background: t.line, margin: '0 16px 10px' }} />
          <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {TABS.map((tab) => {
              const on = section === tab.id;
              return (
                <span
                  key={tab.id}
                  onClick={() => go(tab.to)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '11px 12px',
                    borderRadius: 9,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: on ? t.accentSoft : 'transparent',
                    color: on ? t.accent : t.ink,
                  }}
                >
                  <TopNavIcon kind={tab.id} color={on ? t.accent : t.faint} />
                  {tab.label}
                </span>
              );
            })}
          </div>
          {sidebar && <div style={{ height: 1, background: t.line, margin: '12px 16px' }} />}
          {sidebar && <div style={{ paddingBottom: 24 }}>{sidebar}</div>}
        </Drawer>
      </>
    );
  }

  return (
    <div
      style={{
        height: 56,
        background: t.chrome || t.bg,
        borderBottom: `1px solid ${t.chromeLine || t.line}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        gap: 16,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => go('/directory/active')}>
        <div
          style={{
            minWidth: 30,
            height: 28,
            padding: '0 6px',
            borderRadius: 7,
            background: t.accent,
            color: t.onAccent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SERIF,
            fontSize: 14,
            letterSpacing: 1.5,
          }}
        >
          ΦΣΛ
        </div>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: t.chromeInk || t.ink, letterSpacing: -0.2 }}>Phi Sigma Lambda</span>
      </div>
      <div style={{ width: 1, height: 22, background: t.chromeLine || t.line }} />
      <div style={{ display: 'flex', gap: 3 }}>
        {TABS.map((tab) => {
          const on = section === tab.id;
          return (
            <span
              key={tab.id}
              onClick={() => go(tab.to)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 13px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: on ? t.accentSoft : 'transparent',
                color: on ? t.accent : t.sub,
              }}
            >
              <TopNavIcon kind={tab.id} color={on ? t.accent : t.faint} />
              {tab.label}
            </span>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 12px',
          borderRadius: 9,
          background: t.bg,
          border: `1px solid ${t.chromeLine || t.line}`,
          width: 220,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.5">
          <circle cx="6" cy="6" r="4.5" />
          <path d="M10 10l3 3" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 12.5, color: t.faint }}>
          {onResources ? 'Search resources…' : onTracker ? 'Search alumni…' : 'Search members…'}
        </span>
      </div>
      <button
        onClick={onAction}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 14px',
          borderRadius: 9,
          background: t.accent,
          color: t.onAccent,
          border: 'none',
          fontFamily: UI,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {actionIcon}
        {actionLabel}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ModeToggle theme={t} />
        <NotifBell theme={t} />
        <IdentitySwitcher theme={t} />
      </div>
    </div>
  );
}
