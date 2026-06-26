// kit.jsx — shared design tokens, mock data, and UI atoms for the
// Phi Sigma Lambda CRM exploration. Everything is exported to window so the
// other babel scripts (cards / directory / app) can use the bare names.

// ── Type ────────────────────────────────────────────────────────────────
// One coherent system across all directions:
//   • UI / data  → Hanken Grotesk (clean, warm grotesque — not Inter slop)
//   • Names / display → Newsreader (refined serif → collegiate warmth)
//   • Micro-labels → letter-spaced uppercase Hanken
const UI = "'Hanken Grotesk', system-ui, sans-serif";
const SERIF = "'Newsreader', Georgia, serif";

// ── Color directions ──────────────────────────────────────────────────────
// Three brand themes to compare. Neutral SaaS canvas; the accent is the only
// strongly-saturated color. Status semantics (stage tags) are SHARED across
// themes so they always read the same.
const THEMES = {
  navy: {
    key: 'navy', name: 'Heritage Navy',
    ink: '#1a2233', sub: '#5d6577', faint: '#8b91a0',
    bg: '#ffffff', panel: '#f6f7f9', panel2: '#eef0f4', line: '#e4e7ec',
    chrome: '#eceff5', chromeLine: '#d8deea', chromeInk: '#2a3550', groupBg: '#e4eaf6', groupInk: '#2c4178',
    accent: '#22386b', accentDeep: '#16264c', accentSoft: '#eef1f8', onAccent: '#ffffff',
    gold: '#a9852f',
  },
  evergreen: {
    key: 'evergreen', name: 'Evergreen & Cream',
    ink: '#1d2a25', sub: '#586860', faint: '#8a978f',
    bg: '#ffffff', panel: '#f4f6f3', panel2: '#e9efe9', line: '#e0e6e0',
    chrome: '#e8efe9', chromeLine: '#d4ded6', groupBg: '#e1ece4', groupInk: '#1f4f3f',
    accent: '#1f4f3f', accentDeep: '#143a2d', accentSoft: '#ecf3ef', onAccent: '#ffffff',
    gold: '#b08433',
  },
  maroon: {
    key: 'maroon', name: 'Maroon & Stone',
    ink: '#2a2020', sub: '#6b5d5d', faint: '#9a8e8e',
    bg: '#ffffff', panel: '#f7f4f3', panel2: '#efe8e7', line: '#e8e0df',
    chrome: '#f1e9e8', chromeLine: '#e2d5d4', groupBg: '#f0e1e2', groupInk: '#7a2230',
    accent: '#7a2230', accentDeep: '#5c1822', accentSoft: '#f6edee', onAccent: '#ffffff',
    gold: '#a9842f',
  },
};

// Journey-stage tags — shared, semantic. Light + dark variants so the chips
// stay legible against either surface.
// Each of the four journey stages owns a distinct hue so leaders read the
// pipeline at a glance:  Applicant → Amber · Candidate → Azure ·
// Member → Green · Alumni → Steel.
// `solid` is the banner-strength fill (the user's chosen hue, tuned so white
// banner text stays legible); `fg`/`bg` are the chip text + soft tint.
const STAGES = {
  applicant: { label: 'Applicant', solid: '#bd7526', fg: '#a3641f', bg: '#f6ead8' },
  candidate: { label: 'Candidate', solid: '#0a86dd', fg: '#0080d8', bg: '#e0eefc' },
  member:    { label: 'Active Member', solid: '#3f7a52', fg: '#3f7a52', bg: '#e6f1ea' },
  alumni:    { label: 'Alumni', solid: '#454d78', fg: '#454d78', bg: '#eaebf4' },
};
const STAGES_DARK = {
  applicant: { label: 'Applicant', solid: '#bd7526', fg: '#dca460', bg: 'rgba(192,121,42,.20)' },
  candidate: { label: 'Candidate', solid: '#0a86dd', fg: '#5bb4ff', bg: 'rgba(0,151,255,.18)' },
  member:    { label: 'Active Member', solid: '#3f7a52', fg: '#6fb78a', bg: 'rgba(63,122,82,.24)' },
  alumni:    { label: 'Alumni', solid: '#454d78', fg: '#9aa0cf', bg: 'rgba(69,77,120,.30)' },
};

