// src/components/chrome/Sidebar.tsx
// Directory left rail (ported from directory.jsx): the stage view-nav
// (Applicants → Candidates → Members → Alumni) with live counts, plus
// contextual filter groups that change per view. Filters are presented faithfully
// here; wiring them to the query is a follow-up (see BUILD_STATUS.md).

import { useNavigate } from 'react-router-dom';
import type { Theme } from '@/theme/tokens';
import type { DirectoryView } from '@/features/directory/DirectoryPage';

function NavIcon({ kind, color }: { kind: string; color: string }) {
  const s: React.CSSProperties = { width: 16, height: 16, display: 'block' };
  if (kind === 'applicant')
    return (
      <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
        <path d="M2 9.5l1.6-6.2a1 1 0 011-.8h6.8a1 1 0 011 .8L14 9.5M2 9.5v3.3h12V9.5M2 9.5h3.2l.8 1.4h4l.8-1.4H14" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  if (kind === 'active')
    return (
      <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
        <circle cx="6" cy="5" r="2.6" />
        <path d="M1.8 13c0-2.4 1.9-4 4.2-4s4.2 1.6 4.2 4" strokeLinecap="round" />
        <circle cx="12" cy="5.4" r="1.9" />
        <path d="M11 9.2c2 .1 3.2 1.6 3.2 3.8" strokeLinecap="round" />
      </svg>
    );
  if (kind === 'candidate')
    return (
      <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
        <path d="M8 14V7" strokeLinecap="round" />
        <path d="M8 7c0-2 1.4-3.5 3.5-3.5C11.5 5.5 10 7 8 7zM8 8.5C8 6.8 6.7 5.5 4.8 5.5 4.8 7.2 6.1 8.5 8 8.5z" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
      <path d="M8 2.2L14.5 5 8 7.8 1.5 5z" strokeLinejoin="round" />
      <path d="M4.5 6.4v3.1c0 1 1.6 1.9 3.5 1.9s3.5-.9 3.5-1.9V6.4M14.5 5v3.4" strokeLinecap="round" />
    </svg>
  );
}

function NavItem({
  theme: t,
  kind,
  label,
  sub,
  count,
  active,
  onClick,
}: {
  theme: Theme;
  kind: string;
  label: string;
  sub?: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '9px 11px',
        borderRadius: 9,
        cursor: 'pointer',
        background: active ? t.accentSoft : 'transparent',
        boxShadow: active ? `inset 2.5px 0 0 ${t.accent}` : 'none',
      }}
    >
      <NavIcon kind={kind} color={active ? t.accent : t.faint} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? t.accent : t.ink, lineHeight: 1.2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>{sub}</div>}
      </div>
      <span
        style={{
          marginLeft: 'auto',
          fontSize: 11.5,
          fontWeight: 600,
          color: active ? t.accent : t.faint,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </span>
    </div>
  );
}

function FilterGroup({ theme: t, title, children }: { theme: Theme; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function Check({ theme: t, label, on, count }: { theme: Theme; label: string; on?: boolean; count?: number }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
      <span
        style={{
          width: 15,
          height: 15,
          borderRadius: 4,
          flexShrink: 0,
          background: on ? t.accent : t.bg,
          border: `1.5px solid ${on ? t.accent : t.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {on && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke={t.onAccent} strokeWidth="2">
            <path d="M1.5 5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ fontSize: 13, color: on ? t.ink : t.sub, fontWeight: on ? 600 : 400, flex: 1 }}>{label}</span>
      {count != null && <span style={{ fontSize: 11.5, color: t.faint, fontVariantNumeric: 'tabular-nums' }}>{count}</span>}
    </label>
  );
}

export interface StageCounts {
  applicant: number;
  candidate: number;
  member: number;
  alumni: number;
}

export function Sidebar({
  theme: t,
  view,
  counts,
  onNav,
  full,
}: {
  theme: Theme;
  view: DirectoryView;
  counts: StageCounts;
  onNav?: (v: DirectoryView) => void;
  full?: boolean;
}) {
  const navigate = useNavigate();
  const navTo = (v: DirectoryView) => (onNav ? onNav(v) : navigate(`/directory/${v}`));

  const isAlumni = view === 'alumni';
  const isApplicant = view === 'applicant';
  const isCandidate = view === 'candidate';
  const isActive = !isAlumni && !isApplicant && !isCandidate;

  return (
    <div
      style={{
        width: full ? '100%' : 236,
        background: full ? 'transparent' : t.chrome || t.bg,
        borderRight: full ? 'none' : `1px solid ${t.chromeLine || t.line}`,
        padding: '18px 18px',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: t.faint, marginBottom: 10, paddingLeft: 3 }}>
        Directory
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 22 }}>
        <NavItem theme={t} kind="applicant" label="Applicants" sub="Pending review" count={counts.applicant} active={isApplicant} onClick={() => navTo('applicant')} />
        <NavItem theme={t} kind="candidate" label="Candidates" sub="In formation" count={counts.candidate} active={isCandidate} onClick={() => navTo('candidate')} />
        <NavItem theme={t} kind="active" label="Active Members" sub="Current roster" count={counts.member} active={isActive} onClick={() => navTo('active')} />
        <NavItem theme={t} kind="alumni" label="Alumni" sub="Graduated" count={counts.alumni} active={isAlumni} onClick={() => navTo('alumni')} />
      </div>

      <div style={{ height: 1, background: t.line, margin: '0 3px 18px' }} />

      {/* Contextual filters (visual; wiring is a follow-up) */}
      {isActive && (
        <>
          <FilterGroup theme={t} title="Status">
            <Check theme={t} label="Active" on count={counts.member} />
            <Check theme={t} label="Inactive" />
          </FilterGroup>
          <FilterGroup theme={t} title="Class">
            <Check theme={t} label="Freshman" />
            <Check theme={t} label="Sophomore" />
            <Check theme={t} label="Junior" />
            <Check theme={t} label="Senior" />
            <Check theme={t} label="Super Senior" />
          </FilterGroup>
          <FilterGroup theme={t} title="Leadership">
            <Check theme={t} label="Holds office" />
            <Check theme={t} label="No office" />
          </FilterGroup>
        </>
      )}
      {isCandidate && (
        <FilterGroup theme={t} title="Cohort">
          <Check theme={t} label="Fall 2025" />
          <Check theme={t} label="Spring 2025" />
        </FilterGroup>
      )}
      {isApplicant && (
        <FilterGroup theme={t} title="Recommendation">
          <Check theme={t} label="Advance" />
          <Check theme={t} label="Discuss" />
          <Check theme={t} label="Hold" />
          <Check theme={t} label="Awaiting" />
        </FilterGroup>
      )}
      {isAlumni && (
        <>
          <FilterGroup theme={t} title="Connection">
            <Check theme={t} label="Open to connect" />
          </FilterGroup>
          <FilterGroup theme={t} title="Graduating class">
            <Check theme={t} label="2025" />
            <Check theme={t} label="2024" />
            <Check theme={t} label="2023" />
            <Check theme={t} label="Earlier" />
          </FilterGroup>
        </>
      )}
    </div>
  );
}
