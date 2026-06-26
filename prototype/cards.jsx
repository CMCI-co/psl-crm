// cards.jsx — the Profile Card (hero, themeable) + the "traveling cards"
// that ride under every profile. Reads atoms/tokens from window (kit.jsx).

// ───────────────────────────────────────────────────────────────────────
// DuePill — the contact-cadence flag that travels from the Relationship
// Tracker's "Next due" column onto the Profile Card. Only renders when the
// person carries cadence data (i.e. opened from the tracker), so it signals
// at a glance how urgent the next outreach is.
// ───────────────────────────────────────────────────────────────────────
function DuePill({ due, next, cadence }) {
  if (!due) return null;
  const map = {
    overdue: { bg: '#fbe6e2', fg: '#b3402f', label: 'Call This Week', urgent: true },
    due:     { bg: '#fbefdd', fg: '#8a5a16', label: 'Call Today', urgent: true },
    ok:      { bg: '#e8f0ea', fg: '#3c7d5b', label: 'On track', urgent: false },
  };
  const c = map[due] || map.ok;
  return (
    <span title={cadence ? `${cadence} cadence` : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999,
        background: c.bg, color: c.fg, fontSize: 12, fontWeight: 700 }}>
      {c.urgent
        ? <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={c.fg} strokeWidth="1.6"><path d="M7 4.5l-.001-1.2A2 2 0 0 1 9 1.3M7 4.5a3.5 3.5 0 0 1 3.5 3.5c0 2.2.7 3 1.2 3.4H2.3c.5-.4 1.2-1.2 1.2-3.4A3.5 3.5 0 0 1 7 4.5zM5.6 12a1.4 1.4 0 0 0 2.8 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={c.fg} strokeWidth="1.6"><circle cx="7" cy="7" r="5.2"/><path d="M7 4.2V7l1.9 1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      <span>{c.label}</span>
      {next && <span style={{ fontWeight: 500, opacity: 0.85 }}>· Next {next}</span>}
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────────
// ProfileCard — the credential that travels Apply → Alumni.
// One component, rendered in each color theme to compare directions.
// ───────────────────────────────────────────────────────────────────────
function ProfileCard({ theme: t, stage, person, narrow }) {
  const p = person ? { ...PROFILE, ...person } : PROFILE;
  const st = stage || p.stage;
  const pal = (t.stages || STAGES)[st] || (t.stages || STAGES).member;
  const profileLabel = (st === 'member' ? 'Member' : pal.label) + ' Profile';
  const wrap = { fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' };

  return (
    <div style={wrap}>
      {/* Banner — tinted by journey stage */}
      <div style={{ background: pal.solid, height: 112, padding: narrow ? '16px 18px' : '18px 32px', position: 'relative', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: SERIF, fontSize: 22, color: t.onAccent, letterSpacing: 3, paddingRight: 3 }}>ΦΣΛ</span>
            <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,.28)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,.82)' }}>{profileLabel}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: t.onAccent, fontVariantNumeric: 'tabular-nums' }}>{p.memberId}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>{p.campus}</div>
            <div style={{ marginTop: 8 }}><Tag stage={st} size="sm" theme={t} /></div>
          </div>
        </div>
      </div>

      {/* Identity head — large avatar left · name & info centered beside it · Active top-right */}
      <div style={{ padding: narrow ? '0 18px' : '0 32px', marginTop: -22, flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: narrow ? 14 : 24, alignItems: 'flex-start', flexDirection: narrow ? 'column' : 'row' }}>
          <div style={{ background: pal.bg, color: pal.fg, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: narrow ? 40 : 62,
            boxShadow: `0 0 0 5px ${t.bg}`, borderRadius: '50%', width: narrow ? '108px' : '175px', height: narrow ? '108px' : '175px' }}>{initials(p.first, p.last)}</div>
          <div style={{ flex: 1, minWidth: 0, marginTop: narrow ? 2 : 34, minHeight: narrow ? 'auto' : 141, position: 'relative', alignSelf: narrow ? 'stretch' : 'auto',
            display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 10, right: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Dot active />
              <span style={{ fontSize: 12.5, color: t.sub, fontWeight: 500 }}>Active</span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: narrow ? 24 : 30, fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.08, paddingRight: 84 }}>{p.first} {p.middle} {p.last}</div>
            <div style={{ fontSize: 13.5, color: t.sub, marginTop: 5 }}>{p.year} · {p.school}</div>
            {currentRoles(p)[0] && <div style={{ marginTop: 9 }}><OfficeChip role={currentRoles(p)[0]} theme={t} /></div>}
            <div style={{ marginTop: 11, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <div onClick={(e) => { e.stopPropagation(); window.PSLNav && window.PSLNav.go('cohort', { focus: p.cohort }); }}
                title={`View the ${p.cohort}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 9px 5px 11px', borderRadius: 999, background: t.panel, border: `1px solid ${t.line}`, cursor: 'pointer' }}>
                <CardGlyph k="milestones" color={t.accent} size={13} />
                <span style={{ fontSize: 12, fontWeight: 600, color: t.ink }}>{p.cohort}</span>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.faint} strokeWidth="1.6" style={{ flexShrink: 0 }}><path d="M4 2.5L7.5 6 4 9.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <DuePill due={p.due} next={p.next} cadence={p.cadence} />
            </div>
          </div>
        </div>
      </div>

      {/* Identity fields */}
      <div style={{ padding: narrow ? '20px 18px 4px' : '22px 32px 4px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : '1fr 1fr', rowGap: 18, columnGap: 20 }}>
          <Field theme={t} label="Phone" value={p.phone} mono />
          <Field theme={t} label="Birthday" value={p.birthday} />
          <div style={{ gridColumn: '1 / -1' }}><Field theme={t} label="Personal email" value={p.email} /></div>
          <div style={{ gridColumn: '1 / -1' }}><Field theme={t} label="Permanent address" value={p.address} /></div>
          <Field theme={t} label="Hometown" value={p.hometown} />
          <Field theme={t} label="Home church" value={p.church} />
          <Field theme={t} label="Major" value={p.major} />
          <Field theme={t} label="Minor" value={p.minor} />
          <Field theme={t} label="Current employer" value={p.employer} />
          <Field theme={t} label="Relationship status" value={p.relationship} />
        </div>
      </div>

      {/* Leadership & Service — current offices + permanent historic labels */}
      <div style={{ padding: narrow ? '20px 18px 0' : '20px 32px 0' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 16 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Eyebrow theme={t}>Leadership & Service</Eyebrow>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: t.accent, cursor: 'pointer' }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg>Manage
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentRoles(p).map((r, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 11, background: 'rgba(169,133,47,.09)', border: `1px solid rgba(169,133,47,.28)` }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.gold || '#a9852f'} strokeWidth="1.4"><path d="M2.5 5l3 2.4L8 3.5l2.5 3.9 3-2.4-1 6.5h-9z" strokeLinejoin="round" /></svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>Serving now · {r.term}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.gold || '#a9852f' }}>Current</span>
            </div>
          )}
          {pastRoles(p).map((r, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: t.panel, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.4"><circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.sub }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>Served · {r.term}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Permanent record — the immutable file that travels with the profile */}
      <div style={{ padding: narrow ? '20px 18px 26px' : '20px 32px 30px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 16 }} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
          <Eyebrow theme={t}>Permanent record</Eyebrow>
          <span style={{ fontSize: 11, color: t.faint }}>Read-only · travels forever</span>
        </div>
        <div style={{ fontSize: 12, color: t.faint, lineHeight: 1.45, marginBottom: 13 }}>What {p.first} filled out and earned. Open any to look back — these stay on the record from Apply through Alumni.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {p.cards.map((c) =>
          <div key={c.k} onClick={(e) => { e.stopPropagation(); window.PSLRecords && window.PSLRecords.open(c.k, `${p.first} ${p.last}`); }}
            style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
            background: t.panel, border: `1px solid ${t.line}`, borderRadius: 10, cursor: 'pointer' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: t.bg, border: `1px solid ${t.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CardGlyph k={c.k} color={t.accent} size={15} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
                <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>{c.meta}</div>
              </div>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.faint} strokeWidth="1.6" style={{ flexShrink: 0 }}><path d="M4 2.5L7.5 6 4 9.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
        </div>
      </div>
    </div>);

}

// ───────────────────────────────────────────────────────────────────────
// Traveling card: Interview Scorecard (auto-averaged across reviewers)
// ───────────────────────────────────────────────────────────────────────
function ScoreCard({ theme: t }) {
  const criteria = [
  { label: 'Character & Integrity', score: 9.0 },
  { label: 'Sense of Calling', score: 8.7 },
  { label: 'Teachability', score: 9.3 },
  { label: 'Communication', score: 7.8 },
  { label: 'Commitment', score: 8.2 }];

  const reviewers = [['A', 'R'], ['D', 'H'], ['T', 'B']];
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow theme={t}>Interview Scorecard</Eyebrow>
          <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Marcus J. Bellamy</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999,
          background: t.accentSoft, color: t.accent, fontSize: 11.5, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: 9, background: t.accent }} /> Final · Locked
        </span>
      </div>

      {/* Overall */}
      <div style={{ margin: '20px 26px 0', padding: '16px 20px', background: t.accent, borderRadius: 14, color: t.onAccent,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,.72)' }}>Final Score</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.82)', marginTop: 6 }}>Averaged from 3 reviewers</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: SERIF }}>
          <span style={{ fontSize: 44, lineHeight: 1 }}>8.6</span>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,.7)' }}>/10</span>
        </div>
      </div>

      {/* Criteria */}
      <div style={{ padding: '20px 26px 0', flex: 1 }}>
        {criteria.map((c) =>
        <div key={c.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: t.ink }}>{c.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.accent, fontVariantNumeric: 'tabular-nums' }}>{c.score.toFixed(1)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: t.panel2 }}>
              <div style={{ width: `${c.score * 10}%`, height: '100%', borderRadius: 6, background: t.accent }} />
            </div>
          </div>
        )}
      </div>

      {/* Reviewers + note */}
      <div style={{ padding: '4px 26px 24px' }}>
        <div style={{ height: 1, background: t.line, marginBottom: 14 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {reviewers.map((r, i) =>
            <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, color: t.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
              marginLeft: i ? -8 : 0, boxShadow: `0 0 0 2px ${t.bg}` }}>{r.join('')}</div>
            )}
            <span style={{ fontSize: 12, color: t.sub, marginLeft: 10 }}>3 cards locked</span>
          </div>
          <span style={{ fontSize: 12, color: t.faint }}>Sep 14, 2024</span>
        </div>
        <div style={{ marginTop: 14, padding: '11px 13px', background: t.panel, borderRadius: 10, fontSize: 12.5, lineHeight: 1.5, color: t.sub }}>
          <span style={{ fontWeight: 600, color: t.ink }}>Panel note · </span>
          Strong character and humility. Coach on public communication; pair with a senior member for first semester.
        </div>
      </div>
    </div>);

}