// Dark counterparts of the three brand directions. Built on a neutral slate-
// gray base — a midpoint between near-black and mid-gray (#2E313B is the main
// content surface) for comfortable, legible contrast; chrome sits darkest, the
// app void one step down, raised fills one step up. Brand accent + soft tint
// are the only per-direction colors.
const DARK_NEUTRALS = {
  ink: '#f1f2f6', sub: '#c2c6cf', faint: '#9095a1',
  bg: '#2e313b', panel: '#25272f', panel2: '#3a3d48', line: '#43464f',
  chrome: '#1c1e24', chromeLine: '#383b44', chromeInk: '#e6e8ee', groupBg: '#2a2c35',
  onAccent: '#ffffff', gold: '#cba959',
};
const THEMES_DARK = {
  navy: {
    key: 'navy', name: 'Heritage Navy', ...DARK_NEUTRALS,
    groupInk: '#9fb3e6',
    accent: '#6885d2', accentDeep: '#3f5aa8', accentSoft: '#2c3347',
  },
  evergreen: {
    key: 'evergreen', name: 'Evergreen & Cream', ...DARK_NEUTRALS,
    groupInk: '#7ec79f',
    accent: '#4cb084', accentDeep: '#2c7657', accentSoft: '#283a33',
  },
  maroon: {
    key: 'maroon', name: 'Maroon & Stone', ...DARK_NEUTRALS,
    groupInk: '#e09aa4',
    accent: '#d2616f', accentDeep: '#9e3343', accentSoft: '#3b2b30',
  },
};

// Attach the right stage palette to every theme, then expose a resolver.
Object.values(THEMES).forEach((t) => { t.stages = STAGES; t.dark = false; if (!t.chromeInk) t.chromeInk = t.ink; });
Object.values(THEMES_DARK).forEach((t) => { t.stages = STAGES_DARK; t.dark = true; if (!t.chromeInk) t.chromeInk = t.ink; });
function getTheme(key, dark) { return (dark ? THEMES_DARK : THEMES)[key] || THEMES.navy; }

// ── Mock data ───────────────────────────────────────────────────────────
// The hero profile — the card that travels Apply → Alumni.
const PROFILE = {
  first: 'Marcus', last: 'Bellamy', middle: 'J.',
  stage: 'member',
  phone: '(704) 555-0182',
  email: 'marcus.bellamy@gmail.com',
  address: '412 Catawba Ave, Charlotte, NC 28206',
  birthday: 'March 9, 2004',
  church: 'Forest Hill Church',
  school: 'UNC Charlotte',
  year: 'Junior',
  major: 'Mechanical Engineering',
  minor: 'Biblical Studies',
  employer: 'Summer Intern · Duke Energy',
  relationship: 'Single',
  hometown: 'Asheville, NC',
  cohort: 'Fall 2024 Cohort',
  campus: 'UNC Charlotte',
  memberId: 'PSL-0418',
  // Leadership & service history — current offices ride with the card; past
  // ones become permanent historic labels. Stays with the profile Member→Alum.
  roles: [
    { title: 'Service Chair', term: '2025–26', current: true },
    { title: 'Formation Mentor', term: '2024–25', current: false },
  ],
  // Permanent record — the immutable artifacts that travel with the profile
  // forever (openable, read-only). Living engagement (prayer, calls, follow-ups)
  // lives in the right-hand workspace, not here, so nothing is duplicated.
  cards: [
    { k: 'application', label: 'Application', meta: 'Submitted Aug 2024' },
    { k: 'scorecard', label: 'Interview Scorecard', meta: '8.6 avg · locked' },
    { k: 'testing', label: 'Candidacy Testing', meta: '5 / 6 modules' },
    { k: 'certs', label: 'Certifications', meta: '3 active' },
    { k: 'milestones', label: 'Milestones', meta: '11 events' },
  ],
};

