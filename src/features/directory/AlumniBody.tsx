// AlumniBody.tsx — the alumni roster: expanded life/work fields, an
// open-to-connect signal, and a grad-year / major / map view switch. Ported
// from directory.jsx AlumniBody (the flat table is now groupable).
import { useMemo, useState } from 'react';
import { useTheme } from '@/theme/useTheme';
import { SERIF, BP } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { Avatar, OfficeChip, StatChip, SegmentedControl } from '@/components/ui';
import { fullName, topOffice, type Member } from '@/types/domain';

type Mode = 'year' | 'major' | 'map';

function ConnectPill({ on, faint }: { on: boolean; faint: string }) {
  if (on) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 11.5, fontWeight: 600 }}>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#1f6b46" strokeWidth="2"><path d="M1.5 5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Open
      </span>
    );
  }
  return <span style={{ fontSize: 12.5, color: faint }}>Private</span>;
}

export function AlumniBody({ rows, dense, onOpen }: {
  rows: Member[]; dense: boolean; onOpen: (m: Member) => void;
}) {
  const { t } = useTheme();
  const narrow = useViewport() < BP.tab;
  const [mode, setMode] = useState<Mode>('year');

  const stats = useMemo(() => {
    const open = rows.filter((m) => m.openToConnect).length;
    const married = rows.filter((m) => (m.marital ?? '').toLowerCase() === 'married').length;
    const engOpen = rows.filter((m) => m.openToConnect && /engineer/i.test(m.major ?? '')).length;
    const outOfState = rows.filter((m) => /,\s*(?!NC)[A-Z]{2}\b/.test(m.location ?? '')).length;
    return { open, married, engOpen, outOfState };
  }, [rows]);

  const cols = '1.8fr 0.7fr 1.4fr 2fr 1.2fr 1fr';
  const rowPad = dense ? '7px 26px' : '11px 26px';

  const sub = (m: Member) =>
    `${m.marital ?? ''}${m.kids ? ` · ${m.kids} ${m.kids === 1 ? 'child' : 'kids'}` : ''}`;

  // ── narrow: flat card list (no view switch) ──────────────────────────────
  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        <div style={{ padding: '15px 16px 13px', borderBottom: `1px solid ${t.line}` }}>
          <div style={{ fontFamily: SERIF, fontSize: 21 }}>Alumni</div>
          <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>UNC Charlotte</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <StatChip value={rows.length} label="Alumni" tone={t.stages.alumni.fg} />
            <StatChip value={stats.open} label="Open to connect" tone="#1f6b46" />
            <StatChip value={stats.married} label="Married" tone={t.accent} />
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {rows.map((m) => {
            const office = topOffice(m);
            return (
              <div key={m.id} onClick={() => onOpen(m)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer' }}>
                <Avatar first={m.firstName} last={m.lastName} size={42} url={m.avatarUrl} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</span>
                    {m.openToConnect && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>Open</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Class of {m.gradYear ?? '—'} · {m.major ?? '—'}</div>
                  {m.work && <div style={{ fontSize: 12, color: t.faint, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.work}</div>}
                  <div style={{ fontSize: 12, color: t.faint, marginTop: 1 }}>{m.location ?? '—'}{sub(m) ? ` · ${sub(m)}` : ''}</div>
                  {office && <div style={{ marginTop: 6 }}><OfficeChip office={office} size="sm" /></div>}
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.6" style={{ flexShrink: 0, marginTop: 4 }}><path d="M5 2.5L9.5 7 5 11.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── wide: header + view switch ───────────────────────────────────────────
  const header = (
    <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: SERIF, fontSize: 25 }}>UNC Charlotte</span>
          <span style={{ fontSize: 13, color: t.faint }}>· Alumni</span>
        </div>
        <SegmentedControl
          value={mode}
          onChange={(k) => setMode(k as Mode)}
          items={[
            { key: 'year', label: 'By grad year' },
            { key: 'major', label: 'By major' },
            { key: 'map', label: 'Map' },
          ]}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <StatChip value={rows.length} label="Alumni" tone={t.stages.alumni.fg} />
        <StatChip value={stats.open} label="Open to connect" tone="#1f6b46" />
        <StatChip value={stats.married} label="Married" tone={t.accent} />
        <StatChip value={stats.outOfState} label="Out of state" tone={t.faint} />
      </div>
      {stats.engOpen > 0 && (
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.line}` }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="4" /><path d="M9.5 9.5L13 13" strokeLinecap="round" /></svg>
          <span style={{ fontSize: 12.5, color: t.ink }}>
            <b style={{ color: t.accent }}>Cross-reference ·</b> {stats.engOpen} {stats.engOpen === 1 ? 'alumnus is' : 'alumni are'} in <b>Engineering</b> and open to connecting with current members.
          </span>
        </div>
      )}
    </div>
  );

  if (mode === 'map') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {header}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, padding: '40px 26px' }}>
          <div style={{ textAlign: 'center', maxWidth: 360 }}>
            <div style={{ width: 48, height: 48, margin: '0 auto 14px', borderRadius: 12, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.4" /></svg>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 19, color: t.ink, marginBottom: 6 }}>Alumni map</div>
            <div style={{ fontSize: 13, color: t.faint, lineHeight: 1.5 }}>
              A geographic view of where alumni live — {stats.open} are open to connecting. The interactive map lands in a later phase; for now, switch to <b style={{ color: t.sub }}>By grad year</b> or <b style={{ color: t.sub }}>By major</b>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // grouped table (year | major)
  const groups = (() => {
    const map = new Map<string, Member[]>();
    rows.forEach((m) => {
      const key = mode === 'year' ? (m.gradYear ?? 'Year unknown') : (m.major ?? 'Major unknown');
      const arr = map.get(key);
      if (arr) arr.push(m); else map.set(key, [m]);
    });
    const entries = [...map.entries()];
    entries.sort((a, b) => (mode === 'year' ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0])));
    return entries;
  })();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {header}
      <div style={{ flex: 1, overflow: 'auto', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}` }}>
          {['Alumnus', 'Class of', 'Major', 'Work', 'Location', 'Connect'].map((h) => (
            <span key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        {groups.map(([label, members]) => (
          <div key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 26px', background: t.groupBg, borderBottom: `1px solid ${t.line}` }}>
              <span style={{ width: 3, height: 13, borderRadius: 2, background: t.groupInk }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: t.groupInk }}>
                {mode === 'year' ? `Class of ${label}` : label}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.faint, background: t.bg, borderRadius: 999, padding: '1px 8px' }}>{members.length}</span>
            </div>
            {members.map((m) => {
              const office = topOffice(m);
              return (
                <div key={m.id} onClick={() => onOpen(m)} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: rowPad, alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                    <Avatar first={m.firstName} last={m.lastName} size={dense ? 28 : 32} url={m.avatarUrl} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
                      {office && <div style={{ marginTop: 3 }}><OfficeChip office={office} size="sm" /></div>}
                      {sub(m) && <div style={{ fontSize: 11, color: t.faint, marginTop: 3 }}>{sub(m)}</div>}
                    </div>
                  </div>
                  <span style={{ fontSize: 13, color: t.sub, fontVariantNumeric: 'tabular-nums' }}>{m.gradYear ?? '—'}</span>
                  <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.major ?? '—'}</span>
                  <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.work ?? '—'}</span>
                  <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.location ?? '—'}</span>
                  <span><ConnectPill on={!!m.openToConnect} faint={t.faint} /></span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