// ───────────────────────────────────────────────────────────────────────
// Traveling card: Milestones timeline
// ───────────────────────────────────────────────────────────────────────
function MilestonesCard({ theme: t }) {
  const events = [
  { date: 'Aug 28, 2024', title: 'Submitted application', kind: 'app', done: true },
  { date: 'Sep 14, 2024', title: 'Completed interview', kind: 'interview', done: true },
  { date: 'Sep 20, 2024', title: 'Accepted as Candidate', kind: 'stage', done: true },
  { date: 'Oct 6, 2024', title: 'Baptized — Forest Hill', kind: 'personal', done: true },
  { date: 'Nov 22, 2024', title: 'Completed New Member Formation', kind: 'stage', done: true },
  { date: 'Dec 1, 2024', title: 'Initiated as Active Member', kind: 'stage', done: true },
  { date: 'Upcoming', title: 'CPR Certification renewal', kind: 'next', done: false }];

  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 18px' }}>
        <Eyebrow theme={t}>Milestones</Eyebrow>
        <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Journey & history</div>
      </div>
      <div style={{ padding: '0 26px 24px', flex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'relative', paddingLeft: 26 }}>
          <div style={{ position: 'absolute', left: 6, top: 6, bottom: 10, width: 2, background: t.line }} />
          {events.map((e, i) => {
            const personal = e.kind === 'personal';
            const next = !e.done;
            return (
              <div key={i} style={{ position: 'relative', paddingBottom: i === events.length - 1 ? 0 : 20 }}>
                <div style={{ position: 'absolute', left: -26, top: 2, width: 14, height: 14, borderRadius: '50%',
                  background: next ? t.bg : personal ? t.gold : t.accent,
                  border: next ? `2px dashed ${t.faint}` : 'none',
                  boxShadow: next ? 'none' : `0 0 0 3px ${t.bg}, 0 0 0 4px ${t.line}` }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: next ? t.faint : t.faint, letterSpacing: 0.2, fontVariantNumeric: 'tabular-nums' }}>{e.date}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: next ? t.sub : t.ink, marginTop: 2 }}>{e.title}</div>
                {personal && <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.gold }}>Personal</span>}
              </div>);

          })}
        </div>
      </div>
    </div>);

}

