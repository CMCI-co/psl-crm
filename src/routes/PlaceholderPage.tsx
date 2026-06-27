// PlaceholderPage.tsx — themed, navigable scaffolds for the screens whose full
// bodies land in later phases (Relationship Tracker, Resources, Training,
// Cohorts). Keeps the app fully traversable so the shell, routing, and theming
// can be reviewed end-to-end now.
import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SubBar } from '@/components/layout/SubBar';
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';

export function PlaceholderPage({ crumbs, title, blurb, phase, icon }: {
  crumbs: string[]; title: string; blurb: string; phase: string; icon: ReactNode;
}) {
  const { t } = useTheme();
  return (
    <AppShell>
      <SubBar crumbs={crumbs} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 26px', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.accentSoft, color: t.accent }}>
          {icon}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 28, color: t.ink }}>{title}</div>
        <div style={{ fontFamily: UI, fontSize: 14, color: t.sub, marginTop: 10, lineHeight: 1.55 }}>{blurb}</div>
        <div style={{ display: 'inline-block', marginTop: 18, fontFamily: UI, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: t.accent, background: t.accentSoft, border: `1px solid ${t.line}`, borderRadius: 999, padding: '5px 13px' }}>{phase}</div>
      </div>
    </AppShell>
  );
}

const ICON = {
  tracker: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12h4l2 6 4-14 2 8h6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  resources: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 5.5A2.5 2.5 0 016.5 3H12v16H6.5A2.5 2.5 0 004 21.5z" strokeLinejoin="round" /><path d="M20 5.5A2.5 2.5 0 0017.5 3H12v16h5.5a2.5 2.5 0 012.5 2.5z" strokeLinejoin="round" /></svg>,
  training: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 4L2 9l10 5 10-5z" strokeLinejoin="round" /><path d="M6 11v5c0 1 2.7 3 6 3s6-2 6-3v-5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  cohort: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /><path d="M16 5.5a3 3 0 010 5.8M18 14c2.3.6 4 2.7 4 5.2" strokeLinecap="round" /></svg>,
};

export const TrackerPage = () => <PlaceholderPage crumbs={['Relationships']} title="Relationship Tracker" blurb="The shared discipleship board — owners, follow-ups, life areas, and real-time collaboration across your leadership team." phase="Phase 4" icon={ICON.tracker} />;
export const ResourcesPage = () => <PlaceholderPage crumbs={['Resources']} title="Resources" blurb="Chapter documents, formation curriculum, bylaws, and shared files — organized and searchable." phase="Phase 3" icon={ICON.resources} />;
export const TrainingPage = () => <PlaceholderPage crumbs={['Training']} title="Training" blurb="Formation modules, interactive lessons, and knowledge checks — with a builder for staff and a player for candidates." phase="Phase 3" icon={ICON.training} />;
export const CohortPage = () => <PlaceholderPage crumbs={['Directory', 'Cohorts']} title="Cohorts" blurb="The roster grouped by New Member Formation cohort, tracking each class through the journey together." phase="Phase 2" icon={ICON.cohort} />;
