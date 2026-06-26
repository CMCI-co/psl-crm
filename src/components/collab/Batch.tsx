// src/components/collab/Batch.tsx
// Batch-selection UI (ported from collab.jsx): the row checkbox (with
// indeterminate state), the Select⇄Done header toggle, and the floating
// BatchBar shown only while selecting.

import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';

export function SelChk({
  theme: t,
  checked,
  indeterminate,
  onChange,
  size = 18,
}: {
  theme: Theme;
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  size?: number;
}) {
  const on = checked || !!indeterminate;
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      role="checkbox"
      aria-checked={!!checked}
      style={{
        width: size,
        height: size,
        borderRadius: 5,
        border: `1.5px solid ${on ? t.accent : t.line}`,
        background: on ? t.accent : t.bg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background .12s, border-color .12s',
      }}
    >
      {checked && (
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 12 12" fill="none" stroke={t.onAccent} strokeWidth="2.2">
          <path d="M2 6.2l2.6 2.6L10 3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && <span style={{ width: size * 0.5, height: 2.2, background: t.onAccent, borderRadius: 2 }} />}
    </span>
  );
}

export function SelectToggle({ theme: t, selecting, onToggle }: { theme: Theme; selecting: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        border: `1px solid ${selecting ? t.accent : t.line}`,
        background: selecting ? t.accentSoft : t.bg,
        color: selecting ? t.accent : t.sub,
        fontFamily: UI,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {selecting ? (
        <>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3.5 7.5l2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2" y="2" width="10" height="10" rx="2.5" />
            <path d="M4.6 7l1.8 1.8L9.6 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Select
        </>
      )}
    </button>
  );
}

export function BatchBar({
  theme: t,
  count,
  label,
  onAction,
  onClear,
  disabled,
}: {
  theme: Theme;
  count: number;
  label: string;
  onAction: () => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  const off = disabled || !count;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 22,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 250,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 12px 10px 18px',
        borderRadius: 14,
        background: t.ink,
        color: t.bg,
        boxShadow: '0 14px 44px rgba(15,20,32,.34)',
        fontFamily: UI,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{count} selected</span>
      <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,.22)' }} />
      <button
        onClick={onClear}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,.75)',
          fontFamily: UI,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={onAction}
        disabled={off}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 15px',
          borderRadius: 9,
          border: 'none',
          whiteSpace: 'nowrap',
          background: off ? 'rgba(255,255,255,.18)' : t.accent,
          color: off ? 'rgba(255,255,255,.5)' : t.onAccent,
          fontFamily: UI,
          fontSize: 12.5,
          fontWeight: 700,
          cursor: off ? 'default' : 'pointer',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M7 10.5V3.5M3.8 6.5L7 3.3l3.2 3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label}
      </button>
    </div>
  );
}
