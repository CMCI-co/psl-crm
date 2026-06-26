// features.jsx — newer screens layered onto the CRM shell:
//   • ApplicationReview — leaders read a submitted application + decide
//   • ResourcesView / ResourcesUpload — a Resources hub (videos, training,
//     quizzes, docs) with a backend upload flow
//   • AlumniCallView — log a call, take notes, update an alum's info
// Reuses TopBar / atoms / data from window (kit.jsx, directory.jsx).

// Shared secondary bar (sits under TopBar on detail screens) ----------------
function SubBar({ t, crumbs, children }) {
  const w = useViewport();
  const narrow = w < BP.tab;
  const shown = narrow ? crumbs.slice(-1) : crumbs;
  return (
    <div style={{ height: 50, background: t.bg, borderBottom: `1px solid ${t.line}`, display: 'flex',
      alignItems: 'center', padding: narrow ? '0 12px' : '0 24px', gap: 12, flexShrink: 0 }}>
      <span onClick={() => window.PSLNav && window.PSLNav.back()} style={{ display: 'flex', alignItems: 'center', gap: 7, color: t.faint, cursor: 'pointer', flexShrink: 0 }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9.5 3.5L5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, minWidth: 0, overflow: 'hidden' }}>
        {shown.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: t.faint }}>/</span>}
            <span style={{ color: i === shown.length - 1 ? t.ink : t.faint, fontWeight: i === shown.length - 1 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {children}
    </div>
  );
}

function Btn({ t, label, kind = 'ghost', icon, onClick }) {
  const styles = {
    primary: { background: t.accent, color: t.onAccent, border: 'none' },
    ghost: { background: t.bg, color: t.sub, border: `1px solid ${t.line}` },
    good: { background: '#1f6b46', color: '#fff', border: 'none' },
    warn: { background: t.bg, color: '#9a3b3b', border: `1px solid ${t.line}` },
  }[kind];
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 9,
      fontFamily: UI, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', ...styles }}>
      {icon}{label}
    </button>
  );
}

// ───────────────────────────────────────────────────────────────────────
// ApplicationReview — full submitted application, leader reads & decides
// ───────────────────────────────────────────────────────────────────────
const APP_REVIEW = {
  f: 'Owen', l: 'Carter', year: 'Freshman', major: 'Computer Science', town: 'Charlotte, NC',
  submitted: 'Jun 2, 2026', term: 'Fall 2026', sponsor: 'Marcus Bellamy', gpa: '3.88',
  email: 'owen.carter@charlotte.edu', phone: '(704) 555-0147', church: 'Elevation Church', score: 9.1,
  refs: [{ n: 'Pastor Dan Whitfield', r: 'College pastor · Elevation Church' }, { n: 'Coach Reggie Mills', r: 'Intramural mentor · UNCC' }],
  crits: [['Character & Integrity', 9.4], ['Sense of Calling', 9.0], ['Teachability', 9.2], ['Communication', 8.8], ['Commitment', 9.1]],
  answers: [
    { q: 'Why do you want to join Phi Sigma Lambda?', a: 'I’ve watched the men in this brotherhood carry themselves with a seriousness about their faith that I want for my own life. I’m not looking for another club to put on a résumé — I want brothers who will know me well enough to call me higher and hold me to the standard I say I believe in.' },
    { q: 'Describe your relationship with Christ.', a: 'I came to faith my junior year of high school through a campus ministry, and it reordered everything. The last two years I’ve been learning what it means to follow Christ when no one is watching — in my study habits, in how I treat my roommates, in the quiet decisions. It’s a daily, sometimes clumsy, pursuit, but it’s the most real thing in my life.' },
    { q: 'Tell us about a time you led others.', a: 'I captained my robotics team senior year. Halfway to regionals our drivetrain failed and morale cratered. I split the team into two crews, took the late shifts myself, and we rebuilt it in four days. We didn’t win, but three teammates told me afterward they’d never felt more like a team. I learned leadership is mostly showing up and carrying weight others can’t see.' },
    { q: 'What does brotherhood mean to you?', a: 'Brotherhood is being fully known and still fully committed to. It’s the friend who tells you the hard truth because he’s in it with you for the long haul, not just the good seasons.' },
    { q: 'Where are you hoping to grow?', a: 'Honestly, consistency in prayer and being quicker to ask for help. I tend to white-knuckle things alone, and I know that’s not how this is supposed to work.' },
  ],
};

function QA({ t, n, q, a }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent }}>{String(n).padStart(2, '0')}</span>
        <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: t.ink, lineHeight: 1.25 }}>{q}</span>
      </div>
      <p style={{ margin: 0, paddingLeft: 31, fontSize: 13.5, lineHeight: 1.65, color: t.sub, textWrap: 'pretty' }}>{a}</p>
    </div>
  );
}

