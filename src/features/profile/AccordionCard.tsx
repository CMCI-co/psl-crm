// AccordionCard.tsx — the collapsible section shell used by the Profile
// workspace (port of engagement.jsx AccordionCard). An icon + title + summary
// header with an optional edit affordance (gated by `editable`), and a body
// that expands/collapses.
import { useState, type ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';
import { SERIF } from '@/theme/tokens';

export function AccordionCard({
  icon, title, summary, badge, defaultOpen, editable, editLabel, onEdit, children,
}: {
  icon: ReactNode;
  title: string;
  summary?: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  editable?: boolean;
  editLabel?: string;
  onEdit?: () => void;
  children: ReactNode;
}) {
  const { t } = useTheme();
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
      <div onClick={() => setOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontFamily: SERIF, fontSize: 17, color: t.ink }}>{title}</span>
            {badge}
          </div>
          {summary && <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>{summary}</div>}
        </div>
        {open && editable && (
          <span onClick={(e) => { e.stopPropagation(); onEdit?.(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: t.accent, cursor: 'pointer', marginRight: 4 }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg>{editLabel || 'Add'}
          </span>
        )}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.7" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }}><path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {open && <div style={{ padding: '4px 16px 16px', borderTop: `1px solid ${t.panel2}` }}>{children}</div>}
    </div>
  );
}
