// collab.jsx — the live team-collaboration layer for the CRM.
// Turns the static owner avatars and "Assign" affordances into a working
// assignment system: a shared in-memory store (so every screen stays in sync),
// a person-picker, an identity switcher (be any leader to feel the hand-off),
// in-app notifications + toasts, and a live activity feed. All mock data — no
// backend — but fully interactive so the collaboration flow can be felt.
//
// Loads BEFORE directory/features/engagement so they can destructure these
// helpers off window. Self-contained: does not depend on features.jsx atoms.

const { UI: CUI, SERIF: CSERIF } = window;

// The leadership team that can own relationships & receive assignments.
const TEAM = [
  { name: 'Jordan Tate',    role: 'Campus Director' },
  { name: 'Anthony Reyes',  role: 'Discipleship Lead' },
  { name: 'Devon Hayes',    role: 'Alumni Chair' },
  { name: 'Marcus Bellamy', role: 'Service Chair' },
];

// Journey lifecycle: Applicant → Candidate → Member → Alumni.
const STAGE_LABEL = { applicant: 'Applicant', candidate: 'Candidate', member: 'Active Member', alumni: 'Alumni' };
const STAGE_FLOW = {
  applicant: { next: 'candidate', label: 'Advance to Candidate', verb: 'advanced' },
  candidate: { next: 'member',    label: 'Promote to Member',    verb: 'promoted' },
  member:    { next: 'alumni',    label: 'Move to Alumni',       verb: 'moved' },
};

// ── Shared store ─────────────────────────────────────────────────────────
const PSLStore = (function () {
  let state = {
    me: 'Jordan Tate',
    owners: {},     // personKey -> owner name (override of seed value)
    stages: {},     // personKey -> stage override (e.g. promoted candidate -> member)
    tasks: [],      // {id, title, who, owner, due, channel, pri, status, by}
    activity: [],   // live events prepended onto the static feed
    toasts: [],     // {id, text}
    notifs: [],     // {id, to, text, sub, read, ts}
  };
  const subs = new Set();
  const emit = () => subs.forEach((fn) => fn());
  let uid = 1;
  const nid = () => 'n' + (uid++);
  let seeded = false;

  function dropToast(id) { state = { ...state, toasts: state.toasts.filter((x) => x.id !== id) }; emit(); }
  function pushToast(text) { const id = nid(); state = { ...state, toasts: [{ id, text }, ...state.toasts] }; emit(); setTimeout(() => dropToast(id), 3400); }
  function notify(to, text, sub) {
    if (to === state.me) return; // don't notify yourself
    state = { ...state, notifs: [{ id: nid(), to, text, sub, read: false, ts: 'just now' }, ...state.notifs] };
  }
  const first = (n) => (n || '').split(' ')[0];

  return {
    seed(tasks) {
      if (seeded) return; seeded = true;
      state = { ...state, tasks: (tasks || []).map((tk) => ({ id: nid(), status: tk.bucket === 'overdue' ? 'doing' : 'todo', owner: tk.owner || 'Jordan Tate', ...tk })) };
      emit();
    },
    get: () => state,
    sub(fn) { subs.add(fn); return () => subs.delete(fn); },
    setMe(name) { state = { ...state, me: name }; emit(); },
    ownerOf(key, fallback) { return state.owners[key] || fallback; },

    // Journey stage override — advance someone along Applicant → Candidate →
    // Member → Alumni. Persists across every screen.
    stageOf(key, fallback) { return state.stages[key] || fallback; },
    promote(key, label) { this.advance(key, label, 'member'); },
    advance(key, label, toStage) {
      if (state.stages[key] === toStage) return;
      state = { ...state, stages: { ...state.stages, [key]: toStage } };
      pushToast(`${label} → ${STAGE_LABEL[toStage] || toStage}`);
      emit();
    },
    advanceMany(items, toStage, verb) {
      var changed = { ...state.stages };
      items.forEach((it) => { changed[it.key] = toStage; });
      state = { ...state, stages: changed };
      pushToast(`${items.length} ${items.length === 1 ? 'profile' : 'profiles'} ${verb || 'advanced'} → ${STAGE_LABEL[toStage] || toStage}`);
      emit();
    },

    reassign(key, label, toName) {
      const prev = state.owners[key];
      if (prev === toName) return;
      state = { ...state, owners: { ...state.owners, [key]: toName } };
      notify(toName, `${first(state.me)} gave you ${label}`, 'Relationship owner');
      pushToast(`${label} → ${toName === state.me ? 'you' : first(toName)}`);
      emit();
    },

    addTask(task) {
      const tk = { id: nid(), status: 'todo', by: state.me, ...task };
      state = { ...state, tasks: [tk, ...state.tasks] };
      notify(tk.owner, `${first(state.me)} assigned you a follow-up`, tk.title);
      pushToast(`Follow-up assigned to ${tk.owner === state.me ? 'you' : first(tk.owner)}`);
      emit();
    },

    reassignTask(id, toName) {
      const tk = state.tasks.find((x) => x.id === id);
      if (!tk || tk.owner === toName) return;
      state = { ...state, tasks: state.tasks.map((x) => x.id === id ? { ...x, owner: toName } : x) };
      notify(toName, `${first(state.me)} reassigned a follow-up to you`, tk.title);
      pushToast(`Reassigned to ${toName === state.me ? 'you' : first(toName)}`);
      emit();
    },

    toggleTask(id) {
      state = { ...state, tasks: state.tasks.map((x) => x.id === id ? { ...x, status: x.status === 'done' ? 'todo' : 'done' } : x) };
      emit();
    },

    logActivity(ev) {
      state = { ...state, activity: [{ id: nid(), by: state.me, when: 'just now', ...ev }, ...state.activity] };
      pushToast(`Logged ${(ev.type || 'note').toLowerCase()} with ${first(ev.who)}`);
      emit();
    },

    markRead(to) { state = { ...state, notifs: state.notifs.map((n) => n.to === to ? { ...n, read: true } : n) }; emit(); },
    dropToast,
  };
})();

