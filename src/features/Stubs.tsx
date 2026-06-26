// src/features/Stubs.tsx
// Honest scaffolds for screens not yet built in this pass. Each uses the real
// app chrome and states what it will contain (per the README), so navigation and
// the shell are already correct and these can be filled in next. See
// BUILD_STATUS.md for the build order and exact specs.

import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/theme/ThemeProvider';
import { SERIF, UI } from '@/theme/tokens';
import { TopBar } from '@/components/chrome/TopBar';
import { SubBar } from '@/components/chrome/SubBar';
import { Btn } from '@/components/atoms/Btn';
import { Avatar } from '@/components/atoms/Avatar';
import { Tag } from '@/components/atoms/Tag';
import { ScoreCard } from '@/components/cards/TravelingCards';
import { recommend } from '@/lib/recommend';
import { useMember } from '@/data/queries';
import { fullName } from '@/types/domain';
import type { Theme } from '@/theme/tokens';

function ScaffoldNotice({ theme: t, title, bullets }: { theme: Theme; title: string; bullets: string[] }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 26px' }}>
      <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><rect x="2" y="2.5" width="12" height="11" rx="2" /><path d="M5 6h6M5 9h4" strokeLinecap="round" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 22 }}>{title}</div>
            <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>Scaffolded — next in the build order</div>
          </div>
        </div>
        <p style={{ fontFamily: UI, fontSize: 13.5, color: t.sub, lineHeight: 1.6, margin: '0 0 14px' }}>
          The app shell, theming, data layer, and navigation for this screen are in place. The full UI is the next step — here's what it will contain:
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontFamily: UI, fontSize: 13, color: t.ink, lineHeight: 1.5 }}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TrackerPage() {
  const { theme: t } = useTheme();
  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink }}>
      <TopBar theme={t} section="tracker" />
      <ScaffoldNotice
        theme={t}
        title="Relationship Tracker"
        bullets={[
          'KPI tiles: In your care, Call this month, Overdue, Open follow-ups, Thriving.',
          'Contact Queue with segmented filters (Everyone / Call Today / Call This Week / My guys / Open to help) and columns: Member, Owner (click to reassign), Last contact, Open to, Up next (due badge + date).',
          'Right rail (312px): My follow-ups (assign + reassign + complete) and a live activity feed — both already powered by the collab store.',
          'Owner reassignment + task assignment already fan out notifications, toasts, and activity via the store.',
        ]}
      />
    </div>
  );
}

export function ResourcesPage() {
  const { theme: t } = useTheme();
  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink }}>
      <TopBar theme={t} section="resources" />
      <ScaffoldNotice
        theme={t}
        title="Resources"
        bullets={[
          'Shared file/library list backed by Supabase Storage.',
          'Upload, categorize, and download chapter resources.',
          'Permission-gated by role (Campus Director / National Staff can upload).',
        ]}
      />
    </div>
  );
}

export function TrainingPage() {
  const { theme: t } = useTheme();
  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink }}>
      <TopBar theme={t} section="directory" />
      <ScaffoldNotice
        theme={t}
        title="Training"
        bullets={[
          'Self-contained sub-app: lesson library, lesson player, builder, and interactive games.',
          'Candidate formation progress tracking.',
          'Ported from training-library / training-player / training-builder / training-games.',
        ]}
      />
    </div>
  );
}

export function ApplicationPage() {
  const { theme: t } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: m, isLoading } = useMember(id);

  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar theme={t} section="directory" />
      <SubBar theme={t} crumbs={[{ label: 'Directory', to: '/directory/applicant' }, { label: 'Applicants', to: '/directory/applicant' }, m ? fullName(m) : 'Application']} />
      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center', color: t.faint }}>Loading application…</div>
      ) : !m ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Btn theme={t} kind="ghost" label="Back to applicants" onClick={() => navigate('/directory/applicant')} />
        </div>
      ) : (
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', padding: '24px 26px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'start' }}>
          <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <Avatar f={m.firstName} l={m.lastName} size={56} theme={t} />
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 24 }}>{fullName(m)}</div>
                <div style={{ fontSize: 13, color: t.sub, marginTop: 3 }}>{m.classYear} · {m.major}</div>
                <div style={{ marginTop: 8 }}><Tag stage={m.stage} size="sm" theme={t} /></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {([['Hometown', m.hometown], ['Submitted', m.submitted], ['Interview score', m.interviewScore == null ? '—' : m.interviewScore.toFixed(1)], ['Recommendation', recommend(m.interviewScore).label]] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 500, color: t.ink }}>{v}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: t.faint, lineHeight: 1.6, marginTop: 20, marginBottom: 0 }}>
              Full application form (essays, references, candidacy checklist) and the editable reviewer scorecard are the next step — see BUILD_STATUS.md.
            </p>
          </div>
          <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, overflow: 'hidden' }}>
            <ScoreCard theme={t} />
          </div>
        </div>
      )}
    </div>
  );
}
