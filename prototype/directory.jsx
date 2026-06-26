// directory.jsx — Member Directory (campus roster, cohort & alumni views) for
// Leaders, plus the Overview/rationale card. Reads tokens/atoms/data from window.

// Small shared chrome bits ---------------------------------------------------
function TopNavIcon({ kind, color }) {
  const s = { width: 15, height: 15, display: 'block' };
  if (kind === 'resources') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><rect x="2" y="3" width="12" height="9.5" rx="1.5"/><path d="M6.6 6v4l3.2-2z" fill={color} stroke="none"/></svg>;
  if (kind === 'tracker') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="5.4" cy="5" r="2.2"/><path d="M1.6 12.6c0-2.1 1.7-3.4 3.8-3.4 1 0 1.9.3 2.6.9" strokeLinecap="round"/><circle cx="11" cy="10.6" r="3.2"/><path d="M11 9.2v1.4l1 .9" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><rect x="2" y="2.5" width="5" height="5" rx="1"/><rect x="9" y="2.5" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>;
}

function TopBar({ t, section = 'directory', sidebar = null }) {
  const tabs = [{ id: 'directory', label: 'Directory' }, { id: 'tracker', label: 'Relationship Tracker' }, { id: 'resources', label: 'Resources' }];
  const onResources = section === 'resources';
  const onTracker = section === 'tracker';
  const w = useViewport();
  const narrow = w < BP.tab;
  const [menu, setMenu] = React.useState(false);
  // Close the drawer whenever navigation happens (fired by window.PSLNav).
  React.useEffect(() => {
    const close = () => setMenu(false);
    window.addEventListener('psl:navigate', close);
    return () => window.removeEventListener('psl:navigate', close);
  }, []);

  if (narrow) {
    const iconBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.chromeLine || t.line}`, background: t.bg, color: t.sub, cursor: 'pointer', flexShrink: 0 };
    return (
      <React.Fragment>
        <div style={{ height: 56, background: t.chrome || t.bg, borderBottom: `1px solid ${t.chromeLine || t.line}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, flexShrink: 0 }}>
          <button onClick={() => setMenu(true)} aria-label="Menu" style={iconBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 5h12M3 9h12M3 13h12" strokeLinecap="round"/></svg>
          </button>
          <div onClick={() => window.PSLNav && window.PSLNav.home()} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 0 }}>
            <div style={{ minWidth: 28, height: 26, padding: '0 5px', borderRadius: 6, background: t.accent, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 13, letterSpacing: 1.2, flexShrink: 0 }}>ΦΣΛ</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.ink, letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Phi Sigma Lambda</span>
          </div>
          <div style={{ flex: 1 }} />
          <ModeToggle t={t} />
          <NotifBell t={t} />
          <IdentitySwitcher t={t} />
        </div>
        <Drawer t={t} open={menu} onClose={() => setMenu(false)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '16px 16px 14px' }}>
            <div style={{ minWidth: 30, height: 28, padding: '0 6px', borderRadius: 7, background: t.accent, color: t.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 14, letterSpacing: 1.5 }}>ΦΣΛ</div>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: t.ink }}>Phi Sigma Lambda</span>
            <span onClick={() => setMenu(false)} style={{ marginLeft: 'auto', color: t.faint, cursor: 'pointer', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" strokeLinecap="round"/></svg>
            </span>
          </div>
          <div style={{ height: 1, background: t.line, margin: '0 16px 10px' }} />
          <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {tabs.map((tab) => {
              const on = section === tab.id;
              return (
                <span key={tab.id} onClick={() => window.PSLNav && window.PSLNav.go(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderRadius: 9,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', background: on ? t.accentSoft : 'transparent', color: on ? t.accent : t.ink }}>
                  <TopNavIcon kind={tab.id} color={on ? t.accent : t.faint} />
                  {tab.label}
                </span>
              );
            })}
          </div>
          {sidebar && <div style={{ height: 1, background: t.line, margin: '12px 16px' }} />}
          {sidebar && <div style={{ paddingBottom: 24 }}>{sidebar}</div>}
        </Drawer>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
    <div style={{ height: 56, background: t.chrome || t.bg, borderBottom: `1px solid ${t.chromeLine || t.line}`, display: 'flex',
      alignItems: 'center', padding: '0 22px', gap: 16, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => window.PSLNav && window.PSLNav.home()}>
        <div style={{ minWidth: 30, height: 28, padding: '0 6px', borderRadius: 7, background: t.accent, color: t.onAccent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 14, letterSpacing: 1.5 }}>ΦΣΛ</div>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: t.chromeInk || t.ink, letterSpacing: -0.2 }}>Phi Sigma Lambda</span>
      </div>
      <div style={{ width: 1, height: 22, background: t.chromeLine || t.line }} />
      <div style={{ display: 'flex', gap: 3 }}>
        {tabs.map((tab) => {
          const on = section === tab.id;
          return (
            <span key={tab.id} onClick={() => window.PSLNav && window.PSLNav.go(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', background: on ? t.accentSoft : 'transparent', color: on ? t.accent : t.sub }}>
              <TopNavIcon kind={tab.id} color={on ? t.accent : t.faint} />
              {tab.label}
            </span>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 9,
        background: t.bg, border: `1px solid ${t.chromeLine || t.line}`, width: 220 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.5"><circle cx="6" cy="6" r="4.5"/><path d="M10 10l3 3" strokeLinecap="round"/></svg>
        <span style={{ fontSize: 12.5, color: t.faint }}>{onResources ? 'Search resources…' : onTracker ? 'Search alumni…' : 'Search members…'}</span>
      </div>
      <button onClick={() => { if (!onResources && !onTracker) window.PSLNav && window.PSLNav.go('reportBuilder'); }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 9,
        background: t.accent, color: t.onAccent, border: 'none', fontFamily: UI, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
        {onResources ? (
          <React.Fragment>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 9.5V2.5M4.2 5.3L7 2.5l2.8 2.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 9.5v2h9v-2" strokeLinecap="round"/></svg>
            Upload resource
          </React.Fragment>
        ) : onTracker ? (
          <React.Fragment>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 2.5v9M2.5 7h9" strokeLinecap="round"/></svg>
            Log interaction
          </React.Fragment>
        ) : (
          <React.Fragment>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 1.5h5l3 3v8h-8z" strokeLinejoin="round"/><path d="M5 8h4M5 10h4" strokeLinecap="round"/></svg>
            Generate report
          </React.Fragment>
        )}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ModeToggle t={t} />
        <NotifBell t={t} />
        <IdentitySwitcher t={t} />
      </div>
    </div>
    </React.Fragment>
  );
}

// nav glyphs (simple shapes only)
function NavIcon({ kind, color }) {
  const s = { width: 16, height: 16, display: 'block' };
  if (kind === 'applicant') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M2 9.5l1.6-6.2a1 1 0 011-.8h6.8a1 1 0 011 .8L14 9.5M2 9.5v3.3h12V9.5M2 9.5h3.2l.8 1.4h4l.8-1.4H14" strokeLinejoin="round" strokeLinecap="round"/></svg>;
  if (kind === 'active') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><circle cx="6" cy="5" r="2.6"/><path d="M1.8 13c0-2.4 1.9-4 4.2-4s4.2 1.6 4.2 4" strokeLinecap="round"/><circle cx="12" cy="5.4" r="1.9"/><path d="M11 9.2c2 .1 3.2 1.6 3.2 3.8" strokeLinecap="round"/></svg>;
  if (kind === 'candidate') return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 14V7" strokeLinecap="round"/><path d="M8 7c0-2 1.4-3.5 3.5-3.5C11.5 5.5 10 7 8 7zM8 8.5C8 6.8 6.7 5.5 4.8 5.5 4.8 7.2 6.1 8.5 8 8.5z" strokeLinejoin="round"/></svg>;
  return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M8 2.2L14.5 5 8 7.8 1.5 5z" strokeLinejoin="round"/><path d="M4.5 6.4v3.1c0 1 1.6 1.9 3.5 1.9s3.5-.9 3.5-1.9V6.4M14.5 5v3.4" strokeLinecap="round"/></svg>;
}

function NavItem({ t, kind, label, sub, count, active, onClick, pal }) {
  // The selected item's splash + tint mirror the journey-stage color
  // (Applicants amber · Candidates azure · Members green · Alumni steel).
  const splash = pal ? pal.solid : t.accent;
  const softBg = pal ? pal.bg : t.accentSoft;
  const fg = pal ? pal.fg : t.accent;
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 9, cursor: 'pointer',
      background: active ? softBg : 'transparent', boxShadow: active ? `inset 2.5px 0 0 ${splash}` : 'none' }}>
      <NavIcon kind={kind} color={active ? fg : t.faint} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? fg : t.ink, lineHeight: 1.2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: t.faint, marginTop: 1 }}>{sub}</div>}
      </div>
      <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: active ? fg : t.faint, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </div>
  );
}

function FilterGroup({ t, title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: t.faint, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}
function Check({ t, label, on, count }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
      <span style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0,
        background: on ? t.accent : t.bg, border: `1.5px solid ${on ? t.accent : t.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {on && <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke={t.onAccent} strokeWidth="2"><path d="M1.5 5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span style={{ fontSize: 13, color: on ? t.ink : t.sub, fontWeight: on ? 600 : 400, flex: 1 }}>{label}</span>
      {count != null && <span style={{ fontSize: 11.5, color: t.faint, fontVariantNumeric: 'tabular-nums' }}>{count}</span>}
    </label>
  );
}

// Shared left rail: View nav (Applicants → Candidates → Members → Alumni) + contextual filters.
function Sidebar({ t, view, onNav, full }) {
  const navTo = (v) => onNav ? onNav(v) : (window.PSLNav && window.PSLNav.setView(v));
  const isAlumni = view === 'alumni';
  const isApplicant = view === 'applicant';
  const isCandidate = view === 'candidate';
  const isActive = !isAlumni && !isApplicant && !isCandidate;
  return (
    <div style={{ width: full ? '100%' : 236, background: full ? 'transparent' : (t.chrome || t.bg), borderRight: full ? 'none' : `1px solid ${t.chromeLine || t.line}`, padding: '18px 18px', flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: t.faint, marginBottom: 10, paddingLeft: 3 }}>Directory</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 18 }}>
        <NavItem t={t} kind="applicant" label="Applicants" sub="Pending review" count={25} active={isApplicant} pal={t.stages.applicant} onClick={() => navTo('applicant')} />
        <NavItem t={t} kind="candidate" label="Candidates" sub="In Formation" count={6} active={isCandidate} pal={t.stages.candidate} onClick={() => navTo('candidate')} />
        <NavItem t={t} kind="active" label="Active Members" count={42} active={isActive} pal={t.stages.member} onClick={() => navTo('active')} />
        <NavItem t={t} kind="alumni" label="Alumni" count={18} active={isAlumni} pal={t.stages.alumni} onClick={() => navTo('alumni')} />
      </div>
      <div style={{ height: 1, background: t.line, margin: '0 3px 18px' }} />

      <FilterGroup t={t} title="Campus">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px',
          borderRadius: 9, background: t.accentSoft, border: `1px solid ${t.line}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.accent }}>UNC Charlotte</span>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke={t.accent} strokeWidth="1.6"><path d="M2 4l3.5 3.5L9 4" strokeLinecap="round"/></svg>
        </div>
      </FilterGroup>

      {isApplicant ? (
        <React.Fragment>
          <FilterGroup t={t} title="Stage">
            <Check t={t} label="New" on count={12} />
            <Check t={t} label="Interviewed" on count={8} />
            <Check t={t} label="Awaiting decision" on count={5} />
          </FilterGroup>
          <FilterGroup t={t} title="Recommendation">
            <Check t={t} label="Advance" on count={8} />
            <Check t={t} label="Discuss" on count={9} />
            <Check t={t} label="Hold" count={8} />
          </FilterGroup>
          <FilterGroup t={t} title="Major">
            <Check t={t} label="Engineering" on count={11} />
            <Check t={t} label="Business / Finance" count={6} />
            <Check t={t} label="Computer Science" count={4} />
          </FilterGroup>
        </React.Fragment>
      ) : isAlumni ? (
        <React.Fragment>
          <FilterGroup t={t} title="Graduating Class">
            <Check t={t} label="2025" on count={1} />
            <Check t={t} label="2024" on count={2} />
            <Check t={t} label="2023" on count={2} />
            <Check t={t} label="2022 & earlier" on count={3} />
          </FilterGroup>
          <FilterGroup t={t} title="Major">
            <Check t={t} label="Engineering" on count={5} />
            <Check t={t} label="Computer Science" count={1} />
            <Check t={t} label="Business / Finance" count={2} />
          </FilterGroup>
          <FilterGroup t={t} title="Connection">
            <Check t={t} label="Open to connect" on count={6} />
            <Check t={t} label="Out of state" count={3} />
            <Check t={t} label="Married" count={6} />
          </FilterGroup>
          <FilterGroup t={t} title="Leadership legacy">
            <Check t={t} label="Held office as member" on count={6} />
            <Check t={t} label="Past President" count={3} />
            <Check t={t} label="On alumni board" count={2} />
          </FilterGroup>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <FilterGroup t={t} title="Status">
            <Check t={t} label="Active" on count={42} />
            <Check t={t} label="Inactive" count={4} />
          </FilterGroup>
          <FilterGroup t={t} title="Class">
            <Check t={t} label="Freshman" on count={2} />
            <Check t={t} label="Sophomore" on count={1} />
            <Check t={t} label="Junior" on count={3} />
            <Check t={t} label="Senior" on count={3} />
            <Check t={t} label="Super Senior" on count={1} />
          </FilterGroup>
          <FilterGroup t={t} title="Cohort">
            <Check t={t} label="Fall 2025" count={2} />
            <Check t={t} label="Fall 2024" on count={4} />
            <Check t={t} label="Spring 2024" count={3} />
          </FilterGroup>
          <FilterGroup t={t} title="Major">
            <Check t={t} label="Engineering" on count={6} />
            <Check t={t} label="Business" count={2} />
            <Check t={t} label="Computer Science" count={2} />
          </FilterGroup>
          <FilterGroup t={t} title="Leadership">
            <Check t={t} label="Current officers" on count={8} />
            <Check t={t} label="Has held office" count={14} />
            <Check t={t} label="Exec board" count={5} />
          </FilterGroup>
        </React.Fragment>
      )}
    </div>
  );
}