// Re-render hook — any component that shows live data calls this.
function useStore() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => PSLStore.sub(force), []);
  return PSLStore.get();
}

// Initials avatar (self-contained so collab has no cross-file dependency).
function MiniA({ name, t, size = 22 }) {
  const init = (name || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: t.accentSoft, color: t.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 700, flexShrink: 0, fontFamily: CUI }}>{init}</div>
  );
}

// ── OwnerMenu — the person-picker popover ─────────────────────────────────
// Wraps any trigger element; opens a "Assign to" list of the team.
function OwnerMenu({ t, current, onPick, children, align = 'left', title = 'Assign to' }) {
  const [open, setOpen] = React.useState(false);
  const me = PSLStore.get().me;
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', minWidth: 0, maxWidth: '100%' }} onClick={(e) => e.stopPropagation()}>
      <span onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} style={{ display: 'inline-flex', cursor: 'pointer', minWidth: 0, maxWidth: '100%' }}>{children}</span>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', [align]: 0, zIndex: 80, minWidth: 224,
          background: t.bg, border: `1px solid ${t.line}`, borderRadius: 12, boxShadow: '0 14px 40px rgba(15,20,32,.2)', padding: 6, fontFamily: CUI }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint, padding: '6px 9px 7px' }}>{title}</div>
          {TEAM.map((m) => {
            const on = m.name === current;
            return (
              <div key={m.name} onClick={() => { onPick(m.name); setOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 9px', borderRadius: 8, cursor: 'pointer', background: on ? t.accentSoft : 'transparent' }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = t.panel; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                <MiniA name={m.name} t={t} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{m.name}{m.name === me ? ' (you)' : ''}</div>
                  <div style={{ fontSize: 11, color: t.faint }}>{m.role}</div>
                </div>
                {on && <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.9"><path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            );
          })}
        </div>
      )}
    </span>
  );
}