function ApplicationReview({ theme: t }) {
  const a = APP_REVIEW;
  const rec = recommend(a.score);
  const [interviewOpen, setInterviewOpen] = React.useState(false);
  const [justScored, setJustScored] = React.useState(false);
  const w = useViewport();
  const narrow = w < BP.tab;
  return (
    <div style={{ position: 'relative', fontFamily: UI, height: narrow ? 'auto' : '100%', minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="directory" />
      <SubBar t={t} crumbs={['Directory', 'Applicants', `${a.f} ${a.l}`]}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn t={t} kind="primary" label={narrow ? 'Interview' : 'Start interview'} onClick={() => setInterviewOpen(true)}
            icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 2.5h6l1.5 1.5v8h-9v-9z" strokeLinejoin="round"/><path d="M5 6.5h4M5 9h2.5" strokeLinecap="round"/></svg>} />
          {!narrow && <Btn t={t} kind="warn" label="Hold" />}
          {!narrow && <Btn t={t} kind="ghost" label="Flag to discuss" />}
          <Btn t={t} kind="good" label={narrow ? 'Advance' : 'Advance to Candidate'}
            icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6.5h6M6.5 3.5L9.5 6.5 6.5 9.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        </div>
      </SubBar>

      <div style={{ flex: 1, display: 'flex', flexDirection: narrow ? 'column' : 'row', minHeight: 0 }}>
        {/* main — the application */}
        <div style={{ flex: 1, overflow: narrow ? 'visible' : 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* applicant header */}
          <div style={{ padding: narrow ? '16px 16px' : '22px 30px 18px', background: t.bg, borderBottom: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', gap: narrow ? 12 : 16, flexWrap: 'wrap' }}>
            <Avatar f={a.f} l={a.l} size={56} theme={t} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: SERIF, fontSize: 24 }}>{a.f} {a.l}</span>
                <Tag stage="applicant" size="sm" theme={t} />
              </div>
              <div style={{ fontSize: 12.5, color: t.faint, marginTop: 3 }}>{a.year} · {a.major} · {a.town}</div>
            </div>
            <div style={{ display: 'flex', gap: narrow ? 16 : 22, paddingRight: 6, flexWrap: 'wrap' }}>
              <Field label="Submitted" value={a.submitted} theme={t} />
              <Field label="Term" value={a.term} theme={t} />
              <Field label="GPA" value={a.gpa} theme={t} mono />
            </div>
          </div>
          {/* answers */}
          <div style={{ flex: 1, overflow: narrow ? 'visible' : 'hidden', padding: narrow ? '18px 16px' : '24px 30px' }}>
            <Eyebrow theme={t} style={{ marginBottom: 16 }}>Application responses</Eyebrow>
            {a.answers.map((x, i) => <QA key={i} t={t} n={i + 1} q={x.q} a={x.a} />)}
          </div>
        </div>

        {/* right rail — snapshot, score, decision */}
        <div style={{ width: narrow ? 'auto' : 320, flexShrink: 0, background: t.bg, borderLeft: narrow ? 'none' : `1px solid ${t.line}`, borderTop: narrow ? `1px solid ${t.line}` : 'none', overflow: narrow ? 'visible' : 'hidden', display: 'flex', flexDirection: 'column', order: narrow ? -1 : 0 }}>
          <div style={{ padding: '20px 22px', borderBottom: `1px solid ${t.line}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Eyebrow theme={t}>Interview scorecard</Eyebrow>
              <span onClick={() => setInterviewOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: t.accent, cursor: 'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M4 2.5h6l1.5 1.5v8h-9v-9z" strokeLinejoin="round"/><path d="M5 6.5h4M5 9h2.5" strokeLinecap="round"/></svg>
                Conduct interview
              </span>
            </div>
            {justScored && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', borderRadius: 9, background: '#e3f3ea', marginBottom: 12 }}>
                <svg width="14" height="14" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#1f6b46"/><path d="M4.7 8.2l2.1 2.1 4.3-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#1f6b46' }}>Interview saved to scorecard · just now</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
              <span style={{ fontFamily: SERIF, fontSize: 40, color: t.accent, lineHeight: 1 }}>{a.score.toFixed(1)}</span>
              <span style={{ fontSize: 14, color: t.faint }}>/10</span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', padding: '4px 11px', borderRadius: 999, background: rec.bg, color: rec.fg, fontSize: 12, fontWeight: 600 }}>{rec.label}</span>
            </div>
            {a.crits.map(([name, s]) => (
              <div key={name} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, color: t.sub }}>{name}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: t.accent, fontVariantNumeric: 'tabular-nums' }}>{s.toFixed(1)}</span>
                </div>
                <div style={{ height: 5, borderRadius: 5, background: t.panel2, overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '100%', width: `${s * 10}%`, background: t.accent, borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '18px 22px', borderBottom: `1px solid ${t.line}` }}>
            <Eyebrow theme={t} style={{ marginBottom: 12 }}>Contact & sponsor</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <Field label="Email" value={a.email} theme={t} />
              <Field label="Phone" value={a.phone} theme={t} mono />
              <Field label="Home church" value={a.church} theme={t} />
              <Field label="Sponsored by" value={a.sponsor} theme={t} />
            </div>
          </div>
          <div style={{ padding: '18px 22px' }}>
            <Eyebrow theme={t} style={{ marginBottom: 12 }}>References</Eyebrow>
            {a.refs.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: i === 0 ? 12 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: t.panel, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: t.sub }}>{initials(...r.n.split(' ').slice(-2))}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>{r.n}</div>
                  <div style={{ fontSize: 11, color: t.faint }}>{r.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {interviewOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(20,26,40,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: narrow ? 10 : 22 }}>
          <div style={{ width: 'min(960px, 95%)', height: '93%', background: t.bg, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(20,26,40,.45)' }}>
            {/* chrome — frames the EXACT interview form + shows the backend connection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: `1px solid ${t.line}`, flexShrink: 0 }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M4.5 3h7v10.5h-7z" strokeLinejoin="round"/><rect x="5.6" y="1.5" width="4.8" height="2.4" rx="1.2"/><path d="M6 7h4M6 9.3h2.6" strokeLinecap="round"/></svg>
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: SERIF, fontSize: 17, lineHeight: 1.1 }}>Interview · {a.f} {a.l}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: t.faint, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f6b46' }} />
                  Live · saves to {a.f}’s Interview Scorecard & card system
                </div>
              </div>
              <span onClick={() => setInterviewOpen(false)} style={{ marginLeft: 'auto', cursor: 'pointer', color: t.faint, padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" strokeLinecap="round"/></svg>
              </span>
            </div>
            {/* the EXACT uploaded interview form, embedded so it looks & feels identical */}
            <iframe src="uploads/Phi%20Slam%20Interview%20Scorecard.html" title="Interview form" style={{ flex: 1, width: '100%', border: 'none', background: '#22263e' }} />
            {/* footer — submit to backend → scorecard */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderTop: `1px solid ${t.line}`, background: t.panel, flexShrink: 0 }}>
              <span style={{ fontSize: 11.5, color: t.faint }}>On save, this scorecard syncs to the panel average and {a.f}’s traveling cards.</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                <Btn t={t} kind="ghost" label="Cancel" onClick={() => setInterviewOpen(false)} />
                <Btn t={t} kind="primary" label="Save to scorecard" onClick={() => { setJustScored(true); setInterviewOpen(false); }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Resources hub — sidebar of categories + library grid + backend upload
// ───────────────────────────────────────────────────────────────────────
const RES_CATS = [
  { id: 'videos', kind: 'videos', label: 'Videos', count: 24 },
  { id: 'training', kind: 'training', label: 'Training Modules', count: 12 },
  { id: 'quizzes', kind: 'quizzes', label: 'Quizzes', count: 8 },
  { id: 'docs', kind: 'docs', label: 'Documents', count: 31 },
  { id: 'templates', kind: 'templates', label: 'Templates', count: 6 },
];
const RES_COLLECTIONS = ['New Member Formation', 'Leadership Track', 'Alumni & Mentoring'];

function ResIcon({ kind, color }) {
  const s = { width: 16, height: 16, display: 'block' };
  switch (kind) {
    case 'videos': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M6.6 6v4l3.2-2z" fill={color} stroke="none"/></svg>;
    case 'training': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 3.2L2 5.5 8 7.8l6-2.3z" strokeLinejoin="round"/><path d="M4.5 6.7v2.8c0 .9 1.6 1.7 3.5 1.7s3.5-.8 3.5-1.7V6.7" strokeLinecap="round"/></svg>;
    case 'quizzes': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="8" cy="8" r="6"/><path d="M6.3 6.4c0-1 .8-1.7 1.7-1.7s1.7.6 1.7 1.6c0 1.3-1.6 1.3-1.7 2.6" strokeLinecap="round"/><circle cx="8" cy="11.2" r=".7" fill={color} stroke="none"/></svg>;
    case 'docs': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M4 1.8h5l3 3v9.4H4z" strokeLinejoin="round"/><path d="M6 7h4M6 9.5h4" strokeLinecap="round"/></svg>;
    default: return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="2"/><path d="M2.5 6.5h11" /></svg>;
  }
}

function ResourcesSidebar({ t, active, full }) {
  return (
    <div style={{ width: full ? '100%' : 236, background: t.bg, borderRight: full ? 'none' : `1px solid ${t.line}`, padding: '18px 18px', flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: t.faint, marginBottom: 10, paddingLeft: 3 }}>Library</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 18 }}>
        {RES_CATS.map((c) => {
          const on = c.id === active;
          return (
            <div key={c.id} onClick={() => window.PSLNav && (c.kind === 'training' ? window.PSLNav.go('training') : window.PSLNav.go('resources'))} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 9, cursor: 'pointer',
              background: on ? t.accentSoft : 'transparent', boxShadow: on ? `inset 2.5px 0 0 ${t.accent}` : 'none' }}>
              <ResIcon kind={c.kind} color={on ? t.accent : t.faint} />
              <span style={{ fontSize: 13, fontWeight: 600, color: on ? t.accent : t.ink }}>{c.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: on ? t.accent : t.faint, fontVariantNumeric: 'tabular-nums' }}>{c.count}</span>
            </div>
          );
        })}
      </div>
      <div style={{ height: 1, background: t.line, margin: '0 3px 18px' }} />
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: t.faint, marginBottom: 10, paddingLeft: 3 }}>Collections</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {RES_COLLECTIONS.map((c) => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 8, cursor: 'pointer' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: t.faint, opacity: .5 }} />
            <span style={{ fontSize: 12.5, color: t.sub }}>{c}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, padding: '12px 13px', borderRadius: 10, background: t.panel, border: `1px dashed ${t.line}` }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: t.ink, marginBottom: 3 }}>Backend admin</div>
        <div style={{ fontSize: 11, lineHeight: 1.5, color: t.faint }}>Upload videos, modules & quizzes any time — they sync to the right audience automatically.</div>
      </div>
    </div>
  );
}

const VIDEOS = [
  { title: 'Welcome to Phi Sigma Lambda', cat: 'Orientation', len: '6:24', by: 'Jordan Tate', date: 'May 2026', views: 142, pub: true },
  { title: 'The History & Heritage of ΦΣΛ', cat: 'Training', len: '18:40', by: 'Jordan Tate', date: 'May 2026', views: 96, pub: true },
  { title: 'Understanding the Creed', cat: 'Training', len: '12:05', by: 'Devon Hayes', date: 'Apr 2026', views: 88, pub: true },
  { title: 'Financial Stewardship Basics', cat: 'Training', len: '9:33', by: 'Devon Hayes', date: 'Apr 2026', views: 71, pub: true },
  { title: 'Leading a Small Group', cat: 'Leadership', len: '21:18', by: 'Jordan Tate', date: 'Mar 2026', views: 54, pub: true },
  { title: 'Interview Day: What to Expect', cat: 'Orientation', len: '7:50', by: 'A. Reyes', date: 'Feb 2026', views: 0, pub: false },
];

function VideoCard({ t, v }) {
  return (
    <div style={{ border: `1px solid ${t.line}`, borderRadius: 13, overflow: 'hidden', background: t.bg, cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: 124, background: t.panel2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: t.bg, boxShadow: '0 2px 8px rgba(0,0,0,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill={t.accent}><path d="M5 3.5v9l7-4.5z"/></svg>
        </div>
        <span style={{ position: 'absolute', right: 8, bottom: 8, padding: '2px 7px', borderRadius: 5, background: 'rgba(20,26,40,.78)', color: '#fff', fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v.len}</span>
        {!v.pub && <span style={{ position: 'absolute', left: 8, top: 8, padding: '2px 8px', borderRadius: 5, background: t.bg, color: t.faint, fontSize: 10.5, fontWeight: 700, border: `1px solid ${t.line}` }}>DRAFT</span>}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.accent }}>{v.cat}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, lineHeight: 1.3, marginBottom: 8, textWrap: 'pretty' }}>{v.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: t.faint }}>
          <span>{v.by}</span><span>·</span><span>{v.date}</span><span style={{ marginLeft: 'auto' }}>{v.pub ? `${v.views} views` : 'Unpublished'}</span>
        </div>
      </div>
    </div>
  );
}

function ResourcesView({ theme: t }) {
  const w = useViewport();
  const narrow = w < BP.tab;
  const cols = w < BP.phone ? '1fr' : narrow ? '1fr 1fr' : 'repeat(3, 1fr)';
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="resources" sidebar={narrow ? <ResourcesSidebar t={t} active="videos" full /> : null} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {!narrow && <ResourcesSidebar t={t} active="videos" />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ padding: narrow ? '15px 16px 13px' : '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: SERIF, fontSize: narrow ? 21 : 25 }}>Videos</span>
                <span style={{ fontSize: 13, color: t.faint }}>· 24 in library · 1 draft</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {!narrow && <Segmented t={t} items={['All', 'Published', 'Drafts']} activeIndex={0} />}
                <Btn t={t} kind="primary" label="Upload video"
                  icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 10V3M4.2 5.8L7 3l2.8 2.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 10v1.5h9V10" strokeLinecap="round"/></svg>} />
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: narrow ? '16px' : '20px 26px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
              {/* upload tile first — the admin affordance */}
              <div style={{ border: `1.5px dashed ${t.line}`, borderRadius: 13, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: t.bg }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={t.accent} strokeWidth="1.6"><path d="M10 14V5M6 9l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 14v2h12v-2" strokeLinecap="round"/></svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>Upload a new video</div>
                  <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2 }}>Drag a file or browse</div>
                </div>
              </div>
              {VIDEOS.map((v, i) => <VideoCard key={i} t={t} v={v} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Backend upload modal — what an admin sees when adding a resource
function ResourcesUpload({ theme: t }) {
  const Lbl = ({ children }) => <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: t.faint, marginBottom: 7 }}>{children}</div>;
  const Input = ({ value, ph }) => (
    <div style={{ padding: '10px 12px', borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, fontSize: 13.5, color: value ? t.ink : t.faint }}>{value || ph}</div>
  );
  const Chip = ({ label, on }) => (
    <span style={{ padding: '6px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
      background: on ? t.accentSoft : t.panel, color: on ? t.accent : t.sub, border: `1px solid ${on ? t.accent : t.line}` }}>{label}</span>
  );
  return (
    <div style={{ fontFamily: UI, height: '100%', background: 'rgba(20,26,40,.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 600, background: t.bg, borderRadius: 16, boxShadow: '0 24px 70px rgba(20,26,40,.28)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${t.line}`, display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 19 }}>Upload a resource</div>
            <div style={{ fontSize: 12, color: t.faint, marginTop: 2 }}>Add it to the library and choose who sees it.</div>
          </div>
          <span style={{ marginLeft: 'auto', color: t.faint, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" strokeLinecap="round"/></svg>
          </span>
        </div>
        <div style={{ padding: '20px 22px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* dropzone */}
          <div style={{ border: `1.5px dashed ${t.line}`, borderRadius: 12, padding: '24px', display: 'flex', alignItems: 'center', gap: 14, background: t.panel }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={t.accent} strokeWidth="1.6"><path d="M10 14V5M6 9l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 14v2h12v-2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink }}>Drag & drop a video, PDF, or slide deck</div>
              <div style={{ fontSize: 12, color: t.faint, marginTop: 2 }}>or <span style={{ color: t.accent, fontWeight: 600 }}>browse files</span> · up to 2 GB</div>
            </div>
          </div>
          <div><Lbl>Title</Lbl><Input value="The History & Heritage of ΦΣΛ" /></div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1 }}><Lbl>Category</Lbl><Input value="Training Module" /></div>
            <div style={{ flex: 1 }}><Lbl>Collection</Lbl><Input value="New Member Formation" /></div>
          </div>
          <div>
            <Lbl>Visible to</Lbl>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip label="Applicants" /><Chip label="Candidates" on /><Chip label="Members" on /><Chip label="Alumni" /><Chip label="Leaders only" />
            </div>
          </div>
          <div><Lbl>Description</Lbl><Input ph="Add a short summary so members know what to expect…" /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 10, background: t.panel, border: `1px solid ${t.line}` }}>
            <span style={{ width: 34, height: 20, borderRadius: 999, background: t.accent, position: 'relative', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
            </span>
            <span style={{ fontSize: 13, color: t.ink, fontWeight: 600 }}>Publish now</span>
            <span style={{ fontSize: 12, color: t.faint }}>· or save as a draft</span>
          </div>
        </div>
        <div style={{ padding: '16px 22px', borderTop: `1px solid ${t.line}`, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Btn t={t} kind="ghost" label="Save draft" />
          <Btn t={t} kind="primary" label="Publish resource" />
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// RelationshipTracker — the TOP-LEVEL hub (its own nav tab). The cross-alumni
// working surface a leader opens first: who's due / overdue for contact, the
// follow-ups assigned to me across everyone, and a live activity feed. Each
// row drills into that alum's engagement record (the per-profile detail view
// below). Patterned on a HubSpot "Tasks/Engagements" home + Attio list view.
// ───────────────────────────────────────────────────────────────────────
const ME = 'Jordan Tate';

// One row per alum — the portfolio. due: 'overdue' | 'due' | 'ok'.
const TRACKER = [
  { f: 'Trevor', l: 'Quinn', grad: '2022', owner: 'Jordan Tate', last: 'Jun 18', lastCh: 'Call', cadence: 'Quarterly', next: 'Sep 18', due: 'ok', tone: 'good', health: 'Thriving', opens: ['connect', 'mentor', 'give'] },
  { f: 'Grant', l: 'Mercer', grad: '2025', owner: 'Jordan Tate', last: 'Jun 10', lastCh: 'Call', cadence: 'Quarterly', next: 'Sep 10', due: 'ok', tone: 'good', health: 'Thriving', opens: ['connect', 'mentor', 'volunteer', 'give'] },
  { f: 'Caleb', l: 'Stone', grad: '2023', owner: 'Anthony Reyes', last: 'May 30', lastCh: 'Visit', cadence: 'Quarterly', next: 'Aug 30', due: 'ok', tone: 'steady', health: 'Steady', opens: ['connect', 'volunteer'] },
  { f: 'Joel', l: 'Ramsey', grad: '2024', owner: 'Anthony Reyes', last: 'Apr 20', lastCh: 'Text', cadence: 'Quarterly', next: 'Jun 30', due: 'due', tone: 'good', health: 'Growing', opens: ['connect', 'mentor'] },
  { f: 'Patrick', l: 'Lowe', grad: '2024', owner: 'Jordan Tate', last: 'Mar 12', lastCh: 'Email', cadence: 'Quarterly', next: 'Jun 26', due: 'due', tone: 'steady', health: 'Steady', opens: ['connect', 'give'] },
  { f: 'Marcus', l: 'Doyle', grad: '2021', owner: 'Devon Hayes', last: 'Jan 8', lastCh: 'Email', cadence: 'Biannual', next: 'Jul 8', due: 'due', tone: 'steady', health: 'Steady', opens: ['connect', 'give'] },
  { f: 'Andre', l: 'Wallace', grad: '2023', owner: 'Devon Hayes', last: 'Nov 12', lastCh: 'Email', cadence: 'Biannual', next: 'May 12', due: 'overdue', tone: 'watch', health: 'Quiet', opens: [] },
  { f: 'Brett', l: 'Halloway', grad: '2020', owner: 'Jordan Tate', last: 'Sep 2', lastCh: 'Text', cadence: 'Biannual', next: 'Mar 2', due: 'overdue', tone: 'watch', health: 'Out of touch', opens: [] },
];

// Follow-ups assigned to ME, across every alum (the personal task queue).
const MY_TASKS = [
  { title: 'Re-engage Brett — he\u2019s gone quiet', who: 'Brett Halloway', due: 'Jun 12', bucket: 'overdue', channel: 'Call', pri: 'high' },
  { title: 'Q2 check-in call with Patrick', who: 'Patrick Lowe', due: 'Jun 26', bucket: 'week', channel: 'Call', pri: 'med' },
  { title: 'Intro Grant to two engineering members', who: 'Grant Mercer', due: 'Jun 30', bucket: 'week', channel: 'Call', pri: 'high' },
  { title: 'Send Trevor his year-end giving summary', who: 'Trevor Quinn', due: 'Jul 10', bucket: 'later', channel: 'Email', pri: 'low' },
];

// Live activity — every touch logged across the chapter, newest first.
const ACTIVITY = [
  { by: 'Jordan Tate', type: 'Call', who: 'Trevor Quinn', when: 'Jun 18', note: 'Annual catch-up — doing great, offered to host a finance panel.' },
  { by: 'Jordan Tate', type: 'Call', who: 'Grant Mercer', when: 'Jun 10', note: 'Open to mentoring two members this fall. Updated employer.' },
  { by: 'Anthony Reyes', type: 'Visit', who: 'Caleb Stone', when: 'May 30', note: 'Coffee in Atlanta — wants in on the spring service project.' },
  { by: 'Anthony Reyes', type: 'Text', who: 'Joel Ramsey', when: 'Apr 20', note: 'Quick check-in; offered to review senior-class résumés.' },
];

const OPEN_LABELS = { connect: 'Connect', mentor: 'Mentor', volunteer: 'Volunteer', give: 'Giving' };

function DueBadge({ due }) {
  const map = {
    overdue: { bg: '#fbe6e2', fg: '#b3402f', label: 'Call This Week' },
    due:     { bg: '#fbefdd', fg: '#8a5a16', label: 'Call Today' },
    ok:      { bg: '#e8f0ea', fg: '#3c7d5b', label: 'On track' },
  };
  const c = map[due] || map.ok;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', width: 'fit-content' }}>
    {due === 'overdue' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.fg }} />}{c.label}
  </span>;
}

// Small KPI tile for the header band.
function StatTile({ t, label, value, sub, tone }) {
  return (
    <div style={{ flex: '1 1 140px', padding: '13px 16px', background: t.bg, border: `1px solid ${t.line}`, borderRadius: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', color: t.faint, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
        <span style={{ fontFamily: SERIF, fontSize: 28, lineHeight: 1, color: tone || t.ink }}>{value}</span>
        {sub && <span style={{ fontSize: 11.5, color: t.faint }}>{sub}</span>}
      </div>
    </div>
  );
}

// System-wide care queue — every guy a leader is responsible for: members AND
// alumni. Members open their profile; alumni open their engagement record.
const CARE_QUEUE = [
  { f:'Tyler', l:'Brooks', stage:'member', sub:'Senior · President', year:'Senior', major:'Finance', town:'Wilmington, NC', church:'Port City Community', cohort:'Spring 2024', roles:[{title:'President',term:'2025–26',current:true}], owner:'Jordan Tate', last:'Jun 22', lastCh:'Call', cadence:'Monthly', next:'Jul 22', due:'ok', tone:'good', health:'Thriving', opens:['connect'] },
  { f:'Marcus', l:'Bellamy', stage:'member', sub:'Junior · Active Member', year:'Junior', major:'Mechanical Engineering', town:'Asheville, NC', church:'Forest Hill Church', cohort:'Fall 2024', roles:[{title:'Service Chair',term:'2025–26',current:true}], owner:'Jordan Tate', last:'Jun 20', lastCh:'Call', cadence:'Monthly', next:'Jul 20', due:'ok', tone:'good', health:'Thriving', opens:['connect'] },
  { f:'Anthony', l:'Reyes', stage:'member', sub:'Junior · Active Member', year:'Junior', major:'Electrical Engineering', town:'Charlotte, NC', church:'Forest Hill Church', cohort:'Fall 2024', owner:'Jordan Tate', last:'Jun 5', lastCh:'Text', cadence:'Monthly', next:'Jul 5', due:'due', tone:'steady', health:'Steady', opens:[] },
  { f:'Caleb', l:'Whitfield', stage:'member', sub:'Sophomore · Active Member', year:'Sophomore', major:'Mechanical Engineering', town:'Greensboro, NC', church:'Mercy Hill', cohort:'Fall 2024', owner:'Devon Hayes', last:'May 28', lastCh:'Visit', cadence:'Monthly', next:'Jun 28', due:'due', tone:'good', health:'Growing', opens:['connect'] },
  { f:'Sam', l:'Okafor', stage:'member', sub:'Junior · Inactive', year:'Junior', major:'Civil Engineering', town:'Charlotte, NC', church:'Elevation Church', cohort:'Fall 2024', owner:'Jordan Tate', last:'Apr 2', lastCh:'Email', cadence:'Monthly', next:'May 2', due:'overdue', tone:'watch', health:'Disengaging', opens:[] },
  { f:'Grant', l:'Mercer', stage:'alumni', sub:'Class of 2025', grad:'2025', major:'Mechanical Engineering', loc:'Charlotte, NC', church:'Forest Hill Church', cohort:'Fall 2021', roles:[{title:'President',term:'2024–25',current:false}], owner:'Jordan Tate', last:'Jun 10', lastCh:'Call', cadence:'Quarterly', next:'Sep 10', due:'ok', tone:'good', health:'Thriving', opens:['connect','mentor','give'] },
  { f:'Trevor', l:'Quinn', stage:'alumni', sub:'Class of 2022', grad:'2022', major:'Finance', loc:'Charlotte, NC', church:'Forest Hill Church', cohort:'Fall 2018', owner:'Jordan Tate', last:'Jun 18', lastCh:'Call', cadence:'Quarterly', next:'Sep 18', due:'ok', tone:'good', health:'Thriving', opens:['connect','give'] },
  { f:'Brett', l:'Halloway', stage:'alumni', sub:'Class of 2020', grad:'2020', major:'Business Admin', loc:'Mooresville, NC', church:'Mercy Hill', cohort:'Fall 2016', owner:'Jordan Tate', last:'Sep 2', lastCh:'Text', cadence:'Biannual', next:'Mar 2', due:'overdue', tone:'watch', health:'Out of touch', opens:[] },
];

function RelationshipTracker({ theme: t, role }) {
  const card = { background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14 };
  const cols = '1.8fr 1fr 1.05fr 1.15fr 1.45fr';
  const [group, setGroup] = React.useState('all');
  const [seg, setSeg] = React.useState('Everyone');
  const [assignOpen, setAssignOpen] = React.useState(false);
  const segs = ['Everyone', 'Call Today', 'Call This Week', 'My guys', 'Open to help'];
  const s = useStore();
  React.useEffect(() => { PSLStore.seed(MY_TASKS); }, []);
  const me = s.me;
  const ownerOf = (r) => PSLStore.ownerOf(`${r.f} ${r.l}`, r.owner);
  let queue = CARE_QUEUE.filter((r) => group === 'all' ? true : group === 'alumni' ? r.stage === 'alumni' : r.stage !== 'alumni');
  queue = queue.filter((r) => {
    if (seg === 'Call Today') return r.due === 'due';
    if (seg === 'Call This Week') return r.due === 'overdue';
    if (seg === 'My guys') return ownerOf(r) === me;
    if (seg === 'Open to help') return r.opens.length > 0;
    return true;
  });
  const overdue = CARE_QUEUE.filter((r) => r.due === 'overdue').length;
  const dueNow = CARE_QUEUE.filter((r) => r.due === 'due').length;
  const thriving = CARE_QUEUE.filter((r) => r.tone === 'good').length;
  const myCare = CARE_QUEUE.filter((r) => ownerOf(r) === me).length;
  const myTasks = s.tasks.filter((tk) => tk.owner === me);
  const myOpen = myTasks.filter((tk) => tk.status !== 'done');
  const myOverdue = myOpen.filter((tk) => tk.bucket === 'overdue').length;
  const liveActivity = [...s.activity, ...ACTIVITY];
  const w = useViewport();
  const narrow = w < BP.tab;
  // Between tablet and ~1240px the fixed side-rail squeezes the queue table too
  // tight, so stack the rail below and give the table the full width.
  const tight = w < 1240;

  const SectionHead = ({ children, right }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
      <Eyebrow theme={t}>{children}</Eyebrow>
      {right}
    </div>
  );

  return (
    <div style={{ fontFamily: UI, background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar t={t} section="tracker" sidebar={narrow ? <Sidebar t={t} view={group === 'alumni' ? 'alumni' : 'active'} onNav={(v) => setGroup(v === 'alumni' ? 'alumni' : 'active')} full /> : null} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {!narrow && <Sidebar t={t} view={group === 'alumni' ? 'alumni' : 'active'} onNav={(v) => setGroup(v === 'alumni' ? 'alumni' : 'active')} />}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

      {/* page header — title + portfolio KPIs */}
      <div style={{ padding: narrow ? '16px 16px' : '22px 26px 20px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow theme={t}>Member care</Eyebrow>
            <div style={{ fontFamily: SERIF, fontSize: 27, marginTop: 4 }}>Relationship Tracker</div>
          </div>
          <span style={{ fontSize: 13, color: t.faint, paddingBottom: 5 }}>Stay in rhythm with every guy you lead — members and alumni — who's due, what's owed, how they're doing.</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <StatTile t={t} label="In your care" value={myCare} sub="members & alumni" />
          <StatTile t={t} label="Call this month" value={dueNow} sub="ready to reach out" tone="#8a5a16" />
          <StatTile t={t} label="Overdue" value={overdue} sub="past cadence" tone="#b3402f" />
          <StatTile t={t} label="Open follow-ups" value={myOpen.length} sub={`${myOverdue} overdue · assigned to you`} />
          <StatTile t={t} label="Thriving" value={`${thriving}/${CARE_QUEUE.length}`} sub="healthy reads" tone="#3c7d5b" />
        </div>
      </div>

      {/* body — contact queue (main) + my tasks & activity (rail) */}
      <div style={{ display: 'grid', gridTemplateColumns: tight ? '1fr' : '1fr 312px', gap: 22, padding: narrow ? '16px 16px' : '22px 26px', alignItems: 'start' }}>

        {/* ── LEFT: the contact queue ──────────────────────────────────── */}
        <div style={{ minWidth: 0 }}>
          <SectionHead right={<span style={{ fontSize: 11.5, color: t.faint }}>Sorted by who's due</span>}>Contact queue</SectionHead>

          {/* segment filter row */}
          <div style={{ display: 'flex', gap: 4, padding: 3, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 11, marginBottom: 14, width: 'fit-content', maxWidth: '100%', overflowX: 'auto' }}>
            {segs.map((sg, i) => {
              const on = seg === sg;
              return (
              <span key={sg} onClick={() => setSeg(sg)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: on ? t.accentSoft : 'transparent', color: on ? t.accent : t.faint, cursor: 'pointer' }}>
                {sg}
                {sg === 'Call Today' && <span style={{ fontSize: 10.5, fontWeight: 700, color: '#8a5a16', background: '#fbefdd', borderRadius: 999, padding: '0 6px' }}>{dueNow}</span>}
                {sg === 'Call This Week' && <span style={{ fontSize: 10.5, fontWeight: 700, color: '#b3402f', background: '#fbe6e2', borderRadius: 999, padding: '0 6px' }}>{overdue}</span>}
              </span>
            );})}
          </div>

          {narrow ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {queue.map((r, i) => (
                <div key={i} onClick={() => window.PSLNav && window.PSLNav.go(r.stage === 'alumni' ? 'alumniRecord' : 'profile', { person: r })} style={{ ...card, padding: '13px 14px', cursor: 'pointer', borderLeft: r.due === 'overdue' ? '3px solid #b3402f' : `1px solid ${t.line}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Avatar f={r.f} l={r.l} size={38} theme={t} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</span>
                        <StatusPill tone={r.tone} label={r.health} />
                      </div>
                      <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>{r.sub} · {r.cadence}</div>
                    </div>
                    <DueBadge due={r.due} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                    <OwnerChip t={t} owner={ownerOf(r)} size={18} onPick={(n) => PSLStore.reassign(`${r.f} ${r.l}`, `${r.f} ${r.l}`, n)} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: t.sub }}><ChannelIcon kind={r.lastCh} color={t.faint} size={12} />{r.last}</span>
                    <span style={{ fontSize: 11.5, color: t.faint }}>Next {r.next}</span>
                    {r.opens.map((o) => (
                      <span key={o} style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: o === 'give' ? '#e3f3ea' : t.accentSoft, color: o === 'give' ? '#1f6b46' : t.accent }}>{OPEN_LABELS[o]}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div style={{ ...card, overflow: 'hidden' }}>
            {/* header row */}
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 14, padding: '10px 18px', borderBottom: `1px solid ${t.line}`, background: t.panel }}>
              {['Member', 'Owner', 'Last contact', 'Open to', 'Up next'].map((h) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', color: t.faint }}>{h}</span>
              ))}
            </div>
            {queue.map((r, i) => (
              <div key={i} onClick={() => window.PSLNav && window.PSLNav.go(r.stage === 'alumni' ? 'alumniRecord' : 'profile', { person: r })} style={{ display: 'grid', gridTemplateColumns: cols, gap: 14, padding: '13px 18px', alignItems: 'center',
                borderBottom: i < queue.length - 1 ? `1px solid ${t.panel2}` : 'none', position: 'relative', cursor: 'pointer' }}>
                {r.due === 'overdue' && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: '#b3402f' }} />}
                {/* alum */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <Avatar f={r.f} l={r.l} size={34} theme={t} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0, marginTop: 2 }}>
                      <span style={{ flexShrink: 0 }}><StatusPill tone={r.tone} label={r.health} /></span>
                      <span style={{ fontSize: 11.5, color: t.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub} · {r.cadence}</span>
                    </div>
                  </div>
                </div>
                {/* owner */}
                <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
                  <OwnerChip t={t} owner={ownerOf(r)} onPick={(n) => PSLStore.reassign(`${r.f} ${r.l}`, `${r.f} ${r.l}`, n)} />
                </div>
                {/* last contact */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ display: 'inline-flex', width: 22, height: 22, borderRadius: 6, background: t.panel, border: `1px solid ${t.line}`, alignItems: 'center', justifyContent: 'center' }}>
                    <ChannelIcon kind={r.lastCh} color={t.sub} size={12} />
                  </span>
                  <span style={{ fontSize: 12.5, color: t.sub }}>{r.last}</span>
                </div>
                {/* open to */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {r.opens.length === 0
                    ? <span style={{ fontSize: 11.5, color: t.faint }}>—</span>
                    : r.opens.map((o) => (
                        <span key={o} style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: o === 'give' ? '#e3f3ea' : t.accentSoft, color: o === 'give' ? '#1f6b46' : t.accent }}>{OPEN_LABELS[o]}</span>
                      ))}
                </div>
                {/* next due */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <DueBadge due={r.due} />
                    <span style={{ fontSize: 11, color: t.faint, paddingLeft: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.next}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.6"><path d="M5 2.5L9.5 7 5 11.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* ── RIGHT: my follow-ups + activity feed ─────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* My follow-ups */}
          <div style={{ ...card, overflow: 'visible' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: `1px solid ${t.line}`, position: 'relative' }}>
              <span style={{ fontFamily: SERIF, fontSize: 16 }}>My follow-ups</span>
              {myOverdue > 0 && <span style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 700, color: '#b3402f', background: '#fbe6e2', padding: '1px 8px', borderRadius: 999 }}>{myOverdue} overdue</span>}
              <span onClick={() => setAssignOpen((o) => !o)} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: t.accent, fontWeight: 600, cursor: 'pointer' }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round"/></svg>Assign
              </span>
              {assignOpen && <NewFollowupForm t={t} people={CARE_QUEUE} onClose={() => setAssignOpen(false)} />}
            </div>
            {myOpen.length === 0 && (
              <div style={{ padding: '20px 16px', fontSize: 12.5, color: t.faint, lineHeight: 1.5 }}>Nothing on your plate. Use <b style={{ color: t.accent }}>Assign</b> to create a follow-up — for yourself or a teammate.</div>
            )}
            {myTasks.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: i < myTasks.length - 1 ? `1px solid ${t.panel2}` : 'none', alignItems: 'flex-start', opacity: f.status === 'done' ? 0.55 : 1 }}>
                <span onClick={() => PSLStore.toggleTask(f.id)} style={{ marginTop: 1, flexShrink: 0, cursor: 'pointer' }}><TaskStatusIcon status={f.status === 'done' ? 'done' : (f.bucket === 'overdue' ? 'doing' : 'todo')} t={t} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, lineHeight: 1.4, fontWeight: 500, color: t.ink, marginBottom: 6, textDecoration: f.status === 'done' ? 'line-through' : 'none' }}>{f.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: t.accent, fontWeight: 600 }}>{f.who}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: f.bucket === 'overdue' && f.status !== 'done' ? '#b3402f' : t.sub, fontWeight: f.bucket === 'overdue' ? 600 : 400 }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="2.5" width="9" height="8" rx="1.2"/><path d="M1.5 4.8h9M4 1.5v2M8 1.5v2" strokeLinecap="round"/></svg>
                      {f.due}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.faint }}>
                      <ChannelIcon kind={f.channel} color={t.faint} size={11} />{f.channel}
                    </span>
                    <PriorityFlag pri={f.pri} />
                  </div>
                </div>
                <OwnerMenu t={t} current={f.owner} onPick={(n) => PSLStore.reassignTask(f.id, n)} align="right" title="Reassign to">
                  <span title="Reassign" style={{ flexShrink: 0, cursor: 'pointer' }}><MiniA name={f.owner} t={t} size={22} /></span>
                </OwnerMenu>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div style={{ ...card, padding: '14px 16px' }}>
            <SectionHead right={<span style={{ fontSize: 11.5, color: t.accent, fontWeight: 600, cursor: 'pointer' }}>View all</span>}>Recent activity</SectionHead>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {liveActivity.map((e, i) => (
                <div key={e.id || i} style={{ display: 'flex', gap: 11, paddingBottom: i < liveActivity.length - 1 ? 14 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: '50%', background: t.panel, border: `1px solid ${t.line}`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ChannelIcon kind={e.type} color={t.accent} size={13} />
                    </span>
                    {i < liveActivity.length - 1 && <span style={{ flex: 1, width: 1.5, background: t.panel2, marginTop: 4 }} />}
                  </div>
                  <div style={{ minWidth: 0, paddingBottom: 2 }}>
                    <div style={{ fontSize: 12, color: t.ink, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600 }}>{e.by.split(' ')[0]}</span> logged a {e.type.toLowerCase()} with <span style={{ fontWeight: 600, color: t.accent }}>{e.who}</span>
                      <span style={{ color: t.faint }}> · {e.when}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: t.faint, lineHeight: 1.45, marginTop: 2 }}>{e.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// AlumniCallView — the alumni engagement record. A CRM-style profile that
// tracks how an alum is doing across life areas, the full interaction log
// (who called / emailed / texted / visited), assigned follow-up tasks, and
// the ways they're open to staying involved (connect / volunteer / mentor /
// give). Patterned on Attio/HubSpot record pages + Linear/Asana task model.
// ───────────────────────────────────────────────────────────────────────
const ALUM = {
  f: 'Grant', l: 'Mercer', grad: '2025', major: 'Mechanical Engineering',
  work: 'Senior Design Engineer · Collins Aerospace', loc: 'Charlotte, NC',
  email: 'grant.mercer@gmail.com', phone: '(828) 555-0193', church: 'Forest Hill Church',
  marital: 'Married', spouse: 'Hannah', cohort: 'Fall 2021',
  owner: 'Jordan Tate',           // relationship manager
  cadence: 'Quarterly',           // target contact rhythm
  last: 'Jun 10, 2026', next: 'Sep 2026',
  health: 'Thriving',             // overall engagement read
};

// Ways an alum is open to staying involved — the three asks, plus giving.
const HELP = [
  { key: 'connect', label: 'Connect with members', on: true,  note: 'Happy to grab coffee with current engineering students.' },
  { key: 'mentor',  label: 'Mentor a member',       on: true,  note: 'Up for mentoring 1–2 men through senior year & job search.' },
  { key: 'volunteer', label: 'Volunteer / serve',   on: true,  note: 'Wants in on the spring service project & interview days.' },
];
const GIVING = { status: 'Active monthly donor', amount: '$50 / mo', since: '2025', ytd: '$400', lifetime: '$1,150' };

// How they're doing — a health check across the life areas leaders track.
// tone: good (thriving) · steady (fine) · watch (needs attention) · info (neutral)
const LIFE_AREAS = [
  { key: 'personal', label: 'Personal', status: 'Steady', tone: 'steady', by: 'Jordan Tate', date: 'Jun 10',
    note: 'Settled into Charlotte and in a good rhythm. Training for an October half-marathon. Energy is high.' },
  { key: 'family', label: 'Family', status: 'Big news', tone: 'good', by: 'Devon Hayes', date: 'Mar 2',
    note: 'He and Hannah are expecting their first child this fall. Her parents recently relocated nearby.' },
  { key: 'work', label: 'Work', status: 'Thriving', tone: 'good', by: 'Jordan Tate', date: 'Jun 10',
    note: 'Promoted to a senior design role at Collins Aerospace; now leading a small team. Loves the work.' },
  { key: 'spiritual', label: 'Spiritual', status: 'Growing', tone: 'good', by: 'Jordan Tate', date: 'Jun 10',
    note: 'Plugged into a men\u2019s group at Forest Hill and reading through the Gospels with two coworkers.' },
];
const PRAYER = [
  { text: 'Healthy pregnancy & delivery for Hannah this fall.', date: 'Jun 10', open: true },
  { text: 'Wisdom leading his new team well at work.', date: 'Jun 10', open: true },
  { text: 'Closed: peace on the cross-country move.', date: 'Mar 2', open: false },
];

// Assigned follow-ups — the project-management layer. Linear/Asana model:
// owner, due date, intended channel, priority, status.
const FOLLOWUPS = [
  { title: 'Intro Grant to two engineering members for mentoring', owner: 'Jordan Tate', due: 'Jun 30', overdue: false, channel: 'Call', pri: 'high', status: 'doing' },
  { title: 'Send him Collins referral info for members interviewing there', owner: 'Anthony Reyes', due: 'Jul 5', overdue: false, channel: 'Email', pri: 'med', status: 'todo' },
  { title: 'Loop Grant into the fall service project', owner: 'Devon Hayes', due: 'Aug 15', overdue: false, channel: 'Text', pri: 'low', status: 'todo' },
  { title: 'Send congratulations on the baby news', owner: 'Jordan Tate', due: 'Mar 4', overdue: false, channel: 'Text', pri: 'med', status: 'done' },
];

// Interaction log — every touch, who made it, on what channel.
const CALLS = [
  { date: 'Jun 10, 2026', by: 'Jordan Tate', type: 'Call', dur: '24 min', areas: ['Work', 'Mentoring'],
    note: 'Great catch-up. Grant moved into a senior design role and is open to mentoring two engineering members this fall. Wants intros to anyone interviewing at Collins.', updates: ['Employer', 'Phone'] },
  { date: 'May 1, 2026', by: 'Anthony Reyes', type: 'Text', dur: null, areas: [],
    note: 'Quick check-in before finals push. He offered to review résumés for the senior class. Replied same day.', updates: [] },
  { date: 'Mar 2, 2026', by: 'Devon Hayes', type: 'Visit', dur: null, areas: ['Family'],
    note: 'Coffee in Charlotte. He and Hannah are expecting in the fall. Asked to be looped into the spring service project.', updates: ['Marital status'] },
  { date: 'Dec 18, 2025', by: 'Jordan Tate', type: 'Email', dur: null, areas: [],
    note: 'Sent year-end note + chapter update. Replied within the day — still very engaged.', updates: [] },
];

// Life-area glyphs (simple shapes only).
function AreaIcon({ kind, color, size = 15 }) {
  const s = { width: size, height: size, display: 'block' };
  switch (kind) {
    case 'personal': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="8" cy="5.4" r="2.5"/><path d="M3.4 13c0-2.3 2-3.7 4.6-3.7s4.6 1.4 4.6 3.7" strokeLinecap="round"/></svg>;
    case 'family': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="5.6" cy="5.6" r="2"/><circle cx="10.8" cy="6.2" r="1.6"/><path d="M2.3 12.6c0-1.9 1.5-3.1 3.3-3.1 1.1 0 2 .4 2.6 1.1M9.2 12.6c.2-1.5 1.2-2.4 2.7-2.4" strokeLinecap="round"/></svg>;
    case 'work': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="2.4" y="5.2" width="11.2" height="7.6" rx="1.4"/><path d="M6 5.2V4a1 1 0 011-1h2a1 1 0 011 1v1.2M2.4 8.6h11.2" strokeLinecap="round"/></svg>;
    case 'spiritual': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 2.4v11.2M4.6 6.2h6.8" strokeLinecap="round"/></svg>;
    case 'prayer': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 13.2s-4.3-2.7-4.3-6A2.55 2.55 0 018 4.5a2.55 2.55 0 014.3 2.7c0 3.3-4.3 6-4.3 6z" strokeLinejoin="round"/></svg>;
    default: return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="3" y="3" width="10" height="10" rx="2"/></svg>;
  }
}

// Channel badge for the interaction log (who called / emailed / texted / visited).
function ChannelIcon({ kind, color, size = 12 }) {
  const s = { width: size, height: size, display: 'block' };
  switch (kind) {
    case 'Call': return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><path d="M2.5 3c0 5 3.5 8.5 8.5 8.5l.8-2-2.3-1-1 1c-1.3-.6-2.4-1.7-3-3l1-1-1-2.3z" strokeLinejoin="round"/></svg>;
    case 'Text': return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><path d="M2 3.5h10v6H6l-2.5 2v-2H2z" strokeLinejoin="round"/></svg>;
    case 'Email': return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><rect x="1.8" y="3" width="10.4" height="8" rx="1.2"/><path d="M2.2 3.6L7 7.4l4.8-3.8" strokeLinecap="round"/></svg>;
    case 'Visit': return <svg style={s} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5"><path d="M7 1.8c2.2 0 4 1.7 4 3.9 0 2.7-4 6.5-4 6.5S3 8.4 3 5.7c0-2.2 1.8-3.9 4-3.9z" strokeLinejoin="round"/><circle cx="7" cy="5.6" r="1.3"/></svg>;
    default: return null;
  }
}
function ChannelBadge({ t, type }) {
  const map = { Call: t.accent, Visit: '#1f6b46', Email: t.faint, Text: '#8a5a16' };
  const c = map[type] || t.faint;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: t.panel, border: `1px solid ${t.line}`, fontSize: 11, fontWeight: 600, color: c }}>
      <ChannelIcon kind={type} color={c} />{type}
    </span>
  );
}

// Status pill for life-area health.
function StatusPill({ tone, label }) {
  const tones = {
    good: { bg: '#e3f3ea', fg: '#1f6b46' },
    steady: { bg: '#e8eef9', fg: '#3a5da8' },
    watch: { bg: '#fbefdd', fg: '#8a5a16' },
    info: { bg: '#eef0f4', fg: '#6b7280' },
  };
  const c = tones[tone] || tones.info;
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 999, background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>{label}</span>;
}

function MiniAvatar({ name, t, size = 22 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 700, flexShrink: 0 }}>{initials(...name.split(' '))}</div>;
}

// Linear-style status glyph for follow-up tasks.
function TaskStatusIcon({ status, t }) {
  if (status === 'done') return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#1f6b46"/><path d="M4.7 8.2l2.1 2.1 4.3-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (status === 'doing') return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.6" fill="none" stroke={t.accent} strokeWidth="1.5"/><path d="M8 8 V1.4 A6.6 6.6 0 0 1 14.6 8 Z" fill={t.accent}/></svg>;
  return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.6" fill="none" stroke={t.faint} strokeWidth="1.5" strokeDasharray="2.4 2.2"/></svg>;
}
function PriorityFlag({ pri }) {
  const map = { high: { c: '#b3402f', l: 'High' }, med: { c: '#8a5a16', l: 'Med' }, low: { c: '#8b91a0', l: 'Low' } };
  const p = map[pri]; if (!p) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: p.c }}>
      <svg width="9" height="10" viewBox="0 0 9 10" fill="none" stroke={p.c} strokeWidth="1.3"><path d="M1.5 9V1h5l-1.3 2L7 5H1.5" strokeLinejoin="round" strokeLinecap="round"/></svg>{p.l}
    </span>
  );
}

function AlumniCallView({ theme: t }) {
  const a = ALUM;
  const card = { background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14 };
  const w = useViewport();
  const narrow = w < BP.tab;

  const EditField = ({ label, value, mono }) => (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', color: t.faint, marginBottom: 5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 11px', borderRadius: 8, border: `1px solid ${t.line}`, background: t.bg, fontSize: 13, color: t.ink, fontVariantNumeric: mono ? 'tabular-nums' : 'normal' }}>
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.5"><path d="M9.5 2.5l2 2-6.5 6.5-2.5.5.5-2.5z" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );

  const Vital = ({ label, value, tone }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', color: t.faint }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: tone || t.ink }}>{value}</span>
    </div>
  );

  const SectionHead = ({ children, right }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
      <Eyebrow theme={t}>{children}</Eyebrow>
      {right}
    </div>
  );

  return (
    <div style={{ fontFamily: UI, background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar t={t} section="directory" />
      <SubBar t={t} crumbs={['Directory', 'Alumni', `${a.f} ${a.l}`]}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn t={t} kind="ghost" label="Call" icon={<ChannelIcon kind="Call" color={t.sub} size={13} />} />
          <Btn t={t} kind="ghost" label="Email" icon={<ChannelIcon kind="Email" color={t.sub} size={13} />} />
          <Btn t={t} kind="ghost" label="Text" icon={<ChannelIcon kind="Text" color={t.sub} size={13} />} />
          <Btn t={t} kind="primary" label="Log interaction"
            icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 2.5v9M2.5 7h9" strokeLinecap="round"/></svg>} />
        </div>
      </SubBar>

      {/* hero — identity, overall health, engagement vitals */}
      <div style={{ padding: narrow ? '16px 16px' : '20px 26px', background: t.bg, borderBottom: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <Avatar f={a.f} l={a.l} size={58} theme={t} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 26 }}>{a.f} {a.l}</span>
            <Tag stage="alumni" size="sm" theme={t} />
            <StatusPill tone="good" label={a.health} />
          </div>
          <div style={{ fontSize: 13, color: t.faint, marginTop: 3 }}>Class of {a.grad} · {a.major} · {a.loc}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: narrow ? 18 : 28, paddingRight: 4, flexWrap: 'wrap' }}>
          <Vital label="Relationship owner" value={a.owner} />
          <Vital label="Cadence" value={a.cadence} />
          <Vital label="Last contact" value={a.last} />
          <Vital label="Next due" value={a.next} tone={t.accent} />
        </div>
      </div>

      {/* body — main feed (left) + rails (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 372px', gap: 22, padding: narrow ? '16px 16px' : '22px 26px', alignItems: 'start' }}>

        {/* ── LEFT: contact details, how they're doing + interaction log ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>

          {/* Contact & details — top of the left column (matches How they're doing width) */}
          <div style={{ ...card, padding: '16px 18px' }}>
            <SectionHead right={<span style={{ fontSize: 11.5, color: t.accent, fontWeight: 600, cursor: 'pointer' }}>Save</span>}>Contact & details</SectionHead>
            <div style={{ display: 'grid', gridTemplateColumns: w < BP.phone ? '1fr' : 'repeat(3, 1fr)', gap: 14 }}>
              <EditField label="Email" value={a.email} />
              <EditField label="Phone" value={a.phone} mono />
              <EditField label="Location" value={a.loc} />
              <EditField label="Employer" value={a.work} />
              <EditField label="Marital" value={`${a.marital} · ${a.spouse}`} />
              <EditField label="Home church" value={a.church} />
            </div>
          </div>

          {/* How they're doing — life-area health */}
          <div>
            <SectionHead right={<span style={{ fontSize: 11.5, color: t.accent, fontWeight: 600, cursor: 'pointer' }}>+ Add update</span>}>How they’re doing</SectionHead>
            <div style={{ display: 'grid', gridTemplateColumns: w < BP.phone ? '1fr' : '1fr 1fr', gap: 12 }}>
              {LIFE_AREAS.map((x) => (
                <div key={x.key} style={{ ...card, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AreaIcon kind={x.key} color={t.accent} /></span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>{x.label}</span>
                    <span style={{ marginLeft: 'auto' }}><StatusPill tone={x.tone} label={x.status} /></span>
                  </div>
                  <p style={{ margin: '0 0 9px', fontSize: 12.5, lineHeight: 1.55, color: t.sub, textWrap: 'pretty' }}>{x.note}</p>
                  <div style={{ fontSize: 11, color: t.faint }}>Updated {x.date} · {x.by}</div>
                </div>
              ))}
            </div>

            {/* Prayer requests — its own list, supports open/closed */}
            <div style={{ ...card, padding: '14px 16px', marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AreaIcon kind="prayer" color={t.accent} /></span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>Prayer Requests</span>
                <span style={{ marginLeft: 'auto' }}><StatusPill tone="info" label={`${PRAYER.filter((p) => p.open).length} open`} /></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {PRAYER.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ width: 15, height: 15, borderRadius: '50%', marginTop: 1, flexShrink: 0, border: `1.5px solid ${p.open ? t.line : '#1f6b46'}`, background: p.open ? 'transparent' : '#1f6b46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {!p.open && <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2"><path d="M1.5 5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    <span style={{ flex: 1, fontSize: 12.5, lineHeight: 1.45, color: p.open ? t.ink : t.faint, textDecoration: p.open ? 'none' : 'line-through' }}>{p.text}</span>
                    <span style={{ fontSize: 11, color: t.faint, whiteSpace: 'nowrap' }}>{p.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interaction log */}
          <div>
            <SectionHead right={<span style={{ fontSize: 11.5, color: t.faint }}>{CALLS.length} touches · last {a.last}</span>}>Interaction log</SectionHead>

            {/* quick composer */}
            <div style={{ ...card, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 10, padding: '11px 14px', borderBottom: `1px solid ${t.line}`, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 4, padding: 3, background: t.panel, borderRadius: 9, border: `1px solid ${t.line}` }}>
                  {['Call', 'Text', 'Email', 'Visit'].map((v, i) => (
                    <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                      background: i === 0 ? t.bg : 'transparent', color: i === 0 ? t.ink : t.faint, boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,.10)' : 'none' }}>
                      <ChannelIcon kind={v} color={i === 0 ? t.accent : t.faint} />{v}
                    </span>
                  ))}
                </div>
                <div style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${t.line}`, fontSize: 12.5, color: t.ink }}>Today · Jun 25</div>
                <div style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${t.line}`, fontSize: 12.5, color: t.faint }}>Duration</div>
              </div>
              <div style={{ padding: '13px 14px', fontSize: 13, color: t.faint, minHeight: 52 }}>Notes from your conversation — what you discussed, how they’re doing, anything to remember…</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: `1px solid ${t.line}`, background: t.panel }}>
                <span style={{ fontSize: 11.5, color: t.faint }}>Tag a life area or create a follow-up as you save.</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <Btn t={t} kind="ghost" label="Add follow-up" />
                  <Btn t={t} kind="primary" label="Save log" />
                </div>
              </div>
            </div>

            {/* timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CALLS.map((c, i) => (
                <div key={i} style={{ ...card, padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                    <ChannelBadge t={t} type={c.type} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{c.date}</span>
                    {c.dur && <span style={{ fontSize: 12, color: t.faint }}>· {c.dur}</span>}
                    <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MiniAvatar name={c.by} t={t} size={20} />
                      <span style={{ fontSize: 11.5, color: t.faint }}>{c.by}</span>
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: t.sub, textWrap: 'pretty' }}>{c.note}</p>
                  {(c.areas.length > 0 || c.updates.length > 0) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, flexWrap: 'wrap' }}>
                      {c.areas.map((u) => (
                        <span key={u} style={{ padding: '2px 9px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3 }}>{u}</span>
                      ))}
                      {c.updates.map((u) => (
                        <span key={u} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: t.panel, border: `1px solid ${t.line}`, fontSize: 10.5, fontWeight: 600, color: t.sub }}>
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#1f6b46" strokeWidth="2"><path d="M1.5 5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Updated {u}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: giving, follow-ups, ways to help ────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Giving — actively donating (top right) */}
          <div style={{ ...card, padding: '14px 16px' }}>
            <SectionHead right={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 10.5, fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f6b46' }} />Active</span>}>Giving</SectionHead>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: SERIF, fontSize: 26, color: t.ink, lineHeight: 1 }}>{GIVING.amount.split(' ')[0]}</span>
              <span style={{ fontSize: 13, color: t.faint }}>/ mo · since {GIVING.since}</span>
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              {[['This year', GIVING.ytd], ['Lifetime', GIVING.lifetime], ['Status', 'Monthly']].map(([l, v], i) => (
                <div key={l} style={{ flex: 1, paddingLeft: i ? 14 : 0, borderLeft: i ? `1px solid ${t.line}` : 'none' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', color: t.faint, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-ups — the task board */}
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: `1px solid ${t.line}` }}>
              <span style={{ fontFamily: SERIF, fontSize: 16 }}>Follow-ups</span>
              <span style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '1px 8px', borderRadius: 999 }}>{FOLLOWUPS.filter((f) => f.status !== 'done').length} open</span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: t.accent, fontWeight: 600, cursor: 'pointer' }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round"/></svg>Assign
              </span>
            </div>
            <div>
              {FOLLOWUPS.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: i < FOLLOWUPS.length - 1 ? `1px solid ${t.panel2}` : 'none', alignItems: 'flex-start' }}>
                  <span style={{ marginTop: 1, flexShrink: 0 }}><TaskStatusIcon status={f.status} t={t} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, lineHeight: 1.4, fontWeight: 500, color: f.status === 'done' ? t.faint : t.ink, textDecoration: f.status === 'done' ? 'line-through' : 'none', marginBottom: 7 }}>{f.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <MiniAvatar name={f.owner} t={t} size={18} />
                        <span style={{ fontSize: 11, color: t.sub }}>{f.owner.split(' ')[0]}</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: f.status === 'done' ? t.faint : t.sub }}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="2.5" width="9" height="8" rx="1.2"/><path d="M1.5 4.8h9M4 1.5v2M8 1.5v2" strokeLinecap="round"/></svg>
                        {f.due}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.faint }}>
                        <ChannelIcon kind={f.channel} color={t.faint} size={11} />{f.channel}
                      </span>
                      {f.status !== 'done' && <PriorityFlag pri={f.pri} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ways to help — connect / mentor / volunteer */}
          <div style={{ ...card, padding: '14px 16px' }}>
            <SectionHead>Ways {a.f} can help</SectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {HELP.map((h) => (
                <div key={h.key} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span style={{ width: 30, height: 18, borderRadius: 999, flexShrink: 0, marginTop: 1, background: h.on ? '#1f6b46' : t.line, position: 'relative', transition: 'background .15s' }}>
                    <span style={{ position: 'absolute', top: 2, left: h.on ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{h.label}</div>
                    <div style={{ fontSize: 11.5, lineHeight: 1.45, color: t.faint, marginTop: 2 }}>{h.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ApplicationReview, ResourcesView, ResourcesUpload, RelationshipTracker, AlumniCallView });
