// src/features/directory/DirectoryPage.tsx
// The Directory shell: top bar + sidebar + content. Renders the right stage body
// for the active view, owns the page header (chapter, By class/By cohort/Table
// segmented control, Select toggle, KPI chips), and wires BOTH transition paths:
//   • single — per-row action in each body  → useSetStage + announceStage
//   • batch  — Select → checkboxes → BatchBar → useSetStageMany + announceStageMany

import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@/theme/ThemeProvider';
import { SERIF, UI, BP } from '@/theme/tokens';
import { useViewport } from '@/components/responsive/useViewport';
import { useRole } from '@/auth/RoleContext';
import { canManage as canManageRole } from '@/auth/roles';
import { useCollab } from '@/store/collab';
import { useBatch } from '@/store/useBatch';
import { useMembers, useSetStage, useSetStageMany } from '@/data/queries';
import { STAGE_FLOW, STAGE_LABEL, type Member, type Stage } from '@/types/domain';
import { TopBar } from '@/components/chrome/TopBar';
import { Sidebar, type StageCounts } from '@/components/chrome/Sidebar';
import { SelectToggle, BatchBar } from '@/components/collab/Batch';
import { ActiveBody, type GroupBy } from './ActiveBody';
import { CandidateBody } from './CandidateBody';
import { ApplicantBody } from './ApplicantBody';
import { AlumniBody } from './AlumniBody';

export type DirectoryView = 'active' | 'candidate' | 'applicant' | 'alumni';

const VIEW_STAGE: Record<DirectoryView, Stage> = {
  active: 'member',
  candidate: 'candidate',
  applicant: 'applicant',
  alumni: 'alumni',
};

const VIEW_TITLE: Record<DirectoryView, string> = {
  active: 'Active Members',
  candidate: 'Candidates',
  applicant: 'Applicants',
  alumni: 'Alumni',
};

export default function DirectoryPage() {
  const { theme: t, density } = useTheme();
  const params = useParams();
  const view = ((params.view as DirectoryView) || 'active') as DirectoryView;
  const stage = VIEW_STAGE[view];

  const { role } = useRole();
  const canManage = canManageRole(role);

  const w = useViewport();
  const narrow = w < BP.tab;

  const { data: all = [], isLoading } = useMembers();
  const batch = useBatch();
  const setStage = useSetStage();
  const setStageMany = useSetStageMany();
  const { me, announceStage, announceStageMany } = useCollab();

  const [groupBy, setGroupBy] = useState<GroupBy>('class');

  const counts: StageCounts = useMemo(
    () => ({
      applicant: all.filter((m) => m.stage === 'applicant').length,
      candidate: all.filter((m) => m.stage === 'candidate').length,
      member: all.filter((m) => m.stage === 'member').length,
      alumni: all.filter((m) => m.stage === 'alumni').length,
    }),
    [all],
  );

  const members = useMemo(() => all.filter((m) => m.stage === stage), [all, stage]);

  const flow = STAGE_FLOW[stage];
  const canTransition = !!flow; // alumni has none

  // single transition
  const advanceOne = (m: Member) => {
    if (!flow) return;
    setStage.mutate(
      { memberId: m.id, toStage: flow.next, byId: me },
      { onSuccess: () => announceStage(flow.label, STAGE_LABEL[flow.next]) },
    );
  };

  // batch transition
  const runBatch = () => {
    if (!flow) return;
    const ids = [...batch.sel];
    if (!ids.length) return;
    setStageMany.mutate(
      { memberIds: ids, toStage: flow.next, byId: me },
      {
        onSuccess: () => {
          announceStageMany(ids.length, flow.verb, STAGE_LABEL[flow.next]);
          batch.clear();
        },
      },
    );
  };

  const sidebar = <Sidebar theme={t} view={view} counts={counts} full />;

  // KPI chips for the header
  const kpis: { label: string; value: number | string }[] =
    view === 'active'
      ? [
          { label: 'Total', value: members.length },
          { label: 'Active', value: members.filter((m) => m.status === 'active').length },
          { label: 'Inactive', value: members.filter((m) => m.status === 'inactive').length },
          { label: 'Holds office', value: members.filter((m) => (m.roles ?? []).some((r) => r.current)).length },
        ]
      : view === 'applicant'
      ? [
          { label: 'In queue', value: members.length },
          { label: 'Scored', value: members.filter((m) => m.interviewScore != null).length },
          { label: 'Awaiting', value: members.filter((m) => m.interviewScore == null).length },
        ]
      : view === 'candidate'
      ? [{ label: 'In formation', value: members.length }]
      : [
          { label: 'Alumni', value: members.length },
          { label: 'Open to connect', value: members.filter((m) => m.openToConnect).length },
        ];

  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar theme={t} section="directory" sidebar={sidebar} onAction={() => {}} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {!narrow && <Sidebar theme={t} view={view} counts={counts} />}

        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: narrow ? '18px 16px 80px' : '24px 26px 80px' }}>
            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500, letterSpacing: -0.3 }}>{VIEW_TITLE[view]}</div>
                <div style={{ fontSize: 13, color: t.sub, marginTop: 4 }}>Phi Sigma Lambda · UNC Charlotte</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {view === 'active' && (
                  <div style={{ display: 'inline-flex', background: t.bg, border: `1px solid ${t.line}`, borderRadius: 9, padding: 2 }}>
                    {(
                      [
                        ['class', 'By class'],
                        ['cohort', 'By cohort'],
                        ['none', 'Table'],
                      ] as [GroupBy, string][]
                    ).map(([k, lbl]) => {
                      const on = groupBy === k;
                      return (
                        <button
                          key={k}
                          onClick={() => setGroupBy(k)}
                          style={{ padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 12, fontWeight: 600, background: on ? t.accent : 'transparent', color: on ? t.onAccent : t.sub }}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                )}
                {canManage && canTransition && <SelectToggle theme={t} selecting={batch.selecting} onToggle={() => (batch.selecting ? batch.clear() : batch.setSelecting(true))} />}
              </div>
            </div>

            {/* KPI chips */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
              {kpis.map((k) => (
                <div key={k.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '9px 14px', background: t.bg, border: `1px solid ${t.line}`, borderRadius: 10 }}>
                  <span style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{k.value}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', color: t.faint }}>{k.label}</span>
                </div>
              ))}
            </div>

            {/* Body */}
            {isLoading ? (
              <div style={{ padding: 60, textAlign: 'center', color: t.faint, fontSize: 13 }}>Loading roster…</div>
            ) : view === 'active' ? (
              <ActiveBody theme={t} members={members} density={density} groupBy={groupBy} selecting={batch.selecting} sel={batch.sel} toggle={batch.toggle} setAll={batch.setAll} />
            ) : view === 'candidate' ? (
              <CandidateBody theme={t} members={members} density={density} selecting={batch.selecting} sel={batch.sel} toggle={batch.toggle} setAll={batch.setAll} onPromote={advanceOne} canManage={canManage} />
            ) : view === 'applicant' ? (
              <ApplicantBody theme={t} members={members} density={density} selecting={batch.selecting} sel={batch.sel} toggle={batch.toggle} setAll={batch.setAll} onAdvance={advanceOne} canManage={canManage} />
            ) : (
              <AlumniBody theme={t} members={members} density={density} />
            )}
          </div>
        </div>
      </div>

      {batch.selecting && flow && (
        <BatchBar theme={t} count={batch.sel.size} label={flow.label} onAction={runBatch} onClear={batch.clear} disabled={setStageMany.isPending} />
      )}
    </div>
  );
}