function StatChip({ t, n, label, tone }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 13px', background: t.panel, borderRadius: 9, border: `1px solid ${t.line}` }}>
      <span style={{ fontFamily: SERIF, fontSize: 18, color: tone, lineHeight: 1 }}>{n}</span>
      <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>{label}</span>
    </div>
  );
}
function Segmented({ t, items, activeIndex }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 3, background: t.panel, borderRadius: 9, border: `1px solid ${t.line}` }}>
      {items.map((v, i) => (
        <span key={v} style={{ padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
          background: i === activeIndex ? t.bg : 'transparent', color: i === activeIndex ? t.ink : t.faint,
          boxShadow: i === activeIndex ? '0 1px 2px rgba(0,0,0,.10)' : 'none' }}>{v}</span>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Active roster body — grouped by class
// ───────────────────────────────────────────────────────────────────────
const CLASS_ORDER = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Super Senior'];
function pluralClass(y) { return y === 'Super Senior' ? 'Super Seniors' : y + 's'; }

function ActiveBody({ t, dense }) {
  const s = useStore();
  const eff = (r) => PSLStore.stageOf(`${r.f} ${r.l}`, r.stage);
  const roster = ROSTER.filter((r) => eff(r) === 'member');
  const groups = CLASS_ORDER.map((y) => ({ y, rows: roster.filter((r) => r.year === y) })).filter((g) => g.rows.length);
  const cols = '2.1fr 1fr 1.5fr 1.3fr 1.5fr 1fr 0.8fr';
  const rowPad = dense ? '6px 26px' : '10px 26px';
  const w = useViewport();
  const narrow = w < BP.tab;
  const batch = useBatch();
  const keys = roster.map((r) => `${r.f} ${r.l}`);
  const allOn = keys.length > 0 && keys.every((k) => batch.sel.has(k));
  const someOn = keys.some((k) => batch.sel.has(k));
  const rowClick = (r) => batch.selecting ? batch.toggle(`${r.f} ${r.l}`) : (window.PSLNav && window.PSLNav.go('profile', { person: r }));
  const doBatch = () => { PSLStore.advanceMany([...batch.sel].map((k) => ({ key: k })), 'alumni', 'moved'); batch.clear(); };
  const gcols = batch.selecting ? '34px ' + cols : cols;
  const bar = batch.selecting && <BatchBar t={t} count={batch.sel.size} label="Move to Alumni" onAction={doBatch} onClear={batch.clear} />;
  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        <div style={{ padding: '15px 16px 13px', borderBottom: `1px solid ${t.line}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 21 }}>UNC Charlotte</div>
              <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>Active roster · Spring 2026</div>
            </div>
            <SelectToggle t={t} selecting={batch.selecting} onToggle={() => batch.selecting ? batch.clear() : batch.setSelecting(true)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <StatChip t={t} n={42} label="Active" tone={t.accent} />
            <StatChip t={t} n={6} label="Candidates" tone={t.stages.candidate.fg} />
            <StatChip t={t} n={4} label="Inactive" tone={t.faint} />
            <StatChip t={t} n={18} label="Alumni" tone={t.stages.alumni.fg} />
          </div>
        </div>
        {batch.selecting && (
          <div onClick={() => batch.setAll(keys, !allOn)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${t.line}`, background: t.panel, cursor: 'pointer' }}>
            <SelChk t={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.sub }}>{allOn ? 'Deselect all' : 'Select all'}</span>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: batch.selecting ? 80 : 0 }}>
          {groups.map((g) => (
            <div key={g.y}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px', background: t.groupBg, position: 'sticky', top: 0, zIndex: 1, borderTop: `1px solid ${t.chromeLine || t.line}`, borderBottom: `1px solid ${t.chromeLine || t.line}` }}>
                <span style={{ width: 3, height: 13, borderRadius: 2, background: t.groupInk, flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.groupInk }}>{pluralClass(g.y)}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: t.groupInk, background: t.bg, borderRadius: 999, padding: '1px 8px' }}>{g.rows.length}</span>
              </div>
              {g.rows.map((r, i) => {
                const k = `${r.f} ${r.l}`;
                return (
                <div key={i} onClick={() => rowClick(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(k) ? t.accentSoft : 'transparent' }}>
                  {batch.selecting && <SelChk t={t} checked={batch.sel.has(k)} onChange={() => batch.toggle(k)} />}
                  <Avatar f={r.f} l={r.l} size={42} theme={t} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</span>
                      <Dot active={r.status === 'active'} />
                    </div>
                    <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.year} · {r.major}</div>
                    <div style={{ fontSize: 12, color: t.faint, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.town} · {r.cohort}</div>
                    {currentRoles(r)[0] && <div style={{ marginTop: 6 }}><OfficeChip role={currentRoles(r)[0]} theme={t} size="sm" /></div>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.6" style={{ flexShrink: 0 }}><path d="M5 2.5L9.5 7 5 11.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              );})}
            </div>
          ))}
        </div>
        {bar}
      </div>
    );
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 25 }}>UNC Charlotte</span>
            <span style={{ fontSize: 13, color: t.faint }}>· Spring 2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SelectToggle t={t} selecting={batch.selecting} onToggle={() => batch.selecting ? batch.clear() : batch.setSelecting(true)} />
            <Segmented t={t} items={['By class', 'By cohort', 'Table']} activeIndex={0} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <StatChip t={t} n={42} label="Active Members" tone={t.accent} />
          <StatChip t={t} n={6} label="Candidates" tone={t.stages.candidate.fg} />
          <StatChip t={t} n={4} label="Inactive" tone={t.faint} />
          <StatChip t={t} n={18} label="Alumni" tone={t.stages.alumni.fg} />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: gcols, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
          {batch.selecting && <SelChk t={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />}
          {['Member', 'Class', 'Major', 'Hometown', 'Home Church', 'Cohort', 'Status'].map((h) => (
            <span key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        <div style={{ paddingBottom: batch.selecting ? 80 : 0 }}>
        {groups.map((g) => (
          <div key={g.y}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 26px', background: t.groupBg, borderTop: `1px solid ${t.chromeLine || t.line}`, borderBottom: `1px solid ${t.chromeLine || t.line}` }}>
              <span style={{ width: 3, height: 13, borderRadius: 2, background: t.groupInk, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.groupInk }}>{pluralClass(g.y)}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: t.groupInk, background: t.bg, borderRadius: 999, padding: '1px 8px' }}>{g.rows.length}</span>
            </div>
            {g.rows.map((r, i) => {
              const k = `${r.f} ${r.l}`;
              return (
              <div key={i} onClick={() => rowClick(r)} style={{ display: 'grid', gridTemplateColumns: gcols, gap: 12, padding: rowPad, alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(k) ? t.accentSoft : 'transparent' }}>
                {batch.selecting && <SelChk t={t} checked={batch.sel.has(k)} onChange={() => batch.toggle(k)} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <Avatar f={r.f} l={r.l} size={dense ? 28 : 32} theme={t} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</div>
                    {!dense && <div style={{ marginTop: 3, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Tag stage={r.stage} size="sm" theme={t} />
                      {currentRoles(r)[0] && <OfficeChip role={currentRoles(r)[0]} theme={t} size="sm" />}
                    </div>}
                  </div>
                </div>
                <span style={{ fontSize: 13, color: t.sub }}>{r.year}</span>
                <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.major}</span>
                <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.town}</span>
                <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.church}</span>
                <span style={{ fontSize: 13, color: t.sub }}>{r.cohort}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Dot active={r.status === 'active'} />
                  <span style={{ fontSize: 12, color: t.sub, textTransform: 'capitalize' }}>{r.status}</span>
                </span>
              </div>
              );})}
            </div>
          ))}
        </div>
      </div>
      {bar}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Candidate body — guys in New Member Formation. Each can be promoted to an
// Active Member (the promotion persists across the app via the store).
// ───────────────────────────────────────────────────────────────────────
function CandidateBody({ t, dense }) {
  const s = useStore();
  const eff = (r) => PSLStore.stageOf(`${r.f} ${r.l}`, r.stage);
  const rows = ROSTER.filter((r) => eff(r) === 'candidate');
  const w = useViewport();
  const narrow = w < BP.tab;
  const batch = useBatch();
  const keys = rows.map((r) => `${r.f} ${r.l}`);
  const allOn = keys.length > 0 && keys.every((k) => batch.sel.has(k));
  const someOn = keys.some((k) => batch.sel.has(k));
  const rowClick = (r) => batch.selecting ? batch.toggle(`${r.f} ${r.l}`) : (window.PSLNav && window.PSLNav.go('profile', { person: r }));
  const doBatch = () => { PSLStore.advanceMany([...batch.sel].map((k) => ({ key: k })), 'member', 'promoted'); batch.clear(); };

  const PromoteBtn = ({ r, full }) => (
    <button onClick={(e) => { e.stopPropagation(); PSLStore.promote(`${r.f} ${r.l}`, `${r.f} ${r.l}`); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: full ? '9px 14px' : '6px 11px', borderRadius: 8,
        background: t.accent, color: t.onAccent, border: 'none', fontFamily: UI, fontSize: full ? 13 : 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, width: full ? '100%' : 'auto', justifyContent: 'center' }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 10.5V3.5M3.8 6.5L7 3.3l3.2 3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Promote to Member
    </button>
  );

  const intro = (
    <div style={{ padding: narrow ? '15px 16px 13px' : '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: SERIF, fontSize: narrow ? 21 : 25 }}>Candidates</span>
          <span style={{ fontSize: 13, color: t.faint }}>· In Formation · Fall 2025 cohort</span>
        </div>
        {rows.length > 0 && <SelectToggle t={t} selecting={batch.selecting} onToggle={() => batch.selecting ? batch.clear() : batch.setSelecting(true)} />}
      </div>
      <div style={{ display: 'flex', gap: 9, marginTop: 12, flexWrap: 'wrap' }}>
        <StatChip t={t} n={rows.length} label="In Formation" tone={t.stages.candidate.fg} />
        <StatChip t={t} n={6} label="Weeks in" tone={t.accent} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.line}` }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: 12, color: t.ink, lineHeight: 1.45 }}><b style={{ color: t.accent }}>Crossing over ·</b> Promote one at a time, or hit <b style={{ color: t.accent }}>Select</b> to advance several at once. They move straight into the Active Members roster.</span>
      </div>
    </div>
  );

  const bar = batch.selecting && <BatchBar t={t} count={batch.sel.size} label="Promote to Member" onAction={doBatch} onClear={batch.clear} />;

  if (rows.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        {intro}
        <div style={{ padding: '40px 26px', textAlign: 'center', color: t.faint, fontSize: 13 }}>Every candidate has crossed over to Active Member. 🎉</div>
      </div>
    );
  }

  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        {intro}
        {batch.selecting && (
          <div onClick={() => batch.setAll(keys, !allOn)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${t.line}`, background: t.panel, cursor: 'pointer' }}>
            <SelChk t={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.sub }}>{allOn ? 'Deselect all' : 'Select all'}</span>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: batch.selecting ? 80 : 0 }}>
          {rows.map((r, i) => {
            const k = `${r.f} ${r.l}`;
            return (
            <div key={i} style={{ padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, background: batch.sel.has(k) ? t.accentSoft : 'transparent' }}>
              <div onClick={() => rowClick(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                {batch.selecting && <SelChk t={t} checked={batch.sel.has(k)} onChange={() => batch.toggle(k)} />}
                <Avatar f={r.f} l={r.l} size={42} theme={t} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</div>
                  <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2 }}>{r.year} · {r.major}</div>
                  <div style={{ fontSize: 12, color: t.faint, marginTop: 1 }}>{r.town} · {r.church}</div>
                </div>
                <Tag stage="candidate" size="sm" theme={t} />
              </div>
              {!batch.selecting && <div style={{ marginTop: 10 }}><PromoteBtn r={r} full /></div>}
            </div>
          );})}
        </div>
        {bar}
      </div>
    );
  }

  const cols = batch.selecting ? '34px 2fr 1fr 1.6fr 1.6fr 1.2fr' : '2fr 1fr 1.6fr 1.6fr 1.2fr';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {intro}
      <div style={{ flex: 1, overflow: 'hidden', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
          {batch.selecting && <SelChk t={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />}
          {['Candidate', 'Class', 'Major', 'Hometown', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        <div style={{ paddingBottom: batch.selecting ? 80 : 0 }}>
        {rows.map((r, i) => {
          const k = `${r.f} ${r.l}`;
          return (
          <div key={i} onClick={() => rowClick(r)} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: dense ? '8px 26px' : '12px 26px', alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(k) ? t.accentSoft : 'transparent' }}>
            {batch.selecting && <SelChk t={t} checked={batch.sel.has(k)} onChange={() => batch.toggle(k)} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <Avatar f={r.f} l={r.l} size={dense ? 28 : 32} theme={t} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</div>
                {!dense && <div style={{ marginTop: 3 }}><Tag stage="candidate" size="sm" theme={t} /></div>}
              </div>
            </div>
            <span style={{ fontSize: 13, color: t.sub }}>{r.year}</span>
            <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.major}</span>
            <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.town}</span>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{!batch.selecting && <PromoteBtn r={r} />}</div>
          </div>
        );})}
        </div>
      </div>
      {bar}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Applicant review queue — generated from submitted applications; awaiting
// accept / advance. Interview score & decision recommendation travel here.
// ───────────────────────────────────────────────────────────────────────
function ApplicantBody({ t, dense }) {
  const s = useStore();
  const eff = (r) => PSLStore.stageOf(`${r.f} ${r.l}`, 'applicant');
  const rows = APPLICANTS.filter((r) => eff(r) === 'applicant');
  const cols = '1.9fr 1.3fr 1.4fr 0.9fr 0.9fr 1.1fr 0.5fr';
  const rowPad = dense ? '7px 26px' : '11px 26px';
  const w = useViewport();
  const narrow = w < BP.tab;
  const batch = useBatch();
  const keys = rows.map((r) => `${r.f} ${r.l}`);
  const allOn = keys.length > 0 && keys.every((k) => batch.sel.has(k));
  const someOn = keys.some((k) => batch.sel.has(k));
  const rowClick = (r) => batch.selecting ? batch.toggle(`${r.f} ${r.l}`) : (window.PSLNav && window.PSLNav.go('application', { person: r }));
  const doBatch = () => { PSLStore.advanceMany([...batch.sel].map((k) => ({ key: k })), 'candidate', 'advanced'); batch.clear(); };
  const gcols = batch.selecting ? '34px ' + cols : cols;
  const bar = batch.selecting && <BatchBar t={t} count={batch.sel.size} label="Advance to Candidate" onAction={doBatch} onClear={batch.clear} />;
  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        <div style={{ padding: '15px 16px 13px', borderBottom: `1px solid ${t.line}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 21 }}>Applicants</div>
              <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>UNC Charlotte · Fall 2026</div>
            </div>
            {rows.length > 0 && <SelectToggle t={t} selecting={batch.selecting} onToggle={() => batch.selecting ? batch.clear() : batch.setSelecting(true)} />}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <StatChip t={t} n={25} label="Applicants" tone={t.stages.applicant.fg} />
            <StatChip t={t} n={12} label="New" tone={t.accent} />
            <StatChip t={t} n={8} label="Interviewed" tone="#1f6b46" />
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 10, background: t.accentSoft, border: `1px solid ${t.line}` }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 12, color: t.ink, lineHeight: 1.45 }}><b style={{ color: t.accent }}>Decision night ·</b> 8 clear to advance · 9 to discuss · 8 below the line.</span>
          </div>
        </div>
        {batch.selecting && (
          <div onClick={() => batch.setAll(keys, !allOn)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: `1px solid ${t.line}`, background: t.panel, cursor: 'pointer' }}>
            <SelChk t={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.sub }}>{allOn ? 'Deselect all' : 'Select all'}</span>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: batch.selecting ? 80 : 0 }}>
          {rows.map((r, i) => {
            const rec = recommend(r.score);
            const k = `${r.f} ${r.l}`;
            return (
              <div key={i} onClick={() => rowClick(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(k) ? t.accentSoft : 'transparent' }}>
                {batch.selecting && <SelChk t={t} checked={batch.sel.has(k)} onChange={() => batch.toggle(k)} />}
                <Avatar f={r.f} l={r.l} size={42} theme={t} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</div>
                  <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.year} · {r.major}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: t.faint }}>Submitted {r.submitted}</span>
                    {r.score != null && <span style={{ fontSize: 12, fontWeight: 700, color: t.accent, fontVariantNumeric: 'tabular-nums' }}>· {r.score.toFixed(1)}</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {rec.kind === 'await'
                    ? <span style={{ fontSize: 12, color: t.faint }}>Awaiting</span>
                    : <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, background: rec.bg, color: rec.fg, fontSize: 11.5, fontWeight: 600 }}>{rec.label}</span>}
                </div>
              </div>
            );
          })}
        </div>
        {bar}
      </div>
    );
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 25 }}>UNC Charlotte</span>
            <span style={{ fontSize: 13, color: t.faint }}>· Applicants · Fall 2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SelectToggle t={t} selecting={batch.selecting} onToggle={() => batch.selecting ? batch.clear() : batch.setSelecting(true)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <StatChip t={t} n={25} label="Applicants" tone={t.stages.applicant.fg} />
          <StatChip t={t} n={12} label="New" tone={t.accent} />
          <StatChip t={t} n={8} label="Interviewed" tone="#1f6b46" />
          <StatChip t={t} n={5} label="Awaiting decision" tone={t.faint} />
        </div>
        {/* decision-night triage banner */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10,
          background: t.accentSoft, border: `1px solid ${t.line}` }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 12.5, color: t.ink }}>
            <b style={{ color: t.accent }}>Decision night ·</b> 8 scored <b>≥ 8.5</b> (clear to advance) · 9 in the <b>discuss</b> range · 8 below the line.
          </span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: gcols, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
          {batch.selecting && <SelChk t={t} checked={allOn} indeterminate={someOn && !allOn} onChange={() => batch.setAll(keys, !allOn)} />}
          {['Applicant', 'School · Year', 'Major', 'Submitted', 'Interview', 'Recommendation', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        <div style={{ paddingBottom: batch.selecting ? 80 : 0 }}>
        {rows.map((r, i) => {
          const rec = recommend(r.score);
          const k = `${r.f} ${r.l}`;
          return (
            <div key={i} onClick={() => rowClick(r)} style={{ display: 'grid', gridTemplateColumns: gcols, gap: 12, padding: rowPad, alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer', background: batch.sel.has(k) ? t.accentSoft : 'transparent' }}>
              {batch.selecting && <SelChk t={t} checked={batch.sel.has(k)} onChange={() => batch.toggle(k)} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <Avatar f={r.f} l={r.l} size={dense ? 28 : 32} theme={t} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</div>
                  {!dense && <div style={{ marginTop: 2 }}><Tag stage="applicant" size="sm" theme={t} /></div>}
                </div>
              </div>
              <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>UNCC · {r.year}</span>
              <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.major}</span>
              <span style={{ fontSize: 13, color: t.sub }}>{r.submitted}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: r.score == null ? t.faint : t.accent, fontVariantNumeric: 'tabular-nums' }}>
                {r.score == null ? 'Not yet' : r.score.toFixed(1)}
              </span>
              <span>
                {rec.kind === 'await' ? (
                  <span style={{ fontSize: 12.5, color: t.faint }}>Awaiting</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, background: rec.bg, color: rec.fg, fontSize: 11.5, fontWeight: 600 }}>{rec.label}</span>
                )}
              </span>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!batch.selecting && <span onClick={(e) => { e.stopPropagation(); PSLStore.advance(`${r.f} ${r.l}`, `${r.f} ${r.l}`, 'candidate'); }} title="Advance to Candidate" style={{ width: 26, height: 26, borderRadius: 7, border: `1px solid ${t.line}`, background: t.panel,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={t.sub} strokeWidth="1.7"><path d="M3 6.5h6M6.5 3.5L9.5 6.5 6.5 9.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>}
              </span>
            </div>
          );
        })}
        </div>
      </div>
      {bar}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Alumni roster body — expanded fields + cross-reference banner
// ───────────────────────────────────────────────────────────────────────
function AlumniBody({ t, dense }) {
  const rows = ALUMNI;
  const cols = '2.3fr 0.8fr 1.5fr 1.9fr 1.3fr 0.9fr';
  const rowPad = dense ? '7px 26px' : '11px 26px';
  const w = useViewport();
  const narrow = w < BP.tab;
  if (narrow) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
        <div style={{ padding: '15px 16px 13px', borderBottom: `1px solid ${t.line}` }}>
          <div style={{ fontFamily: SERIF, fontSize: 21 }}>Alumni</div>
          <div style={{ fontSize: 12.5, color: t.faint, marginTop: 2 }}>UNC Charlotte</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <StatChip t={t} n={18} label="Alumni" tone={t.stages.alumni.fg} />
            <StatChip t={t} n={14} label="Open to connect" tone="#1f6b46" />
            <StatChip t={t} n={6} label="Married" tone={t.accent} />
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {rows.map((r, i) => (
            <div key={i} onClick={() => window.PSLNav && window.PSLNav.go('profile', { person: { ...r, stage: 'alumni', year: 'Alumni', town: r.loc, cohort: r.cohort } })} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer' }}>
              <Avatar f={r.f} l={r.l} size={42} theme={t} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</span>
                  {r.connect && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>Open</span>}
                </div>
                <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Class of {r.grad} · {r.major}</div>
                <div style={{ fontSize: 12, color: t.faint, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.work}</div>
                <div style={{ fontSize: 12, color: t.faint, marginTop: 1 }}>{r.loc} · {r.marital}{r.kids ? ` · ${r.kids} ${r.kids === 1 ? 'child' : 'kids'}` : ''}</div>
                {topRole(r) && <div style={{ marginTop: 6 }}><OfficeChip role={topRole(r)} theme={t} size="sm" /></div>}
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.6" style={{ flexShrink: 0, marginTop: 4 }}><path d="M5 2.5L9.5 7 5 11.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 25 }}>UNC Charlotte</span>
            <span style={{ fontSize: 13, color: t.faint }}>· Alumni</span>
          </div>
          <Segmented t={t} items={['By grad year', 'By major', 'Map']} activeIndex={0} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <StatChip t={t} n={18} label="Alumni" tone={t.stages.alumni.fg} />
          <StatChip t={t} n={14} label="Open to connect" tone="#1f6b46" />
          <StatChip t={t} n={6} label="Married" tone={t.accent} />
          <StatChip t={t} n={3} label="Out of state" tone={t.faint} />
        </div>
        {/* cross-reference helper — ties to the "engineers open to connect" need */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10,
          background: t.accentSoft, border: `1px solid ${t.line}` }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="4"/><path d="M9.5 9.5L13 13" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 12.5, color: t.ink }}>
            <b style={{ color: t.accent }}>Cross-reference ·</b> 5 alumni in <b>Engineering</b> are open to connecting with current members.
          </span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', background: t.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '11px 26px', borderBottom: `1px solid ${t.line}` }}>
          {['Alumnus', 'Class of', 'Major', 'Work', 'Location', 'Connect'].map((h) => (
            <span key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>{h}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} onClick={() => window.PSLNav && window.PSLNav.go('profile', { person: { ...r, stage: 'alumni', year: 'Alumni', town: r.loc, cohort: r.cohort } })} style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: rowPad, alignItems: 'center', borderBottom: `1px solid ${t.panel2}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0, overflow: 'hidden' }}>
              <Avatar f={r.f} l={r.l} size={dense ? 28 : 32} theme={t} />
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.f} {r.l}</div>
                {topRole(r) && <div style={{ marginTop: 3, maxWidth: '100%', overflow: 'hidden' }}><OfficeChip role={topRole(r)} theme={t} size="sm" /></div>}
                <div style={{ fontSize: 11, color: t.faint, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.marital}{r.kids ? ` · ${r.kids} ${r.kids === 1 ? 'child' : 'kids'}` : ''}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, color: t.sub, fontVariantNumeric: 'tabular-nums' }}>{r.grad}</span>
            <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.major}</span>
            <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.work}</span>
            <span style={{ fontSize: 13, color: t.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.loc}</span>
            <span>
              {r.connect ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 11.5, fontWeight: 600 }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#1f6b46" strokeWidth="2"><path d="M1.5 5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Open
                </span>
              ) : (
                <span style={{ fontSize: 12.5, color: t.faint }}>Private</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// DirectoryView — assembles TopBar + Sidebar + the right body for `view`
// ───────────────────────────────────────────────────────────────────────
function DirectoryView({ theme: t, view = 'active', density = 'comfortable' }) {
  const dense = density === 'compact';
  const w = useViewport();
  const narrow = w < BP.tab;
  const sb = <Sidebar t={t} view={view} full={narrow} />;
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="directory" sidebar={narrow ? sb : null} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {!narrow && sb}
        {view === 'alumni' ? <AlumniBody t={t} dense={dense} />
          : view === 'applicant' ? <ApplicantBody t={t} dense={dense} />
          : view === 'candidate' ? <CandidateBody t={t} dense={dense} />
          : <ActiveBody t={t} dense={dense} />}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// CohortView — grouped by New Member Formation cohort (with shared sidebar)
// ───────────────────────────────────────────────────────────────────────
function CohortView({ theme: t, density = 'comfortable', focus }) {
  const dense = density === 'compact';
  const w = useViewport();
  const narrow = w < BP.tab;
  const cohorts = [
    { name: 'Fall 2025 Cohort', sub: 'In Formation', stage: 'candidate', members: ROSTER.filter((r) => r.cohort === 'Fall 2025') },
    { name: 'Fall 2024 Cohort', sub: 'Active Members', stage: 'member', members: ROSTER.filter((r) => r.cohort === 'Fall 2024') },
    { name: 'Spring 2024 Cohort', sub: 'Active Members', stage: 'member', members: ROSTER.filter((r) => r.cohort === 'Spring 2024') },
  ];
  const hasFocus = focus && cohorts.some((c) => c.name === focus);
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="directory" sidebar={narrow ? <Sidebar t={t} view="active" full /> : null} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {!narrow && <Sidebar t={t} view="active" />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: narrow ? '15px 16px 4px' : '18px 26px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {focus && (
                <span onClick={() => window.PSLNav && window.PSLNav.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px 6px 9px', borderRadius: 9, background: t.bg, border: `1px solid ${t.line}`, color: t.sub, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9.5 3.5L5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: SERIF, fontSize: narrow ? 21 : 25 }}>UNC Charlotte</span>
                <span style={{ fontSize: 13, color: t.faint }}>{focus ? `· ${focus}` : '· by Formation cohort'}</span>
              </div>
            </div>
            {!narrow && <Segmented t={t} items={['By class', 'By cohort', 'Table']} activeIndex={1} />}
          </div>
          <div style={{ flex: 1, padding: narrow ? '14px 16px 26px' : '16px 26px 26px', display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(3, 1fr)', gap: 16, minHeight: 0, overflow: narrow ? 'auto' : 'hidden' }}>
            {cohorts.map((c) => {
              const isFocus = focus && c.name === focus;
              return (
              <div key={c.name} style={{ background: t.bg, border: `1px solid ${isFocus ? t.accent : t.line}`, borderRadius: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: isFocus ? `0 0 0 3px ${t.accentSoft}` : 'none', transition: 'box-shadow .15s' }}>
                <div style={{ padding: '15px 16px', borderBottom: `1px solid ${t.line}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: SERIF, fontSize: 16.5 }}>{c.name}</span>
                        {isFocus && <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.accent, background: t.accentSoft, padding: '2px 7px', borderRadius: 999 }}>Viewing</span>}
                      </div>
                      <div style={{ fontSize: 11.5, color: t.faint, marginTop: 3 }}>{c.members.length} men · {c.sub}</div>
                    </div>
                    <Tag stage={c.stage} size="sm" theme={t} />
                  </div>
                </div>
                <div style={{ padding: '8px 9px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {c.members.map((m, i) => (
                    <div key={i} onClick={() => window.PSLNav && window.PSLNav.go('profile', { person: m })} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: dense ? '5px 8px' : '8px 8px', borderRadius: 9, cursor: 'pointer' }}>
                      <Avatar f={m.f} l={m.l} size={dense ? 30 : 34} theme={t} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink }}>{m.f} {m.l}</div>
                        <div style={{ fontSize: 11.5, color: t.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.year} · {m.major}</div>
                      </div>
                      <Dot active={m.status === 'active'} />
                    </div>
                  ))}
                  {c.members.length === 0 && <div style={{ padding: '14px 8px', fontSize: 12, color: t.faint }}>No men in this cohort yet.</div>}
                </div>
              </div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// OverviewCard — design rationale, shown first on the canvas
// ───────────────────────────────────────────────────────────────────────
function OverviewCard({ theme }) {
  const t = theme || THEMES.navy;
  const Sw = ({ c }) => <span style={{ width: 18, height: 18, borderRadius: 5, background: c, display: 'inline-block', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }} />;
  const Row = ({ title, body }) => (
    <div style={{ marginBottom: 15 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: t.sub }}>{body}</div>
    </div>
  );
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.bg, color: t.ink, padding: '36px 38px', display: 'flex', flexDirection: 'column' }}>
      <Eyebrow theme={t}>Design exploration</Eyebrow>
      <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 500, letterSpacing: -0.3, marginTop: 8, lineHeight: 1.1 }}>The Profile Card<br/>& Member Directory</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: t.sub, marginTop: 14 }}>
        A clean, modern-SaaS take on the card that travels with every man from <b style={{ color: t.ink }}>Apply → Alumni</b>, scoped to what a <b style={{ color: t.ink }}>Leader</b> sees on desktop.
      </div>

      <div style={{ height: 1, background: t.line, margin: '20px 0' }} />

      <Row title="The Profile Card" body="One credential carries identity + a journey badge (Applicant → Candidate → Member → Alumni) and links to the cards that ride with it." />
      <Row title="Traveling cards" body="Auto-averaged interview scorecard, a milestones timeline, and prayer requests." />
      <Row title="Directory" body="A left-rail switches Applicants / Candidates / Members / Alumni; filter by everything, broken down by class & cohort, report-ready." />

      <div style={{ marginTop: 'auto' }}>
        <div style={{ height: 1, background: t.line, margin: '6px 0 16px' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 11px', borderRadius: 8, background: t.panel, border: `1px solid ${t.line}`, marginBottom: 16 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M5 1.5h4M7 1.5v3M2.5 6.5h9l-1 6h-7z" strokeLinejoin="round" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 12, color: t.sub }}>Open <b style={{ color: t.ink }}>Tweaks</b> to switch color direction, dark mode & density.</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          <div>
            <Eyebrow theme={t} style={{ marginBottom: 8 }}>Type</Eyebrow>
            <div style={{ fontFamily: SERIF, fontSize: 19 }}>Newsreader</div>
            <div style={{ fontSize: 13, color: t.sub }}>Hanken Grotesk</div>
          </div>
          <div>
            <Eyebrow theme={t} style={{ marginBottom: 8 }}>Directions</Eyebrow>
            <div style={{ display: 'flex', gap: 8 }}>
              <Sw c={THEMES.navy.accent} /><Sw c={THEMES.evergreen.accent} /><Sw c={THEMES.maroon.accent} />
            </div>
            <div style={{ fontSize: 12, color: t.faint, marginTop: 7 }}>Navy · Evergreen · Maroon</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DirectoryView, CohortView, OverviewCard, TopBar, StatChip, Segmented, FilterGroup, Check, NavItem });
