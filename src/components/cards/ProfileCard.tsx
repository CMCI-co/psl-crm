// src/components/cards/ProfileCard.tsx
// The Profile Card — the credential that travels Apply → Alumni (ported from
// cards.jsx). One component, rendered everywhere a person appears. Banner is
// tinted by lifecycle stage; current offices ride along, past offices become
// historic labels.

import type { Theme } from '@/theme/tokens';
import { SERIF, STAGES, UI } from '@/theme/tokens';
import type { Member, Stage } from '@/types/domain';
import { currentRoles, pastRoles } from '@/lib/offices';
import { initials } from '@/components/atoms/Avatar';
import { Tag, Dot, Eyebrow } from '@/components/atoms/Tag';
import { Field } from '@/components/atoms/Field';
import { OfficeChip } from '@/components/atoms/OfficeChip';
import { CardGlyph, type GlyphKey } from '@/components/atoms/CardGlyph';
import { DuePill } from './DuePill';

const DEFAULT_CARDS: { k: GlyphKey; label: string; meta: string }[] = [
  { k: 'application', label: 'Application', meta: 'Submitted' },
  { k: 'scorecard', label: 'Interview Scorecard', meta: '8.6 avg' },
  { k: 'testing', label: 'Candidacy Testing', meta: '5 / 6 modules' },
  { k: 'certs', label: 'Certifications', meta: '3 active' },
  { k: 'milestones', label: 'Milestones', meta: '11 events' },
  { k: 'prayer', label: 'Prayer Requests', meta: '2 open' },
];

export function ProfileCard({ theme: t, member, stage, narrow }: { theme: Theme; member: Member; stage?: Stage; narrow?: boolean }) {
  const p = member;
  const st = stage || p.stage;
  const pal = (t.stages || STAGES)[st] || (t.stages || STAGES).member;
  const profileLabel = (st === 'member' ? 'Member' : pal.label) + ' Profile';
  const cur = currentRoles(p);
  const past = pastRoles(p);

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
            <div style={{ fontSize: 12.5, fontWeight: 600, color: t.onAccent, fontVariantNumeric: 'tabular-nums' }}>{p.memberNo}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>{p.school}</div>
            <div style={{ marginTop: 8 }}>
              <Tag stage={st} size="sm" theme={t} />
            </div>
          </div>
        </div>
      </div>

      {/* Identity head */}
      <div style={{ padding: narrow ? '0 18px' : '0 32px', marginTop: -22, flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: narrow ? 14 : 24, alignItems: 'flex-start', flexDirection: narrow ? 'column' : 'row' }}>
          <div
            style={{
              background: pal.bg,
              color: pal.fg,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SERIF,
              fontSize: narrow ? 40 : 62,
              boxShadow: `0 0 0 5px ${t.bg}`,
              borderRadius: '50%',
              width: narrow ? 108 : 175,
              height: narrow ? 108 : 175,
            }}
          >
            {initials(p.firstName, p.lastName)}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              marginTop: narrow ? 2 : 34,
              minHeight: narrow ? 'auto' : 141,
              position: 'relative',
              alignSelf: narrow ? 'stretch' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'absolute', top: 10, right: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Dot active={p.status === 'active'} />
              <span style={{ fontSize: 12.5, color: t.sub, fontWeight: 500 }}>{p.status === 'active' ? 'Active' : 'Inactive'}</span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: narrow ? 24 : 30, fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.08, paddingRight: 84 }}>
              {p.firstName} {p.middle ? p.middle + ' ' : ''}{p.lastName}
            </div>
            <div style={{ fontSize: 13.5, color: t.sub, marginTop: 5 }}>
              {p.classYear} · {p.school}
            </div>
            {cur[0] && (
              <div style={{ marginTop: 9 }}>
                <OfficeChip role={cur[0]} theme={t} />
              </div>
            )}
            <div style={{ marginTop: 11, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {p.cohort && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 11px', borderRadius: 999, background: t.panel, border: `1px solid ${t.line}` }}>
                  <CardGlyph k="milestones" color={t.accent} size={13} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.ink }}>{p.cohort}</span>
                </div>
              )}
              <DuePill due={p.due} next={p.next} cadence={p.cadence} />
            </div>
          </div>
        </div>
      </div>

      {/* Identity fields */}
      <div style={{ padding: narrow ? '20px 18px 4px' : '22px 32px 4px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 18, columnGap: 20 }}>
          <Field theme={t} label="Phone" value={p.phone} mono />
          <Field theme={t} label="Birthday" value={p.birthday} />
          <div style={{ gridColumn: '1 / -1' }}>
            <Field theme={t} label="Personal email" value={p.email} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field theme={t} label="Permanent address" value={p.address} />
          </div>
          <Field theme={t} label="Hometown" value={p.hometown} />
          <Field theme={t} label="Home church" value={p.church} />
          <Field theme={t} label="Major" value={p.major} />
          <Field theme={t} label="Minor" value={p.minor} />
          <Field theme={t} label="Current employer" value={p.employer} />
          <Field theme={t} label="Relationship status" value={p.relationship} />
        </div>
      </div>

      {/* Leadership & Service */}
      <div style={{ padding: narrow ? '20px 18px 0' : '20px 32px 0' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 16 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Eyebrow theme={t}>Leadership &amp; Service</Eyebrow>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: t.accent, cursor: 'pointer' }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7">
              <path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" />
            </svg>
            Manage
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cur.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '11px 13px',
                borderRadius: 11,
                background: 'rgba(169,133,47,.09)',
                border: '1px solid rgba(169,133,47,.28)',
              }}
            >
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.gold || '#a9852f'} strokeWidth="1.4">
                  <path d="M2.5 5l3 2.4L8 3.5l2.5 3.9 3-2.4-1 6.5h-9z" strokeLinejoin="round" />
                </svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>Serving now · {r.term}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.gold || '#a9852f' }}>Current</span>
            </div>
          ))}
          {past.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: t.panel, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.4">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M8 5v3l2 1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.sub }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>Served · {r.term}</div>
              </div>
            </div>
          ))}
          {cur.length === 0 && past.length === 0 && (
            <div style={{ fontSize: 12.5, color: t.faint, padding: '2px 2px 4px' }}>No offices held yet.</div>
          )}
        </div>
      </div>

      {/* Carries with this profile — traveling cards */}
      <div style={{ padding: narrow ? '20px 18px 26px' : '20px 32px 30px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 16 }} />
        <Eyebrow theme={t} style={{ marginBottom: 12 }}>
          Carries with this profile
        </Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {DEFAULT_CARDS.map((c) => (
            <div
              key={c.k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '10px 12px',
                background: t.panel,
                border: `1px solid ${t.line}`,
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
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
