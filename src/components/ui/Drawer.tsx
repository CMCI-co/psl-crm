// Drawer.tsx — off-canvas panel for nav/filters on narrow screens (kit.jsx).
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';

export function Drawer({
  open, onClose, side = 'left', width = 300, children,
}: { open: boolean; onClose: () => void; side?: 'left' | 'right'; width?: number; children: ReactNode }) {
  const { t } = useTheme();
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: open ? 'auto' : 'none' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15,20,32,.46)', opacity: open ? 1 : 0, transition: 'opacity .22s ease' }}
      />
      <div
        style={{
          position: 'absolute', top: 0, bottom: 0, [side]: 0, width, maxWidth: '86%',
          background: t.bg, color: t.ink,
          borderRight: side === 'left' ? `1px solid ${t.line}` : 'none',
          borderLeft: side === 'right' ? `1px solid ${t.line}` : 'none',
          transform: open ? 'translateX(0)' : `translateX(${side === 'left' ? '-101%' : '101%'})`,
          transition: 'transform .26s cubic-bezier(.32,.72,0,1)',
          overflowY: 'auto', WebkitOverflowScrolling: 'touch',
          boxShadow: open ? '0 12px 48px rgba(15,20,32,.28)' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
