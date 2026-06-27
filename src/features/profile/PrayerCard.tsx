// PrayerCard.tsx — the Prayer Requests traveling card: open requests and
// answered praises. Faithful port of cards.jsx PrayerCard; the item set is the
// prototype's fixed demonstration data, wired to live prayer records later.
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { Eyebrow, CardGlyph } from '@/components/ui';

interface PrayerItem {
  text: string;
  date: string;
  status: 'open' | 'answered';
  praise?: string;
}

const ITEMS: PrayerItem[] = [
  { text: 'Wisdom choosing between two co-op offers for spring.', date: 'Jun 2', status: 'open' },
  { text: "Dad's recovery after surgery — peace for the family.", date: 'May 19', status: 'open' },
  { text: 'Grandmother healed and home from the hospital.', date: 'Apr 28', status: 'answered', praise: 'Discharged Apr 30 — praise God.' },
  { text: 'Found a steady summer internship near campus.', date: 'Mar 11', status: 'answered', praise: 'Accepted at Duke Energy.' },
];

export function PrayerCard() {
  const { t } = useTheme();
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>Prayer Requests</Eyebrow>
          <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Lifted in prayer</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: t.sub }}>2 open</span>
          <span style={{ fontSize: 11.5, color: t.faint }}>·</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#1f6b46' }}>2 answered</span>
        </div>
      </div>
      <div style={{ padding: '16px 26px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ITEMS.map((it, i) => {
          const ans = it.status === 'answered';
          return (
            <div key={i} style={{ padding: '13px 14px', borderRadius: 12, background: ans ? '#f1f8f3' : t.panel, border: `1px solid ${ans ? '#d9ecdf' : t.line}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ marginTop: 1 }}><CardGlyph k="prayer" color={ans ? '#1f6b46' : t.accent} size={15} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.45, color: t.ink }}>{it.text}</div>
                  {ans && <div style={{ fontSize: 12, color: '#1f6b46', marginTop: 6, fontWeight: 500 }}>✓ {it.praise}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: ans ? '#1f6b46' : t.faint }}>{ans ? 'Answered' : 'Open'}</span>
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
