// CandidateBody.tsx — the "In Formation" roster. Candidates cross over into
// Active Members one at a time or in a batch; the promotion persists across the
// app via the lifecycle store. Ported from directory.jsx CandidateBody.
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF, BP } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { Avatar, Tag, StatChip, useBatch, SelChk, SelectToggle, BatchBar } from '@/components/ui';
import { useLifecycle } from '@/lib/lifecycle';
import { fullName, type Member } from '@/types/domain';

export function CandidateBody({ rows, dense, onOpen }: {
  rows: Member[]; dense: boolean; onOpen: (m: Member) => void;
}) {
  const { t } = useTheme();
  const lc = useLifecycle();
  const batch = useBatch();
  const narrow = useViewport() < BP.tab;

  const keys = rows.map((r) => r.id);
  const allOn = keys.length > 0 && keys.every((k) => batch.sel.has(k));
  const someOn = keys.some((k) => batch.sel.has(k));
  const cohort = rows.find((r) => r.cohort)?.cohort ?? 'Current cohort';

  const rowClick = (m: Member) => (batch.selecting ? batch.toggle(m.id) : onOpen(m));
  const doBatch = () => {
    lc.advanceMany(rows.filter((r) => batch.sel.has(r.id)), 'member', 'promoted');
    batch.clear();
  };

  const PromoteBtn = ({ m, full }: { m: Member; full?: boolean }) => (
    <button
      onClick={(e) => { e.stopPropagation(); lc.promote(m); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: full ? '9px 14px' : '6px 11px',
        borderRadius: 8, background: t.accent, color: t.onAccent, border: 'none', fontFamily: UI,
        fontSize: full ? 13 : 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
        flexShrink: 0, width: full ? '100%' : 'auto', justifyContent: 'center',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 10.5V3.5M3.8 6.5L7 3.3l3.2 3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Promote to Member
    </button>
  );

  const intro = (
    <div style={{ padding: narrow ? '15px 16px 13px' : '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: SERIF, fontSize: narrow ? 21 : 25 }}>Candidates</span>
          <span style={{ fontSize: 13, color: t.faint }}>· In Formation · {cohort}</span>
        </div>
        {rows.length > 0 && (
          <SelectToggle selecting={batch.selecting} onToggle={() => (batch.selecting ? batch.clear() : batch.setSelecting(true))} />
        )}
      </div>
      <div style={{ display: 'flex', gap: 9, marginTop: 12, flexWrap: 'wrap' }}>
        <StatChip value={rows.length} label="In Formation" tone={t.stages.candidate.fg} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.line}` }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round" /></svg>
        <span style={{ fontSize: 12, color: t.ink, lineHeight: 1.45 }}>
          <b style={{ color: t.accent }}>Crossing over ·</b> Promote one at a time, or hit <b style={{ color: t.accent }}>Select</b> to advance several at once. They move straight into the Active Members roster.
        </span>
      </div>
    </div>
  );

  const bar = batch.selecting ? (
    <BatchBar count={batch.sel.size} label="Promote to Member" onAction={doBatch} onClear={batch.clear} />
  ) : null;

  if (rows.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        {intro}
        <div style={{ padding: '40px 26px', textAlign: 'center', color: t.faint, fontSize: 13 }}>
          Every candidate has crossed over to Active Member. 🎉
        </div>
      </div>
    );
  }

  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        {intro}
        {batch.selecting && (
          <div onClick={() => batch.setAll(keys, !allOn)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${t.line}`, background: t.panel, cursor: 'pointer' }}>
            <SelChk checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.sub }}>{allOn ? 'Deselect all' : 'Select all'}</span>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: batch.selecting ? 80 : 0 }}>
          {rows.map((m) => (
            <div key={m.id} style={{ padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, background: batch.sel.has(m.id) ? t.accentSoft : 'transparent' }}>
              <div onClick={() => rowClick(m)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                {batch.selecting && <SelChk checked={batch.sel.has(m.id)} onChange={() => batch.toggle(m.id)} />}
                <Avatar first={m.firstName} last={m.lastName} size={42} url={m.avatarUrl} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
                  <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2 }}>{m.classYear} · {m.major ?? '—'}</div>
                  <div style={{ fontSize: 12, color: t.faint, marginTop: 1 }}>{m.hometown ?? '—'} · {m.church ?? '—'}</div>
                </div>
                <Tag stage="candidate" size="sm" />
              </div>
              {!batch.selecting && <div style={{ marginTop: 10 }}><PromoteBtn m={m} full /></div>}
            </div>
          ))}
        </div>
        {bar}
      </div>
    );
  }

  const cols = batch.selecting ? '34px 2fr 1fr 1.6fr 1.6fr 1.2fr' : '2fr 1fr 1.6fr 1.6fr 1.2fr';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {intro}
      <div style={{ flex: 1, overflow: 'hidden', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
          {batch.selecting && <SelChk checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />}
          {['Candidate', 'Class', 'Major', 'Hometown', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        <div style={{ paddingBottom: batch.selecting ? 80 : 0 }}>
          {rows.map((m) => (
            <div key={m.id} onClick={() => rowClick(m)} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: dense ? '8px 26px' : '12px 26px', alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(m.id) ? t.accentSoft : 'transparent' }}>
              {batch.selecting && <SelChk checked={batch.sel.has(m.id)} onChange={() => batch.toggle(m.id)} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <Avatar first={m.firstName} last={m.lastName} size={dense ? 28 : 32} url={m.avatarUrl} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
                  {!dense && <div style={{ marginTop: 3 }}><Tag stage="candidate" size="sm" /></div>}
                </div>
              </div>
              <span style={{ fontSize: 13, color: t.sub }}>{m.classYear}</span>
              <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.major ?? '—'}</span>
              <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.hometown ?? '—'}</span>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{!batch.selecting && <PromoteBtn m={m} />}</div>
            </div>
          ))}
        </div>
      </div>
      {bar}
    </div>
  );
}