// Roster for the directory. stage: candidate|member|alumni; status active/inactive.
const ROSTER = [
  { f: 'Eli', l: 'Navarro', year: 'Freshman', stage: 'candidate', status: 'active', major: 'Computer Science', town: 'Raleigh, NC', church: 'The Summit Church', cohort: 'Fall 2025' },
  { f: 'Jordan', l: 'Pace', year: 'Freshman', stage: 'candidate', status: 'active', major: 'Business Admin', town: 'Durham, NC', church: 'The Summit Church', cohort: 'Fall 2025' },
  { f: 'Caleb', l: 'Whitfield', year: 'Sophomore', stage: 'member', status: 'active', major: 'Mechanical Engineering', town: 'Greensboro, NC', church: 'Mercy Hill', cohort: 'Fall 2024', roles: [{ title: 'Recruitment Chair', term: '2025–26', current: true }] },
  { f: 'Marcus', l: 'Bellamy', year: 'Junior', stage: 'member', status: 'active', major: 'Mechanical Engineering', town: 'Asheville, NC', church: 'Forest Hill Church', cohort: 'Fall 2024', roles: [{ title: 'Service Chair', term: '2025–26', current: true }, { title: 'Formation Mentor', term: '2024–25', current: false }] },
  { f: 'Anthony', l: 'Reyes', year: 'Junior', stage: 'member', status: 'active', major: 'Electrical Engineering', town: 'Charlotte, NC', church: 'Forest Hill Church', cohort: 'Fall 2024', roles: [{ title: 'Formation Chair', term: '2025–26', current: true }] },
  { f: 'Sam', l: 'Okafor', year: 'Junior', stage: 'member', status: 'inactive', major: 'Civil Engineering', town: 'Charlotte, NC', church: 'Elevation Church', cohort: 'Fall 2024' },
  { f: 'Tyler', l: 'Brooks', year: 'Senior', stage: 'member', status: 'active', major: 'Finance', town: 'Wilmington, NC', church: 'Port City Community', cohort: 'Spring 2024', roles: [{ title: 'President', term: '2025–26', current: true }, { title: 'Treasurer', term: '2024–25', current: false }] },
  { f: 'Devon', l: 'Hayes', year: 'Senior', stage: 'member', status: 'active', major: 'Biblical Studies', town: 'Charlotte, NC', church: 'Forest Hill Church', cohort: 'Spring 2024', roles: [{ title: 'Chaplain', term: '2025–26', current: true }, { title: 'Service Chair', term: '2024–25', current: false }] },
  { f: 'Isaiah', l: 'Cole', year: 'Senior', stage: 'member', status: 'inactive', major: 'Computer Science', town: 'Concord, NC', church: 'Elevation Church', cohort: 'Spring 2024' },
  { f: 'Nathan', l: 'Ford', year: 'Super Senior', stage: 'member', status: 'active', major: 'Mechanical Engineering', town: 'Hickory, NC', church: 'Mercy Hill', cohort: 'Fall 2023', roles: [{ title: 'Vice President', term: '2025–26', current: true }] },
  { f: 'Grant', l: 'Mercer', year: 'Alumni', stage: 'alumni', status: 'active', major: 'Mechanical Engineering', town: 'Charlotte, NC', church: 'Forest Hill Church', cohort: 'Fall 2021', roles: [{ title: 'Alumni Mentor Lead', term: '2025–26', current: true }, { title: 'President', term: '2024–25', current: false }] },
  { f: 'Patrick', l: 'Lowe', year: 'Alumni', stage: 'alumni', status: 'active', major: 'Electrical Engineering', town: 'Atlanta, GA', church: 'Passion City', cohort: 'Fall 2020', roles: [{ title: 'Treasurer', term: '2023–24', current: false }] },
];

// ── Atoms ─────────────────────────────────────────────────────────────────
function initials(f, l) { return (f[0] || '') + (l[0] || ''); }

// Initials avatar (clean SaaS placeholder — no fake photos).
function Avatar({ f, l, size = 56, theme, ring }) {
  const t = theme;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: t.accentSoft, color: t.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: SERIF, fontWeight: 500, fontSize: size * 0.4, letterSpacing: 0.2,
      boxShadow: ring ? `0 0 0 3px ${t.bg}, 0 0 0 4px ${t.line}` : 'none',
      userSelect: 'none',
    }}>{initials(f, l)}</div>
  );
}

