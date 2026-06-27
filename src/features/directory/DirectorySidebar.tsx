// DirectorySidebar.tsx — the left rail: search, the four lifecycle nav items
// (with live counts), and a status filter. Ported from directory.jsx Sidebar.
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { useNav } from '@/routes/useNav';
import type { DirView } from './DirectoryView';

export interface DirCounts { applicant: number; candidate: number; member: number; alumni: number }

type NavKind = 'applicant' | 'candidate' | 'active' | 'alumni';
const NAV: { kind: NavKind; view: DirView; label: string; sub?: string }[] = [
  { kind: 'applicant', view: 'applicant', label: 'Applicants', sub: 'Pending review' },
  { kind: 'candidate', view: 'candidate', label: 'Candidates', sub: 'In Formation' },
  { kind: 'active', view: 'active', label: 'Active Members' },
  { kind: 'alumni', view: 'alumni', label: 'Alumni' },
];

function NavIcon({ kind, color }: { kind: NavKind; color: string }) {
  const s = { width: 17, height: 17, flexShrink: 0 } as const;
  if (kind === 'applicant') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M4 2.5h6l2 2v9H4z" strokeLinejoin="round" /><path d="M6 6.5h4M6 9h4" strokeLinecap="round" /></svg>;
  if (kind === 'candidate') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="8" cy="5" r="2.7" /><path d="M3 13.2c0-2.6 2.2-4.2 5-4.2s5 1.6 5 4.2" strokeLinecap="round" /></svg>;
  if (kind === 'active') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="6" cy="5" r="2.6" /><path d="M1.8 13c0-2.4 1.9-4 4.2-4s4.2 1.6 4.2 4" strokeLinecap="round" /><circle cx="12" cy="5.4" r="1.9" /><path d="M11 9.2c2 .1 3.2 1.6 3.2 3.8" strokeLinecap="round" /></svg>;
  return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 2l5 2.5v3c0 3-2.2 5.2-5 6.5-2.8-1.3-5-3.5-5-6.5v-3z" strokeLinejoin="round" /></svg>;
}

function NavRow({ kind, label, sub, count, active, onClick }: {
  kind: NavKind; label: string; sub?: string; count: number; active: boolean; onClick: () => void;
}) {
  const { t } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px',
        border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 0,
        background: active ? t.accentSoft : 'transparent',
        boxShadow: active ? `inset 2.5px 0 0 ${t.accent}` : 'none',
      }}
    >
      <NavIcon kind={kind} color={active ? t.accent : t.faint} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: UI, fontSize: 13, fontWeight: 600, color: active ? t.accent : t.ink, lineHeight: 1.2 }}>{label}</span>
        {sub && <span style={{ display: 'block', fontFamily: UI, fontSize: 11.5, color: t.faint, marginTop: 1 }}>{sub}</span>}
      </span>
      <span style={{ fontFamily: UI, fontSize: 11.5, fontWeight: 600, color: active ? t.accent : t.faint, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </button>
  );
}

export function DirectorySidebar({
  view, counts, query, onQuery, activeOnly, onActiveOnly,
}: {
  view: DirView;
  counts: DirCounts;
  query: string;
  onQuery: (v: string) => void;
  activeOnly: boolean;
  onActiveOnly: (v: boolean) => void;
}) {
  const { t } = useTheme();
  const { setView } = useNav();
  const countFor = (k: NavKind): number =>
    k === 'applicant' ? counts.applicant : k === 'candidate' ? counts.candidate : k === 'active' ? counts.member : counts.alumni;

  return (
    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
      <div style={{ padding: '0 16px 4px' }}>
        <div style={{ fontFamily: SERIF, fontSize: 19, color: t.ink }}>Directory</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: t.faint, marginTop: 1 }}>UNC Charlotte</div>
      </div>

      <div style={{ padding: '4px 12px 6px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.5" style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}><circle cx="7" cy="7" r="4.5" /><path d="M11 11l3 3" strokeLinecap="round" /></svg>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search people…"
            style={{
              width: '100%', padding: '8px 10px 8px 30px', borderRadius: 9, outline: 'none',
              border: `1px solid ${t.line}`, background: t.bg, color: t.ink, fontFamily: UI, fontSize: 12.5,
            }}
          />
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {NAV.map((n) => (
          <NavRow
            key={n.kind}
            kind={n.kind}
            label={n.label}
            sub={n.sub}
            count={countFor(n.kind)}
            active={view === n.view}
            onClick={() => setView(n.view)}
          />
        ))}
      </nav>

      <div style={{ padding: '10px 16px 6px', marginTop: 6, borderTop: `1px solid ${t.line}` }}>
        <div style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: t.faint, marginBottom: 8 }}>Status</div>
        {([['Active only', true], ['Show all', false]] as const).map(([label, val]) => {
          const on = activeOnly === val;
          return (
            <button
              key={label}
              onClick={() => onActiveOnly(val)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ width: 15, height: 15, borderRadius: 5, border: `1.5px solid ${on ? t.accent : t.line}`, background: on ? t.accent : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {on && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke={t.onAccent} strokeWidth="2"><path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span style={{ fontFamily: UI, fontSize: 12.5, color: on ? t.ink : t.sub, fontWeight: on ? 600 : 500 }}>{label}</span>
            </button>
          );
        })}
        <div style={{ fontFamily: UI, fontSize: 11, color: t.faint, marginTop: 8, lineHeight: 1.4 }}>
          Status filter applies to the Active roster.
        </div>
      </div>
    </div>
  );
}
