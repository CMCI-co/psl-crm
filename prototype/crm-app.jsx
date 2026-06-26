// crm-app.jsx — the LIVE, clickable single-screen app shell. Reuses every view
// component (DirectoryView, ApplicationReview, RelationshipTracker, ResourcesView,
// AlumniCallView, Training*) and wires them together with a tiny router exposed
// as window.PSLNav so components can navigate without prop-threading.

// ── Router ────────────────────────────────────────────────────────────────
// route = { name, params }. Components call window.PSLNav.go(name, params).
const TWEAK_DEFAULTS = { color: 'Navy', dark: false, density: 'comfortable', role: 'Campus Director' };

function CRMApp() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const t = getTheme((tw.color || 'Navy').toLowerCase(), tw.dark);
  const density = tw.density;
  const role = tw.role || 'Campus Director';

  // Expose the dark-mode toggle app-wide so the always-visible TopBar switch
  // (and anything else) can flip it without prop-threading. Set every render.
  window.PSLTheme = { dark: !!tw.dark, toggle: () => setTweak('dark', !tw.dark), set: (v) => setTweak('dark', !!v) };

  const [stack, setStack] = React.useState([{ name: 'directory', params: { view: 'active' } }]);
  const route = stack[stack.length - 1];

  // Expose navigation to all child components (set every render so it stays fresh).
  const fireNav = () => { try { window.dispatchEvent(new Event('psl:navigate')); } catch (e) {} };
  window.PSLNav = {
    go: (name, params = {}) => { fireNav(); setStack((s) => [...s, { name, params }]); },
    replace: (name, params = {}) => { fireNav(); setStack((s) => [...s.slice(0, -1), { name, params }]); },
    setView: (view) => { fireNav(); setStack((s) => [...s.slice(0, -1), { name: 'directory', params: { view } }]); },
    back: () => { fireNav(); setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)); },
    home: () => { fireNav(); setStack([{ name: 'directory', params: { view: 'active' } }]); },
    canBack: stack.length > 1,
  };

  const p = route.params || {};
  let screen;
  switch (route.name) {
    case 'profile':      screen = <ProfileDetail theme={t} person={p.person} section="directory" role={role} />; break;
    case 'application':  screen = <ApplicationReview theme={t} />; break;
    case 'tracker':      screen = <RelationshipTracker theme={t} role={role} />; break;
    case 'alumniRecord': screen = <ProfileDetail theme={t} person={p.person} section="tracker" role={role} />; break;
    case 'resources':    screen = <ResourcesView theme={t} />; break;
    case 'training':     screen = <TrainingLibrary theme={t} role={role} />; break;
    case 'builder':      screen = <TrainingBuilder theme={t} role={role} />; break;
    case 'player':       screen = <TrainingPlayer theme={t} start={p.start} />; break;
    case 'cohort':       screen = <CohortView theme={t} density={density} focus={p.focus} />; break;
    case 'reportBuilder': screen = <ReportBuilder theme={t} role={role} />; break;
    default:             screen = <DirectoryView theme={t} view={p.view || 'active'} density={density} />;
  }

  return (
    <React.Fragment>
      <div style={{ position: 'fixed', inset: 0, background: t.panel, overflow: 'auto' }}>
        {screen}
      </div>
      <Toasts t={t} />
      <RecordViewerHost theme={t} />
      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Color direction" value={tw.color} options={['Navy', 'Evergreen', 'Maroon']} onChange={(v) => setTweak('color', v)} />
        <TweakToggle label="Dark mode" value={tw.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={tw.density} options={['comfortable', 'compact']} onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Permissions" />
        <TweakSelect label="Your role" value={tw.role} options={['National Staff', 'Campus Director', 'Member', 'Candidate']} onChange={(v) => setTweak('role', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

// ── ProfileScreen — a real profile page: identity card + traveling cards ────
function ProfileScreen({ theme: t, person }) {
  // Normalize a directory row (f/l/town…) into the ProfileCard's shape.
  const merged = person ? {
    first: person.f, last: person.l, middle: '',
    year: person.year, school: 'UNC Charlotte', major: person.major,
    hometown: person.town, church: person.church,
    cohort: (person.cohort ? person.cohort + ' Cohort' : PROFILE.cohort),
    stage: person.stage, roles: person.roles,
  } : null;
  const st = (person && person.stage) || 'member';
  const crumbLabel = { applicant: 'Applicants', candidate: 'Candidates', member: 'Active Members', alumni: 'Alumni' }[st] || 'Directory';
  const name = person ? `${person.f} ${person.l}` : `${PROFILE.first} ${PROFILE.last}`;

  const frame = { background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, overflow: 'hidden' };

  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="directory" />
      <SubBar t={t} crumbs={['Directory', crumbLabel, name]}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn t={t} kind="ghost" label="Edit profile" icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.5 2.5l2 2-6.5 6.5-2.5.5.5-2.5z" strokeLinejoin="round"/></svg>} />
          {st === 'alumni' && <Btn t={t} kind="primary" label="Open engagement record" onClick={() => window.PSLNav.go('alumniRecord', { person })} />}
        </div>
      </SubBar>

      <div style={{ flex: 1, padding: '24px 26px', display: 'grid', gridTemplateColumns: 'minmax(560px, 600px) 1fr', gap: 22, alignItems: 'start', maxWidth: 1320, width: '100%', margin: '0 auto' }}>
        {/* the credential */}
        <div style={{ ...frame }}>
          <ProfileCard theme={t} stage={st} person={merged} />
        </div>
        {/* traveling cards stacked as panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
          <div style={{ ...frame, height: 600 }}><ScoreCard theme={t} /></div>
          <div style={{ ...frame, height: 600 }}><MilestonesCard theme={t} /></div>
          <div style={{ ...frame, height: 600 }}><PrayerCard theme={t} /></div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CRMApp />);