// Status / stage tag. Pass `theme` so the chip picks the light/dark palette.
function Tag({ stage, size = 'md', theme }) {
  const pal = (theme && theme.stages) || STAGES;
  const s = pal[stage] || pal.member;
  const pad = size === 'sm' ? '2px 8px' : '4px 11px';
  const fs = size === 'sm' ? 11 : 12.5;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 999, background: s.bg, color: s.fg,
      fontFamily: UI, fontSize: fs, fontWeight: 600, letterSpacing: 0.1, whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

// Active/inactive dot.
function Dot({ active }) {
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: active ? '#3aa563' : '#c4b9b9', display: 'inline-block', flexShrink: 0 }} />;
}

// Uppercase micro-label.
function Eyebrow({ children, theme, style }) {
  return <div style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.faint, ...style }}>{children}</div>;
}

// Label-over-value field.
function Field({ label, value, theme, mono }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: theme.faint, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: UI, fontSize: 14.5, fontWeight: 500, color: theme.ink, lineHeight: 1.3, fontVariantNumeric: mono ? 'tabular-nums' : 'normal' }}>{value}</div>
    </div>
  );
}

// Small icon-ish glyph for the traveling-card chips (simple shapes only).
function CardGlyph({ k, color, size = 16 }) {
  const c = color;
  const s = { width: size, height: size, display: 'block' };
  switch (k) {
    case 'application': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4"><rect x="3" y="1.5" width="10" height="13" rx="1.5"/><path d="M5.5 5h5M5.5 8h5M5.5 11h3" strokeLinecap="round"/></svg>;
    case 'scorecard': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4"><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round"/></svg>;
    case 'testing': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4"><path d="M2.5 8.5l3 3 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'certs': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4"><circle cx="8" cy="6" r="4"/><path d="M5.5 9.5L4 14l4-2 4 2-1.5-4.5" strokeLinejoin="round"/></svg>;
    case 'milestones': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4"><path d="M8 1.5v13" strokeLinecap="round"/><circle cx="8" cy="4" r="1.6" fill={c} stroke="none"/><circle cx="8" cy="8" r="1.6" fill={c} stroke="none"/><circle cx="8" cy="12" r="1.6" fill={c} stroke="none"/></svg>;
    case 'prayer': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4"><path d="M8 14s-5-3.2-5-7a3 3 0 015-2.2A3 3 0 0113 7c0 3.8-5 7-5 7z" strokeLinejoin="round"/></svg>;
    default: return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="2"/></svg>;
  }
}

