// src/features/directory/ActiveBody.tsx
// Active-member roster (ported/derived from directory.jsx ActiveBody). Grouped by
// class year (default) or cohort, or flat (Table). Each group gets the standout
// tinted band: groupBg fill + 3px accent marker + UPPERCASE groupInk label +
// count pill. Rows reveal a checkbox column while selecting; compact density
// drops the secondary chip line.

import { useNavigate } from 'react-router-dom';
import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import type { Member } from '@/types/domain';
import { CLASS_ORDER, fullName } from '@/types/domain';
import { Avatar } from '@/components/atoms/Avatar';
import { Tag, Dot } from '@/components/atoms/Tag';
import { OfficeChip } from '@/components/atoms/OfficeChip';
import { SelChk } from '@/components/collab/Batch';
import { topRole } from '@/lib/offices';

export type GroupBy = 'class' | 'cohort' | 'none';

interface Props {
  theme: Theme;
  members: Member[];
  density: 'comfortable' | 'compact';
  groupBy: GroupBy;
  selecting: boolean;
  sel: Set<string>;
  toggle: (id: string) => void;
  setAll: (ids: string[], on: boolean) => void;
}

const COLS = '1.7fr 0.8fr 1.1fr 1fr 1fr 0.9fr 0.7fr';

export function ActiveBody({ theme: t, members, density, groupBy, selecting, sel, toggle, setAll }: Props) {
  const navigate = useNavigate();
  const compact = density === 'compact';
  const rowPad = compact ? '8px 14px' : '12px 14px';

  const allIds = members.map((m) => m.id);
  const allOn = allIds.length > 0 && allIds.every((id) => sel.has(id));
  const someOn = allIds.some((id) => sel.has(id));

  // Build groups
  const groups: { key: string; label: string; items: Member[] }[] = [];
  if (groupBy === 'none') {
    groups.push({ key: 'all', label: `All members`, items: members });
  } else if (groupBy === 'cohort') {
    const byCohort = new Map<string, Member[]>();
    members.forEach((m) => {
      const k = m.cohort || 'No cohort';
      if (!byCohort.has(k)) byCohort.set(k, []);
      byCohort.get(k)!.push(m);
    });
    [...byCohort.keys()].sort().forEach((k) => groups.push({ key: k, label: k, items: byCohort.get(k)! }));
  } else {
    CLASS_ORDER.forEach((cls) => {
      const items = members.filter((m) => m.classYear === cls);
      if (items.length) groups.push({ key: cls, label: cls, items });
    });
    // any members without a recognized class year
    const rest = members.filter((m) => !m.classYear || !CLASS_ORDER.includes(m.classYear));
    if (rest.length) groups.push({ key: 'other', label: 'Other', items: rest });
  }

  const gridCols = selecting ? `34px ${COLS}` : COLS;

  const HeaderCell = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        color: t.faint,
        textAlign: right ? 'right' : 'left',
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
      {/* column header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 12,
          alignItems: 'center',
          padding: '11px 14px',
          borderBottom: `1px solid ${t.line}`,
          background: t.panel,
        }}
      >
        {selecting && <SelChk theme={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => setAll(allIds, !allOn)} />}
        <HeaderCell>Member</HeaderCell>
        <HeaderCell>Class</HeaderCell>
        <HeaderCell>Major</HeaderCell>
        <HeaderCell>Hometown</HeaderCell>
        <HeaderCell>Home Church</HeaderCell>
        <HeaderCell>Cohort</HeaderCell>
        <HeaderCell right>Status</HeaderCell>
      </div>

      {groups.map((g) => (
        <div key={g.key}>
          {/* group band */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px 8px 11px',
              background: t.groupBg,
              borderBottom: `1px solid ${t.line}`,
              boxShadow: `inset 3px 0 0 ${t.accent}`,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.groupInk }}>{g.label}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: t.groupInk,
                background: t.bg,
                borderRadius: 999,
                padding: '1px 8px',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {g.items.length}
            </span>
          </div>

          {g.items.map((m) => {
            const role = topRole(m);
            const on = sel.has(m.id);
            return (
              <div
                key={m.id}
                onClick={() => (selecting ? toggle(m.id) : navigate(`/profile/${m.id}`))}
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridCols,
                  gap: 12,
                  alignItems: 'center',
                  padding: rowPad,
                  borderBottom: `1px solid ${t.line}`,
                  cursor: 'pointer',
                  background: on ? t.accentSoft : t.bg,
                }}
                onMouseEnter={(e) => {
                  if (!on) (e.currentTarget as HTMLDivElement).style.background = t.panel;
                }}
                onMouseLeave={(e) => {
                  if (!on) (e.currentTarget as HTMLDivElement).style.background = t.bg;
                }}
              >
                {selecting && <SelChk theme={t} checked={on} onChange={() => toggle(m.id)} />}
                {/* Member */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <Avatar f={m.firstName} l={m.lastName} size={compact ? 30 : 38} theme={t} src={m.avatarUrl} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fullName(m)}
                    </div>
                    {!compact && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                        <Tag stage={m.stage} size="sm" theme={t} />
                        {role && <OfficeChip role={role} theme={t} size="sm" />}
                      </div>
                    )}
                  </div>
                </div>
                <Cell t={t}>{m.classYear}</Cell>
                <Cell t={t}>{m.major}</Cell>
                <Cell t={t}>{m.hometown}</Cell>
                <Cell t={t}>{m.church}</Cell>
                <Cell t={t}>{m.cohort}</Cell>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end' }}>
                  <Dot active={m.status === 'active'} />
                  <span style={{ fontSize: 12, color: t.sub }}>{m.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Cell({ t, children }: { t: Theme; children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: UI, fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {children ?? '—'}
    </div>
  );
}
