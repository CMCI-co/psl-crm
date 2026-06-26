// src/components/cards/DuePill.tsx
// Contact-cadence flag (ported from cards.jsx). Travels from the Relationship
// Tracker's "Next due" column onto the Profile Card. Only renders when the person
// carries cadence data.

export function DuePill({
  due,
  next,
  cadence,
}: {
  due?: 'overdue' | 'due' | 'ok';
  next?: string;
  cadence?: string;
}) {
  if (!due) return null;
  const map = {
    overdue: { bg: '#fbe6e2', fg: '#b3402f', label: 'Call This Week', urgent: true },
    due: { bg: '#fbefdd', fg: '#8a5a16', label: 'Call Today', urgent: true },
    ok: { bg: '#e8f0ea', fg: '#3c7d5b', label: 'On track', urgent: false },
  } as const;
  const c = map[due] || map.ok;
  return (
    <span
      title={cadence ? `${cadence} cadence` : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 11px',
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {c.urgent ? (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={c.fg} strokeWidth="1.6">
          <path
            d="M7 4.5l-.001-1.2A2 2 0 0 1 9 1.3M7 4.5a3.5 3.5 0 0 1 3.5 3.5c0 2.2.7 3 1.2 3.4H2.3c.5-.4 1.2-1.2 1.2-3.4A3.5 3.5 0 0 1 7 4.5zM5.6 12a1.4 1.4 0 0 0 2.8 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={c.fg} strokeWidth="1.6">
          <circle cx="7" cy="7" r="5.2" />
          <path d="M7 4.2V7l1.9 1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span>{c.label}</span>
      {next && <span style={{ fontWeight: 500, opacity: 0.85 }}>· Next {next}</span>}
    </span>
  );
}
