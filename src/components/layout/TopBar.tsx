// TopBar.tsx — the fixed 56px application bar: wordmark, primary section nav,
// and the appearance/profile cluster. Highlights the active section by URL.
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/theme/useTheme';
import { SERIF, UI, BP } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { dataSource } from '@/env';
import { ModeToggle, AppearanceMenu, ProfileMenu } from './nav-controls';

interface NavItem { label: string; to: string; match: (p: string) => boolean }
const NAV: NavItem[] = [
  { label: 'Directory', to: '/directory/active', match: (p) => p.startsWith('/directory') || p.startsWith('/profile') || p.startsWith('/application') || p.startsWith('/alumni') || p.startsWith('/cohort') },
  { label: 'Relationships', to: '/tracker', match: (p) => p.startsWith('/tracker') },
  { label: 'Resources', to: '/resources', match: (p) => p.startsWith('/resources') },
  { label: 'Training', to: '/training', match: (p) => p.startsWith('/training') },
];

export function TopBar({ onMenu, showMenu }: { onMenu?: () => void; showMenu?: boolean }) {
  const { t } = useTheme();
  const { pathname } = useLocation();
  const w = useViewport();
  const narrow = w < BP.tab;

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 60, height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px',
        background: t.chrome, borderBottom: `1px solid ${t.chromeLine}`,
      }}
    >
      {narrow && showMenu && (
        <button
          onClick={onMenu}
          aria-label="Open menu"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.chromeLine}`, background: t.bg, color: t.chromeInk, cursor: 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2.5 5h13M2.5 9h13M2.5 13h13" strokeLinecap="round" /></svg>
        </button>
      )}

      {/* Wordmark */}
      <Link to="/directory/active" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: t.accent, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 15, letterSpacing: 0.5 }}>ΦΣΛ</span>
        {!narrow && (
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span style={{ fontFamily: SERIF, fontSize: 15, color: t.chromeInk }}>Phi Sigma Lambda</span>
            <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: t.faint }}>Chapter CRM</span>
          </span>
        )}
      </Link>

      {/* Primary nav */}
      {!narrow && (
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 8 }}>
          {NAV.map((it) => {
            const on = it.match(pathname);
            return (
              <Link
                key={it.label}
                to={it.to}
                style={{
                  fontFamily: UI, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  padding: '7px 12px', borderRadius: 8,
                  color: on ? t.accent : t.sub,
                  background: on ? t.accentSoft : 'transparent',
                }}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
      )}

      <div style={{ flex: 1 }} />

      {dataSource === 'demo' && !narrow && (
        <span
          title="No Supabase keys set — showing the prototype's sample data. Add keys in .env to go live."
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontFamily: UI, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent }} />
          Demo data
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ModeToggle />
        <AppearanceMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
