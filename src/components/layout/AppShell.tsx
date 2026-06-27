// AppShell.tsx — the desktop frame: fixed top bar over a flex row of an
// optional 236px sidebar + scrolling content. Below the tablet breakpoint the
// sidebar collapses into a drawer (kit.jsx Drawer).
import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/theme/useTheme';
import { BP } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { Drawer } from '@/components/ui/Drawer';
import { TopBar } from './TopBar';

const SIDEBAR_W = 236;

export function AppShell({ sidebar, children }: { sidebar?: ReactNode; children: ReactNode }) {
  const { t } = useTheme();
  const w = useViewport();
  const narrow = w < BP.tab;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer on navigation.
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.panel, color: t.ink }}>
      <TopBar showMenu={!!sidebar} onMenu={() => setDrawerOpen(true)} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {sidebar && !narrow && (
          <aside style={{ width: SIDEBAR_W, flexShrink: 0, borderRight: `1px solid ${t.line}`, background: t.bg, overflowY: 'auto' }}>
            {sidebar}
          </aside>
        )}
        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>{children}</main>
      </div>
      {sidebar && narrow && (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} width={300}>
          {sidebar}
        </Drawer>
      )}
    </div>
  );
}