// ───────────────────────────────────────────────────────────────────────
// Traveling card: Prayer Requests
// ───────────────────────────────────────────────────────────────────────
function PrayerCard({ theme: t }) {
  const items = [
  { text: 'Wisdom choosing between two co-op offers for spring.', date: 'Jun 2', status: 'open' },
  { text: "Dad's recovery after surgery — peace for the family.", date: 'May 19', status: 'open' },
  { text: 'Grandmother healed and home from the hospital.', date: 'Apr 28', status: 'answered', praise: 'Discharged Apr 30 — praise God.' },
  { text: 'Found a steady summer internship near campus.', date: 'Mar 11', status: 'answered', praise: 'Accepted at Duke Energy.' }];

  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 26px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow theme={t}>Prayer Requests</Eyebrow>
          <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 6 }}>Lifted in prayer</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: t.sub }}>2 open</span>
          <span style={{ fontSize: 11.5, color: t.faint }}>·</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#1f6b46' }}>2 answered</span>
        </div>
      </div>
      <div style={{ padding: '16px 26px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => {
          const ans = it.status === 'answered';
          return (
            <div key={i} style={{ padding: '13px 14px', borderRadius: 12, background: ans ? '#f1f8f3' : t.panel,
              border: `1px solid ${ans ? '#d9ecdf' : t.line}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ marginTop: 1 }}><CardGlyph k="prayer" color={ans ? '#1f6b46' : t.accent} size={15} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.45, color: t.ink }}>{it.text}</div>
                  {ans && <div style={{ fontSize: 12, color: '#1f6b46', marginTop: 6, fontWeight: 500 }}>✓ {it.praise}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                      color: ans ? '#1f6b46' : t.faint }}>{ans ? 'Answered' : 'Open'}</span>
                    <span style={{ fontSize: 11, color: t.faint }}>{it.date}</span>
                  </div>
                </div>
              </div>
            </div>);

        })}
      </div>
    </div>);

}

Object.assign(window, { ProfileCard, ScoreCard, MilestonesCard, PrayerCard });