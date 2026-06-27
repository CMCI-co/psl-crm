// ScoreCard.tsx — the Interview Scorecard traveling card. Faithful port of
// cards.jsx ScoreCard: the averaged final score, per-criterion bars, the
// reviewer cluster, and the locked panel note. Data is the prototype's fixed
// demonstration set; it gets wired to live interview records in a later phase.
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { Eyebrow } from '@/components/ui';

const CRITERIA = [
  { label: 'Character & Integrity', score: 9.0 },
  { label: 'Sense of Calling', score: 8.7 },
  { label: 'Teachability', score: 9.3 },
  { label: 'Communication', score: 7.8 },
  { label: 'Commitment', score: 8.2 },
];

const REVIEWERS: string[][] = [['A', 'R'], ['D', 'H'], ['T', 'B']];

export function ScoreCard({ name = 'Marcus J. Bellamy' }: { name?: string }) {
  const { t } = useTheme();
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>Interview Scorecard</Eyebrow>
          <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>{name}</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontSize: 11.5, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: 9, background: t.accent }} /> Final · Locked
        </span>
      </div>

      {/* Overall */}
      <div style={{ margin: '20px 26px 0', padding: '16px 20px', background: t.accent, borderRadius: 14, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,.72)' }}>Final Score</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.82)', marginTop: 6 }}>Averaged from 3 reviewers</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: SERIF }}>
          <span style={{ fontSize: 44, lineHeight: 1 }}>8.6</span>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,.7)' }}>/10</span>
        </div>
      </div>

      {/* Criteria */}
      <div style={{ padding: '20px 26px 0', flex: 1 }}>
        {CRITERIA.map((c) => (
          <div key={c.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: t.ink }}>{c.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.accent, fontVariantNumeric: 'tabular-nums' }}>{c.score.toFixed(1)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: t.panel2 }}>
              <div style={{ width: `${c.score * 10}%`, height: '100%', borderRadius: 6, background: t.accent }} />
            </div>
          </div>
        ))}
      </div>

      {/* Reviewers + note */}
      <div style={{ padding: '4px 26px 24px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 14 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {REVIEWERS.map((r, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginLeft: i ? -8 : 0, boxShadow: `0 0 0 2px ${t.bg}` }}>{r.join('')}</div>
            ))}
            <span style={{ fontSize: 12, color: t.sub, marginLeft: 10 }}>3 cards locked</span>
          </div>
          <span style={{ fontSize: 12, color: t.faint }}>Sep 14, 2024</span>
        </div>
        <div style={{ marginTop: 14, padding: '11px 13px', background: t.panel, borderRadius: 10, fontSize: 12.5, lineHeight: 1.5, color: t.sub }}>
          <span style={{ fontWeight: 600, color: t.ink }}>Panel note · </span>
          Strong character and humility. Coach on public communication; pair with a senior member for first semester.
        </div>
      </div>
    </div>
  );
}
