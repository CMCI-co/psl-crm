// engagement.jsx — the system-wide engagement record. Built ON the Profile Card
// so "Contact & Details" stays consistent for every guy (member or alum), plus
// editable accordion sections: How They're Doing, Call Log, Follow-ups, Prayer
// Requests, Giving, Ways to Help. Campus Directors & National Staff can edit.
// Reuses global data + atoms from features.jsx / kit.jsx / cards.jsx.

// ── Accordion shell ─────────────────────────────────────────────────────
function AccordionCard({ t, icon, title, summary, badge, defaultOpen, editable, editLabel, onEdit, children }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, overflow: 'hidden' }}>
      <div onClick={() => setOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontFamily: SERIF, fontSize: 17, color: t.ink }}>{title}</span>
            {badge}
          </div>
          {summary && <div style={{ fontSize: 11.5, color: t.faint, marginTop: 1 }}>{summary}</div>}
        </div>
        {open && editable && (
          <span onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: t.accent, cursor: 'pointer', marginRight: 4 }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.7"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg>{editLabel || 'Add'}
          </span>
        )}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.7" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }}><path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {open && <div style={{ padding: '4px 16px 16px', borderTop: `1px solid ${t.panel2}` }}>{children}</div>}
    </div>
  );
}

const REL_OPTIONS = ['Single', 'Dating', 'Married', 'Divorced', 'Widower'];

// ── Section bodies (reuse the global engagement data) ───────────────────
function HowDoingBody({ t, editable }) {
  const w = useViewport();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: w < BP.phone ? '1fr' : '1fr 1fr', gap: 12, paddingTop: 12 }}>
      {LIFE_AREAS.map((x) => (
        <div key={x.key} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: '13px 15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: t.bg, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AreaIcon kind={x.key} color={t.accent} /></span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{x.label}</span>
            <span style={{ marginLeft: 'auto' }}><StatusPill tone={x.tone} label={x.status} /></span>
          </div>
          <p style={{ margin: '0 0 7px', fontSize: 12.5, lineHeight: 1.5, color: t.sub, textWrap: 'pretty' }}>{x.note}</p>
          <div style={{ fontSize: 11, color: t.faint }}>Updated {x.date} · {x.by}</div>
        </div>
      ))}
    </div>
  );
}

