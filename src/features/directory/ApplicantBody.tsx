// src/features/directory/ApplicantBody.tsx
// Applicants queue (derived from directory.jsx). Shows interview score + a
// recommendation derived from it (recommend()), a per-row advance arrow, and
// batch "Advance to Candidate". Row click opens Application Review.

import { useNavigate } from 'react-router-dom';
import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import type { Member } from '@/types/domain';
import { fullName } from '@/types/domain';
import { Avatar } from '@/components/atoms/Avatar';
import { SelChk } from '@/components/collab/Batch';
import { recommend } from '@/lib/recommend';

interface Props {
  theme: Theme;
  members: Member[];
  density: 'comfortable' | 'compact';
  selecting: boolean;
  sel: Set<string>;
  toggle: (id: string) => void;
  setAll: (ids: string[], on: boolean) => void;
  onAdvance: (m: Member) => void;
  canManage: boolean;
}

export function ApplicantBody({ theme: t, members, density, selecting, sel, toggle, setAll, onAdvance, canManage }: Props) {
  const navigate = useNavigate();
  const compact = density === 'compact';
  const allIds = members.map((m) => m.id);
  const allOn = allIds.length > 0 && allIds.every((id) => sel.has(id));
  const someOn = allIds.some((id) => sel.has(id));
  const cols = selecting ? '34px 1.6fr 0.8fr 1.1fr 0.8fr 0.7fr 1fr' : '1.6fr 0.8fr 1.1fr 0.8fr 0.7fr 1fr auto';

  return (
    <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: '11px 14px', borderBottom: `1px solid ${t.line}`, background: t.panel }}>
        {selecting && <SelChk theme={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => setAll(allIds, !allOn)} />}
        {['Applicant', 'Class', 'Major', 'Submitted', 'Score', 'Recommendation'].map((h) => (
          <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</div>
        ))}
        {!selecting && <div />}
      </div>

      {members.map((m) => {
        const on = sel.has(m.id);
        const rec = recommend(m.interviewScore);
        return (
          <div
            key={m.id}
            onClick={() => (selecting ? toggle(m.id) : navigate(`/application/${m.id}`))}
            style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: compact ? '8px 14px' : '11px 14px', borderBottom: `1px solid ${t.line}`, cursor: 'pointer', background: on ? t.accentSoft : t.bg }}
            onMouseEnter={(e) => { if (!on) (e.currentTarget as HTMLDivElement).style.background = t.panel; }}
            onMouseLeave={(e) => { if (!on) (e.currentTarget as HTMLDivElement).style.background = t.bg; }}
          >
            {selecting && <SelChk theme={t} checked={on} onChange={() => toggle(m.id)} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <Avatar f={m.firstName} l={m.lastName} size={compact ? 30 : 36} theme={t} src={m.avatarUrl} />
              <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
            </div>
            <Cell t={t}>{m.classYear}</Cell>
            <Cell t={t}>{m.major}</Cell>
            <Cell t={t}>{m.submitted}</Cell>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: m.interviewScore == null ? t.faint : t.ink, fontVariantNumeric: 'tabular-nums' }}>
              {m.interviewScore == null ? '—' : m.interviewScore.toFixed(1)}
            </div>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, background: rec.bg, color: rec.fg, fontSize: 11.5, fontWeight: 700, border: rec.kind === 'await' ? `1px solid ${t.line}` : 'none' }}>
                {rec.label}
              </span>
            </div>
            {!selecting && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {canManage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onAdvance(m); }}
                    title="Advance to Candidate"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.line}`, background: t.bg, color: t.accent, cursor: 'pointer' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Cell({ t, children }: { t: Theme; children: React.ReactNode }) {
  return <div style={{ fontFamily: UI, fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{children ?? '—'}</div>;
}
