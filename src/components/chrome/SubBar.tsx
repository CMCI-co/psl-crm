// src/components/chrome/SubBar.tsx
// Breadcrumb sub-bar with a right-aligned action slot (used by Profile and other
// detail screens). Crumbs after the first can be navigable.

import { useNavigate } from 'react-router-dom';
import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';

export interface Crumb {
  label: string;
  to?: string;
}

export function SubBar({
  theme: t,
  crumbs,
  children,
}: {
  theme: Theme;
  crumbs: (string | Crumb)[];
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const items: Crumb[] = crumbs.map((c) => (typeof c === 'string' ? { label: c } : c));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 26px',
        background: t.bg,
        borderBottom: `1px solid ${t.line}`,
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span
                onClick={c.to ? () => navigate(c.to as string) : undefined}
                style={{
                  fontFamily: UI,
                  fontSize: 12.5,
                  fontWeight: last ? 600 : 500,
                  color: last ? t.ink : t.sub,
                  cursor: c.to ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {c.label}
              </span>
              {!last && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={t.faint} strokeWidth="1.5">
                  <path d="M4.5 2.5L8 6l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          );
        })}
      </div>
      {children}
    </div>
  );
}
