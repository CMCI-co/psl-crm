// ProfileDetail.tsx — the Profile workspace body (port of engagement.jsx
// ProfileDetail). Rendered inside RecordPage's AppShell, so it owns the SubBar
// (breadcrumb + lifecycle actions) but not the TopBar. Desktop is a two-column
// layout — the traveling Profile Card (sticky) beside editable accordion
// sections — collapsing to a tabbed "card system" on narrow screens. Promotion
// routes through the lifecycle store; edits are gated by the collab store's role.
import { useState, type ReactNode } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI, BP, type Stage } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { useLifecycle } from '@/lib/lifecycle';
import { useCollab } from '@/lib/collab';
import { SubBar } from '@/components/layout/SubBar';
import { Button, Eyebrow, TabStrip } from '@/components/ui';
import { NewFollowupForm, ChannelIcon } from '@/components/collab';
import { fullName, type Member } from '@/types/domain';
import { ProfileCard } from './ProfileCard';
import { AccordionCard } from './AccordionCard';
import { AreaIcon, StatusPill } from './engagement-atoms';
import { LIFE_AREAS, CALLS, FOLLOWUPS, PRAYER, GIVING, HELP } from './engagement-data';
import {
  HowDoingBody, CallLogBody, FollowupsBody, PrayerBody, GivingBody, WaysToHelpBody,
} from './sections';

const STAGE_CRUMB: Record<Stage, string> = {
  applicant: 'Applicants', candidate: 'Candidates', member: 'Active Members', alumni: 'Alumni',
};

const PencilIcon = <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.5 2.5l2 2-6.5 6.5-2.5.5.5-2.5z" strokeLinejoin="round" /></svg>;
const PromoteIcon = <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 10.5V3.5M3.8 6.5L7 3.3l3.2 3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const LogIcon = <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 2.5v9M2.5 7h9" strokeLinecap="round" /></svg>;

