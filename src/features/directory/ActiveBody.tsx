// ActiveBody.tsx — the signature Active roster, grouped by class year
// (Freshman → Super Senior). Faithful port of directory.jsx ActiveBody: tinted
// group band with a 3px accent marker + uppercase label + count pill, then the
// member rows. Desktop is a 7-column grid; below the tablet breakpoint it
// becomes a stacked card list.
import type { CSSProperties } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF, BP } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { Avatar, Tag, Dot, OfficeChip } from '@/components/ui';
import { CLASS_ORDER, currentOffices, fullName, type ClassYear, type Member } from '@/types/domain';
import type { DirStats } from './DirectoryView';

const COLS = '2.1fr 1fr 1.5fr 1.3fr 1.5fr 1fr 0.8fr';
const HEADERS = ['Member', 'Class', 'Major', 'Hometown', 'Home Church', 'Cohort', 'Status'];

function pluralClass(y: ClassYear): string {
  return y === 'Super Senior' ? 'Super Seniors' : `${y}s`;
}

function GroupBand({ label, count }: { label: string; count: number }) {
  const { t } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 26px', background: t.groupBg, borderTop: `1px solid ${t.chromeLine || t.line}`, borderBottom: `1px solid ${t.chromeLine || t.line}` }}>
      <span style={{ width: 3, height: 13, borderRadius: 2, background: t.groupInk, flexShrink: 0 }} />
      <span style={{ fontFamily: UI, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.groupInk }}>{label}</span>
      <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 600, color: t.groupInk, background: t.bg, borderRadius: 999, padding: '1px 8px' }}>{count}</span>
    </div>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  const { t } = useTheme();
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, padding: '7px 13px', borderRadius: 10, background: t.bg, border: `1px solid ${t.line}` }}>
      <span style={{ fontFamily: UI, fontSize: 17, fontWeight: 700, color: tone, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint }}>{label}</span>
    </div>
  );
}

function useGroups(rows: Member[]) {
  return CLASS_ORDER
    .filter((y) => y !== 'Alumni')
    .map((y) => ({ y, rows: rows.filter((r) => r.classYear === y) }))
    .filter((g) => g.rows.length > 0);
}

export function ActiveBody({ rows, stats, dense, onOpen }: {
  rows: Member[]; stats: DirStats; dense: boolean; onOpen: (m: Member) => void;
}) {
  const { t } = useTheme();
  const w = useViewport();
  const narrow = w < BP.tab;
  const groups = useGroups(rows);

  const statRow = (
    <>
      <Stat value={stats.member} label="Active Members" tone={t.accent} />
      <Stat value={stats.candidate} label="Candidates" tone={t.stages.candidate.fg} />
      <Stat value={stats.inactive} label="Inactive" tone={t.faint} />
      <Stat value={stats.alumni} label="Alumni" tone={t.stages.alumni.fg} />
    </>
  );

  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        <div style={{ padding: '15px 16px 13px', borderBottom: `1px solid ${t.line}` }}>
          <div style={{ fontFamily: SERIF, fontSize: 21, color: t.ink }}>UNC Charlotte</div>
          <div style={{ fontFamily: UI, fontSize: 12.5, color: t.faint, marginTop: 2 }}>Active roster · Spring 2026</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>{statRow}</div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {groups.map((g) => (
            <div key={g.y}>
              <GroupBand label={pluralClass(g.y)} count={g.rows.length} />
              {g.rows.map((r) => {
                const office = currentOffices(r)[0] ?? null;
                return (
                  <div key={r.id} onClick={() => onOpen(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer' }}>
                    <Avatar first={r.firstName} last={r.lastName} size={42} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontFamily: UI, fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(r)}</span>
                        <Dot active={r.status === 'active'} />
                      </div>
                      <div style={{ fontFamily: UI, fontSize: 12.5, color: t.sub, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.classYear} · {r.major}</div>
                      <div style={{ fontFamily: UI, fontSize: 12, color: t.faint, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.hometown} · {r.cohort}</div>
                      {office && <div style={{ marginTop: 6 }}><OfficeChip office={office} size="sm" /></div>}
                    </div>
                    <Chevron color={t.faint} />
                  </div>
                );
              })}
            </div>
          ))}
          {groups.length === 0 && <Empty label="No active members match your search." />}
        </div>
      </div>
    );
  }

  const rowPad: CSSProperties['padding'] = dense ? '6px 26px' : '10px 26px';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: SERIF, fontSize: 25, color: t.ink }}>UNC Charlotte</span>
          <span style={{ fontFamily: UI, fontSize: 13, color: t.faint }}>· Spring 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>{statRow}</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
          {HEADERS.map((h) => (
            <span key={h} style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        {groups.map((g) => (
          <div key={g.y}>
            <GroupBand label={pluralClass(g.y)} count={g.rows.length} />
            {g.rows.map((r) => {
              const office = currentOffices(r)[0] ?? null;
              return (
                <div key={r.id} onClick={() => onOpen(r)} style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, padding: rowPad, alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                    <Avatar first={r.firstName} last={r.lastName} size={dense ? 28 : 32} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: UI, fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(r)}</div>
                      {!dense && (
                        <div style={{ marginTop: 3, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Tag stage={r.stage} size="sm" />
                          {office && <OfficeChip office={office} size="sm" />}
                        </div>
                      )}
                    </div>
                  </div>
                  <Cell>{r.classYear}</Cell>
                  <Cell ellipsis>{r.major}</Cell>
                  <Cell ellipsis>{r.hometown}</Cell>
                  <Cell ellipsis>{r.church}</Cell>
                  <Cell>{r.cohort}</Cell>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Dot active={r.status === 'active'} />
                    <span style={{ fontFamily: UI, fontSize: 12, color: t.sub, textTransform: 'capitalize' }}>{r.status}</span>
                  </span>
                </div>
              );
            })}
          </div>
        ))}
        {groups.length === 0 && <Empty label="No active members match your search." />}
      </div>
    </div>
  );
}

function Cell({ children, ellipsis }: { children: React.ReactNode; ellipsis?: boolean }) {
  const { t } = useTheme();
  return (
    <span style={{ fontFamily: UI, fontSize: 13, color: t.sub, ...(ellipsis ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {}) }}>{children}</span>
  );
}
function Chevron({ color }: { color: string }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.6" style={{ flexShrink: 0 }}><path d="M5 2.5L9.5 7 5 11.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Empty({ label }: { label: string }) {
  const { t } = useTheme();
  return <div style={{ padding: '44px 26px', textAlign: 'center', fontFamily: UI, fontSize: 13, color: t.faint }}>{label}</div>;
}
