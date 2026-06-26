// src/components/atoms/Btn.tsx
// Shared button. Matches the prototype's inline button styling (kinds seen in
// crm-app.jsx SubBar + various screens): primary (filled accent), ghost
// (outlined), and danger.

import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';

type Kind = 'primary' | 'ghost' | 'danger';

interface BtnProps {
  theme: Theme;
  label: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  kind?: Kind;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  title?: string;
  type?: 'button' | 'submit';
}

export function Btn({ theme: t, label, onClick, kind = 'ghost', icon, disabled, size = 'md', title, type = 'button' }: BtnProps) {
  const pad = size === 'sm' ? '6px 11px' : '8px 14px';
  const fs = size === 'sm' ? 12 : 12.5;

  let bg = t.bg;
  let fg = t.sub;
  let border = `1px solid ${t.line}`;
  if (kind === 'primary') {
    bg = t.accent;
    fg = t.onAccent;
    border = 'none';
  } else if (kind === 'danger') {
    bg = t.bg;
    fg = '#b3402f';
    border = `1px solid ${t.line}`;
  }

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: pad,
        borderRadius: 9,
        border,
        background: disabled ? t.line : bg,
        color: disabled ? t.faint : fg,
        fontFamily: UI,
        fontSize: fs,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
