// ProfileCard.tsx — the credential that travels Apply → Alumni. Faithful port
// of cards.jsx ProfileCard: a stage-tinted banner, large identity head, the
// fixed identity-fields grid, leadership/service history, and the traveling-card
// chips that ride underneath. Reads the active theme from context and renders a
// typed Member; visual output is 1:1 with the prototype.
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { Tag, Dot, Eyebrow, Field, OfficeChip, CardGlyph, initials } from '@/components/ui';
import { currentOffices, pastOffices, type Member } from '@/types/domain';
import { DEFAULT_TRAVELING_CARDS, type TravelingCardChip } from './traveling-cards';

// ── Cadence flag ────────────────────────────────────────────────────────
// The contact-cadence pill that travels from the Relationship Tracker's "Next
// due" column onto the Profile Card. Only renders when cadence data is supplied
// (i.e. the card was opened from the tracker), so it signals at a glance how
// urgent the next outreach is.
export type DueLevel = 'overdue' | 'due' | 'ok';
export interface Cadence {
  due: DueLevel;
  next?: string | null;
  cadence?: string | null;
}

function DuePill({ cadence }: { cadence?: Cadence | null }) {
  if (!cadence || !cadence.due) return null;
  const map: Record<DueLevel, { bg: string; fg: string; label: string; urgent: boolean }> = {
    overdue: { bg: '#fbe6e2', fg: '#b3402f', label: 'Call This Week', urgent: true },
    due: { bg: '#fbefdd', fg: '#8a5a16', label: 'Call Today', urgent: true },
    ok: { bg: '#e8f0ea', fg: '#3c7d5b', label: 'On track', urgent: false },
  };
  const c = map[cadence.due] ?? map.ok;
  return (
    <span
      title={cadence.cadence ? `${cadence.cadence} cadence` : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: c.bg, color: c.fg, fontSize: 12, fontWeight: 700 }}
    >
      {c.urgent ? (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={c.fg} strokeWidth="1.6"><path d="M7 4.5l-.001-1.2A2 2 0 0 1 9 1.3M7 4.5a3.5 3.5 0 0 1 3.5 3.5c0 2.2.7 3 1.2 3.4H2.3c.5-.4 1.2-1.2 1.2-3.4A3.5 3.5 0 0 1 7 4.5zM5.6 12a1.4 1.4 0 0 0 2.8 0" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={c.fg} strokeWidth="1.6"><circle cx="7" cy="7" r="5.2" /><path d="M7 4.2V7l1.9 1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
      <span>{c.label}</span>
      {cadence.next && <span style={{ fontWeight: 500, opacity: 0.85 }}>· Next {cadence.next}</span>}
    </span>
  );
}

export interface ProfileCardProps {
  member: Member;
  /** Override the stage tint (defaults to the member's own stage). */
  stage?: Member['stage'];
  /** Compact single-column layout for the mobile profile surface. */
  narrow?: boolean;
  /** Cadence flag, supplied when opened from the Relationship Tracker. */
  cadence?: Cadence | null;
  /** Traveling-card chips riding under the profile. */
  cards?: TravelingCardChip[];
  /** Gates the management affordances (default true — matches the prototype). */
  canEdit?: boolean;
}

const dash = (v: string | null | undefined) => (v && v.trim() ? v : '—');

export function ProfileCard({
  member, stage, narrow, cadence, cards = DEFAULT_TRAVELING_CARDS, canEdit = true,
}: ProfileCardProps) {
  const { t } = useTheme();
  const st = stage ?? member.stage;
  const pal = t.stages[st] ?? t.stages.member;
  const profileLabel = (st === 'member' ? 'Member' : pal.label) + ' Profile';
  const isActive = member.status === 'active';
  const name = [member.firstName, member.middle, member.lastName].filter(Boolean).join(' ');
  const current = currentOffices(member);
  const past = pastOffices(member);
  const topRole = current[0] ?? null;
  const gold = t.gold;
  const cohortLabel = member.cohort
    ? (/cohort$/i.test(member.cohort) ? member.cohort : `${member.cohort} Cohort`)
    : null;

  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      {/* Banner — tinted by journey stage */}
      <div style={{ background: pal.solid, height: 112, padding: narrow ? '16px 18px' : '18px 32px', position: 'relative', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: SERIF, fontSize: 22, color: t.onAccent, letterSpacing: 3, paddingRight: 3 }}>ΦΣΛ</span>
            <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,.28)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,.82)' }}>{profileLabel}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: t.onAccent, fontVariantNumeric: 'tabular-nums' }}>{member.memberNo ?? ''}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>{member.school ?? ''}</div>
            <div style={{ marginTop: 8 }}><Tag stage={st} size="sm" /></div>
          </div>
        </div>
      </div>

      {/* Identity head — large avatar left · name & info centered beside it · status top-right */}
      <div style={{ padding: narrow ? '0 18px' : '0 32px', marginTop: -22, flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: narrow ? 14 : 24, alignItems: 'flex-start', flexDirection: narrow ? 'column' : 'row' }}>
          <div style={{ background: pal.bg, color: pal.fg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: narrow ? 40 : 62, boxShadow: `0 0 0 5px ${t.bg}`, borderRadius: '50%', width: narrow ? '108px' : '175px', height: narrow ? '108px' : '175px' }}>{initials(member.firstName, member.lastName)}</div>
          <div style={{ flex: 1, minWidth: 0, marginTop: narrow ? 2 : 34, minHeight: narrow ? 'auto' : 141, position: 'relative', alignSelf: narrow ? 'stretch' : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 10, right: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Dot active={isActive} />
              <span style={{ fontSize: 12.5, color: t.sub, fontWeight: 500 }}>{isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: narrow ? 24 : 30, fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.08, paddingRight: 84 }}>{name}</div>
            <div style={{ fontSize: 13.5, color: t.sub, marginTop: 5 }}>{[member.classYear, member.school].filter(Boolean).join(' · ')}</div>
            {topRole && <div style={{ marginTop: 9 }}><OfficeChip office={topRole} /></div>}
            <div style={{ marginTop: 11, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {cohortLabel && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 11px', borderRadius: 999, background: t.panel, border: `1px solid ${t.line}` }}>
                  <CardGlyph k="milestones" color={t.accent} size={13} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.ink }}>{cohortLabel}</span>
                </div>
              )}
              <DuePill cadence={cadence} />
            </div>
          </div>
        </div>
      </div>

      {/* Identity fields */}
      <div style={{ padding: narrow ? '20px 18px 4px' : '22px 32px 4px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 18, columnGap: 20 }}>
          <Field label="Phone" value={dash(member.phone)} mono />
          <Field label="Birthday" value={dash(member.birthday)} />
          <div style={{ gridColumn: '1 / -1' }}><Field label="Personal email" value={dash(member.email)} /></div>
          <div style={{ gridColumn: '1 / -1' }}><Field label="Permanent address" value={dash(member.address)} /></div>
          <Field label="Hometown" value={dash(member.hometown)} />
          <Field label="Home church" value={dash(member.church)} />
          <Field label="Major" value={dash(member.major)} />
          <Field label="Minor" value={dash(member.minor)} />
          <Field label="Current employer" value={dash(member.employer)} />
          <Field label="Relationship status" value={dash(member.relationship)} />
        </div>
      </div>

      {/* Leadership & Service — current offices + permanent historic labels */}
      <div style={{ padding: narrow ? '20px 18px 0' : '20px 32px 0' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 16 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Eyebrow>Leadership &amp; Service</Eyebrow>
          {canEdit && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: t.accent, cursor: 'pointer' }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg>Manage
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {current.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 11, background: 'rgba(169,133,47,.09)', border: '1px solid rgba(169,133,47,.28)' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={gold} strokeWidth="1.4"><path d="M2.5 5l3 2.4L8 3.5l2.5 3.9 3-2.4-1 6.5h-9z" strokeLinejoin="round" /></svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>Serving now · {r.term}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: gold }}>Current</span>
            </div>
          ))}
          {past.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: t.panel, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.4"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.sub }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>Served · {r.term}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traveling cards */}
      <div style={{ padding: narrow ? '20px 18px 26px' : '20px 32px 30px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 16 }} />
        <Eyebrow style={{ marginBottom: 12 }}>Carries with this profile</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {cards.map((c) => (
            <div key={c.k} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', background: t.panel, border: `1px solid ${t.line}`, borderRadius: 10, cursor: 'pointer' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CardGlyph k={c.k} color={t.accent} size={15} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
                <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>{c.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
