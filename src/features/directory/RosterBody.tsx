// RosterBody.tsx — a configurable table used by the Candidate, Applicant and
// Alumni views. Each view supplies its own columns; the Active view has its own
// bespoke component (ActiveBody). Bespoke per-view layouts (cohort crossover,
// application scoring rail, alumni map) land in a later phase — this gives every
// view a real, navigable directory now.
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { Avatar, Tag, OfficeChip } from '@/components/ui';
import { currentOffices, fullName, recommend, type Member } from '@/types/domain';
import type { DirView } from './DirectoryView';

interface Col { key: string; header: string; grow: number; render: (m: Member) => ReactNode }

function MemberCell({ m, withTag }: { m: Member; withTag?: boolean }) {
  const { t } = useTheme();
  const office = currentOffices(m)[0] ?? null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
      <Avatar first={m.firstName} last={m.lastName} size={32} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: UI, fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
        {withTag && (
          <div style={{ marginTop: 3, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <Tag stage={m.stage} size="sm" />
            {office && <OfficeChip office={office} size="sm" />}
          </div>
        )}
      </div>
    </div>
  );
}

function Plain({ children }: { children: ReactNode }) {
  const { t } = useTheme();
  return <span style={{ fontFamily: UI, fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</span>;
}

function ScoreCell({ score }: { score: number | null | undefined }) {
  const { t } = useTheme();
  if (score == null) return <span style={{ fontFamily: UI, fontSize: 13, color: t.faint }}>—</span>;
  return <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{score.toFixed(1)}</span>;
}

function RecChip({ score }: { score: number | null | undefined }) {
  const r = recommend(score);
  return <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999, color: r.fg, background: r.bg, border: r.kind === 'await' ? '1px dashed currentColor' : 'none', whiteSpace: 'nowrap' }}>{r.label}</span>;
}

function ConnectChip({ open }: { open: boolean | null | undefined }) {
  const { t } = useTheme();
  const on = !!open;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: UI, fontSize: 12, color: on ? t.stages.member.fg : t.faint }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: on ? t.stages.member.solid : t.line }} />
      {on ? 'Open to connect' : 'Private'}
    </span>
  );
}

function columnsFor(view: DirView): Col[] {
  if (view === 'candidate') return [
    { key: 'member', header: 'Candidate', grow: 2.2, render: (m) => <MemberCell m={m} withTag /> },
    { key: 'class', header: 'Class', grow: 1, render: (m) => <Plain>{m.classYear}</Plain> },
    { key: 'major', header: 'Major', grow: 1.6, render: (m) => <Plain>{m.major}</Plain> },
    { key: 'town', header: 'Hometown', grow: 1.4, render: (m) => <Plain>{m.hometown}</Plain> },
    { key: 'cohort', header: 'Cohort', grow: 1.1, render: (m) => <Plain>{m.cohort}</Plain> },
  ];
  if (view === 'applicant') return [
    { key: 'member', header: 'Applicant', grow: 2.2, render: (m) => <MemberCell m={m} /> },
    { key: 'class', header: 'Class', grow: 1, render: (m) => <Plain>{m.classYear}</Plain> },
    { key: 'major', header: 'Major', grow: 1.6, render: (m) => <Plain>{m.major}</Plain> },
    { key: 'submitted', header: 'Submitted', grow: 1, render: (m) => <Plain>{m.submitted ?? '—'}</Plain> },
    { key: 'score', header: 'Score', grow: 0.7, render: (m) => <ScoreCell score={m.interviewScore} /> },
    { key: 'rec', header: 'Recommendation', grow: 1.2, render: (m) => <RecChip score={m.interviewScore} /> },
  ];
  // alumni
  return [
    { key: 'member', header: 'Alumnus', grow: 2, render: (m) => <MemberCell m={m} /> },
    { key: 'grad', header: 'Grad', grow: 0.7, render: (m) => <Plain>{m.gradYear ?? '—'}</Plain> },
    { key: 'work', header: 'Work', grow: 2.2, render: (m) => <Plain>{m.work}</Plain> },
    { key: 'loc', header: 'Location', grow: 1.3, render: (m) => <Plain>{m.location ?? m.hometown}</Plain> },
    { key: 'cohort', header: 'Cohort', grow: 1, render: (m) => <Plain>{m.cohort}</Plain> },
    { key: 'connect', header: 'Network', grow: 1.3, render: (m) => <ConnectChip open={m.openToConnect} /> },
  ];
}

const TITLES: Record<Exclude<DirView, 'active'>, { title: string; sub: string }> = {
  candidate: { title: 'Candidates', sub: 'New Member Formation' },
  applicant: { title: 'Applicants', sub: 'Pending review' },
  alumni: { title: 'Alumni', sub: 'Graduated brothers' },
};

export function RosterBody({ view, rows, dense, onOpen }: {
  view: Exclude<DirView, 'active'>; rows: Member[]; dense: boolean; onOpen: (m: Member) => void;
}) {
  const { t } = useTheme();
  const cols = columnsFor(view);
  const grid = cols.map((c) => `${c.grow}fr`).join(' ');
  const meta = TITLES[view];
  const rowPad = dense ? '7px 26px' : '11px 26px';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: SERIF, fontSize: 25, color: t.ink }}>{meta.title}</span>
          <span style={{ fontFamily: UI, fontSize: 13, color: t.faint }}>· {meta.sub}</span>
        </div>
        <div style={{ marginTop: 12, display: 'inline-flex', flexDirection: 'column', gap: 2, padding: '7px 13px', borderRadius: 10, background: t.bg, border: `1px solid ${t.line}` }}>
          <span style={{ fontFamily: UI, fontSize: 17, fontWeight: 700, color: t.accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{rows.length}</span>
          <span style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint }}>{meta.title}</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
          {cols.map((c) => (
            <span key={c.key} style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{c.header}</span>
          ))}
        </div>
        {rows.map((m) => (
          <div key={m.id} onClick={() => onOpen(m)} style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, padding: rowPad, alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer' }}>
            {cols.map((c) => <div key={c.key} style={{ minWidth: 0 }}>{c.render(m)}</div>)}
          </div>
        ))}
        {rows.length === 0 && <div style={{ padding: '44px 26px', textAlign: 'center', fontFamily: UI, fontSize: 13, color: t.faint }}>No {meta.title.toLowerCase()} match your search.</div>}
      </div>
    </div>
  );
}