// An owner chip that opens the picker on click. Shows "You" for current user.
function OwnerChip({ t, owner, label, onPick, size = 20 }) {
  const me = PSLStore.get().me;
  const isMe = owner === me;
  return (
    <OwnerMenu t={t} current={owner} onPick={onPick}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '3px 9px 3px 3px', borderRadius: 999,
        border: `1px solid ${t.line}`, background: t.bg, minWidth: 0, maxWidth: '100%' }}
        title={`Owner: ${owner} — click to reassign`}>
        <MiniA name={owner} t={t} size={size} />
        <span style={{ fontSize: 12, color: isMe ? t.ink : t.sub, fontWeight: isMe ? 600 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isMe ? 'You' : owner.split(' ')[0]}</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.faint} strokeWidth="1.5" style={{ flexShrink: 0 }}><path d="M3 4.5L6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </OwnerMenu>
  );
}

// ── NewFollowupForm — the working "Assign" popover ────────────────────────
function NewFollowupForm({ t, people = [], defaultWho, onClose, modal }) {
  const me = PSLStore.get().me;
  const [who, setWho] = React.useState(defaultWho || (people[0] ? `${people[0].f} ${people[0].l}` : ''));
  const [title, setTitle] = React.useState('');
  const [owner, setOwner] = React.useState(me);
  const [channel, setChannel] = React.useState('Call');
  const [pri, setPri] = React.useState('med');
  const [due, setDue] = React.useState('This week');
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const lbl = { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: t.faint, marginBottom: 5, display: 'block' };
  const inp = { width: '100%', fontFamily: CUI, fontSize: 13, color: t.ink, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 8, padding: '8px 10px', outline: 'none' };
  const canSave = title.trim().length > 0;
  const save = () => { if (!canSave) return; PSLStore.addTask({ title: title.trim(), who, owner, channel, pri, due }); onClose(); };
  const cardStyle = modal
    ? { position: 'relative', width: 320, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, boxShadow: '0 24px 60px rgba(15,20,32,.3)', padding: 16, fontFamily: CUI }
    : { position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 80, width: 300, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, boxShadow: '0 16px 44px rgba(15,20,32,.22)', padding: 14, fontFamily: CUI };
  const form = (
    <div ref={ref} onClick={(e) => e.stopPropagation()} style={cardStyle}>
      <div style={{ fontFamily: CSERIF, fontSize: 16, marginBottom: 12 }}>New follow-up</div>

      <label style={lbl}>Task</label>
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q2 check-in call" style={{ ...inp, marginBottom: 12 }} />

      <label style={lbl}>About</label>
      <select value={who} onChange={(e) => setWho(e.target.value)} style={{ ...inp, marginBottom: 12 }}>
        {people.map((p) => { const n = `${p.f} ${p.l}`; return <option key={n} value={n}>{n}</option>; })}
      </select>

      <label style={lbl}>Assign to</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        {TEAM.map((m) => {
          const on = m.name === owner;
          return (
            <div key={m.name} onClick={() => setOwner(m.name)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 7px', borderRadius: 8, cursor: 'pointer',
              background: on ? t.accentSoft : 'transparent', border: `1px solid ${on ? t.accent : 'transparent'}` }}>
              <MiniA name={m.name} t={t} size={24} />
              <span style={{ fontSize: 12.5, fontWeight: on ? 600 : 500, color: on ? t.accent : t.ink }}>{m.name === me ? 'You' : m.name}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Channel</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} style={inp}>
            {['Call', 'Text', 'Email', 'Visit'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Priority</label>
          <select value={pri} onChange={(e) => setPri(e.target.value)} style={inp}>
            <option value="high">High</option><option value="med">Med</option><option value="low">Low</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onClose} style={{ flex: '0 0 auto', fontFamily: CUI, fontSize: 12.5, fontWeight: 600, padding: '8px 14px', borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer' }}>Cancel</button>
        <button onClick={save} disabled={!canSave} style={{ flex: 1, fontFamily: CUI, fontSize: 12.5, fontWeight: 600, padding: '8px 14px', borderRadius: 9, border: 'none',
          background: canSave ? t.accent : t.line, color: canSave ? t.onAccent : t.faint, cursor: canSave ? 'pointer' : 'default' }}>Assign follow-up</button>
      </div>
    </div>
  );
  if (!modal) return form;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,20,32,.46)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {form}
    </div>
  );
}

// ── NotifBell — header notification bell for the current user ─────────────
function NotifBell({ t }) {
  const s = useStore();
  const [open, setOpen] = React.useState(false);
  const mine = s.notifs.filter((n) => n.to === s.me);
  const unread = mine.filter((n) => !n.read).length;
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const toggle = () => { setOpen((o) => { const nx = !o; if (nx && unread) PSLStore.markRead(s.me); return nx; }); };
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={toggle} aria-label="Notifications" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer' }}>
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2.5a4.5 4.5 0 0 0-4.5 4.5c0 3-1 4-1.5 4.6h12c-.5-.6-1.5-1.6-1.5-4.6A4.5 4.5 0 0 0 9 2.5zM7.2 14.5a1.8 1.8 0 0 0 3.6 0" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {unread > 0 && <span style={{ position: 'absolute', top: 5, right: 5, minWidth: 15, height: 15, padding: '0 4px', borderRadius: 999, background: '#b3402f', color: '#fff', fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CUI }}>{unread}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 80, width: 312, maxHeight: 380, overflowY: 'auto',
          background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, boxShadow: '0 16px 44px rgba(15,20,32,.22)', padding: 6, fontFamily: CUI }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, padding: '8px 10px 9px' }}>Notifications</div>
          {mine.length === 0
            ? <div style={{ padding: '14px 10px 18px', fontSize: 12.5, color: t.faint }}>Nothing assigned to you yet. When a teammate hands off a relationship or follow-up, it shows up here.</div>
            : mine.map((n) => (
              <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px', borderRadius: 9, alignItems: 'flex-start' }}>
                <span style={{ marginTop: 1, flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.6"><path d="M3 8.2l2.2 2.2L11 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: t.ink, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2, lineHeight: 1.4 }}>{n.sub} · {n.ts}</div>
                </div>
              </div>
            ))}
        </div>
      )}
    </span>
  );
}

