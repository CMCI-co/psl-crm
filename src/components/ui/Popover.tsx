// Popover.tsx — a trigger + click-outside panel. Used by the top-bar menus and
// (later) the owner/person pickers.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';

export function Popover({
  trigger, children, align = 'right', width = 240, panelLabel,
}: {
  trigger: (open: boolean) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'left' | 'right';
  width?: number;
  panelLabel?: string;
}) {
  const { t } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <span onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex', cursor: 'pointer' }}>
        {trigger(open)}
      </span>
      {open && (
        <div
          role="menu"
          aria-label={panelLabel}
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', [align]: 0, zIndex: 90, width,
            background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14,
            boxShadow: '0 16px 44px rgba(15,20,32,.22)', padding: 6,
          }}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </span>
  );
}
