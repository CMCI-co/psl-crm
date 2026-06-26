// report-builder.jsx — a print/PDF-first Report Builder for the CRM.
// Pick which data to highlight from a palette; each section offers several
// chart formats (bar / horizontal / 100% stacked / donut / funnel / line /
// dot-plot) that swap dynamically. The "paper" preview is styled to print.
// Reuses atoms/data from window (kit.jsx). Always renders on a light paper
// theme so the exported report reads professionally regardless of dark mode.

// ── Datasets you can drop into a report ─────────────────────────────────
// ── Population records — one row per person, NON-PERSONAL fields only.
// Generated deterministically so cross-tabs (filter + group-by) are stable.
function __rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }
function __col(spec, rng) { const arr = []; spec.forEach((p) => { for (let i = 0; i < p[1]; i++) arr.push(p[0]); }); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; } return arr; }
function __pop(n, cols, seed) { const rng = __rng(seed); const built = {}; Object.keys(cols).forEach((f) => { built[f] = __col(cols[f], rng); }); const recs = []; for (let i = 0; i < n; i++) { const r = {}; Object.keys(built).forEach((f) => { r[f] = built[f][i]; }); recs.push(r); } return recs; }

const POP = {
  members: __pop(46, {
    status: [['Active', 42], ['Inactive', 4]],
    year: [['Freshman', 9], ['Sophomore', 10], ['Junior', 13], ['Senior', 11], ['Super Sr.', 3]],
    major: [['Engineering', 18], ['Business', 9], ['Computer Science', 8], ['Finance', 7], ['Biblical Studies', 4]],
    church: [['Forest Hill', 15], ['Elevation', 10], ['Mercy Hill', 9], ['The Summit', 7], ['Other', 5]],
    state: [['North Carolina', 37], ['South Carolina', 3], ['Georgia', 3], ['Virginia', 2], ['Other', 1]],
    relationship: [['Single', 36], ['Dating', 8], ['Married', 2]],
    cohort: [['Fall 2025', 7], ['Fall 2024', 19], ['Spring 2024', 13], ['Fall 2023', 7]],
    leadership: [['Current officer', 8], ['Held office', 15], ['No office', 23]],
  }, 11),
  alumni: __pop(18, {
    grad: [['2025', 3], ['2024', 5], ['2023', 4], ['2022', 3], ['≤2021', 3]],
    major: [['Engineering', 9], ['Business', 4], ['Computer Science', 3], ['Finance', 2]],
    industry: [['Engineering', 7], ['Technology', 4], ['Finance', 3], ['Operations', 2], ['Other', 2]],
    marital: [['Married', 11], ['Single', 7]],
    connect: [['Open to connect', 14], ['Private', 4]],
    state: [['North Carolina', 9], ['Georgia', 3], ['South Carolina', 2], ['Texas', 2], ['Other', 2]],
  }, 23),
  applicants: __pop(25, {
    major: [['Engineering', 9], ['Business', 6], ['Computer Science', 5], ['Finance', 3], ['Other', 2]],
    score: [['9.0–10', 5], ['8.0–8.9', 7], ['7.0–7.9', 6], ['6.0–6.9', 4], ['Below 6', 3]],
    recommendation: [['Advance', 8], ['Discuss', 9], ['Hold', 8]],
    year: [['Freshman', 16], ['Sophomore', 9]],
  }, 37),
};

