// SubBar.tsx — breadcrumb + actions strip under the top bar (crm-app.jsx SubBar).
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI } from '@/theme/tokens';
import { useNav } from '@/routes/useNav';

export function SubBar({ crumbs, children }: { crumbs: ReactNode[]; children?: ReactNode }) {
  const { t } = useTheme();
  const { back, canBack } = useNav();
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '11px 22px',
        background: t.bg, borderBottom: `1px solid ${t.line}`, minHeight: 50,
      }}
    >
      {canBack && (
        <button
          onClick={back}
          aria-label="Back"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer', flexShrink: 0 }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 3.5L5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0, flex: 1, overflow: 'hidden' }}>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
              {i > 0 && <span style={{ color: t.faint, fontSize: 12 }}>/</span>}
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: last ? 600 : 500, color: last ? t.ink : t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c}
              </span>
            </span>
          );
        })}
      </nav>
      {children && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{children}</div>}
    </div>
  );
}
