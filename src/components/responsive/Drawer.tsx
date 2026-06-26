// src/components/responsive/Drawer.tsx
// Off-canvas drawer + sticky horizontal tab strip (ported from kit.jsx).
// The drawer powers nav/filters on narrow screens; the tab strip is the
// "card system" tab navigation on profile/section views below the breakpoint.

import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';

export function Drawer({
  theme: t,
  open,
  onClose,
  side = 'left',
  width = 300,
  children,
}: {
  theme: Theme;
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  width?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: open ? 'auto' : 'none' }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15,20,32,.46)',
          opacity: open ? 1 : 0,
          transition: 'opacity .22s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [side]: 0,
          width,
          maxWidth: '86%',
          background: t.bg,
          color: t.ink,
          borderRight: side === 'left' ? `1px solid ${t.line}` : 'none',
          borderLeft: side === 'right' ? `1px solid ${t.line}` : 'none',
          transform: open ? 'translateX(0)' : `translateX(${side === 'left' ? '-101%' : '101%'})`,
          transition: 'transform .26s cubic-bezier(.32,.72,0,1)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          boxShadow: open ? '0 12px 48px rgba(15,20,32,.28)' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode | ((on: boolean) => React.ReactNode);
  badge?: number | string | null;
}

export function TabStrip({
  theme: t,
  items,
  active,
  onChange,
  top = 0,
}: {
  theme: Theme;
  items: TabItem[];
  active: string;
  onChange: (k: string) => void;
  top?: number;
}) {
  return (
    <div
      className="psl-no-scrollbar"
      style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        padding: '9px 12px',
        background: t.bg,
        borderBottom: `1px solid ${t.line}`,
        position: 'sticky',
        top,
        zIndex: 6,
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {items.map((it) => {
        const on = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 13px',
              borderRadius: 999,
              border: `1px solid ${on ? t.accent : t.line}`,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontFamily: UI,
              fontSize: 12.5,
              fontWeight: 600,
              flexShrink: 0,
              background: on ? t.accent : t.bg,
              color: on ? t.onAccent : t.sub,
            }}
          >
            {typeof it.icon === 'function' ? it.icon(on) : it.icon}
            {it.label}
            {it.badge != null && (
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: '0 6px',
                  borderRadius: 999,
                  background: on ? 'rgba(255,255,255,.22)' : t.accentSoft,
                  color: on ? '#fff' : t.accent,
                }}
              >
                {it.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