// ── IdentitySwitcher — the header avatar; switch who you are ──────────────
function IdentitySwitcher({ t }) {
  const s = useStore();
  const me = TEAM.find((m) => m.name === s.me) || TEAM[0];
  return (
    <OwnerMenu t={t} current={s.me} onPick={(n) => PSLStore.setMe(n)} align="right" title="View as">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer' }} title={`Signed in as ${me.name} — click to switch`}>
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: CUI }}>
          {me.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
        </span>
      </span>
    </OwnerMenu>
  );
}

// ── Toasts — transient confirmation stack (rendered once at app root) ─────
function Toasts({ t }) {
  const s = useStore();
  if (!s.toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 300, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
      {s.toasts.map((t2) => (
        <div key={t2.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 16px', borderRadius: 999, background: t.ink, color: t.bg,
          fontFamily: CUI, fontSize: 12.5, fontWeight: 600, boxShadow: '0 10px 30px rgba(15,20,32,.3)', whiteSpace: 'nowrap' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {t2.text}
        </div>
      ))}
    </div>
  );
}

// ── Batch selection system ───────────────────────────────────────────────
// useBatch() holds selection state for a list body; SelChk is the checkbox;
// BatchBar is the floating action bar shown only while selecting.
function useBatch() {
  const [selecting, setSelecting] = React.useState(false);
  const [sel, setSel] = React.useState(() => new Set());
  const toggle = (k) => setSel((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const setAll = (keys, on) => setSel(on ? new Set(keys) : new Set());
  const clear = () => { setSel(new Set()); setSelecting(false); };
  return { selecting, setSelecting, sel, toggle, setAll, clear };
}

function SelChk({ t, checked, indeterminate, onChange, size = 18 }) {
  const on = checked || indeterminate;
  return (
    <span onClick={(e) => { e.stopPropagation(); onChange(); }} role="checkbox" aria-checked={!!checked}
      style={{ width: size, height: size, borderRadius: 5, border: `1.5px solid ${on ? t.accent : t.line}`, background: on ? t.accent : t.bg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background .12s, border-color .12s' }}>
      {checked && <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 12 12" fill="none" stroke={t.onAccent} strokeWidth="2.2"><path d="M2 6.2l2.6 2.6L10 3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {indeterminate && !checked && <span style={{ width: size * 0.5, height: 2.2, background: t.onAccent, borderRadius: 2 }} />}
    </span>
  );
}

// "Select" ⇄ "Done" toggle button for a list header.
function SelectToggle({ t, selecting, onToggle }) {
  return (
    <button onClick={onToggle} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
      border: `1px solid ${selecting ? t.accent : t.line}`, background: selecting ? t.accentSoft : t.bg, color: selecting ? t.accent : t.sub,
      fontFamily: CUI, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
      {selecting
        ? <React.Fragment><svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3.5 7.5l2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Done</React.Fragment>
        : <React.Fragment><svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="10" height="10" rx="2.5" /><path d="M4.6 7l1.8 1.8L9.6 5" strokeLinecap="round" strokeLinejoin="round" /></svg>Select</React.Fragment>}
    </button>
  );
}

// Floating batch action bar — rendered by a body only while selecting.
function BatchBar({ t, count, label, onAction, onClear, disabled }) {
  return (
    <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 250,
      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px 10px 18px', borderRadius: 14, background: t.ink, color: t.bg,
      boxShadow: '0 14px 44px rgba(15,20,32,.34)', fontFamily: CUI }}>
      <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{count} selected</span>
      <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,.22)' }} />
      <button onClick={onClear} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.75)', fontFamily: CUI, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
      <button onClick={onAction} disabled={disabled || !count} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 15px', borderRadius: 9, border: 'none', whiteSpace: 'nowrap',
        background: (disabled || !count) ? 'rgba(255,255,255,.18)' : t.accent, color: (disabled || !count) ? 'rgba(255,255,255,.5)' : t.onAccent,
        fontFamily: CUI, fontSize: 12.5, fontWeight: 700, cursor: (disabled || !count) ? 'default' : 'pointer' }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M7 10.5V3.5M3.8 6.5L7 3.3l3.2 3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {label}
      </button>
    </div>
  );
}

// ── ModeToggle — always-visible light/dark switch for the TopBar ──────────
function ModeToggle({ t }) {
  const dark = t.dark;
  const flip = () => { if (window.PSLTheme) window.PSLTheme.toggle(); };
  return (
    <button onClick={flip} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10,
        border: `1px solid ${t.chromeLine || t.line}`, background: t.bg, color: t.sub, cursor: 'pointer', flexShrink: 0 }}>
      {dark
        ? <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="3.4" /><path d="M9 1.6v2M9 14.4v2M1.6 9h2M14.4 9h2M3.8 3.8l1.4 1.4M12.8 12.8l1.4 1.4M14.2 3.8l-1.4 1.4M5.2 12.8l-1.4 1.4" strokeLinecap="round" /></svg>
        : <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10.2A6.4 6.4 0 0 1 7.8 3a6.4 6.4 0 1 0 7.2 7.2z" strokeLinejoin="round" /></svg>}
    </button>
  );
}

Object.assign(window, { TEAM, STAGE_LABEL, STAGE_FLOW, PSLStore, useStore, MiniA, OwnerMenu, OwnerChip, NewFollowupForm, NotifBell, IdentitySwitcher, ModeToggle, Toasts, useBatch, SelChk, SelectToggle, BatchBar });