function CallLogBody({ t, editable, person }) {
  const [ch, setCh] = React.useState('Call');
  const [note, setNote] = React.useState('');
  const who = person ? `${person.f} ${person.l}` : `${PROFILE.first} ${PROFILE.last}`;
  const s = useStore();
  const liveCalls = s.activity.filter((e) => e.who === who);
  const save = () => { PSLStore.logActivity({ type: ch, who, note: note.trim() || `${ch} logged.` }); setNote(''); };
  return (
    <div style={{ paddingTop: 12 }}>
      {editable && (
        <div style={{ border: `1px solid ${t.line}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${t.line}`, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: t.panel, borderRadius: 9, border: `1px solid ${t.line}` }}>
              {['Call', 'Text', 'Email', 'Visit'].map((v) => { const on = v === ch; return (
                <span key={v} onClick={() => setCh(v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: on ? t.bg : 'transparent', color: on ? t.ink : t.faint, boxShadow: on ? '0 1px 2px rgba(0,0,0,.1)' : 'none' }}>
                  <ChannelIcon kind={v} color={on ? t.accent : t.faint} />{v}
                </span>
              );})}
            </div>
            <div style={{ padding: '7px 11px', borderRadius: 8, border: `1px solid ${t.line}`, fontSize: 12.5, color: t.ink }}>Today · Jun 25</div>
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes from your conversation — what you discussed, how they're doing, anything to remember…"
            style={{ width: '100%', minHeight: 60, resize: 'vertical', border: 'none', outline: 'none', padding: '12px 13px', fontFamily: UI, fontSize: 13, color: t.ink, background: t.bg, boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', borderTop: `1px solid ${t.line}`, background: t.panel }}>
            <span style={{ fontSize: 11.5, color: t.faint }}>Saves to this record &amp; the team activity feed.</span>
            <div style={{ marginLeft: 'auto' }}><Btn t={t} kind="primary" label="Save log" onClick={save} /></div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {liveCalls.map((c) => (
          <div key={c.id} style={{ background: t.accentSoft, border: `1px solid ${t.accent}`, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <ChannelBadge t={t} type={c.type} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{c.when}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: t.accent }}>NEW</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MiniAvatar name={c.by} t={t} size={20} /><span style={{ fontSize: 11.5, color: t.faint }}>{c.by}</span>
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: t.sub, textWrap: 'pretty' }}>{c.note}</p>
          </div>
        ))}
        {CALLS.map((c, i) => (
          <div key={i} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <ChannelBadge t={t} type={c.type} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{c.date}</span>
              {c.dur && <span style={{ fontSize: 12, color: t.faint }}>· {c.dur}</span>}
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MiniAvatar name={c.by} t={t} size={20} /><span style={{ fontSize: 11.5, color: t.faint }}>{c.by}</span>
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: t.sub, textWrap: 'pretty' }}>{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowupsBody({ t, editable, person }) {
  const s = useStore();
  const who = person ? `${person.f} ${person.l}` : `${PROFILE.first} ${PROFILE.last}`;
  const live = s.tasks.filter((tk) => tk.who === who);
  const all = [...live, ...FOLLOWUPS.map((f, i) => ({ ...f, id: 'static' + i }))];
  return (
    <div style={{ paddingTop: 6 }}>
      {all.map((f, i) => {
        const isLive = f.id && !String(f.id).startsWith('static');
        return (
        <div key={f.id || i} style={{ display: 'flex', gap: 11, padding: '11px 2px', borderBottom: i < all.length - 1 ? `1px solid ${t.panel2}` : 'none', alignItems: 'flex-start' }}>
          <span onClick={() => isLive && PSLStore.toggleTask(f.id)} style={{ marginTop: 1, flexShrink: 0, cursor: isLive ? 'pointer' : 'default' }}><TaskStatusIcon status={f.status} t={t} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, lineHeight: 1.4, fontWeight: 500, color: f.status === 'done' ? t.faint : t.ink, textDecoration: f.status === 'done' ? 'line-through' : 'none', marginBottom: 6 }}>{f.title}{isLive && <span style={{ marginLeft: 7, fontSize: 10, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '1px 7px', borderRadius: 999, verticalAlign: 'middle' }}>New</span>}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
              {isLive
                ? <OwnerMenu t={t} current={f.owner} onPick={(n) => PSLStore.reassignTask(f.id, n)} title="Reassign to"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}><MiniAvatar name={f.owner} t={t} size={18} /><span style={{ fontSize: 11, color: t.sub }}>{f.owner.split(' ')[0]}</span><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={t.faint} strokeWidth="1.5"><path d="M3 4.5L6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></OwnerMenu>
                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MiniAvatar name={f.owner} t={t} size={18} /><span style={{ fontSize: 11, color: t.sub }}>{f.owner.split(' ')[0]}</span></span>}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.sub }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="2.5" width="9" height="8" rx="1.2" /><path d="M1.5 4.8h9M4 1.5v2M8 1.5v2" strokeLinecap="round" /></svg>{f.due}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.faint }}><ChannelIcon kind={f.channel} color={t.faint} size={11} />{f.channel}</span>
              {f.status !== 'done' && <PriorityFlag pri={f.pri} />}
            </div>
          </div>
        </div>
      );})}
    </div>
  );
}

function PrayerBody({ t, editable }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 12 }}>
      {PRAYER.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', marginTop: 1, flexShrink: 0, border: `1.5px solid ${p.open ? t.line : '#1f6b46'}`, background: p.open ? 'transparent' : '#1f6b46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!p.open && <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2"><path d="M1.5 5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span style={{ flex: 1, fontSize: 12.5, lineHeight: 1.45, color: p.open ? t.ink : t.faint, textDecoration: p.open ? 'none' : 'line-through' }}>{p.text}</span>
          <span style={{ fontSize: 11, color: t.faint, whiteSpace: 'nowrap' }}>{p.date}</span>
        </div>
      ))}
    </div>
  );
}

