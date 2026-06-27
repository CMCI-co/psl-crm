// nav-controls.tsx — the right-hand cluster of the top bar: light/dark toggle,
// an appearance menu (brand direction + density), and a profile menu. The
// prototype's identity switcher becomes a real profile menu in production.
import { useTheme } from '@/theme/useTheme';
import { UI } from '@/theme/tokens';
import { BRANDS } from '@/theme/tokens';
import { Popover } from '@/components/ui/Popover';
import { dataSource } from '@/env';

const iconBtn = (line: string, bg: string, color: string) =>
  ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 38, height: 38, borderRadius: 10, border: `1px solid ${line}`,
    background: bg, color, cursor: 'pointer', flexShrink: 0,
  }) as const;

export function ModeToggle() {
  const { t, mode, toggleMode } = useTheme();
  const dark = mode === 'dark';
  return (
    <button
      onClick={toggleMode}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      style={iconBtn(t.chromeLine, t.bg, t.sub)}
    >
      {dark ? (
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="3.4" /><path d="M9 1.6v2M9 14.4v2M1.6 9h2M14.4 9h2M3.8 3.8l1.4 1.4M12.8 12.8l1.4 1.4M14.2 3.8l-1.4 1.4M5.2 12.8l-1.4 1.4" strokeLinecap="round" /></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10.2A6.4 6.4 0 0 1 7.8 3a6.4 6.4 0 1 0 7.2 7.2z" strokeLinejoin="round" /></svg>
      )}
    </button>
  );
}

const swatch = { navy: '#22386b', evergreen: '#1f4f3f', maroon: '#7a2230' } as const;

export function AppearanceMenu() {
  const { t, brand, setBrand, density, setDensity } = useTheme();
  const head = { fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint, padding: '8px 9px 6px' } as const;
  return (
    <Popover
      width={228}
      panelLabel="Appearance"
      trigger={() => (
        <span style={iconBtn(t.chromeLine, t.bg, t.sub)} title="Appearance">
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="6.5" /><path d="M9 2.5v13M2.5 9h13" /></svg>
        </span>
      )}
    >
      {() => (
        <>
          <div style={head}>Brand</div>
          {BRANDS.map((b) => {
            const on = b.key === brand;
            return (
              <div
                key={b.key}
                onClick={() => setBrand(b.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 9px', borderRadius: 8, cursor: 'pointer', background: on ? t.accentSoft : 'transparent' }}
              >
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: swatch[b.key], flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: UI, fontSize: 12.5, fontWeight: on ? 600 : 500, color: t.ink }}>{b.name}</span>
                {on && <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.9"><path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            );
          })}
          <div style={{ height: 1, background: t.line, margin: '6px 4px' }} />
          <div style={head}>Density</div>
          <div style={{ display: 'flex', gap: 6, padding: '2px 6px 6px' }}>
            {(['comfortable', 'compact'] as const).map((d) => {
              const on = d === density;
              return (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  style={{ flex: 1, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', textTransform: 'capitalize', fontFamily: UI, fontSize: 12, fontWeight: 600, border: `1px solid ${on ? t.accent : t.line}`, background: on ? t.accentSoft : t.bg, color: on ? t.accent : t.sub }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </>
      )}
    </Popover>
  );
}

const DEMO_ME = { name: 'Jordan Tate', role: 'Campus Director' };
const initialsOf = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export function ProfileMenu() {
  const { t } = useTheme();
  return (
    <Popover
      width={232}
      panelLabel="Account"
      trigger={() => (
        <span
          title={`${DEMO_ME.name} — ${DEMO_ME.role}`}
          style={{ width: 34, height: 34, borderRadius: '50%', background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: UI, cursor: 'pointer' }}
        >
          {initialsOf(DEMO_ME.name)}
        </span>
      )}
    >
      {() => (
        <>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 9px' }}>
            <span style={{ width: 36, height: 36, borderRadius: '50%', background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: UI }}>{initialsOf(DEMO_ME.name)}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: t.ink }}>{DEMO_ME.name}</div>
              <div style={{ fontFamily: UI, fontSize: 11.5, color: t.faint }}>{DEMO_ME.role}</div>
            </div>
          </div>
          <div style={{ height: 1, background: t.line, margin: '4px 4px' }} />
          <div style={{ padding: '8px 10px', fontFamily: UI, fontSize: 11.5, color: t.faint, lineHeight: 1.5 }}>
            {dataSource === 'demo'
              ? 'Demo mode — sign-in activates once Supabase keys are added.'
              : 'Signed in.'}
          </div>
        </>
      )}
    </Popover>
  );
}
