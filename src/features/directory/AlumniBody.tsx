// src/features/directory/AlumniBody.tsx
// Alumni roster (derived from directory.jsx). Expanded fields — graduating class,
// work, location, marital, open-to-connect — so leaders can cross-reference
// (e.g. engineers open to connecting). Row click opens the engagement record.
// Alumni is the terminal stage, so there's no lifecycle action here.

import { useNavigate } from 'react-router-dom';
import type { Theme } from '@/theme/tokens';
import { UI } from '@/theme/tokens';
import type { Member } from '@/types/domain';
import { fullName } from '@/types/domain';
import { Avatar } from '@/components/atoms/Avatar';
import { OfficeChip } from '@/components/atoms/OfficeChip';
import { topRole } from '@/lib/offices';

export function AlumniBody({ theme: t, members, density }: { theme: Theme; members: Member[]; density: 'comfortable' | 'compact' }) {
  const navigate = useNavigate();
  const compact = density === 'compact';
  const cols = '1.7fr 0.7fr 1.1fr 1.4fr 1fr 0.9fr';

  return (
    <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: '11px 14px', borderBottom: `1px solid ${t.line}`, background: t.panel }}>
        {['Alumnus', 'Class', 'Major', 'Work', 'Location', 'Connect'].map((h, i) => (
          <div key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint, textAlign: i === 5 ? 'right' : 'left' }}>{h}</div>
        ))}
      </div>

      {members.map((m) => {
        const role = topRole(m);
        return (
          <div
            key={m.id}
            onClick={() => navigate(`/profile/${m.id}`)}
            style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: compact ? '8px 14px' : '12px 14px', borderBottom: `1px solid ${t.line}`, cursor: 'pointer', background: t.bg }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = t.panel)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = t.bg)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <Avatar f={m.firstName} l={m.lastName} size={compact ? 30 : 38} theme={t} src={m.avatarUrl} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(m)}</div>
                {!compact && role && <div style={{ marginTop: 4 }}><OfficeChip role={role} theme={t} size="sm" /></div>}
              </div>
            </div>
            <Cell t={t}>{m.gradYear ? `'${m.gradYear.slice(2)}` : m.classYear}</Cell>
            <Cell t={t}>{m.major}</Cell>
            <Cell t={t}>{m.work}</Cell>
            <Cell t={t}>{m.location}</Cell>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {m.openToConnect ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: '#e6f1ea', color: '#3f7a52', fontSize: 11, fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 9, background: '#3f7a52' }} /> Open
                </span>
              ) : (
                <span style={{ fontSize: 11.5, color: t.faint }}>—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Cell({ t, children }: { t: Theme; children: React.ReactNode }) {
  return <div style={{ fontFamily: UI, fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{children ?? '—'}</div>;
}