function GivingBody({ t, editable }) {
  return (
    <div style={{ paddingTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: SERIF, fontSize: 26, color: t.ink, lineHeight: 1 }}>{GIVING.amount.split(' ')[0]}</span>
        <span style={{ fontSize: 13, color: t.faint }}>/ mo · since {GIVING.since}</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 10.5, fontWeight: 700 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f6b46' }} />Active</span>
      </div>
      <div style={{ display: 'flex' }}>
        {[['This year', GIVING.ytd], ['Lifetime', GIVING.lifetime], ['Cadence', 'Monthly']].map(([l, v], i) => (
          <div key={l} style={{ flex: 1, paddingLeft: i ? 14 : 0, borderLeft: i ? `1px solid ${t.line}` : 'none' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', color: t.faint, marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WaysToHelpBody({ t, editable }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, paddingTop: 12 }}>
      {HELP.map((h) => (
        <div key={h.key} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <span style={{ width: 30, height: 18, borderRadius: 999, flexShrink: 0, marginTop: 1, background: h.on ? '#1f6b46' : t.line, position: 'relative' }}>
            <span style={{ position: 'absolute', top: 2, left: h.on ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{h.label}</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.45, color: t.faint, marginTop: 2 }}>{h.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ProfileDetail — Profile Card + editable accordion engagement sections ──
function ProfileDetail({ theme: t, person, section = 'directory', role = 'Campus Director' }) {
  const editable = canEdit(role);
  const isAlum = person ? (person.stage === 'alumni' || !!person.grad) : false;
  const merged = person ? {
    first: person.f, last: person.l, middle: '',
    year: person.year || (isAlum ? 'Alumni' : 'Member'),
    school: 'UNC Charlotte', major: person.major || PROFILE.major,
    hometown: person.town || person.loc || PROFILE.hometown,
    church: person.church || PROFILE.church,
    cohort: person.cohort ? person.cohort + ' Cohort' : PROFILE.cohort,
    stage: person.stage || (isAlum ? 'alumni' : 'member'),
    roles: person.roles || [],
    employer: person.work || (isAlum ? PROFILE.employer : PROFILE.employer),
    relationship: person.marital || PROFILE.relationship,
    due: person.due, next: person.next, cadence: person.cadence,
  } : null;
  const st = (merged && merged.stage) || 'member';
  const crumb = { applicant: 'Applicants', candidate: 'Candidates', member: 'Active Members', alumni: 'Alumni' }[st] || 'Directory';
  const name = person ? `${person.f} ${person.l}` : `${PROFILE.first} ${PROFILE.last}`;
  const firstLast = person ? { f: person.f, l: person.l } : { f: PROFILE.first, l: PROFILE.last };
  const [assignOpen, setAssignOpen] = React.useState(false);
  const collab = useStore();
  const promoteKey = person ? `${person.f} ${person.l}` : null;
  const effSt = promoteKey ? PSLStore.stageOf(promoteKey, st) : st;

  const watch = LIFE_AREAS.filter((x) => x.tone === 'watch').length;
  const openFollow = FOLLOWUPS.filter((f) => f.status !== 'done').length;
  const openPrayer = PRAYER.filter((p) => p.open).length;
  const waysOn = HELP.filter((h) => h.on).length;

  const headRoot = { applicant: 'Directory', candidate: 'Directory', member: section === 'tracker' ? 'Relationship Tracker' : 'Directory', alumni: section === 'tracker' ? 'Relationship Tracker' : 'Directory' }[st];

  const w = useViewport();
  const narrow = w < BP.tab;
  const [tab, setTab] = React.useState('profile');

  // ── Narrow: the Card system becomes a tabbed surface ──────────────────
  if (narrow) {
    const Panel = ({ title, badge, children }) => (
      <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2 }}>
          <Eyebrow theme={t}>{title}</Eyebrow>
          {badge}
        </div>
        {children}
      </div>
    );
    const tabItems = [
      { key: 'profile', label: 'Profile', icon: (on) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={on ? t.onAccent : t.faint} strokeWidth="1.5"><circle cx="8" cy="5.4" r="2.6"/><path d="M3.4 13c0-2.4 1.9-4 4.6-4s4.6 1.6 4.6 4" strokeLinecap="round"/></svg> },
      { key: 'doing', label: 'Updates', badge: watch > 0 ? watch : null, icon: (on) => <AreaIcon kind="personal" color={on ? t.onAccent : t.faint} size={14} /> },
      { key: 'calls', label: 'Calls', badge: CALLS.length, icon: (on) => <ChannelIcon kind="Call" color={on ? t.onAccent : t.faint} size={13} /> },
      { key: 'follow', label: 'Follow-ups', badge: openFollow, icon: (on) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={on ? t.onAccent : t.faint} strokeWidth="1.5"><path d="M3 8.2l2.2 2.2L11 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { key: 'prayer', label: 'Prayer', badge: openPrayer, icon: (on) => <AreaIcon kind="prayer" color={on ? t.onAccent : t.faint} size={14} /> },
      { key: 'giving', label: 'Giving', icon: (on) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={on ? t.onAccent : t.faint} strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M6.3 6.2c0-.8.8-1.3 1.7-1.3s1.7.4 1.7 1.2-.8 1.1-1.7 1.1-1.7.4-1.7 1.2.8 1.2 1.7 1.2 1.7-.5 1.7-1.2" strokeLinecap="round"/></svg> },
      { key: 'help', label: 'Help', badge: waysOn, icon: (on) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={on ? t.onAccent : t.faint} strokeWidth="1.5"><path d="M8 13s-5-3.2-5-7a3 3 0 015-2.2A3 3 0 0113 6c0 3.8-5 7-5 7z" strokeLinejoin="round"/></svg> },
    ];
    return (
      <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
        <TopBar t={t} section={section} />
        <SubBar t={t} crumbs={[headRoot, crumb, name]}>
          {editable && effSt === 'candidate' && <Btn t={t} kind="good" label="Promote" onClick={() => PSLStore.promote(promoteKey, name)} icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 10.5V3.5M3.8 6.5L7 3.3l3.2 3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />}
          {editable && <Btn t={t} kind="primary" label="Log" icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 2.5v9M2.5 7h9" strokeLinecap="round" /></svg>} />}
        </SubBar>
        <TabStrip t={t} items={tabItems} active={tab} onChange={setTab} />
        <div style={{ padding: '14px 14px 30px' }}>
          {!editable && tab !== 'profile' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderRadius: 11, background: t.bg, border: `1px solid ${t.line}`, fontSize: 12, color: t.faint, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.6"><rect x="4" y="7.5" width="8" height="5.5" rx="1.3" /><path d="M5.7 7.5V6a2.3 2.3 0 014.6 0v1.5" strokeLinecap="round" /></svg>
              Viewing only — edits are reserved for Campus Directors & National Staff.
            </div>
          )}
          {tab === 'profile' && (
            <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, overflow: 'hidden' }}>
              <ProfileCard theme={t} stage={effSt} person={merged} narrow />
            </div>
          )}
          {tab === 'doing' && <Panel title="How they're doing" badge={watch > 0 ? <StatusPill tone="watch" label={`${watch} needs attention`} /> : <StatusPill tone="good" label="Healthy" />}><HowDoingBody t={t} editable={editable} /></Panel>}
          {tab === 'calls' && <Panel title="Call log"><CallLogBody t={t} editable={editable} person={firstLast} /></Panel>}
          {tab === 'follow' && <Panel title="Follow-ups" badge={editable ? <span onClick={() => setAssignOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '2px 9px', borderRadius: 999, cursor: 'pointer' }}><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.8"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round"/></svg>Assign</span> : <span style={{ fontSize: 11, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '1px 8px', borderRadius: 999 }}>{openFollow} open</span>}><FollowupsBody t={t} editable={editable} person={firstLast} /></Panel>}
          {tab === 'prayer' && <Panel title="Prayer requests" badge={<StatusPill tone="info" label={`${openPrayer} open`} />}><PrayerBody t={t} editable={editable} /></Panel>}
          {tab === 'giving' && <Panel title="Giving"><GivingBody t={t} editable={editable} /></Panel>}
          {tab === 'help' && <Panel title="Ways to help" badge={<span style={{ fontSize: 11, fontWeight: 700, color: '#1f6b46', background: '#e3f3ea', padding: '1px 8px', borderRadius: 999 }}>{waysOn} active</span>}><WaysToHelpBody t={t} editable={editable} /></Panel>}
        </div>
        {assignOpen && <NewFollowupForm modal t={t} people={[firstLast]} defaultWho={name} onClose={() => setAssignOpen(false)} />}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: UI, minHeight: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section={section} />
      <SubBar t={t} crumbs={[headRoot, crumb, name]}>
        <div style={{ display: 'flex', gap: 8 }}>
          {editable && <Btn t={t} kind="ghost" label="Edit profile" icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.5 2.5l2 2-6.5 6.5-2.5.5.5-2.5z" strokeLinejoin="round" /></svg>} />}
          {editable && effSt === 'candidate' && <Btn t={t} kind="good" label="Promote to Member" onClick={() => PSLStore.promote(promoteKey, name)} icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 10.5V3.5M3.8 6.5L7 3.3l3.2 3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />}
          {editable && <Btn t={t} kind="primary" label="Log interaction" icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 2.5v9M2.5 7h9" strokeLinecap="round" /></svg>} />}
        </div>
      </SubBar>

      <div style={{ flex: 1, padding: '24px 26px', display: 'grid', gridTemplateColumns: 'minmax(540px, 580px) 1fr', gap: 22, alignItems: 'start', maxWidth: 1320, width: '100%', margin: '0 auto' }}>
        {/* the Profile Card — consistent Contact & Details */}
        <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 24 }}>
          <ProfileCard theme={t} stage={effSt} person={merged} />
        </div>

        {/* editable accordion engagement sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {!editable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderRadius: 11, background: t.bg, border: `1px solid ${t.line}`, fontSize: 12, color: t.faint }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.faint} strokeWidth="1.6"><rect x="4" y="7.5" width="8" height="5.5" rx="1.3" /><path d="M5.7 7.5V6a2.3 2.3 0 014.6 0v1.5" strokeLinecap="round" /></svg>
              You're viewing this record. Tracking & edits are reserved for Campus Directors & National Staff.
            </div>
          )}
          <AccordionCard t={t} defaultOpen editable={editable} editLabel="Add update" title="How they're doing"
            icon={<AreaIcon kind="personal" color={t.accent} />}
            summary={`${LIFE_AREAS.length} life areas tracked`}
            badge={watch > 0 ? <StatusPill tone="watch" label={`${watch} needs attention`} /> : <StatusPill tone="good" label="Healthy" />}>
            <HowDoingBody t={t} editable={editable} />
          </AccordionCard>

          <AccordionCard t={t} defaultOpen editable={editable} editLabel="Log" title="Call log"
            icon={<ChannelIcon kind="Call" color={t.accent} size={15} />}
            summary={`${CALLS.length} touches · last ${CALLS[0].date}`}>
            <CallLogBody t={t} editable={editable} person={firstLast} />
          </AccordionCard>

          <AccordionCard t={t} editable={editable} editLabel="Assign" onEdit={() => setAssignOpen(true)} title="Follow-ups"
            icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M3 8.2l2.2 2.2L11 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            summary="Tasks owed across the team"
            badge={<span style={{ fontSize: 11, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '1px 8px', borderRadius: 999 }}>{openFollow} open</span>}>
            <FollowupsBody t={t} editable={editable} person={firstLast} />
          </AccordionCard>

          <AccordionCard t={t} editable={editable} editLabel="Add" title="Prayer requests"
            icon={<AreaIcon kind="prayer" color={t.accent} />}
            summary="Lifted in prayer"
            badge={<StatusPill tone="info" label={`${openPrayer} open`} />}>
            <PrayerBody t={t} editable={editable} />
          </AccordionCard>

          <AccordionCard t={t} editable={editable} editLabel="Edit" title="Giving"
            icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v6M6.3 6.2c0-.8.8-1.3 1.7-1.3s1.7.4 1.7 1.2-.8 1.1-1.7 1.1-1.7.4-1.7 1.2.8 1.2 1.7 1.2 1.7-.5 1.7-1.2" strokeLinecap="round" /></svg>}
            summary={`${GIVING.status}`}>
            <GivingBody t={t} editable={editable} />
          </AccordionCard>

          <AccordionCard t={t} editable={editable} editLabel="Edit" title="Ways to help"
            icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M8 13s-5-3.2-5-7a3 3 0 015-2.2A3 3 0 0113 6c0 3.8-5 7-5 7z" strokeLinejoin="round" /></svg>}
            summary="How they're open to serving"
            badge={<span style={{ fontSize: 11, fontWeight: 700, color: '#1f6b46', background: '#e3f3ea', padding: '1px 8px', borderRadius: 999 }}>{waysOn} active</span>}>
            <WaysToHelpBody t={t} editable={editable} />
          </AccordionCard>
        </div>
      </div>
      {assignOpen && <NewFollowupForm modal t={t} people={[firstLast]} defaultWho={name} onClose={() => setAssignOpen(false)} />}
    </div>
  );
}

Object.assign(window, { AccordionCard, ProfileDetail, REL_OPTIONS });
