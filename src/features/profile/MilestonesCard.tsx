// MilestonesCard.tsx — the Milestones traveling card: a vertical journey
// timeline of application, formation, and personal events. Faithful port of
// cards.jsx MilestonesCard; the event set is the prototype's fixed demonstration
// data, wired to live milestone records in a later phase.
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { Eyebrow } from '@/components/ui';

interface MilestoneEvent {
  date: string;
  title: string;
  kind: 'app' | 'interview' | 'stage' | 'personal' | 'next';
  done: boolean;
}

const EVENTS: MilestoneEvent[] = [
  { date: 'Aug 28, 2024', title: 'Submitted application', kind: 'app', done: true },
  { date: 'Sep 14, 2024', title: 'Completed interview', kind: 'interview', done: true },
  { date: 'Sep 20, 2024', title: 'Accepted as Candidate', kind: 'stage', done: true },
  { date: 'Oct 6, 2024', title: 'Baptized — Forest Hill', kind: 'personal', done: true },
  { date: 'Nov 22, 2024', title: 'Completed New Member Formation', kind: 'stage', done: true },
  { date: 'Dec 1, 2024', title: 'Initiated as Active Member', kind: 'stage', done: true },
  { date: 'Upcoming', title: 'CPR Certification renewal', kind: 'next', done: false },
];

export function MilestonesCard() {
  const { t } = useTheme();
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 18px' }}>
        <Eyebrow>Milestones</Eyebrow>
        <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Journey &amp; history</div>
      </div>
      <div style={{ padding: '0 26px 24px', flex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'relative', paddingLeft: 26 }}>
          <div style={{ position: 'absolute', left: 6, top: 6, bottom: 10, width: 2, background: t.line }} />
          {EVENTS.map((e, i) => {
            const personal = e.kind === 'personal';
            const next = !e.done;
            return (
              <div key={i} style={{ position: 'relative', paddingBottom: i === EVENTS.length - 1 ? 0 : 20 }}>
                <div style={{ position: 'absolute', left: -26, top: 2, width: 14, height: 14, borderRadius: '50%', background: next ? t.bg : personal ? t.gold : t.accent, border: next ? `2px dashed ${t.faint}` : 'none', boxShadow: next ? 'none' : `0 0 0 3px ${t.bg}, 0 0 0 4px ${t.line}` }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: t.faint, letterSpacing: 0.2, fontVariantNumeric: 'tabular-nums' }}>{e.date}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: next ? t.sub : t.ink, marginTop: 2 }}>{e.title}</div>
                {personal && <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.gold }}>Personal</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
