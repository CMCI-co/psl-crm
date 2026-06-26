// src/components/cards/TravelingCards.tsx
// The "traveling cards" that ride under a profile (ported from cards.jsx):
// Interview Scorecard, Milestones timeline, Prayer Requests. Hero-focused in
// this pass (seeded data); these become member-scoped queries later.

import type { Theme } from '@/theme/tokens';
import { SERIF, UI } from '@/theme/tokens';
import { Eyebrow } from '@/components/atoms/Tag';
import { CardGlyph } from '@/components/atoms/CardGlyph';
import { SEED_MILESTONES, SEED_PRAYER } from '@/data/mockData';

// ── Interview Scorecard ───────────────────────────────────────────────────
export function ScoreCard({ theme: t }: { theme: Theme }) {
  const criteria = [
    { label: 'Character & Integrity', score: 9.0 },
    { label: 'Sense of Calling', score: 8.7 },
    { label: 'Teachability', score: 9.3 },
    { label: 'Communication', score: 7.8 },
    { label: 'Commitment', score: 8.2 },
  ];
  const reviewers = [
    ['A', 'R'],
    ['D', 'H'],
    ['T', 'B'],
  ];
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow theme={t}>Interview Scorecard</Eyebrow>
          <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Marcus J. Bellamy</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontSize: 11.5, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: 9, background: t.accent }} /> Final · Locked
        </span>
      </div>

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

      <div style={{ padding: '20px 26px 0', flex: 1 }}>
        {criteria.map((c) => (
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

      <div style={{ padding: '4px 26px 24px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 14 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {reviewers.map((r, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: t.accentSoft,
                  color: t.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  marginLeft: i ? -8 : 0,
                  boxShadow: `0 0 0 2px ${t.bg}`,
                }}
              >
                {r.join('')}
              </div>
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

// ── Milestones timeline ───────────────────────────────────────────────────
export function MilestonesCard({ theme: t }: { theme: Theme }) {
  const events = SEED_MILESTONES;
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 18px' }}>
        <Eyebrow theme={t}>Milestones</Eyebrow>
        <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Journey &amp; history</div>
      </div>
      <div style={{ padding: '0 26px 24px', flex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'relative', paddingLeft: 26 }}>
          <div style={{ position: 'absolute', left: 6, top: 6, bottom: 10, width: 2, background: t.line }} />
          {events.map((e, i) => {
            const personal = e.kind === 'personal';
            const next = !e.done;
            return (
              <div key={e.id} style={{ position: 'relative', paddingBottom: i === events.length - 1 ? 0 : 20 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: -26,
                    top: 2,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: next ? t.bg : personal ? t.gold : t.accent,
                    border: next ? `2px dashed ${t.faint}` : 'none',
                    boxShadow: next ? 'none' : `0 0 0 3px ${t.bg}, 0 0 0 4px ${t.line}`,
                  }}
                />
                <div style={{ fontSize: 11, fontWeight: 600, color: t.faint, letterSpacing: 0.2, fontVariantNumeric: 'tabular-nums' }}>{e.date}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: next ? t.sub : t.ink, marginTop: 2 }}>{e.title}</div>
                {personal && (
                  <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.gold }}>Personal</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Prayer Requests ───────────────────────────────────────────────────────
export function PrayerCard({ theme: t }: { theme: Theme }) {
  const items = SEED_PRAYER;
  const open = items.filter((i) => i.status === 'open').length;
  const answered = items.filter((i) => i.status === 'answered').length;
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow theme={t}>Prayer Requests</Eyebrow>
          <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Lifted in prayer</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: t.sub }}>{open} open</span>
          <span style={{ fontSize: 11.5, color: t.faint }}>·</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#1f6b46' }}>{answered} answered</span>
        </div>
      </div>
      <div style={{ padding: '16px 26px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it) => {
          const ans = it.status === 'answered';
          return (
            <div key={it.id} style={{ padding: '13px 14px', borderRadius: 12, background: ans ? '#f1f8f3' : t.panel, border: `1px solid ${ans ? '#d9ecdf' : t.line}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ marginTop: 1 }}>
                  <CardGlyph k="prayer" color={ans ? '#1f6b46' : t.accent} size={15} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.45, color: t.ink }}>{it.text}</div>
                  {ans && it.praise && <div style={{ fontSize: 12, color: '#1f6b46', marginTop: 6, fontWeight: 500 }}>✓ {it.praise}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: ans ? '#1f6b46' : t.faint }}>
                      {ans ? 'Answered' : 'Open'}
                    </span>
                    <span style={{ fontSize: 11, color: t.faint }}>{it.date}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
