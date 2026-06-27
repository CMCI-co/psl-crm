// ApplicantBody.tsx — the review queue. Submitted applications awaiting a
// decision; interview score & recommendation travel here, and an applicant can
// be advanced to Candidate singly or in a batch. Ported from directory.jsx.
import { useMemo } from 'react';
import { useTheme } from '@/theme/useTheme';
import { SERIF, BP } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { Avatar, Tag, StatChip, useBatch, SelChk, SelectToggle, BatchBar } from '@/components/ui';
import { useLifecycle } from '@/lib/lifecycle';
import { fullName, recommend, type Member } from '@/types/domain';

export function ApplicantBody({ rows, dense, onOpen }: {
  rows: Member[]; dense: boolean; onOpen: (m: Member) => void;
}) {
  const { t } = useTheme();
  const lc = useLifecycle();
  const batch = useBatch();
  const narrow = useViewport() < BP.tab;

  const keys = rows.map((r) => r.id);
  const allOn = keys.length > 0 && keys.every((k) => batch.sel.has(k));
  const someOn = keys.some((k) => batch.sel.has(k));

  const tally = useMemo(() => {
    let interviewed = 0, advance = 0, discuss = 0, hold = 0;
    rows.forEach((m) => {
      if (m.interviewScore != null) interviewed += 1;
      const k = recommend(m.interviewScore).kind;
      if (k === 'advance') advance += 1; else if (k === 'discuss') discuss += 1; else if (k === 'hold') hold += 1;
    });
    return { interviewed, advance, discuss, hold, awaiting: rows.length - interviewed };
  }, [rows]);

  const rowClick = (m: Member) => (batch.selecting ? batch.toggle(m.id) : onOpen(m));
  const doBatch = () => {
    lc.advanceMany(rows.filter((r) => batch.sel.has(r.id)), 'candidate', 'advanced');
    batch.clear();
  };

  const cols = '1.9fr 1.3fr 1.4fr 0.9fr 0.9fr 1.1fr 0.5fr';
  const gcols = batch.selecting ? `34px ${cols}` : cols;
  const rowPad = dense ? '7px 26px' : '11px 26px';
  const bar = batch.selecting ? (
    <BatchBar count={batch.sel.size} label="Advance to Candidate" onAction={doBatch} onClear={batch.clear} />
  ) : null;

  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        <div style={{ padding: '15px 16px 13px', borderBottom: `1px solid ${t.line}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 21 }}>Applicants</div>
              <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>UNC Charlotte · Fall 2026</div>
            </div>
            {rows.length > 0 && (
              <SelectToggle selecting={batch.selecting} onToggle={() => (batch.selecting ? batch.clear() : batch.setSelecting(true))} />
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <StatChip value={rows.length} label="Applicants" tone={t.stages.applicant.fg} />
            <StatChip value={tally.interviewed} label="Interviewed" tone="#1f6b46" />
            <StatChip value={tally.awaiting} label="Awaiting" tone={t.faint} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.line}` }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round" /></svg>
            <span style={{ fontSize: 12, color: t.ink, lineHeight: 1.45 }}>
              <b style={{ color: t.accent }}>Decision night ·</b> {tally.advance} clear to advance · {tally.discuss} to discuss · {tally.hold} below the line.
            </span>
          </div>
        </div>
        {batch.selecting && (
          <div onClick={() => batch.setAll(keys, !allOn)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${t.line}`, background: t.panel, cursor: 'pointer' }}>
            <SelChk checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.sub }}>{allOn ? 'Deselect all' : 'Select all'}</span>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: batch.selecting ? 80 : 0 }}>
          {rows.map((m) => {
            const rec = recommend(m.interviewScore);
            return (
              <div key={m.id} onClick={() => rowClick(m)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(m.id) ? t.accentSoft : 'transparent' }}>
                {batch.selecting && <SelChk checked={batch.sel.has(m.id)} onChange={() => batch.toggle(m.id)} />}
                <Avatar first={m.firstName} last={m.lastName} size={42} url={m.avatarUrl} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
                  <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.classYear} · {m.major ?? '—'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 6 }}>
                    {m.submitted && <span style={{ fontSize: 12, color: t.faint }}>Submitted {m.submitted}</span>}
                    {m.interviewScore != null && <span style={{ fontSize: 12, fontWeight: 700, color: t.accent, fontVariantNumeric: 'tabular-nums' }}>· {m.interviewScore.toFixed(1)}</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {rec.kind === 'await'
                    ? <span style={{ fontSize: 12, color: t.faint }}>Awaiting</span>
                    : <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, background: rec.bg, color: rec.fg, fontSize: 11.5, fontWeight: 600 }}>{rec.label}</span>}
                </div>
              </div>
            );
          })}
        </div>
        {bar}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 25 }}>UNC Charlotte</span>
            <span style={{ fontSize: 13, color: t.faint }}>· Applicants · Fall 2026</span>
          </div>
          <SelectToggle selecting={batch.selecting} onToggle={() => (batch.selecting ? batch.clear() : batch.setSelecting(true))} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <StatChip value={rows.length} label="Applicants" tone={t.stages.applicant.fg} />
          <StatChip value={tally.interviewed} label="Interviewed" tone="#1f6b46" />
          <StatChip value={tally.awaiting} label="Awaiting decision" tone={t.faint} />
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.line}` }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round" /></svg>
          <span style={{ fontSize: 12.5, color: t.ink }}>
            <b style={{ color: t.accent }}>Decision night ·</b> {tally.advance} scored <b>≥ 8.5</b> (clear to advance) · {tally.discuss} in the <b>discuss</b> range · {tally.hold} below the line.
          </span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: gcols, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
          {batch.selecting && <SelChk checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />}
          {['Applicant', 'School · Year', 'Major', 'Submitted', 'Interview', 'Recommendation', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        <div style={{ paddingBottom: batch.selecting ? 80 : 0 }}>
          {rows.map((m) => {
            const rec = recommend(m.interviewScore);
            return (
              <div key={m.id} onClick={() => rowClick(m)} style={{ display: 'grid', gridTemplateColumns: gcols, gap: 12, padding: rowPad, alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(m.id) ? t.accentSoft : 'transparent' }}>
                {batch.selecting && <SelChk checked={batch.sel.has(m.id)} onChange={() => batch.toggle(m.id)} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <Avatar first={m.firstName} last={m.lastName} size={dense ? 28 : 32} url={m.avatarUrl} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
                    {!dense && <div style={{ marginTop: 2 }}><Tag stage="applicant" size="sm" /></div>}
                  </div>
                </div>
                <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.school ?? 'UNCC'} · {m.classYear}</span>
                <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.major ?? '—'}</span>
                <span style={{ fontSize: 13, color: t.sub }}>{m.submitted ?? '—'}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: m.interviewScore == null ? t.faint : t.accent, fontVariantNumeric: 'tabular-nums' }}>
                  {m.interviewScore == null ? 'Not yet' : m.interviewScore.toFixed(1)}
                </span>
                <span>
                  {rec.kind === 'await'
                    ? <span style={{ fontSize: 12.5, color: t.faint }}>Awaiting</span>
                    : <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, background: rec.bg, color: rec.fg, fontSize: 11.5, fontWeight: 600 }}>{rec.label}</span>}
                </span>
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {!batch.selecting && (
                    <span
                      onClick={(e) => { e.stopPropagation(); lc.advance(m, 'candidate'); }}
                      title="Advance to Candidate"
                      style={{ width: 26, height: 26, borderRadius: 7, border: `1px solid ${t.line}`, background: t.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={t.sub} strokeWidth="1.7"><path d="M3 6.5h6M6.5 3.5L9.5 6.5 6.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {bar}
    </div>
  );
}