// Fields you can filter or group by, per population (order drives chart order + color).
const POP_META = {
  members: { label: 'Members', fields: [
    { k: 'year', label: 'Class', order: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Super Sr.'] },
    { k: 'major', label: 'Major', order: ['Engineering', 'Business', 'Computer Science', 'Finance', 'Biblical Studies'] },
    { k: 'relationship', label: 'Relationship status', order: ['Single', 'Dating', 'Married'] },
    { k: 'church', label: 'Home church', order: ['Forest Hill', 'Elevation', 'Mercy Hill', 'The Summit', 'Other'] },
    { k: 'state', label: 'Home state', order: ['North Carolina', 'South Carolina', 'Georgia', 'Virginia', 'Other'] },
    { k: 'cohort', label: 'Cohort', order: ['Fall 2025', 'Fall 2024', 'Spring 2024', 'Fall 2023'] },
    { k: 'leadership', label: 'Leadership', order: ['Current officer', 'Held office', 'No office'] },
    { k: 'status', label: 'Standing', order: ['Active', 'Inactive'] },
  ] },
  alumni: { label: 'Alumni', fields: [
    { k: 'grad', label: 'Graduating class', order: ['2025', '2024', '2023', '2022', '≤2021'] },
    { k: 'major', label: 'Major', order: ['Engineering', 'Business', 'Computer Science', 'Finance'] },
    { k: 'industry', label: 'Industry', order: ['Engineering', 'Technology', 'Finance', 'Operations', 'Other'] },
    { k: 'marital', label: 'Relationship status', order: ['Married', 'Single'] },
    { k: 'connect', label: 'Open to connect', order: ['Open to connect', 'Private'] },
    { k: 'state', label: 'Location', order: ['North Carolina', 'Georgia', 'South Carolina', 'Texas', 'Other'] },
  ] },
  applicants: { label: 'Applicants', fields: [
    { k: 'major', label: 'Major', order: ['Engineering', 'Business', 'Computer Science', 'Finance', 'Other'] },
    { k: 'score', label: 'Interview score', order: ['9.0–10', '8.0–8.9', '7.0–7.9', '6.0–6.9', 'Below 6'] },
    { k: 'recommendation', label: 'Recommendation', order: ['Advance', 'Discuss', 'Hold'] },
    { k: 'year', label: 'Class', order: ['Freshman', 'Sophomore'] },
  ] },
};

// Static rollups — chapter/national aggregates that don't slice per-record.
const STATIC_REPORTS = {
  pipeline: { title: 'Recruitment pipeline', group: 'Pipeline', charts: ['funnel', 'bar', 'stack100'],
    data: [{ label: 'Applicants', value: 25 }, { label: 'Candidates', value: 6 }, { label: 'Members', value: 42 }, { label: 'Alumni', value: 18 }] },
  campus: { title: 'Members by campus (national)', group: 'Membership', charts: ['bar', 'hbar', 'stack100'],
    data: [{ label: 'UNC Charlotte', value: 42 }, { label: 'NC State', value: 28 }, { label: 'UNC Chapel Hill', value: 24 }, { label: 'App State', value: 19 }, { label: 'Clemson', value: 15 }] },
  giving: { title: 'Recurring giving by month', group: 'Giving', charts: ['line', 'bar'], unit: '$',
    data: [{ label: 'Sep', value: 980 }, { label: 'Oct', value: 1040 }, { label: 'Nov', value: 1110 }, { label: 'Dec', value: 1320 }, { label: 'Jan', value: 1180 }, { label: 'Feb', value: 1240 }, { label: 'Mar', value: 1290 }, { label: 'Apr', value: 1360 }, { label: 'May', value: 1410 }] },
};

// Quick-add presets in the left palette. type:'query' is fully editable
// (population + filters + group-by); type:'static' only switches chart.
const PRESETS = [
  { key: 'm_class', group: 'Membership', label: 'Active members by class', sec: { type: 'query', pop: 'members', filters: { status: 'Active' }, groupBy: 'year', chart: 'bar' } },
  { key: 'm_major', group: 'Membership', label: 'Active members by major', sec: { type: 'query', pop: 'members', filters: { status: 'Active' }, groupBy: 'major', chart: 'hbar' } },
  { key: 'm_rel', group: 'Membership', label: 'Members by relationship', sec: { type: 'query', pop: 'members', filters: {}, groupBy: 'relationship', chart: 'donut' } },
  { key: 'm_church', group: 'Membership', label: 'Members by home church', sec: { type: 'query', pop: 'members', filters: {}, groupBy: 'church', chart: 'hbar' } },
  { key: 'm_state', group: 'Membership', label: 'Members by home state', sec: { type: 'query', pop: 'members', filters: {}, groupBy: 'state', chart: 'hbar' } },
  { key: 'm_cohort', group: 'Membership', label: 'Members by cohort', sec: { type: 'query', pop: 'members', filters: {}, groupBy: 'cohort', chart: 'bar' } },
  { key: 'm_lead', group: 'Membership', label: 'Members by leadership', sec: { type: 'query', pop: 'members', filters: {}, groupBy: 'leadership', chart: 'bar' } },
  { key: 'm_status', group: 'Membership', label: 'Active vs. inactive', sec: { type: 'query', pop: 'members', filters: {}, groupBy: 'status', chart: 'donut' } },
  { key: 's_campus', group: 'Membership', label: 'Members by campus (national)', sec: { type: 'static', preset: 'campus', chart: 'bar' } },
  { key: 's_pipeline', group: 'Pipeline', label: 'Recruitment pipeline', sec: { type: 'static', preset: 'pipeline', chart: 'funnel' } },
  { key: 'a_score', group: 'Pipeline', label: 'Applicants by interview score', sec: { type: 'query', pop: 'applicants', filters: {}, groupBy: 'score', chart: 'bar' } },
  { key: 'a_rec', group: 'Pipeline', label: 'Applicant recommendations', sec: { type: 'query', pop: 'applicants', filters: {}, groupBy: 'recommendation', chart: 'stack100' } },
  { key: 'a_major', group: 'Pipeline', label: 'Applicants by major', sec: { type: 'query', pop: 'applicants', filters: {}, groupBy: 'major', chart: 'hbar' } },
  { key: 'al_grad', group: 'Alumni', label: 'Alumni by graduating class', sec: { type: 'query', pop: 'alumni', filters: {}, groupBy: 'grad', chart: 'bar' } },
  { key: 'al_eng', group: 'Alumni', label: 'Engineering alumni by class', sec: { type: 'query', pop: 'alumni', filters: { major: 'Engineering' }, groupBy: 'grad', chart: 'bar' } },
  { key: 'al_major', group: 'Alumni', label: 'Alumni by major', sec: { type: 'query', pop: 'alumni', filters: {}, groupBy: 'major', chart: 'hbar' } },
  { key: 'al_connect', group: 'Alumni', label: 'Alumni open to connect', sec: { type: 'query', pop: 'alumni', filters: {}, groupBy: 'connect', chart: 'donut' } },
  { key: 'al_marital', group: 'Alumni', label: 'Alumni by relationship', sec: { type: 'query', pop: 'alumni', filters: {}, groupBy: 'marital', chart: 'donut' } },
  { key: 'al_married', group: 'Alumni', label: 'Alumni who are married (count)', sec: { type: 'query', pop: 'alumni', filters: { marital: 'Married' }, groupBy: 'none', chart: 'bar' } },
  { key: 'al_industry', group: 'Alumni', label: 'Alumni by industry', sec: { type: 'query', pop: 'alumni', filters: {}, groupBy: 'industry', chart: 'hbar' } },
  { key: 's_giving', group: 'Giving', label: 'Recurring giving by month', sec: { type: 'static', preset: 'giving', chart: 'line' } },
];

const QUERY_CHARTS = ['bar', 'hbar', 'stack100', 'donut'];

// Run a query section against the records → chart-ready data (or a single count).
function runQuery(sec) {
  const recs = POP[sec.pop].filter((r) => Object.keys(sec.filters).every((k) => !sec.filters[k] || r[k] === sec.filters[k]));
  if (!sec.groupBy || sec.groupBy === 'none') return { single: true, total: recs.length, popTotal: POP[sec.pop].length };
  const field = POP_META[sec.pop].fields.find((f) => f.k === sec.groupBy);
  const counts = {}; field.order.forEach((o) => { counts[o] = 0; });
  recs.forEach((r) => { counts[r[sec.groupBy]] = (counts[r[sec.groupBy]] || 0) + 1; });
  return { data: field.order.map((o) => ({ label: o, value: counts[o] })), matched: recs.length };
}
function sectionData(sec) { return sec.type === 'static' ? { data: STATIC_REPORTS[sec.preset].data, unit: STATIC_REPORTS[sec.preset].unit } : runQuery(sec); }
function sectionCharts(sec) { return sec.type === 'static' ? STATIC_REPORTS[sec.preset].charts : QUERY_CHARTS; }
function sectionGroup(sec) { return sec.type === 'static' ? STATIC_REPORTS[sec.preset].group : POP_META[sec.pop].label; }
function sectionUnit(sec) { return sec.type === 'static' ? STATIC_REPORTS[sec.preset].unit : undefined; }
function activeFilters(sec) { return sec.type === 'query' ? Object.keys(sec.filters).filter((k) => sec.filters[k]).map((k) => sec.filters[k]) : []; }
function sectionTitle(sec) {
  if (sec.type === 'static') return STATIC_REPORTS[sec.preset].title;
  const meta = POP_META[sec.pop], filt = activeFilters(sec);
  const head = meta.label + (filt.length ? ' · ' + filt.join(' · ') : '');
  if (!sec.groupBy || sec.groupBy === 'none') return head + ' · count';
  return head + ' by ' + meta.fields.find((f) => f.k === sec.groupBy).label.toLowerCase();
}

const CHART_LABEL = { bar: 'Columns', hbar: 'Bars', stack100: '100% bar', donut: 'Donut', funnel: 'Funnel', line: 'Line', plot: 'Dot plot' };

// Categorical palette built off the brand accent — consistent, professional.
function reportPalette(accent) {
  return [accent, '#3f7a52', '#bd7526', '#0a86dd', '#454d78', '#a9852f', '#7a2230'];
}

function fmt(v, unit) { return unit === '$' ? '$' + v.toLocaleString() : v.toLocaleString(); }

// ── Chart-type mini icons (for the per-section switcher) ────────────────
function ChartIcon({ kind, color, size = 14 }) {
  const s = { width: size, height: size, display: 'block' };
  const st = { fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'bar') return <svg style={s} viewBox="0 0 16 16"><path d="M2 14h12" {...st}/><rect x="3" y="8" width="2.4" height="4" {...st}/><rect x="6.8" y="5" width="2.4" height="7" {...st}/><rect x="10.6" y="9" width="2.4" height="3" {...st}/></svg>;
  if (kind === 'hbar') return <svg style={s} viewBox="0 0 16 16"><path d="M2.5 2v12" {...st}/><rect x="3" y="3" width="7" height="2.2" {...st}/><rect x="3" y="6.9" width="10" height="2.2" {...st}/><rect x="3" y="10.8" width="5" height="2.2" {...st}/></svg>;
  if (kind === 'stack100') return <svg style={s} viewBox="0 0 16 16"><rect x="2" y="6" width="12" height="4" rx="1" {...st}/><path d="M6.5 6v4M10 6v4" {...st}/></svg>;
  if (kind === 'donut') return <svg style={s} viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" {...st}/><circle cx="8" cy="8" r="2" {...st}/><path d="M8 3v3" {...st}/></svg>;
  if (kind === 'funnel') return <svg style={s} viewBox="0 0 16 16"><path d="M2.5 3h11l-3.2 4v4l-2.6 2v-6L2.5 3z" {...st}/></svg>;
  if (kind === 'line') return <svg style={s} viewBox="0 0 16 16"><path d="M2 14h12" {...st}/><path d="M3 11l3-3 2.5 1.5L13 4" {...st}/></svg>;
  if (kind === 'plot') return <svg style={s} viewBox="0 0 16 16"><path d="M2.5 2v12h12" {...st}/><circle cx="6" cy="9" r="1.1" {...st}/><circle cx="9" cy="6" r="1.1" {...st}/><circle cx="12" cy="8" r="1.1" {...st}/></svg>;
  return null;
}

// ════════════════════════════════════════════════════════════════════════
// CHARTS — light SVG, data-driven. ink/sub/line are paper colors.
// ════════════════════════════════════════════════════════════════════════
const PAPER = { ink: '#1d2330', sub: '#5d6577', faint: '#9098a6', line: '#e2e5ec', grid: '#eef0f4' };

function BarChart({ data, pal, unit }) {
  const W = 480, H = 230, padL = 16, padR = 16, padT = 22, padB = 40;
  const max = Math.max(...data.map((d) => d.value)) * 1.12 || 1;
  const plotW = W - padL - padR, plotH = H - padT - padB, base = padT + plotH;
  const step = plotW / data.length, bw = Math.min(54, step * 0.56);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', fontFamily: UI }}>
      {[0, 0.25, 0.5, 0.75, 1].map((g, i) => { const y = padT + plotH * (1 - g); return <line key={i} x1={padL} y1={y} x2={W - padR} y2={y} stroke={PAPER.grid} strokeWidth="1" />; })}
      <line x1={padL} y1={base} x2={W - padR} y2={base} stroke={PAPER.line} strokeWidth="1.4" />
      {data.map((d, i) => {
        const h = (d.value / max) * plotH, x = padL + step * i + (step - bw) / 2, y = base - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={h} rx="3" fill={pal[i % pal.length]} />
            <text x={x + bw / 2} y={y - 7} textAnchor="middle" fontSize="12" fontWeight="700" fill={PAPER.ink}>{fmt(d.value, unit)}</text>
            <text x={x + bw / 2} y={base + 18} textAnchor="middle" fontSize="10.5" fill={PAPER.sub}>{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function HBarChart({ data, pal, unit }) {
  const W = 480, rowH = 34, padT = 8, labelW = 132, valW = 44;
  const H = padT * 2 + data.length * rowH;
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const barX = labelW + 6, barMax = W - barX - valW;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', fontFamily: UI }}>
      {data.map((d, i) => {
        const y = padT + i * rowH, w = (d.value / max) * barMax;
        return (
          <g key={i}>
            <text x={labelW} y={y + rowH / 2} textAnchor="end" dominantBaseline="middle" fontSize="11.5" fill={PAPER.ink}>{d.label}</text>
            <rect x={barX} y={y + 7} width={barMax} height={rowH - 16} rx="4" fill={PAPER.grid} />
            <rect x={barX} y={y + 7} width={Math.max(3, w)} height={rowH - 16} rx="4" fill={pal[i % pal.length]} />
            <text x={W - valW + 8} y={y + rowH / 2} dominantBaseline="middle" fontSize="11.5" fontWeight="700" fill={PAPER.ink}>{fmt(d.value, unit)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Stack100({ data, pal, unit }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const segs = data.map((d, i) => { const pct = d.value / total; const seg = { ...d, pct, x: acc, color: pal[i % pal.length] }; acc += pct; return seg; });
  return (
    <div style={{ fontFamily: UI }}>
      <div style={{ display: 'flex', width: '100%', height: 38, borderRadius: 7, overflow: 'hidden', border: `1px solid ${PAPER.line}` }}>
        {segs.map((s, i) => (
          <div key={i} title={`${s.label} ${Math.round(s.pct * 100)}%`} style={{ width: `${s.pct * 100}%`, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {s.pct > 0.07 && <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{Math.round(s.pct * 100)}%</span>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', marginTop: 14 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: PAPER.ink, fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: 11.5, color: PAPER.sub }}>{Math.round(s.pct * 100)}% · {fmt(s.value, unit)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Donut({ data, pal, unit }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 92, cy = 100, r = 66, sw = 30;
  let a0 = -Math.PI / 2;
  const arcs = data.map((d, i) => {
    const frac = d.value / total, a1 = a0 + frac * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const seg = { d: `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`, color: pal[i % pal.length], frac, item: d };
    a0 = a1; return seg;
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: UI, flexWrap: 'wrap' }}>
      <svg viewBox="0 0 184 200" width="184" style={{ flexShrink: 0 }}>
        {arcs.map((s, i) => <path key={i} d={s.d} stroke={s.color} strokeWidth={sw} fill="none" strokeLinecap="butt" />)}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="26" fontWeight="700" fill={PAPER.ink} fontFamily={SERIF}>{total}</text>
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize="10.5" fill={PAPER.faint}>total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: pal[i % pal.length], flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: PAPER.ink, fontWeight: 600 }}>{d.label}</span>
            <span style={{ fontSize: 12, color: PAPER.sub }}>{Math.round((d.value / total) * 100)}% · {fmt(d.value, unit)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Funnel({ data, pal, unit }) {
  const W = 480, rowH = 40, gap = 8, padT = 6;
  const H = padT + data.length * (rowH + gap);
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', fontFamily: UI }}>
      {data.map((d, i) => {
        const w = (d.value / max) * W, x = (W - w) / 2, y = padT + i * (rowH + gap);
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={rowH} rx="5" fill={pal[i % pal.length]} />
            <text x={W / 2} y={y + rowH / 2 - 4} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="700" fill="#fff">{d.label}</text>
            <text x={W / 2} y={y + rowH / 2 + 11} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="rgba(255,255,255,.85)">{fmt(d.value, unit)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, pal, unit }) {
  const W = 480, H = 230, padL = 40, padR = 14, padT = 18, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB, base = padT + plotH;
  const max = Math.max(...data.map((d) => d.value)) * 1.1 || 1;
  const xs = (i) => padL + (plotW / (data.length - 1)) * i;
  const ys = (v) => padT + plotH * (1 - v / max);
  const pts = data.map((d, i) => `${xs(i)},${ys(d.value)}`).join(' ');
  const area = `${padL},${base} ${pts} ${xs(data.length - 1)},${base}`;
  const accent = pal[0];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', fontFamily: UI }}>
      {[0, 0.5, 1].map((g, i) => { const y = padT + plotH * (1 - g); return <g key={i}><line x1={padL} y1={y} x2={W - padR} y2={y} stroke={PAPER.grid} strokeWidth="1" /><text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9.5" fill={PAPER.faint}>{fmt(Math.round(max * g), unit)}</text></g>; })}
      <polygon points={area} fill={accent} opacity="0.08" />
      <polyline points={pts} fill="none" stroke={accent} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => <circle key={i} cx={xs(i)} cy={ys(d.value)} r="3.4" fill="#fff" stroke={accent} strokeWidth="2" />)}
      {data.map((d, i) => <text key={i} x={xs(i)} y={base + 18} textAnchor="middle" fontSize="10" fill={PAPER.sub}>{d.label}</text>)}
    </svg>
  );
}

function DotPlot({ data, pal, unit }) {
  const W = 480, padL = 16, padR = 16, padT = 14, padB = 36, colTop = padT;
  const dotR = 6, dotGap = 4;
  const maxV = Math.max(...data.map((d) => d.value));
  const colH = maxV * (dotR * 2 + dotGap);
  const H = colTop + colH + padB;
  const step = (W - padL - padR) / data.length;
  const base = colTop + colH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', fontFamily: UI }}>
      <line x1={padL} y1={base + 6} x2={W - padR} y2={base + 6} stroke={PAPER.line} strokeWidth="1.4" />
      {data.map((d, i) => {
        const cx = padL + step * i + step / 2;
        const dots = [];
        for (let k = 0; k < d.value; k++) { const cy = base - dotR - k * (dotR * 2 + dotGap); dots.push(<circle key={k} cx={cx} cy={cy} r={dotR} fill={pal[i % pal.length]} />); }
        return (
          <g key={i}>
            {dots}
            <text x={cx} y={base + 22} textAnchor="middle" fontSize="10.5" fill={PAPER.sub}>{d.label}</text>
            <text x={cx} y={colTop - 0} textAnchor="middle" fontSize="11" fontWeight="700" fill={PAPER.ink}>{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Chart({ kind, data, pal, unit }) {
  if (kind === 'bar') return <BarChart data={data} pal={pal} unit={unit} />;
  if (kind === 'hbar') return <HBarChart data={data} pal={pal} unit={unit} />;
  if (kind === 'stack100') return <Stack100 data={data} pal={pal} unit={unit} />;
  if (kind === 'donut') return <Donut data={data} pal={pal} unit={unit} />;
  if (kind === 'funnel') return <Funnel data={data} pal={pal} unit={unit} />;
  if (kind === 'line') return <LineChart data={data} pal={pal} unit={unit} />;
  if (kind === 'plot') return <DotPlot data={data} pal={pal} unit={unit} />;
  return null;
}

// Headline KPI helpers — the editable figures atop the report.
let __kpiId = 0;
const mkKpi = (label, value) => ({ id: ++__kpiId, label, value: String(value) });
function defaultKpis() { return [mkKpi('Active members', 42), mkKpi('Candidates', 6), mkKpi('Applicants', 25), mkKpi('Alumni', 18)]; }
function countBy(pop, field, filters) { const recs = POP[pop].filter((r) => Object.keys(filters || {}).every((k) => !filters[k] || r[k] === filters[k])); const meta = POP_META[pop].fields.find((f) => f.k === field); return meta.order.map((o) => mkKpi(o, recs.filter((r) => r[field] === o).length)); }
const KPI_SOURCES = [
  { key: 'default', label: 'Pipeline (default)' },
  { key: 'mclass', label: 'Active members by class', pop: 'members', field: 'year', filters: { status: 'Active' } },
  { key: 'mmajor', label: 'Active members by major', pop: 'members', field: 'major', filters: { status: 'Active' } },
  { key: 'mrel', label: 'Members by relationship', pop: 'members', field: 'relationship' },
  { key: 'algrad', label: 'Alumni by graduating class', pop: 'alumni', field: 'grad' },
  { key: 'arec', label: 'Applicant recommendations', pop: 'applicants', field: 'recommendation' },
];
function kpisFromSource(key) { const s = KPI_SOURCES.find((x) => x.key === key); if (!s || s.key === 'default') return defaultKpis(); return countBy(s.pop, s.field, s.filters); }

// A one-line insight caption derived from a section's computed result.
function sectionInsight(sec, res) {
  if (sec.type === 'static') {
    if (sec.preset === 'giving') { const d = res.data, last = d[d.length - 1].value, first = d[0].value; return `Recurring giving is up ${Math.round((last - first) / first * 100)}% since September, now $${last.toLocaleString()}/mo.`; }
    if (sec.preset === 'pipeline') return '25 applicants this cycle narrow to 6 candidates — selective and healthy.';
    const tot = res.data.reduce((s, d) => s + d.value, 0), top = res.data.reduce((a, b) => (b.value > a.value ? b : a), res.data[0]);
    return `${top.label} leads at ${Math.round(top.value / tot * 100)}% (${top.value} of ${tot}).`;
  }
  const meta = POP_META[sec.pop], filt = activeFilters(sec);
  const who = (filt.length ? filt.join(', ') + ' ' : '') + meta.label.toLowerCase();
  if (res.single) { const pct = Math.round(res.total / res.popTotal * 100); return `${res.total} of ${res.popTotal} ${meta.label.toLowerCase()} match${filt.length ? ' (' + filt.join(', ') + ')' : ''} — ${pct}%.`; }
  const total = res.data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return `No ${who} match the current filters.`;
  const top = res.data.reduce((a, b) => (b.value > a.value ? b : a), res.data[0]);
  return `${top.label} is the largest group of ${who} at ${Math.round(top.value / total * 100)}% (${top.value} of ${total}).`;
}

// ════════════════════════════════════════════════════════════════════════
// REPORT BUILDER
// ════════════════════════════════════════════════════════════════════════
let __secId = 0;
function makeSec(presetKey) { const p = PRESETS.find((x) => x.key === presetKey); return { id: ++__secId, ...JSON.parse(JSON.stringify(p.sec)) }; }

function ReportBuilder({ theme: appTheme, role = 'Campus Director' }) {
  const t = appTheme; // app chrome uses the live theme (incl. dark)
  const paperAccent = getTheme(t.key, false).accent; // report paper always light
  const pal = reportPalette(paperAccent);
  const w = useViewport();
  const narrow = w < BP.tab;

  const [title, setTitle] = React.useState('Chapter Health Report');
  const [subtitle, setSubtitle] = React.useState('UNC Charlotte · Spring 2026');
  const [sections, setSections] = React.useState(() => [makeSec('m_class'), makeSec('al_eng'), makeSec('s_pipeline')]);
  const [editId, setEditId] = React.useState(null);
  const [kpis, setKpis] = React.useState(defaultKpis);
  const setKpi = (id, field, val) => setKpis((k) => k.map((x) => (x.id === id ? { ...x, [field]: val } : x)));
  const addKpi = () => setKpis((k) => [...k, mkKpi('New figure', '')]);
  const removeKpi = (id) => setKpis((k) => k.filter((x) => x.id !== id));

  const usedCount = (pk) => { const p = PRESETS.find((x) => x.key === pk); return sections.filter((s) => sectionTitle(s) === sectionTitle({ id: 0, ...p.sec })).length; };
  const addPreset = (pk) => { const ns = makeSec(pk); setSections((s) => [...s, ns]); if (PRESETS.find((x) => x.key === pk).sec.type === 'query') setEditId(ns.id); };
  const removeSection = (id) => setSections((s) => s.filter((x) => x.id !== id));
  const setChart = (id, c) => setSections((s) => s.map((x) => (x.id === id ? { ...x, chart: c } : x)));
  const patch = (id, fn) => setSections((s) => s.map((x) => (x.id === id ? fn(x) : x)));
  const setPop = (id, pop) => patch(id, (x) => ({ ...x, pop, filters: {}, groupBy: POP_META[pop].fields[0].k, chart: 'bar' }));
  const setGroupBy = (id, gb) => patch(id, (x) => ({ ...x, groupBy: gb, chart: gb === 'none' ? x.chart : (sectionCharts(x).includes(x.chart) ? x.chart : 'bar') }));
  const setFilter = (id, field, val) => patch(id, (x) => { const f = { ...x.filters }; if (val) f[field] = val; else delete f[field]; return { ...x, filters: f }; });
  const move = (id, dir) => setSections((s) => { const i = s.findIndex((x) => x.id === id); const j = i + dir; if (j < 0 || j >= s.length) return s; const n = [...s]; const [it] = n.splice(i, 1); n.splice(j, 0, it); return n; });

  const groups = {};
  PRESETS.forEach((p) => { (groups[p.group] = groups[p.group] || []).push(p); });

  const lbl = { fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, margin: '0 0 10px' };
  const ctrlBtn = { width: 26, height: 26, borderRadius: 7, border: `1px solid ${PAPER.line}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 };
  const sel = { fontFamily: UI, fontSize: 12, color: PAPER.ink, background: '#fff', border: `1px solid ${PAPER.line}`, borderRadius: 7, padding: '6px 8px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const microLbl = { fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: PAPER.faint, marginBottom: 4 };

  // ── Left rail: settings + data palette ────────────────────────────────
  const rail = (
    <div className="no-print" style={{ width: narrow ? '100%' : 300, flexShrink: 0, borderRight: narrow ? 'none' : `1px solid ${t.chromeLine || t.line}`, borderBottom: narrow ? `1px solid ${t.chromeLine || t.line}` : 'none', background: t.chrome || t.bg, padding: '18px 18px', overflowY: narrow ? 'visible' : 'auto' }}>
      <div style={lbl}>Report details</div>
      <div style={{ marginBottom: 8 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Report title"
          style={{ width: '100%', fontFamily: SERIF, fontSize: 17, color: t.ink, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 9, padding: '9px 11px', outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Scope / term"
        style={{ width: '100%', fontFamily: UI, fontSize: 12.5, color: t.sub, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 9, padding: '8px 11px', outline: 'none', boxSizing: 'border-box', marginBottom: 22 }} />

      <div style={lbl}>Headline figures</div>
      <div style={{ fontSize: 11.5, color: t.faint, lineHeight: 1.45, margin: '-4px 0 10px' }}>The figures across the top of the report. Edit them, add your own, or fill from data.</div>
      <select onChange={(e) => { if (e.target.value) { setKpis(kpisFromSource(e.target.value)); e.target.value = ''; } }} defaultValue="" style={{ width: '100%', fontFamily: UI, fontSize: 12, color: t.sub, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 8, padding: '8px 10px', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}>
        <option value="">Fill from data…</option>
        {KPI_SOURCES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
      </select>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 10 }}>
        {kpis.map((k) => (
          <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input value={k.label} onChange={(e) => setKpi(k.id, 'label', e.target.value)} placeholder="Label" style={{ flex: 1, minWidth: 0, fontFamily: UI, fontSize: 12, color: t.ink, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 7, padding: '7px 9px', outline: 'none' }} />
            <input value={k.value} onChange={(e) => setKpi(k.id, 'value', e.target.value)} placeholder="Value" style={{ width: 58, flexShrink: 0, fontFamily: UI, fontSize: 12, fontWeight: 700, color: t.ink, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 7, padding: '7px 8px', outline: 'none', boxSizing: 'border-box' }} />
            <span onClick={() => removeKpi(k.id)} title="Remove" style={{ width: 26, height: 26, borderRadius: 7, border: `1px solid ${t.line}`, background: t.bg, color: t.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round"/></svg>
            </span>
          </div>
        ))}
      </div>
      <button onClick={addKpi} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center', fontFamily: UI, fontSize: 12, fontWeight: 600, padding: '8px', borderRadius: 8, border: `1px dashed ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer', marginBottom: 22 }}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 2.5v9M2.5 7h9" strokeLinecap="round"/></svg>Add figure
      </button>

      <div style={lbl}>Add data</div>
      <div style={{ fontSize: 11.5, color: t.faint, lineHeight: 1.45, margin: '-4px 0 13px' }}>Click to add a section, then hit <b style={{ color: t.sub }}>Edit</b> on it to filter and group exactly how you want.</div>
      {Object.keys(groups).map((g) => (
        <div key={g} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint, marginBottom: 7 }}>{g}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {groups[g].map((p) => (
              <div key={p.key} onClick={() => addPreset(p.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 10, cursor: 'pointer', background: t.bg, border: `1px solid ${t.line}` }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChartIcon kind={p.sec.chart} color={t.accent} />
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, color: t.ink }}>{p.label}</span>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.8"><path d="M7 2.5v9M2.5 7h9" strokeLinecap="round"/></svg>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Per-section editor (filter + group-by) — query sections only ──────
  const Editor = ({ s }) => {
    const meta = POP_META[s.pop];
    return (
      <div className="no-print" style={{ margin: '0 0 16px', padding: '14px 15px', background: '#f7f8fa', border: `1px solid ${PAPER.line}`, borderRadius: 10 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 13 }}>
          <div style={{ minWidth: 200 }}>
            <div style={microLbl}>Population</div>
            <div style={{ display: 'flex', gap: 3, padding: 3, background: '#fff', borderRadius: 8, border: `1px solid ${PAPER.line}` }}>
              {['members', 'alumni', 'applicants'].map((pp) => {
                const on = pp === s.pop;
                return <span key={pp} onClick={() => setPop(s.id, pp)} style={{ flex: 1, textAlign: 'center', padding: '6px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', background: on ? paperAccent : 'transparent', color: on ? '#fff' : PAPER.sub }}>{POP_META[pp].label}</span>;
              })}
            </div>
          </div>
          <div style={{ minWidth: 180, flex: 1 }}>
            <div style={microLbl}>Break down by</div>
            <select value={s.groupBy} onChange={(e) => setGroupBy(s.id, e.target.value)} style={sel}>
              {meta.fields.map((f) => <option key={f.k} value={f.k}>{f.label}</option>)}
              <option value="none">Total (count only)</option>
            </select>
          </div>
        </div>
        <div style={microLbl}>Filters</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 9 }}>
          {meta.fields.map((f) => (
            <div key={f.k}>
              <div style={{ fontSize: 10.5, color: PAPER.sub, marginBottom: 3 }}>{f.label}</div>
              <select value={s.filters[f.k] || ''} onChange={(e) => setFilter(s.id, f.k, e.target.value)} style={{ ...sel, borderColor: s.filters[f.k] ? paperAccent : PAPER.line }}>
                <option value="">All</option>
                {f.order.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Section block on the paper ────────────────────────────────────────
  const SectionBlock = ({ s }) => {
    const res = sectionData(s);
    const charts = sectionCharts(s);
    const editing = editId === s.id;
    const empty = !res.single && res.data.reduce((a, d) => a + d.value, 0) === 0;
    return (
      <div style={{ breakInside: 'avoid', marginBottom: 26, border: `1px solid ${PAPER.line}`, borderRadius: 10, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: PAPER.faint }}>{sectionGroup(s)}</div>
            <div style={{ fontFamily: SERIF, fontSize: 17, color: PAPER.ink, marginTop: 2 }}>{sectionTitle(s)}</div>
          </div>
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {!res.single && (
              <div style={{ display: 'flex', gap: 2, padding: 3, background: '#f4f5f8', borderRadius: 8, border: `1px solid ${PAPER.line}` }}>
                {charts.map((c) => {
                  const on = c === s.chart;
                  return <span key={c} title={CHART_LABEL[c]} onClick={() => setChart(s.id, c)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 24, borderRadius: 6, cursor: 'pointer', background: on ? '#fff' : 'transparent', boxShadow: on ? '0 1px 2px rgba(0,0,0,.12)' : 'none' }}><ChartIcon kind={c} color={on ? paperAccent : PAPER.faint} /></span>;
                })}
              </div>
            )}
            {s.type === 'query' && <span onClick={() => setEditId(editing ? null : s.id)} title="Edit data" style={{ ...ctrlBtn, width: 'auto', padding: '0 9px', gap: 5, background: editing ? paperAccent : '#fff', color: editing ? '#fff' : PAPER.sub, borderColor: editing ? paperAccent : PAPER.line, display: 'inline-flex', fontSize: 11.5, fontWeight: 700 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 2.5l2.5 2.5-6.5 6.5L2.5 12l.5-2.5z" strokeLinejoin="round"/></svg>Edit
            </span>}
            <span onClick={() => move(s.id, -1)} title="Move up" style={ctrlBtn}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={PAPER.sub} strokeWidth="1.7"><path d="M6 9V3M3 6l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <span onClick={() => move(s.id, 1)} title="Move down" style={ctrlBtn}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={PAPER.sub} strokeWidth="1.7"><path d="M6 3v6M3 6l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <span onClick={() => removeSection(s.id)} title="Remove" style={ctrlBtn}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#b3402f" strokeWidth="1.7"><path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round"/></svg></span>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: PAPER.sub, lineHeight: 1.5, margin: '2px 0 14px', maxWidth: 560 }}>{sectionInsight(s, res)}</div>
        {editing && s.type === 'query' && <Editor s={s} />}
        {res.single ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 2px 4px' }}>
            <span style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1, color: paperAccent }}>{res.total}</span>
            <span style={{ fontSize: 13, color: PAPER.sub }}>of {res.popTotal} {POP_META[s.pop].label.toLowerCase()}{activeFilters(s).length ? ` · ${activeFilters(s).join(' · ')}` : ''}</span>
          </div>
        ) : empty ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', fontSize: 12.5, color: PAPER.faint, border: `1px dashed ${PAPER.line}`, borderRadius: 8 }}>No records match these filters.</div>
        ) : <Chart kind={s.chart} data={res.data} pal={pal} unit={sectionUnit(s)} />}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <div className="no-print"><TopBar t={t} section="directory" /></div>
      <div className="no-print">
        <SubBar t={t} crumbs={['Directory', 'Report builder']}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn t={t} kind="ghost" label="Print" onClick={() => window.print()} icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 5V1.5h6V5M4 10.5H2.5v-4h9v4H10M4 8.5h6v4H4z" strokeLinejoin="round"/></svg>} />
            <Btn t={t} kind="primary" label="Export PDF" onClick={() => window.print()} icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 9V2.5M4.2 6.3L7 9l2.8-2.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 11.5h9" strokeLinecap="round"/></svg>} />
          </div>
        </SubBar>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: narrow ? 'column' : 'row', minHeight: narrow ? 'auto' : 0 }}>
        {rail}
        {/* paper canvas */}
        <div style={{ flex: 1, minWidth: 0, overflowY: narrow ? 'visible' : 'auto', background: t.panel, padding: narrow ? '16px' : '28px 30px' }}>
          <div className="report-print-root" style={{ maxWidth: 760, margin: '0 auto', background: '#fff', color: PAPER.ink, borderRadius: 6, boxShadow: '0 1px 0 rgba(0,0,0,.04), 0 18px 44px rgba(15,20,32,.13)', padding: '40px 46px' }}>
            {/* letterhead */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottom: `2px solid ${PAPER.ink}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ minWidth: 44, height: 40, padding: '0 11px 0 13px', boxSizing: 'border-box', borderRadius: 8, background: PAPER.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 17, letterSpacing: 1.5 }}>ΦΣΛ</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.1 }}>Phi Sigma Lambda</div>
                  <div style={{ fontSize: 10.5, color: PAPER.faint, marginTop: 1 }}>UNC Charlotte Chapter</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: PAPER.faint }}>Generated</div>
                <div style={{ fontSize: 11, color: PAPER.sub, marginTop: 3 }}>Jun 26, 2026</div>
                <div style={{ fontSize: 9.5, color: PAPER.faint, marginTop: 1 }}>by Jordan Tate</div>
              </div>
            </div>

            {/* title */}
            <div style={{ margin: '22px 0 18px' }}>
              <div style={{ fontFamily: SERIF, fontSize: 29, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.08 }}>{title || 'Untitled report'}</div>
              <div style={{ fontSize: 12, color: PAPER.faint, marginTop: 6 }}>{subtitle}</div>
            </div>

            {/* KPI strip — editable headline figures */}
            {kpis.length > 0 && <div style={{ display: 'flex', border: `1px solid ${PAPER.line}`, borderRadius: 10, overflow: 'hidden', marginBottom: 26, breakInside: 'avoid' }}>
              {kpis.map((k, i) => (
                <div key={k.id} style={{ flex: 1, minWidth: 0, padding: '13px 16px', borderLeft: i ? `1px solid ${PAPER.line}` : 'none' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: PAPER.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.label}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 25, color: PAPER.ink, marginTop: 4, lineHeight: 1.05, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.value}</div>
                </div>
              ))}
            </div>}

            {/* sections */}
            {sections.length === 0 ? (
              <div className="no-print" style={{ padding: '50px 20px', textAlign: 'center', border: `1.5px dashed ${PAPER.line}`, borderRadius: 12, color: PAPER.faint }}>
                <div style={{ fontFamily: SERIF, fontSize: 18, color: PAPER.sub }}>Empty report</div>
                <div style={{ fontSize: 12.5, marginTop: 6 }}>Add data from the left to start building.</div>
              </div>
            ) : sections.map((s) => <SectionBlock key={s.id} s={s} />)}

            {/* footer */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${PAPER.line}`, display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: PAPER.faint }}>
              <span>Confidential · For chapter leadership use only</span>
              <span>Phi Sigma Lambda · UNC Charlotte</span>
            </div>
          </div>
          <div className="no-print" style={{ maxWidth: 760, margin: '14px auto 30px', fontSize: 11.5, color: t.faint, textAlign: 'center' }}>
            This is the printable report. Use <b style={{ color: t.sub }}>Export PDF</b> (or your browser's Save as PDF) — on-page controls are hidden in the export.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReportBuilder });
