// TabStrip.tsx — scrollable sticky pill tabs; the "card system" nav on narrow
// screens (kit.jsx TabStrip).
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI } from '@/theme/tokens';

export interface TabItem { key: string; label: string; icon?: ReactNode; badge?: number | string }

export function TabStrip({
  items, active, onChange, top = 0,
}: { items: TabItem[]; active: string; onChange: (k: string) => void; top?: number }) {
  const { t } = useTheme();
  return (
    <div
      style={{
        display: 'flex', gap: 6, overflowX: 'auto', padding: '9px 12px',
        background: t.bg, borderBottom: `1px solid ${t.line}`,
        position: 'sticky', top, zIndex: 6, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}
    >
      {items.map((it) => {
        const on = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px',
              borderRadius: 999, border: `1px solid ${on ? t.accent : t.line}`, whiteSpace: 'nowrap', cursor: 'pointer',
              fontFamily: UI, fontSize: 12.5, fontWeight: 600, flexShrink: 0,
              background: on ? t.accent : t.bg, color: on ? t.onAccent : t.sub,
            }}
          >
            {it.icon}
            {it.label}
            {it.badge != null && (
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '0 6px', borderRadius: 999, background: on ? 'rgba(255,255,255,.22)' : t.accentSoft, color: on ? '#fff' : t.accent }}>
                {it.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
