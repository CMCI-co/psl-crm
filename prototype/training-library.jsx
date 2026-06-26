// training-library.jsx — the Training Modules category inside the Resources hub.
// Module cards with status / progress; "New module" + per-card "Edit" appear
// only for Campus Directors & National Staff. Reuses ResourcesSidebar + TopBar.

const MODULES = [
  { title: 'The History & Heritage of ΦΣΛ', collection: 'New Member Formation', slides: 5, q: 4, mins: 18, audience: ['Candidates', 'Members'], status: 'Published', taken: 31, pass: 94, by: 'Jordan Tate' },
  { title: 'Understanding the Creed', collection: 'New Member Formation', slides: 7, q: 6, mins: 22, audience: ['Candidates'], status: 'Published', taken: 28, pass: 89, by: 'Devon Hayes' },
  { title: 'Financial Stewardship Basics', collection: 'New Member Formation', slides: 6, q: 5, mins: 15, audience: ['Members'], status: 'Published', taken: 24, pass: 96, by: 'Devon Hayes' },
  { title: 'Leading a Small Group', collection: 'Leadership Track', slides: 9, q: 8, mins: 28, audience: ['Members', 'Leaders only'], status: 'Published', taken: 12, pass: 83, by: 'Jordan Tate' },
  { title: 'Safe Conduct & Accountability', collection: 'Leadership Track', slides: 8, q: 10, mins: 26, audience: ['Members', 'Leaders only'], status: 'Draft', taken: 0, pass: 0, by: 'A. Reyes' },
  { title: 'Mentoring an Alum', collection: 'Alumni & Mentoring', slides: 6, q: 5, mins: 19, audience: ['Members'], status: 'Draft', taken: 0, pass: 0, by: 'Jordan Tate' },
];

function ModuleCard({ t, m, editable, featured }) {
  const draft = m.status === 'Draft';
  return (
    <div onClick={() => window.PSLNav && window.PSLNav.go('player')} style={{ border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden', background: t.bg, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      {/* cover band */}
      <div style={{ position: 'relative', height: 96, background: featured ? t.accent : t.panel2, display: 'flex', alignItems: 'center', padding: '0 18px', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', right: -14, top: -14, width: 86, height: 86, borderRadius: '50%', background: featured ? 'rgba(255,255,255,.10)' : t.bg, opacity: featured ? 1 : .6 }} />
        <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: featured ? 'rgba(255,255,255,.18)' : t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <SlideTypeIcon kind="test" color={featured ? '#fff' : t.accent} size={18} />
        </span>
        <span style={{ marginLeft: 12, zIndex: 1, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: featured ? 'rgba(255,255,255,.85)' : t.faint }}>{m.collection}</span>
        <span style={{ marginLeft: 'auto', zIndex: 1, padding: '3px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 700,
          background: draft ? t.bg : featured ? 'rgba(255,255,255,.2)' : '#e3f3ea', color: draft ? t.faint : featured ? '#fff' : '#1f6b46', border: draft ? `1px solid ${t.line}` : 'none' }}>{m.status}</span>
      </div>
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: SERIF, fontSize: 18, color: t.ink, lineHeight: 1.25, marginBottom: 8, textWrap: 'pretty' }}>{m.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11.5, color: t.faint, marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><SlideTypeIcon kind="text" color={t.faint} size={12} />{m.slides} slides</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><SlideTypeIcon kind="test" color={t.faint} size={12} />{m.q} questions</span>
          <span>· {m.mins} min</span>
        </div>
        {!draft && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10.5, color: t.faint }}>{m.taken} completed</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1f6b46' }}>{m.pass}% pass</span>
              </div>
              <div style={{ height: 5, borderRadius: 5, background: t.panel2, overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${m.pass}%`, background: '#3f7a52', borderRadius: 5 }} />
              </div>
            </div>
          </div>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, flex: 1 }}>
            {m.audience.map((a) => <span key={a} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: t.accentSoft, color: t.accent }}>{a}</span>)}
          </div>
          {editable && (
            <span onClick={(e) => { e.stopPropagation(); window.PSLNav && window.PSLNav.go('builder'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: t.accent }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M9.5 2.5l2 2-6.5 6.5-2.5.5.5-2.5z" strokeLinejoin="round" /></svg> Edit
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TrainingLibrary({ theme: t, role = 'Campus Director' }) {
  const editable = canEdit(role);
  const published = MODULES.filter((m) => m.status === 'Published').length;
  const drafts = MODULES.filter((m) => m.status === 'Draft').length;
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="resources" />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <ResourcesSidebar t={t} active="training" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* header */}
          <div style={{ padding: '18px 26px 14px', background: t.bg, borderBottom: `1px solid ${t.line}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: SERIF, fontSize: 25 }}>Training Modules</span>
                  <span style={{ fontSize: 13, color: t.faint }}>· {published} published · {drafts} drafts</span>
                </div>
                <div style={{ fontSize: 12.5, color: t.faint, marginTop: 3 }}>Slide-based lessons — text, images, video & games — each ending in a pass/fail test.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {editable ? (
                  <Btn t={t} kind="primary" label="New module" onClick={() => window.PSLNav && window.PSLNav.go('builder')}
                    icon={<svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg>} />
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 9, background: t.panel, border: `1px solid ${t.line}`, fontSize: 12, color: t.faint, fontWeight: 600 }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.6"><rect x="4" y="7.5" width="8" height="5.5" rx="1.3" /><path d="M5.7 7.5V6a2.3 2.3 0 014.6 0v1.5" strokeLinecap="round" /></svg>
                    Authoring restricted to leaders
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* grid */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px 26px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {editable && (
                <div onClick={() => window.PSLNav && window.PSLNav.go('builder')} style={{ border: `1.5px dashed ${t.line}`, borderRadius: 14, minHeight: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', background: t.bg }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.ink }}>Build a training module</div>
                    <div style={{ fontSize: 11.5, color: t.faint, marginTop: 3, maxWidth: 180 }}>Slides + a pass/fail test, start to finish</div>
                  </div>
                </div>
              )}
              {MODULES.map((m, i) => <ModuleCard key={i} t={t} m={m} editable={editable} featured={i === 0} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TrainingLibrary, ModuleCard, MODULES });
