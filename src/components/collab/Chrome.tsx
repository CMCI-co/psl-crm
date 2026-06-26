// src/components/collab/Chrome.tsx
// Small collaboration chrome pieces: the toast stack, the light/dark ModeToggle,
// and the IdentitySwitcher (header avatar). Ported from collab.jsx.

import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { useCollab } from '@/store/collab';
import { TEAM } from '@/data/mockData';
import { OwnerMenu } from './OwnerMenu';

// ── Toasts — transient confirmation stack (rendered once at app root) ──────
export function Toasts() {
  const { theme: t } = useTheme();
  const toasts = useCollab((s) => s.toasts);
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t2) => (
        <div
          key={t2.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '10px 16px',
            borderRadius: 999,
            background: t.ink,
            color: t.bg,
            fontFamily: UI,
            fontSize: 12.5,
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(15,20,32,.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t2.text}
        </div>
      ))}
    </div>
  );
}

// ── ModeToggle — always-visible light/dark switch ─────────────────────────
export function ModeToggle({ theme: t }: { theme: Theme }) {
  const { dark, toggleDark } = useTheme();
  return (
    <button
      onClick={toggleDark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: 10,
        border: `1px solid ${t.chromeLine || t.line}`,
        background: t.bg,
        color: t.sub,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {dark ? (
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="9" r="3.4" />
          <path
            d="M9 1.6v2M9 14.4v2M1.6 9h2M14.4 9h2M3.8 3.8l1.4 1.4M12.8 12.8l1.4 1.4M14.2 3.8l-1.4 1.4M5.2 12.8l-1.4 1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 10.2A6.4 6.4 0 0 1 7.8 3a6.4 6.4 0 1 0 7.2 7.2z" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ── IdentitySwitcher — header avatar; switch who you are (dev/prototype only) ──
export function IdentitySwitcher({ theme: t }: { theme: Theme }) {
  const me = useCollab((s) => s.me);
  const setMe = useCollab((s) => s.setMe);
  const meMember = TEAM.find((m) => m.name === me) || TEAM[0];
  return (
    <OwnerMenu theme={t} current={me} onPick={(n) => setMe(n)} align="right" title="View as">
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
        title={`Signed in as ${meMember.name} — click to switch`}
      >
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: t.accentSoft,
            color: t.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: UI,
          }}
        >
          {meMember.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
      </span>
    </OwnerMenu>
  );
}
