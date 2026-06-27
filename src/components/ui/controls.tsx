// controls.tsx — interactive primitives (Button, SegmentedControl, StatChip).
import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI } from '@/theme/tokens';

type BtnKind = 'primary' | 'ghost' | 'subtle' | 'danger';

export function Button({
  label, icon, onClick, kind = 'ghost', disabled, type = 'button', title, full,
}: {
  label: ReactNode; icon?: ReactNode; onClick?: () => void; kind?: BtnKind;
  disabled?: boolean; type?: 'button' | 'submit'; title?: string; full?: boolean;
}) {
  const { t } = useTheme();
  const palette: Record<BtnKind, CSSProperties> = {
    primary: { background: t.accent, color: t.onAccent, border: `1px solid ${t.accent}` },
    ghost: { background: t.bg, color: t.sub, border: `1px solid ${t.line}` },
    subtle: { background: t.panel, color: t.ink, border: `1px solid ${t.line}` },
    danger: { background: 'transparent', color: '#b3402f', border: '1px solid #e3b4ac' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '8px 14px', borderRadius: 9, cursor: disabled ? 'default' : 'pointer',
        fontFamily: UI, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
        width: full ? '100%' : undefined, opacity: disabled ? 0.55 : 1,
        transition: 'filter .12s ease', ...palette[kind],
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.97)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
    >
      {icon}
      {label}
    </button>
  );
}

export interface SegItem { key: string; label: ReactNode; badge?: number | string }

export function SegmentedControl({
  items, value, onChange, size = 'md',
}: { items: SegItem[]; value: string; onChange: (k: string) => void; size?: 'sm' | 'md' }) {
  const { t } = useTheme();
  const padY = size === 'sm' ? 6 : 7;
  return (
    <div style={{ display: 'inline-flex', background: t.panel, border: `1px solid ${t.line}`, borderRadius: 10, padding: 3, gap: 2 }}>
      {items.map((it) => {
        const on = it.key === value;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: `${padY}px 12px`, borderRadius: 7, border: 'none', cursor: 'pointer',
              fontFamily: UI, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
              background: on ? t.bg : 'transparent', color: on ? t.ink : t.sub,
              boxShadow: on ? '0 1px 2px rgba(15,20,32,.10)' : 'none',
            }}
          >
            {it.label}
            {it.badge != null && (
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '0 6px', borderRadius: 999, background: on ? t.accentSoft : t.panel2, color: on ? t.accent : t.faint }}>
                {it.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function StatChip({ label, value, tone }: { label: string; value: ReactNode; tone?: string }) {
  const { t } = useTheme();
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, padding: '7px 13px', borderRadius: 10, background: t.bg, border: `1px solid ${t.line}` }}>
      <span style={{ fontFamily: UI, fontSize: 17, fontWeight: 700, color: tone ?? t.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint }}>{label}</span>
    </div>
  );
}
