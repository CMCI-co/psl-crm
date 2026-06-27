// RecordPage.tsx — the destination when you click someone in the directory.
// Phase 1 shows a real identity header + key facts for the person (looked up
// from the same repository the directory uses). The full Profile workspace,
// Relationship Tracker, and Application Review get their own bodies next phase.
import { useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { SubBar } from '@/components/layout/SubBar';
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { Avatar, Tag, Field, OfficeChip } from '@/components/ui';
import { ProfileDetail } from '@/features/profile';
import { useMembers } from '@/data/members';
import { currentOffices, pastOffices, fullName, recommend, type Member } from '@/types/domain';

type Kind = 'profile' | 'application' | 'alumniRecord';

const CRUMB: Record<Kind, string> = { profile: 'Profile', application: 'Application Review', alumniRecord: 'Alumni' };
const SECTION: Record<Kind, string> = { profile: 'Directory', application: 'Directory', alumniRecord: 'Directory' };

export function RecordPage({ kind }: { kind: Kind }) {
  const { id } = useParams<{ id: string }>();
  const { t } = useTheme();
  const { data: all = [], isLoading } = useMembers();
  const member = all.find((m) => m.id === id);

  return (
    <AppShell>
      {member && kind === 'profile' ? (
        <ProfileDetail member={member} />
      ) : (
        <>
          <SubBar crumbs={[SECTION[kind], member ? fullName(member) : CRUMB[kind]]} />
          {isLoading ? (
            <Notice text="Loading…" />
          ) : !member ? (
            <Notice text="That record could not be found." />
          ) : (
            <Body member={member} kind={kind} />
          )}
        </>
      )}
    </AppShell>
  );

  function Notice({ text }: { text: string }) {
    return <div style={{ padding: '60px 26px', textAlign: 'center', fontFamily: UI, fontSize: 13.5, color: t.faint }}>{text}</div>;
  }
}

/**
 * Application Review / Alumni record (interim) — identity header + key facts.
 * The profile kind now renders the full ProfileDetail workspace above.
 */
function Body({ member, kind }: { member: Member; kind: Kind }) {
  const { t } = useTheme();
  const offices = currentOffices(member);
  const past = pastOffices(member);
  const rec = recommend(member.interviewScore);

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '26px 26px 60px' }}>
      {/* Identity header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 22, borderBottom: `1px solid ${t.line}` }}>
        <Avatar first={member.firstName} last={member.lastName} size={72} ring />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: SERIF, fontSize: 28, color: t.ink }}>{fullName(member)}</span>
            <Tag stage={member.stage} />
          </div>
          <div style={{ fontFamily: UI, fontSize: 13.5, color: t.sub, marginTop: 5 }}>
            {[member.classYear, member.major, member.school].filter(Boolean).join(' · ')}
          </div>
          {offices.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {offices.map((o, i) => <OfficeChip key={i} office={o} size="sm" />)}
            </div>
          )}
        </div>
      </div>

      {/* Applicant scoring callout */}
      {kind === 'application' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 22, padding: '16px 18px', borderRadius: 12, background: t.bg, border: `1px solid ${t.line}` }}>
          <div>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint }}>Interview Score</div>
            <div style={{ fontFamily: SERIF, fontSize: 30, color: t.ink, lineHeight: 1.1, marginTop: 2 }}>{member.interviewScore != null ? member.interviewScore.toFixed(1) : '—'}</div>
          </div>
          <span style={{ fontFamily: UI, fontSize: 12.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, color: rec.fg, background: rec.bg, border: rec.kind === 'await' ? '1px dashed currentColor' : 'none' }}>{rec.label}</span>
          <div style={{ marginLeft: 'auto', fontFamily: UI, fontSize: 12.5, color: t.faint }}>Submitted {member.submitted ?? '—'}</div>
        </div>
      )}

      {/* Facts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px 28px', marginTop: 24 }}>
        {member.email && <Field label="Email" value={member.email} />}
        {member.phone && <Field label="Phone" value={member.phone} />}
        {member.hometown && <Field label="Hometown" value={member.hometown} />}
        {member.church && <Field label="Home Church" value={member.church} />}
        {member.cohort && <Field label="Formation Cohort" value={member.cohort} />}
        {member.memberNo && <Field label="Member No." value={member.memberNo} mono />}
        {kind === 'alumniRecord' && member.gradYear && <Field label="Graduated" value={member.gradYear} />}
        {kind === 'alumniRecord' && member.work && <Field label="Work" value={member.work} />}
        {kind === 'alumniRecord' && member.location && <Field label="Location" value={member.location} />}
        {kind === 'alumniRecord' && member.marital && <Field label="Family" value={`${member.marital}${member.kids ? ` · ${member.kids} kid${member.kids > 1 ? 's' : ''}` : ''}`} />}
      </div>

      {past.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 9 }}>Past Offices</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {past.map((o, i) => <OfficeChip key={i} office={o} size="sm" />)}
          </div>
        </div>
      )}

      <div style={{ marginTop: 30, padding: '14px 16px', borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.line}`, fontFamily: UI, fontSize: 12.5, color: t.sub, lineHeight: 1.5 }}>
        The full {CRUMB[kind]} workspace — {kind === 'application' ? 'scoring rubric, interview notes, and the advance decision' : kind === 'alumniRecord' ? 'engagement history, giving, and ways to help' : 'relationship tracker, life areas, interactions, and lifecycle actions'} — arrives in the next phase. This page already reads live from the configured data source.
      </div>
    </div>
  );
}
