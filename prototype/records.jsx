// records.jsx — two "document" surfaces for the CRM:
//   • ReportModal   — Generate Report: pick a report, see a live paper preview, export.
//   • RecordViewer  — the read-only viewer for the PERMANENT RECORD chips that ride
//                     with every profile (Application, Scorecard, Testing, Certs, Milestones).
// Reuses atoms/data/components from window (kit.jsx, cards.jsx, collab.jsx).

// ════════════════════════════════════════════════════════════════════════
// GENERATE REPORT
// ════════════════════════════════════════════════════════════════════════

// Report definitions. Each builds its own preview table from the global data.
const REPORT_TYPES = [
  { key: 'roster',   label: 'Active Member Roster',   desc: 'Every active man, grouped by class.', glyph: 'active' },
  { key: 'decision', label: 'Applicant Decision Sheet', desc: 'Scores + recommendation for selection night.', glyph: 'applicant' },
  { key: 'cohort',   label: 'Cohort Summary',          desc: 'Formation cohorts and their standing.', glyph: 'milestones' },
  { key: 'alumni',   label: 'Alumni Directory',        desc: 'Grads, where they are, open to connect.', glyph: 'alumni' },
  { key: 'giving',   label: 'Giving Summary',          desc: 'Recurring givers and year-to-date totals.', glyph: 'giving' },
];

function ReportGlyph({ kind, color, size = 16 }) {
  const s = { width: size, height: size, display: 'block' };
  if (kind === 'active') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="6" cy="5" r="2.6"/><path d="M1.8 13c0-2.4 1.9-4 4.2-4s4.2 1.6 4.2 4" strokeLinecap="round"/><circle cx="12" cy="5.4" r="1.9"/><path d="M11 9.2c2 .1 3.2 1.6 3.2 3.8" strokeLinecap="round"/></svg>;
  if (kind === 'applicant') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round"/></svg>;
  if (kind === 'alumni') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 2.2L14.5 5 8 7.8 1.5 5z" strokeLinejoin="round"/><path d="M4.5 6.4v3.1c0 1 1.6 1.9 3.5 1.9s3.5-.9 3.5-1.9V6.4" strokeLinecap="round"/></svg>;
  if (kind === 'giving') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M6.3 6.2c0-.8.8-1.3 1.7-1.3s1.7.4 1.7 1.2-.8 1.1-1.7 1.1-1.7.4-1.7 1.2.8 1.2 1.7 1.2 1.7-.5 1.7-1.2" strokeLinecap="round"/></svg>;
  return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 1.5v13" strokeLinecap="round"/><circle cx="8" cy="4" r="1.5" fill={color} stroke="none"/><circle cx="8" cy="8" r="1.5" fill={color} stroke="none"/><circle cx="8" cy="12" r="1.5" fill={color} stroke="none"/></svg>;
}