// Striped placeholder (for things we genuinely don't have, e.g. alumni gallery).
function Placeholder({ label, w = '100%', h = 90, theme }) {
  const stripe = encodeURIComponent(theme.line);
  return (
    <div style={{
      width: w, height: h, borderRadius: 8, border: `1px dashed ${theme.line}`,
      backgroundImage: `repeating-linear-gradient(45deg, ${theme.panel}, ${theme.panel} 6px, ${theme.bg} 6px, ${theme.bg} 12px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Space Mono', monospace", fontSize: 10.5, letterSpacing: 0.5, color: theme.faint,
    }}>{label}</div>
  );
}

// Alumni roster — expanded fields (work, location, marital, open-to-connect) so
// leaders can cross-reference (e.g. engineers open to connecting).
const ALUMNI = [
  { f: 'Grant', l: 'Mercer', grad: '2025', major: 'Mechanical Engineering', work: 'Design Engineer · Collins Aerospace', loc: 'Charlotte, NC', marital: 'Married', kids: 1, connect: true, church: 'Forest Hill Church', cohort: 'Fall 2021', roles: [{ title: 'Alumni Mentor Lead', term: '2025–26', current: true }, { title: 'President', term: '2024–25', current: false }] },
  { f: 'Patrick', l: 'Lowe', grad: '2024', major: 'Electrical Engineering', work: 'Power Systems Eng · Southern Co.', loc: 'Atlanta, GA', marital: 'Married', kids: 2, connect: true, church: 'Passion City', cohort: 'Fall 2020', roles: [{ title: 'Treasurer', term: '2023–24', current: false }] },
  { f: 'Joel', l: 'Ramsey', grad: '2024', major: 'Computer Science', work: 'Software Engineer · Red Ventures', loc: 'Charlotte, NC', marital: 'Single', kids: 0, connect: true, church: 'Elevation Church', cohort: 'Fall 2020' },
  { f: 'Andre', l: 'Wallace', grad: '2023', major: 'Civil Engineering', work: 'Project Engineer · Kimley-Horn', loc: 'Raleigh, NC', marital: 'Married', kids: 0, connect: false, church: 'The Summit Church', cohort: 'Fall 2019' },
  { f: 'Caleb', l: 'Stone', grad: '2023', major: 'Mechanical Engineering', work: 'Grad Student · Georgia Tech', loc: 'Atlanta, GA', marital: 'Single', kids: 0, connect: true, church: 'Passion City', cohort: 'Fall 2019', roles: [{ title: 'Social Chair', term: '2022–23', current: false }] },
  { f: 'Trevor', l: 'Quinn', grad: '2022', major: 'Finance', work: 'Analyst · Bank of America', loc: 'Charlotte, NC', marital: 'Married', kids: 2, connect: true, church: 'Forest Hill Church', cohort: 'Fall 2018', roles: [{ title: 'Alumni Board Chair', term: '2025–26', current: true }, { title: 'President', term: '2021–22', current: false }] },
  { f: 'Marcus', l: 'Doyle', grad: '2021', major: 'Electrical Engineering', work: 'Hardware Engineer · NVIDIA', loc: 'Austin, TX', marital: 'Married', kids: 1, connect: true, church: 'The Austin Stone', cohort: 'Fall 2017', roles: [{ title: 'Vice President', term: '2020–21', current: false }] },
  { f: 'Brett', l: 'Halloway', grad: '2020', major: 'Business Admin', work: 'Operations Lead · Lowe’s', loc: 'Mooresville, NC', marital: 'Married', kids: 3, connect: false, church: 'Mercy Hill', cohort: 'Fall 2016' },
];

// Applicant review queue — generated when an application is submitted; pending
// accept/advance. Interview score travels here from the scorecard.
const APPLICANTS = [
  { f: 'Owen', l: 'Carter', year: 'Freshman', major: 'Computer Science', town: 'Charlotte, NC', submitted: 'Jun 2', score: 9.1 },
  { f: 'Liam', l: 'Foster', year: 'Freshman', major: 'Mechanical Engineering', town: 'Gastonia, NC', submitted: 'Jun 1', score: 8.7 },
  { f: 'Noah', l: 'Pratt', year: 'Freshman', major: 'Business Admin', town: 'Concord, NC', submitted: 'May 30', score: 8.6 },
  { f: 'Mason', l: 'Reid', year: 'Sophomore', major: 'Electrical Engineering', town: 'Charlotte, NC', submitted: 'May 29', score: 7.4 },
  { f: 'Lucas', l: 'Byrd', year: 'Freshman', major: 'Civil Engineering', town: 'Huntersville, NC', submitted: 'May 28', score: 6.9 },
  { f: 'Henry', l: 'Dalton', year: 'Freshman', major: 'Finance', town: 'Matthews, NC', submitted: 'Jun 3', score: null },
  { f: 'Jack', l: 'Mercer', year: 'Sophomore', major: 'Computer Science', town: 'Raleigh, NC', submitted: 'Jun 3', score: null },
  { f: 'Eli', l: 'Schwab', year: 'Freshman', major: 'Kinesiology', town: 'Charlotte, NC', submitted: 'May 27', score: 5.8 },
];
// Decision recommendation derived from interview score (decision-night triage).
function recommend(score) {
  if (score == null) return { label: 'Awaiting', kind: 'await', fg: '#8b91a0', bg: 'transparent' };
  if (score >= 8.5) return { label: 'Advance', kind: 'advance', fg: '#1f6b46', bg: '#e3f3ea' };
  if (score >= 6.5) return { label: 'Discuss', kind: 'discuss', fg: '#8a5a16', bg: '#fbefdd' };
  return { label: 'Hold', kind: 'hold', fg: '#9a3b3b', bg: '#f6e9e9' };
}

// Leadership helpers + chip. A role: { title, term, current }.
// Current offices render gold-filled (active tenure); past offices render as a
// muted outlined “former” label that stays on the record forever.
function currentRoles(p) { return (p && p.roles || []).filter((r) => r.current); }
function pastRoles(p) { return (p && p.roles || []).filter((r) => !r.current); }
function topRole(p) { return currentRoles(p)[0] || pastRoles(p)[0] || null; }

function OfficeChip({ role, theme, size = 'md' }) {
  const t = theme;
  if (!role) return null;
  const gold = t.gold || '#a9852f';
  const pad = size === 'sm' ? '2px 8px' : '3px 10px';
  const fs = size === 'sm' ? 10.5 : 11.5;
  if (role.current) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: pad, borderRadius: 999,
        background: 'rgba(169,133,47,.14)', color: gold, fontFamily: UI, fontSize: fs, fontWeight: 700, whiteSpace: 'nowrap' }}>
        <svg width={fs} height={fs} viewBox="0 0 16 16" fill="none" stroke={gold} strokeWidth="1.5"><path d="M2.5 5l3 2.4L8 3.5l2.5 3.9 3-2.4-1 6.5h-9z" strokeLinejoin="round"/></svg>
        {role.title}{role.term ? ` · ${role.term}` : ''}
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: pad, borderRadius: 999,
      background: 'transparent', color: t.faint, border: `1px solid ${t.line}`, fontFamily: UI, fontSize: fs, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <svg width={fs - 1} height={fs - 1} viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.4"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Former {role.title}{role.term ? ` · ${role.term}` : ''}
    </span>
  );
}

// ── Responsive plumbing ─────────────────────────────────────────────────
// One source of truth for width. Components call useViewport() and branch on
// the breakpoints below. wide (≥ tab) is the untouched desktop layout; below
// `tab` the app goes to its compact/mobile mode (drawer nav, stacked rails,
// card lists, profile tabs); below `phone` it tightens further.
const BP = { phone: 600, tab: 980 };
function useViewport() {
  const get = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [w, setW] = React.useState(get);
  React.useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setW(get())); };
    window.addEventListener('resize', on);
    on();
    return () => { window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return w;
}

// Off-canvas drawer (used for nav + filters on narrow screens).
function Drawer({ t, open, onClose, side = 'left', width = 300, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,20,32,.46)', opacity: open ? 1 : 0, transition: 'opacity .22s ease' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width, maxWidth: '86%',
        background: t.bg, color: t.ink,
        borderRight: side === 'left' ? `1px solid ${t.line}` : 'none',
        borderLeft: side === 'right' ? `1px solid ${t.line}` : 'none',
        transform: open ? 'translateX(0)' : `translateX(${side === 'left' ? '-101%' : '101%'})`,
        transition: 'transform .26s cubic-bezier(.32,.72,0,1)',
        overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        boxShadow: open ? '0 12px 48px rgba(15,20,32,.28)' : 'none' }}>
        {children}
      </div>
    </div>
  );
}

// Horizontally-scrollable, sticky tab strip — the "card system" on narrow
// screens. items: [{ key, label, icon?, badge? }].
function TabStrip({ t, items, active, onChange, top = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '9px 12px',
      background: t.bg, borderBottom: `1px solid ${t.line}`,
      position: 'sticky', top, zIndex: 6, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      {items.map((it) => {
        const on = it.key === active;
        return (
          <button key={it.key} onClick={() => onChange(it.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 13px', borderRadius: 999, border: `1px solid ${on ? t.accent : t.line}`, whiteSpace: 'nowrap', cursor: 'pointer',
            fontFamily: UI, fontSize: 12.5, fontWeight: 600, flexShrink: 0,
            background: on ? t.accent : t.bg, color: on ? t.onAccent : t.sub }}>
            {typeof it.icon === 'function' ? it.icon(on) : it.icon}
            {it.label}
            {it.badge != null && (
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '0 6px', borderRadius: 999,
                background: on ? 'rgba(255,255,255,.22)' : t.accentSoft, color: on ? '#fff' : t.accent }}>{it.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  UI, SERIF, THEMES, THEMES_DARK, STAGES, STAGES_DARK, getTheme, PROFILE, ROSTER, ALUMNI, APPLICANTS, recommend,
  initials, Avatar, Tag, Dot, Eyebrow, Field, CardGlyph, Placeholder,
  currentRoles, pastRoles, topRole, OfficeChip,
  BP, useViewport, Drawer, TabStrip,
});
