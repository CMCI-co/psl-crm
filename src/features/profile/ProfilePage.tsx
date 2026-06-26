// src/features/profile/ProfilePage.tsx
// The profile detail page, built on the Profile Card (per the README). Desktop:
// breadcrumb sub-bar with stage-aware actions (Edit / Promote / Log) over two
// columns — the credential card on the left, the traveling cards (sections) on
// the right. Narrow: the sections collapse into a tab strip.
//
// This pass ships the Profile Card + the three ported traveling cards. The fuller
// engagement sections (How they're doing, Call log, Follow-ups, Giving, Ways to
// help — from engagement.jsx) are the next build step; see BUILD_STATUS.md.

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/theme/ThemeProvider';
import { UI, BP } from '@/theme/tokens';
import { useViewport } from '@/components/responsive/useViewport';
import { useRole } from '@/auth/RoleContext';
import { canManage as canManageRole } from '@/auth/roles';
import { useCollab } from '@/store/collab';
import { useMember, useSetStage } from '@/data/queries';
import { STAGE_FLOW, STAGE_LABEL, fullName, type Stage } from '@/types/domain';
import { TopBar } from '@/components/chrome/TopBar';
import { SubBar } from '@/components/chrome/SubBar';
import { TabStrip } from '@/components/responsive/Drawer';
import { Btn } from '@/components/atoms/Btn';
import { ProfileCard } from '@/components/cards/ProfileCard';
import { ScoreCard, MilestonesCard, PrayerCard } from '@/components/cards/TravelingCards';
import { NewFollowupForm } from '@/components/collab/NewFollowupForm';

const CRUMB_LABEL: Record<Stage, string> = {
  applicant: 'Applicants',
  candidate: 'Candidates',
  member: 'Active Members',
  alumni: 'Alumni',
};
const CRUMB_TO: Record<Stage, string> = {
  applicant: '/directory/applicant',
  candidate: '/directory/candidate',
  member: '/directory/active',
  alumni: '/directory/alumni',
};

export default function ProfilePage() {
  const { theme: t } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useRole();
  const canManage = canManageRole(role);
  const w = useViewport();
  const narrow = w < BP.tab;

  const { data: member, isLoading } = useMember(id);
  const setStage = useSetStage();
  const { me, announceStage, logActivity } = useCollab();

  const [tab, setTab] = useState('card');
  const [assignOpen, setAssignOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel }}>
        <TopBar theme={t} section="directory" />
        <div style={{ padding: 60, textAlign: 'center', color: t.faint }}>Loading profile…</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel }}>
        <TopBar theme={t} section="directory" />
        <div style={{ padding: 60, textAlign: 'center', color: t.sub }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.ink }}>Profile not found</div>
          <div style={{ marginTop: 8 }}>
            <Btn theme={t} kind="ghost" label="Back to directory" onClick={() => navigate('/directory/active')} />
          </div>
        </div>
      </div>
    );
  }

  const st = member.stage;
  const flow = STAGE_FLOW[st];

  const promote = () => {
    if (!flow) return;
    setStage.mutate({ memberId: member.id, toStage: flow.next, byId: me }, { onSuccess: () => announceStage(flow.label, STAGE_LABEL[flow.next]) });
  };
  const logCall = () => logActivity({ type: 'Call', who: fullName(member), note: 'Logged from profile.' });

  const actions = (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {canManage && (
        <Btn
          theme={t}
          kind="ghost"
          label="Edit profile"
          icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.5 2.5l2 2-6.5 6.5-2.5.5.5-2.5z" strokeLinejoin="round" /></svg>}
        />
      )}
      {canManage && (
        <Btn
          theme={t}
          kind="ghost"
          label="Log interaction"
          onClick={logCall}
          icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 2.5h2l1 3-1.5 1a7 7 0 003 3l1-1.5 3 1v2a1 1 0 01-1 1A9.5 9.5 0 012 3.5a1 1 0 011-1z" strokeLinejoin="round" /></svg>}
        />
      )}
      {canManage && flow && <Btn theme={t} kind="primary" label={flow.label} onClick={promote} />}
    </div>
  );

  const frame: React.CSSProperties = { background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, overflow: 'hidden' };

  const sections = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
      <div style={frame}><ScoreCard theme={t} /></div>
      <div style={frame}><MilestonesCard theme={t} /></div>
      <div style={frame}><PrayerCard theme={t} /></div>
    </div>
  );

  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar theme={t} section="directory" />
      <SubBar theme={t} crumbs={[{ label: 'Directory', to: '/directory/active' }, { label: CRUMB_LABEL[st], to: CRUMB_TO[st] }, fullName(member)]}>
        {!narrow && actions}
      </SubBar>

      {narrow ? (
        <>
          <TabStrip
            theme={t}
            active={tab}
            onChange={setTab}
            items={[
              { key: 'card', label: 'Card' },
              { key: 'scorecard', label: 'Scorecard' },
              { key: 'milestones', label: 'Milestones' },
              { key: 'prayer', label: 'Prayer' },
            ]}
          />
          <div style={{ padding: '16px 14px 40px' }}>
            <div style={{ marginBottom: 14 }}>{actions}</div>
            {tab === 'card' && <div style={frame}><ProfileCard theme={t} member={member} narrow /></div>}
            {tab === 'scorecard' && <div style={frame}><ScoreCard theme={t} /></div>}
            {tab === 'milestones' && <div style={frame}><MilestonesCard theme={t} /></div>}
            {tab === 'prayer' && <div style={frame}><PrayerCard theme={t} /></div>}
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '24px 26px 60px', display: 'grid', gridTemplateColumns: 'minmax(540px, 600px) 1fr', gap: 22, alignItems: 'start', maxWidth: 1320, width: '100%', margin: '0 auto' }}>
            <div style={frame}><ProfileCard theme={t} member={member} /></div>
            {sections}
          </div>
        </div>
      )}

      {assignOpen && <NewFollowupForm theme={t} people={[member]} defaultWho={fullName(member)} onClose={() => setAssignOpen(false)} modal />}
    </div>
  );
}
