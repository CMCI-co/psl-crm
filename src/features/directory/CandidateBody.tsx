// src/features/directory/CandidateBody.tsx
// Candidates roster (derived from directory.jsx). Each row has a single
// "Promote to Member" action; batch promote works via Select. Includes the
// "crossing over" intro band and the done state when the cohort is empty.

import { useNavigate } from 'react-router-dom';
import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import type { Member } from '@/types/domain';
import { fullName } from '@/types/domain';
import { Avatar } from '@/components/atoms/Avatar';
import { Tag } from '@/components/atoms/Tag';
import { SelChk } from '@/components/collab/Batch';

interface Props {
  theme: Theme;
  members: Member[];
  density: 'comfortable' | 'compact';
  selecting: boolean;
  sel: Set<string>;
  toggle: (id: string) => void;
  setAll: (ids: string[], on: boolean) => void;
  onPromote: (m: Member) => void;
  canManage: boolean;
}

export function CandidateBody({ theme: t, members, density, selecting, sel, toggle, setAll, onPromote, canManage }: Props) {
  const navigate = useNavigate();
  const compact = density === 'compact';
  const allIds = members.map((m) => m.id);
  const allOn = allIds.length > 0 && allIds.every((id) => sel.has(id));
  const someOn = allIds.some((id) => sel.has(id));
  const cols = selecting ? '34px 1.7fr 0.9fr 1.2fr 1fr 1fr' : '1.7fr 0.9fr 1.2fr 1fr 1fr auto';

  if (members.length === 0) {
    return (
      <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.6">
            <path d="M3 8.5l3 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontFamily: UI, fontSize: 15, fontWeight: 600, color: t.ink }}>Every candidate has crossed over</div>
        <div style={{ fontSize: 13, color: t.sub, marginTop: 6 }}>No one is in formation right now. New candidates appear here after applicants advance.</div>
      </div>
    );
  }

  return (
    <>
      {/* crossing-over intro band */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', background: t.accentSoft, border: `1px solid ${t.line}`, borderRadius: 12, marginBottom: 14 }}>
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M8 14V7" strokeLinecap="round" />
          <path d="M8 7c0-2 1.4-3.5 3.5-3.5C11.5 5.5 10 7 8 7zM8 8.5C8 6.8 6.7 5.5 4.8 5.5 4.8 7.2 6.1 8.5 8 8.5z" strokeLinejoin="round" />
        </svg>
        <div>
          <div style={{ fontFamily: UI, fontSize: 13.5, fontWeight: 600, color: t.ink }}>Crossing over</div>
          <div style={{ fontSize: 12.5, color: t.sub, marginTop: 3, lineHeight: 1.5 }}>
            Candidates complete formation, then cross over into Active Membership. Promote individually, or use Select to promote a whole cohort at once.
          </div>
        </div>
      </div>

      <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: '11px 14px', borderBottom: `1px solid ${t.line}`, background: t.panel }}>
          {selecting && <SelChk theme={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => setAll(allIds, !allOn)} />}
          {['Candidate', 'Class', 'Major', 'Hometown', 'Cohort'].map((h) => (
            <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</div>
          ))}
          {!selecting && <div />}
        </div>

        {members.map((m) => {
          const on = sel.has(m.id);
          return (
            <div
              key={m.id}
              onClick={() => (selecting ? toggle(m.id) : navigate(`/profile/${m.id}`))}
              style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: compact ? '8px 14px' : '11px 14px', borderBottom: `1px solid ${t.line}`, cursor: 'pointer', background: on ? t.accentSoft : t.bg }}
              onMouseEnter={(e) => { if (!on) (e.currentTarget as HTMLDivElement).style.background = t.panel; }}
              onMouseLeave={(e) => { if (!on) (e.currentTarget as HTMLDivElement).style.background = t.bg; }}
            >
              {selecting && <SelChk theme={t} checked={on} onChange={() => toggle(m.id)} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <Avatar f={m.firstName} l={m.lastName} size={compact ? 30 : 36} theme={t} src={m.avatarUrl} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
                  {!compact && <div style={{ marginTop: 4 }}><Tag stage={m.stage} size="sm" theme={t} /></div>}
                </div>
              </div>
              <Cell t={t}>{m.classYear}</Cell>
              <Cell t={t}>{m.major}</Cell>
              <Cell t={t}>{m.hometown}</Cell>
              <Cell t={t}>{m.cohort}</Cell>
              {!selecting && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {canManage && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onPromote(m); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: `1px solid ${t.line}`, background: t.bg, color: t.accent, fontFamily: UI, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Promote to Member
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Cell({ t, children }: { t: Theme; children: React.ReactNode }) {
  return <div style={{ fontFamily: UI, fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{children ?? '—'}</div>;
}