// The "paper" preview that updates as you change options.
function ReportSheet({ t, type, opts }) {
  const ink = '#1d2330', sub = '#5d6577', faint = '#9098a6', line = '#e2e5ec';
  const eff = (r) => (window.PSLStore ? PSLStore.stageOf(`${r.f} ${r.l}`, r.stage) : r.stage);
  const head = { fontSize: 8.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: faint, padding: '0 0 6px' };
  const cell = { fontSize: 11, color: sub, padding: '6px 0', borderTop: `1px solid ${line}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const nameCell = { ...cell, color: ink, fontWeight: 600 };

  let title = 'Report', subtitle = '', cols = [], rows = null, body = null;

  if (type === 'roster') {
    title = 'Active Member Roster';
    subtitle = 'UNC Charlotte · Spring 2026';
    const men = ROSTER.filter((r) => eff(r) === 'member');
    cols = ['Member', 'Class', 'Major', opts.contact ? 'Phone' : 'Cohort', 'Status'];
    rows = men.map((r) => [`${r.f} ${r.l}`, r.year, r.major, opts.contact ? '(704) 555-••••' : r.cohort, r.status]);
  } else if (type === 'decision') {
    title = 'Applicant Decision Sheet';
    subtitle = 'UNC Charlotte · Fall 2026 selection';
    const ap = APPLICANTS.filter((r) => r.score != null).sort((a, b) => b.score - a.score);
    cols = ['Applicant', 'Major', 'Interview', 'Recommendation'];
    rows = ap.map((r) => [`${r.f} ${r.l}`, r.major, r.score.toFixed(1), recommend(r.score).label]);
  } else if (type === 'alumni') {
    title = 'Alumni Directory';
    subtitle = 'UNC Charlotte · All classes';
    cols = ['Alumnus', 'Class', 'Work', 'Location', 'Connect'];
    rows = ALUMNI.map((r) => [`${r.f} ${r.l}`, r.grad, r.work, r.loc, r.connect ? 'Open' : 'Private']);
  } else if (type === 'cohort') {
    title = 'Cohort Summary';
    subtitle = 'New Member Formation · by cohort';
    const groups = ['Fall 2025', 'Fall 2024', 'Spring 2024'].map((c) => ({ c, men: ROSTER.filter((r) => r.cohort === c) }));
    cols = ['Cohort', 'Standing', 'Men', 'Active'];
    rows = groups.map((g) => [g.c + ' Cohort', g.men.some((m) => m.stage === 'candidate') ? 'In Formation' : 'Active Members', g.men.length, g.men.filter((m) => m.status === 'active').length]);
  } else if (type === 'giving') {
    title = 'Giving Summary';
    subtitle = 'Recurring support · 2025–26';
    body = (
      <div style={{ marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 0, border: `1px solid ${line}`, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
          {[['Recurring givers', '11'], ['This year', '$14,250'], ['Lifetime', '$61,900'], ['Avg / mo', '$118']].map(([l, v], i) => (
            <div key={l} style={{ flex: 1, padding: '11px 12px', borderLeft: i ? `1px solid ${line}` : 'none' }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: faint }}>{l}</div>
              <div style={{ fontFamily: SERIF, fontSize: 18, color: ink, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
        {(() => {
          const givers = [['Marcus Bellamy', '$25 / mo', '$300'], ['Tyler Brooks', '$15 / mo', '$180'], ['Devon Hayes', '$10 / mo', '$120'], ['Nathan Ford', '$20 / mo', '$240'], ['Grant Mercer (alum)', '$50 / mo', '$600']];
          return (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Giver', 'Cadence', 'YTD'].map((c) => <th key={c} style={{ ...head, textAlign: c === 'Giver' ? 'left' : 'right' }}>{c}</th>)}</tr></thead>
              <tbody>{givers.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} style={{ ...(j === 0 ? nameCell : cell), textAlign: j === 0 ? 'left' : 'right' }}>{v}</td>)}</tr>)}</tbody>
            </table>
          );
        })()}
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', color: ink, borderRadius: 6, boxShadow: '0 1px 0 rgba(0,0,0,.04), 0 18px 44px rgba(15,20,32,.13)', padding: '34px 38px', fontFamily: UI, minHeight: '100%' }}>
      {/* Letterhead */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottom: `2px solid ${ink}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ width: 38, height: 36, borderRadius: 7, background: ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 16, letterSpacing: 1.5 }}>ΦΣΛ</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: ink, letterSpacing: -0.1 }}>Phi Sigma Lambda</div>
            <div style={{ fontSize: 10, color: faint, marginTop: 1 }}>UNC Charlotte Chapter</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: faint }}>Generated</div>
          <div style={{ fontSize: 11, color: sub, marginTop: 3 }}>Jun 26, 2026</div>
          <div style={{ fontSize: 9.5, color: faint, marginTop: 1 }}>by Jordan Tate</div>
        </div>
      </div>

      {/* Title */}
      <div style={{ margin: '20px 0 16px' }}>
        <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500, letterSpacing: -0.3, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: faint, marginTop: 5 }}>{subtitle}{rows ? ` · ${rows.length} entries` : ''}</div>
      </div>

      {/* Body */}
      {body || (
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead><tr>{cols.map((c, i) => <th key={c} style={{ ...head, textAlign: i === cols.length - 1 ? 'right' : 'left' }}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((v, j) => <td key={j} style={{ ...(j === 0 ? nameCell : cell), textAlign: j === r.length - 1 ? 'right' : 'left' }}>{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Footer */}
      <div style={{ marginTop: 22, paddingTop: 12, borderTop: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: faint }}>
        <span>Confidential · For chapter leadership use only</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}

function ReportModal({ t, onClose, defaultType = 'roster' }) {
  const [type, setType] = React.useState(defaultType);
  const [format, setFormat] = React.useState('PDF');
  const [opts, setOpts] = React.useState({ contact: false, leadership: true });
  const [done, setDone] = React.useState(false);
  const w = useViewport();
  const narrow = w < BP.tab;

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const cur = REPORT_TYPES.find((r) => r.key === type);
  const generate = () => { setDone(true); setTimeout(() => { setDone(false); onClose(); }, 1400); };

  const sectionLbl = { fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, margin: '0 0 11px' };

  const config = (
    <div style={{ width: narrow ? '100%' : 320, flexShrink: 0, borderRight: narrow ? 'none' : `1px solid ${t.line}`, borderBottom: narrow ? `1px solid ${t.line}` : 'none', padding: '20px 20px', overflowY: 'auto', background: t.bg }}>
      <div style={sectionLbl}>Report</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 22 }}>
        {REPORT_TYPES.map((r) => {
          const on = r.key === type;
          return (
            <div key={r.key} onClick={() => setType(r.key)} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '11px 12px', borderRadius: 11, cursor: 'pointer',
              background: on ? t.accentSoft : t.panel, border: `1px solid ${on ? t.accent : t.line}` }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: t.bg, border: `1px solid ${on ? t.accent : t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ReportGlyph kind={r.glyph} color={on ? t.accent : t.faint} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: on ? t.accent : t.ink }}>{r.label}</div>
                <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2, lineHeight: 1.35 }}>{r.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={sectionLbl}>Options</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 22 }}>
        <ReportToggle t={t} label="Include contact info" sub="Phone & email columns" on={opts.contact} onClick={() => setOpts((o) => ({ ...o, contact: !o.contact }))} />
        <ReportToggle t={t} label="Leadership history" sub="Current & past offices" on={opts.leadership} onClick={() => setOpts((o) => ({ ...o, leadership: !o.leadership }))} />
      </div>

      <div style={sectionLbl}>Format</div>
      <div style={{ display: 'flex', gap: 6, padding: 4, background: t.panel, borderRadius: 10, border: `1px solid ${t.line}` }}>
        {['PDF', 'CSV', 'Print'].map((f) => {
          const on = f === format;
          return <span key={f} onClick={() => setFormat(f)} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            background: on ? t.bg : 'transparent', color: on ? t.ink : t.faint, boxShadow: on ? '0 1px 2px rgba(0,0,0,.1)' : 'none' }}>{f}</span>;
        })}
      </div>
    </div>
  );

  const preview = (
    <div style={{ flex: 1, minWidth: 0, background: t.panel, padding: narrow ? '16px' : '26px 30px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <ReportSheet t={t} type={type} opts={opts} />
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 240, background: 'rgba(15,20,32,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: narrow ? 0 : 28, fontFamily: UI }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: narrow ? '100%' : 'min(940px, 96vw)', height: narrow ? '100%' : 'min(680px, 92vh)', background: t.bg, borderRadius: narrow ? 0 : 18, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(15,20,32,.4)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${t.line}`, flexShrink: 0 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M4 1.8h5l3 3v9.4H4z" strokeLinejoin="round"/><path d="M6 8h4M6 10.5h4" strokeLinecap="round"/></svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.1 }}>Generate report</div>
            <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>Pick a report, then export or print.</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" strokeLinecap="round"/></svg>
          </button>
        </div>
        {/* body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: narrow ? 'column' : 'row', minHeight: 0 }}>
          {config}
          {preview}
        </div>
        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderTop: `1px solid ${t.line}`, flexShrink: 0, background: t.bg }}>
          <span style={{ fontSize: 11.5, color: t.faint }}>{cur.label} · {format}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 9 }}>
            <button onClick={onClose} style={{ fontFamily: UI, fontSize: 12.5, fontWeight: 600, padding: '9px 16px', borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer' }}>Cancel</button>
            <button onClick={generate} style={{ fontFamily: UI, fontSize: 12.5, fontWeight: 600, padding: '9px 18px', borderRadius: 9, border: 'none', background: done ? '#1f6b46' : t.accent, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              {done
                ? <React.Fragment><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2"><path d="M2.5 7.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round"/></svg>Ready — downloading…</React.Fragment>
                : <React.Fragment>{format === 'Print' ? 'Print report' : `Download ${format}`}</React.Fragment>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportToggle({ t, label, sub, on, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, cursor: 'pointer' }}>
      <span style={{ width: 32, height: 19, borderRadius: 999, flexShrink: 0, marginTop: 1, background: on ? t.accent : t.line, position: 'relative', transition: 'background .15s' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 15 : 2, width: 15, height: 15, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.25)', transition: 'left .15s' }} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{label}</div>
        <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PERMANENT RECORD VIEWER
// ════════════════════════════════════════════════════════════════════════
// Read-only archive of the artifacts that ride with a profile forever.

const TESTING_MODULES = [
  { label: 'Statement of Faith', done: true, date: 'Sep 28, 2024' },
  { label: 'Brotherhood & Covenant', done: true, date: 'Oct 5, 2024' },
  { label: 'Service & Stewardship', done: true, date: 'Oct 19, 2024' },
  { label: 'Chapter History & Ritual', done: true, date: 'Nov 2, 2024' },
  { label: 'Leadership Foundations', done: true, date: 'Nov 16, 2024' },
  { label: 'Final Reflection Essay', done: false, date: 'Due before initiation' },
];

const CERTS = [
  { label: 'CPR / AED Certification', org: 'American Red Cross', status: 'Active', exp: 'Renews Mar 2026' },
  { label: 'Background Check', org: 'Chapter Safety', status: 'Active', exp: 'Cleared Aug 2024' },
  { label: 'Safe Conduct Training', org: 'National Office', status: 'Active', exp: 'Completed Sep 2024' },
];

const APPLICATION_RECORD = {
  submitted: 'Aug 28, 2024', term: 'Fall 2024', sponsor: 'Devon Hayes',
  fields: [['Class year', 'Junior'], ['Major', 'Mechanical Engineering'], ['Home church', 'Forest Hill Church'], ['GPA', '3.74']],
  answers: [
    { q: 'Why do you want to join Phi Sigma Lambda?', a: 'I want brothers who will know me well enough to call me higher — not another résumé line, but men committed to following Christ together for the long haul.' },
    { q: 'Describe your relationship with Christ.', a: 'I came to faith in high school and the last few years have been about following Him when no one is watching — in study habits, how I treat my roommates, the quiet decisions.' },
    { q: 'Where are you hoping to grow?', a: 'Consistency in prayer, and being quicker to ask for help instead of white-knuckling things alone.' },
  ],
};

const RECORD_META = {
  application: { title: 'Application', sub: 'Submitted at intake' },
  scorecard:   { title: 'Interview Scorecard', sub: 'Locked after panel' },
  testing:     { title: 'Candidacy Testing', sub: 'Formation modules' },
  certs:       { title: 'Certifications', sub: 'Compliance & training' },
  milestones:  { title: 'Milestones', sub: 'Journey & history' },
};

function RecordBody({ t, recKey }) {
  const frame = { background: t.bg, border: `1px solid ${t.line}`, borderRadius: 12, overflow: 'hidden' };

  if (recKey === 'scorecard') return <div style={{ ...frame }}><ScoreCard theme={t} /></div>;
  if (recKey === 'milestones') return <div style={{ ...frame, paddingBottom: 4 }}><MilestonesCard theme={t} /></div>;

  if (recKey === 'application') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', padding: '14px 16px', background: t.panel, borderRadius: 12, border: `1px solid ${t.line}` }}>
          {[['Submitted', APPLICATION_RECORD.submitted], ['For term', APPLICATION_RECORD.term], ['Sponsored by', APPLICATION_RECORD.sponsor]].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{l}</div><div style={{ fontSize: 13, fontWeight: 600, color: t.ink, marginTop: 3 }}>{v}</div></div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {APPLICATION_RECORD.fields.map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{l}</div><div style={{ fontSize: 13.5, fontWeight: 500, color: t.ink, marginTop: 3 }}>{v}</div></div>
          ))}
        </div>
        <div style={{ height: 1, background: t.line }} />
        {APPLICATION_RECORD.answers.map((qa, i) => (
          <div key={i}>
            <div style={{ display: 'flex', gap: 9, alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{qa.q}</span>
            </div>
            <p style={{ margin: '0 0 0 26px', fontSize: 13, lineHeight: 1.6, color: t.sub, textWrap: 'pretty' }}>{qa.a}</p>
          </div>
        ))}
      </div>
    );
  }

  if (recKey === 'testing') {
    const done = TESTING_MODULES.filter((m) => m.done).length;
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: t.accentSoft, borderRadius: 12, marginBottom: 14 }}>
          <span style={{ fontFamily: SERIF, fontSize: 26, color: t.accent, lineHeight: 1 }}>{done}<span style={{ fontSize: 16, color: t.faint }}>/{TESTING_MODULES.length}</span></span>
          <span style={{ fontSize: 12.5, color: t.sub }}>modules completed in New Member Formation</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {TESTING_MODULES.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', background: t.panel, border: `1px solid ${t.line}`, borderRadius: 11 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: m.done ? '#1f6b46' : t.bg, border: m.done ? 'none' : `2px dashed ${t.faint}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.done && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2"><path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: m.done ? t.ink : t.sub }}>{m.label}</span>
              <span style={{ fontSize: 11.5, color: t.faint }}>{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recKey === 'certs') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {CERTS.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px', background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12 }}>
            <span style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.4"><circle cx="8" cy="6" r="4"/><path d="M5.5 9.5L4 14l4-2 4 2-1.5-4.5" strokeLinejoin="round"/></svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink }}>{c.label}</div>
              <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2 }}>{c.org} · {c.exp}</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 11, fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f6b46' }} />{c.status}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function RecordViewer({ t, recKey, who, onClose }) {
  const meta = RECORD_META[recKey] || { title: 'Record', sub: '' };
  const w = useViewport();
  const narrow = w < BP.tab;
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 240, background: 'rgba(15,20,32,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: narrow ? 0 : 28, fontFamily: UI }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: narrow ? '100%' : 'min(620px, 96vw)', height: narrow ? '100%' : 'min(720px, 92vh)', background: t.bg, borderRadius: narrow ? 0 : 18, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(15,20,32,.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${t.line}`, flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.1 }}>{meta.title}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: t.panel, border: `1px solid ${t.line}`, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint }}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.7"><rect x="4" y="7.5" width="8" height="5.5" rx="1.3"/><path d="M5.7 7.5V6a2.3 2.3 0 014.6 0v1.5" strokeLinecap="round"/></svg>
                Permanent · read-only
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2 }}>{who ? `${who} · ` : ''}{meta.sub}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', background: (recKey === 'scorecard' || recKey === 'milestones') ? t.panel : t.bg }}>
          <RecordBody t={t} recKey={recKey} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderTop: `1px solid ${t.line}`, flexShrink: 0 }}>
          <span style={{ fontSize: 11.5, color: t.faint }}>Travels with this profile permanently.</span>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={onClose} style={{ fontFamily: UI, fontSize: 12.5, fontWeight: 600, padding: '8px 16px', borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global host — mounted once at app root; opened from any profile chip.
window.PSLRecords = { open: (key, who) => { try { window.dispatchEvent(new CustomEvent('psl:record', { detail: { key, who } })); } catch (e) {} } };

function RecordViewerHost({ theme: t }) {
  const [rec, setRec] = React.useState(null);
  React.useEffect(() => {
    const h = (e) => setRec(e.detail);
    window.addEventListener('psl:record', h);
    return () => window.removeEventListener('psl:record', h);
  }, []);
  if (!rec) return null;
  return <RecordViewer t={t} recKey={rec.key} who={rec.who} onClose={() => setRec(null)} />;
}

Object.assign(window, { REPORT_TYPES, ReportModal, ReportSheet, RecordViewer, RecordViewerHost });