export function ProfileDetail({ member }: { member: Member }) {
  const { t } = useTheme();
  const { canEdit: editable } = useCollab();
  const { promote, stageOf } = useLifecycle();
  const w = useViewport();
  const narrow = w < BP.tab;

  const effSt = stageOf(member.id, member.stage);
  const name = fullName(member);
  const firstLast = { f: member.firstName, l: member.lastName };
  const crumb = STAGE_CRUMB[effSt] ?? 'Directory';
  const [assignOpen, setAssignOpen] = useState(false);
  const [tab, setTab] = useState('profile');

  const watch = LIFE_AREAS.filter((x) => x.tone === 'watch').length;
  const openFollow = FOLLOWUPS.filter((f) => f.status !== 'done').length;
  const openPrayer = PRAYER.filter((p) => p.open).length;
  const waysOn = HELP.filter((h) => h.on).length;

  const actions = (short: boolean) => (
    <>
      {!short && editable && <Button kind="ghost" label="Edit profile" icon={PencilIcon} />}
      {editable && effSt === 'candidate' && <Button kind="primary" label={short ? 'Promote' : 'Promote to Member'} icon={PromoteIcon} onClick={() => promote(member)} />}
      {editable && <Button kind="subtle" label={short ? 'Log' : 'Log interaction'} icon={LogIcon} />}
    </>
  );

  const lockNotice = (text: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderRadius: 11, background: t.bg, border: `1px solid ${t.line}`, fontSize: 12, color: t.faint }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.6"><rect x="4" y="7.5" width="8" height="5.5" rx="1.3" /><path d="M5.7 7.5V6a2.3 2.3 0 014.6 0v1.5" strokeLinecap="round" /></svg>
      {text}
    </div>
  );

  const assignModal = assignOpen && (
    <NewFollowupForm modal people={[firstLast]} defaultWho={name} onClose={() => setAssignOpen(false)} />
  );

  // ── Narrow: the Card system becomes a tabbed surface ────────────────────
  if (narrow) {
    const Panel = ({ title, badge, children }: { title: string; badge?: ReactNode; children: ReactNode }) => (
      <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2 }}>
          <Eyebrow>{title}</Eyebrow>
          {badge}
        </div>
        {children}
      </div>
    );
    const ic = (key: string) => tab === key;
    const tabItems = [
      { key: 'profile', label: 'Profile', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={ic('profile') ? t.onAccent : t.faint} strokeWidth="1.5"><circle cx="8" cy="5.4" r="2.6" /><path d="M3.4 13c0-2.4 1.9-4 4.6-4s4.6 1.6 4.6 4" strokeLinecap="round" /></svg> },
      { key: 'doing', label: 'Updates', badge: watch > 0 ? watch : undefined, icon: <AreaIcon kind="personal" color={ic('doing') ? t.onAccent : t.faint} size={14} /> },
      { key: 'calls', label: 'Calls', badge: CALLS.length, icon: <ChannelIcon kind="Call" color={ic('calls') ? t.onAccent : t.faint} size={13} /> },
      { key: 'follow', label: 'Follow-ups', badge: openFollow, icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ic('follow') ? t.onAccent : t.faint} strokeWidth="1.5"><path d="M3 8.2l2.2 2.2L11 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
      { key: 'prayer', label: 'Prayer', badge: openPrayer, icon: <AreaIcon kind="prayer" color={ic('prayer') ? t.onAccent : t.faint} size={14} /> },
      { key: 'giving', label: 'Giving', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ic('giving') ? t.onAccent : t.faint} strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v6M6.3 6.2c0-.8.8-1.3 1.7-1.3s1.7.4 1.7 1.2-.8 1.1-1.7 1.1-1.7.4-1.7 1.2.8 1.2 1.7 1.2 1.7-.5 1.7-1.2" strokeLinecap="round" /></svg> },
      { key: 'help', label: 'Help', badge: waysOn, icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ic('help') ? t.onAccent : t.faint} strokeWidth="1.5"><path d="M8 13s-5-3.2-5-7a3 3 0 015-2.2A3 3 0 0113 6c0 3.8-5 7-5 7z" strokeLinejoin="round" /></svg> },
    ];
    return (
      <>
        <SubBar crumbs={['Directory', crumb, name]}>{actions(true)}</SubBar>
        <TabStrip items={tabItems} active={tab} onChange={setTab} />
        <div style={{ padding: '14px 14px 30px', fontFamily: UI }}>
          {!editable && tab !== 'profile' && (
            <div style={{ marginBottom: 14 }}>{lockNotice('Viewing only — edits are reserved for Campus Directors & National Staff.')}</div>
          )}
          {tab === 'profile' && (
            <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, overflow: 'hidden' }}>
              <ProfileCard member={member} stage={effSt} canEdit={editable} narrow />
            </div>
          )}
          {tab === 'doing' && <Panel title="How they're doing" badge={watch > 0 ? <StatusPill tone="watch" label={`${watch} needs attention`} /> : <StatusPill tone="good" label="Healthy" />}><HowDoingBody /></Panel>}
          {tab === 'calls' && <Panel title="Call log"><CallLogBody who={name} editable={editable} /></Panel>}
          {tab === 'follow' && (
            <Panel title="Follow-ups" badge={editable
              ? <span onClick={() => setAssignOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '2px 9px', borderRadius: 999, cursor: 'pointer' }}><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.8"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg>Assign</span>
              : <span style={{ fontSize: 11, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '1px 8px', borderRadius: 999 }}>{openFollow} open</span>}>
              <FollowupsBody who={name} editable={editable} />
            </Panel>
          )}
          {tab === 'prayer' && <Panel title="Prayer requests" badge={<StatusPill tone="info" label={`${openPrayer} open`} />}><PrayerBody /></Panel>}
          {tab === 'giving' && <Panel title="Giving"><GivingBody /></Panel>}
          {tab === 'help' && <Panel title="Ways to help" badge={<span style={{ fontSize: 11, fontWeight: 700, color: '#1f6b46', background: '#e3f3ea', padding: '1px 8px', borderRadius: 999 }}>{waysOn} active</span>}><WaysToHelpBody /></Panel>}
        </div>
        {assignModal}
      </>
    );
  }

  // ── Desktop: Profile Card + editable accordion sections ─────────────────
  return (
    <>
      <SubBar crumbs={['Directory', crumb, name]}>{actions(false)}</SubBar>
      <div style={{ padding: '24px 26px', display: 'grid', gridTemplateColumns: 'minmax(540px, 580px) 1fr', gap: 22, alignItems: 'start', maxWidth: 1320, width: '100%', margin: '0 auto', fontFamily: UI }}>
        {/* the traveling Profile Card — consistent Contact & Details */}
        <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 24 }}>
          <ProfileCard member={member} stage={effSt} canEdit={editable} />
        </div>

        {/* editable accordion engagement sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {!editable && lockNotice("You're viewing this record. Tracking & edits are reserved for Campus Directors & National Staff.")}

          <AccordionCard defaultOpen editable={editable} editLabel="Add update" title="How they're doing"
            icon={<AreaIcon kind="personal" color={t.accent} />}
            summary={`${LIFE_AREAS.length} life areas tracked`}
            badge={watch > 0 ? <StatusPill tone="watch" label={`${watch} needs attention`} /> : <StatusPill tone="good" label="Healthy" />}>
            <HowDoingBody />
          </AccordionCard>

          <AccordionCard defaultOpen editable={editable} editLabel="Log" title="Call log"
            icon={<ChannelIcon kind="Call" color={t.accent} size={15} />}
            summary={`${CALLS.length} touches · last ${CALLS[0].date}`}>
            <CallLogBody who={name} editable={editable} />
          </AccordionCard>

          <AccordionCard editable={editable} editLabel="Assign" onEdit={() => setAssignOpen(true)} title="Follow-ups"
            icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M3 8.2l2.2 2.2L11 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            summary="Tasks owed across the team"
            badge={<span style={{ fontSize: 11, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '1px 8px', borderRadius: 999 }}>{openFollow} open</span>}>
            <FollowupsBody who={name} editable={editable} />
          </AccordionCard>

          <AccordionCard editable={editable} editLabel="Add" title="Prayer requests"
            icon={<AreaIcon kind="prayer" color={t.accent} />}
            summary="Lifted in prayer"
            badge={<StatusPill tone="info" label={`${openPrayer} open`} />}>
            <PrayerBody />
          </AccordionCard>

          <AccordionCard editable={editable} editLabel="Edit" title="Giving"
            icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v6M6.3 6.2c0-.8.8-1.3 1.7-1.3s1.7.4 1.7 1.2-.8 1.1-1.7 1.1-1.7.4-1.7 1.2.8 1.2 1.7 1.2 1.7-.5 1.7-1.2" strokeLinecap="round" /></svg>}
            summary={GIVING.status}>
            <GivingBody />
          </AccordionCard>

          <AccordionCard editable={editable} editLabel="Edit" title="Ways to help"
            icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M8 13s-5-3.2-5-7a3 3 0 015-2.2A3 3 0 0113 6c0 3.8-5 7-5 7z" strokeLinejoin="round" /></svg>}
            summary="How they're open to serving"
            badge={<span style={{ fontSize: 11, fontWeight: 700, color: '#1f6b46', background: '#e3f3ea', padding: '1px 8px', borderRadius: 999 }}>{waysOn} active</span>}>
            <WaysToHelpBody />
          </AccordionCard>
        </div>
      </div>
      {assignModal}
    </>
  );
}
