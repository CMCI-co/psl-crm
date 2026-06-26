// training.jsx — Editable Training Modules for the Resources hub.
//   • TrainingLibrary  — module cards in the Training category (New module gated)
//   • TrainingBuilder  — slide-based authoring tool (text / image / video / game)
//                        + a final pass/fail test. Edit-gated to Campus Directors
//                        & National Staff.
//   • TrainingPlayer   — the learner experience: step the slides, take the test,
//                        and on a pass → fireworks + confetti + certificate.
// Reuses global atoms from kit.jsx / directory.jsx / features.jsx
//   (UI, SERIF, Avatar, Tag, Eyebrow, TopBar, Btn, SubBar, ResIcon, ResourcesSidebar)

// Who may author / edit modules.
const EDIT_ROLES = ['Campus Director', 'National Staff'];
const canEdit = (role) => EDIT_ROLES.includes(role);

// Festive palette for the celebration (accent + stage hues + gold).
function festive(t) {
  return [t.accent, '#bd7526', '#0a86dd', '#3f7a52', t.gold || '#a9852f', '#c44f60'];
}

// ───────────────────────────────────────────────────────────────────────
// Celebration — canvas confetti + fireworks, runs while `active`.
// ───────────────────────────────────────────────────────────────────────
function Celebration({ active, colors }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!active) return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      W = parent.clientWidth; H = parent.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const pal = colors && colors.length ? colors : ['#22386b', '#bd7526', '#0a86dd', '#3f7a52', '#a9852f'];
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = () => pal[(Math.random() * pal.length) | 0];

    // confetti: ribbons raining from the top
    const confetti = [];
    let first = true;
    const spawnConfetti = (n) => {
      for (let i = 0; i < n; i++) confetti.push({
        x: rnd(0, W), y: rnd(-H, first ? H : 0), w: rnd(6, 11), h: rnd(8, 16),
        vy: rnd(2.2, 5), vx: rnd(-1.2, 1.2), rot: rnd(0, Math.PI), vr: rnd(-0.2, 0.2),
        c: pick(), sway: rnd(0.5, 1.8), phase: rnd(0, 6.28), life: 1,
      });
    };
    spawnConfetti(220); first = false;

    // fireworks: periodic radial bursts
    const sparks = [];
    const burst = () => {
      const cx = rnd(W * 0.15, W * 0.85), cy = rnd(H * 0.12, H * 0.55), c = pick(), N = 46;
      for (let i = 0; i < N; i++) {
        const a = (Math.PI * 2 * i) / N, sp = rnd(2.4, 5.4);
        sparks.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c, life: 1, decay: rnd(0.012, 0.02) });
      }
    };

    let raf, frame = 0, running = true;
    const tick = () => {
      if (!running) return;
      frame++;
      ctx.clearRect(0, 0, W, H);
      if (frame % 34 === 0 && frame < 420) burst();
      if (frame % 16 === 0 && frame < 520) spawnConfetti(20);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.045; s.vx *= 0.985; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(s.life, 0);
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.4, 0, 6.28); ctx.fill();
      }
      for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];
        p.phase += 0.05; p.x += p.vx + Math.sin(p.phase) * p.sway; p.y += p.vy; p.rot += p.vr;
        if (p.y > H + 20) { confetti.splice(i, 1); continue; }
        ctx.globalAlpha = 1;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('resize', resize);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [active, colors]);

  if (!active) return null;
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }} />;
}

// ───────────────────────────────────────────────────────────────────────
// MatchGame — a small, genuinely-playable "game-based HTML" slide: pair each
// term with its meaning. Used live in the player AND previewed in the builder.
// ───────────────────────────────────────────────────────────────────────
const MATCH_DEFAULT = [
  { term: 'Devotion', def: 'A life ordered around Christ' },
  { term: 'Brotherhood', def: 'Fully known, fully committed' },
  { term: 'Service', def: 'Leading by carrying weight' },
  { term: 'Integrity', def: 'The same when no one watches' },
];
function shuffle(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[x[i], x[j]] = [x[j], x[i]]; } return x; }

function MatchGame({ t, pairs = MATCH_DEFAULT, compact }) {
  const [defs] = React.useState(() => shuffle(pairs.map((p, i) => ({ ...p, id: i }))));
  const [picked, setPicked] = React.useState(null);   // term index
  const [matched, setMatched] = React.useState({});   // termIdx -> true
  const [wrong, setWrong] = React.useState(null);     // defId flashing red
  const done = Object.keys(matched).length === pairs.length;

  const tapDef = (d) => {
    if (picked == null || matched[picked]) return;
    if (d.id === picked) { setMatched((m) => ({ ...m, [picked]: true })); setPicked(null); }
    else { setWrong(d.id); setTimeout(() => setWrong(null), 420); }
  };
  const sz = compact ? { fs: 12, pad: '9px 11px', gap: 8 } : { fs: 13.5, pad: '12px 14px', gap: 10 };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sz.gap }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 2 }}>Terms</div>
          {pairs.map((p, i) => {
            const on = picked === i, ok = matched[i];
            return (
              <div key={i} onClick={() => !ok && setPicked(i)} style={{
                padding: sz.pad, borderRadius: 10, fontSize: sz.fs, fontWeight: 600, cursor: ok ? 'default' : 'pointer',
                background: ok ? '#e3f3ea' : on ? t.accentSoft : t.bg, color: ok ? '#1f6b46' : on ? t.accent : t.ink,
                border: `1.5px solid ${ok ? '#bfe3cd' : on ? t.accent : t.line}`, display: 'flex', alignItems: 'center', gap: 9,
                transition: 'all .12s',
              }}>
                {ok && <svg width="14" height="14" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#1f6b46" /><path d="M4.7 8.2l2.1 2.1 4.3-4.4" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                {p.term}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sz.gap }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 2 }}>Meanings</div>
          {defs.map((d) => {
            const used = matched[d.id], bad = wrong === d.id;
            return (
              <div key={d.id} onClick={() => tapDef(d)} style={{
                padding: sz.pad, borderRadius: 10, fontSize: sz.fs, cursor: used ? 'default' : 'pointer',
                background: used ? '#e3f3ea' : bad ? '#fbe6e2' : t.bg, color: used ? '#1f6b46' : bad ? '#b3402f' : t.sub,
                border: `1.5px solid ${used ? '#bfe3cd' : bad ? '#e8b3aa' : t.line}`, opacity: used ? 0.65 : 1, transition: 'all .12s',
              }}>{d.def}</div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 12.5, color: done ? '#1f6b46' : t.faint, fontWeight: done ? 700 : 500 }}>
        {done ? '✓ All matched — well done.' : picked != null ? 'Now tap its meaning →' : 'Tap a term to begin.'}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Slide media glyphs + the starter module (shared by builder & player).
// ───────────────────────────────────────────────────────────────────────
function SlideTypeIcon({ kind, color, size = 15 }) {
  const s = { width: size, height: size, display: 'block' };
  switch (kind) {
    case 'text': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"><path d="M3 4h10M3 7.3h10M3 10.6h6.5" strokeLinecap="round" /></svg>;
    case 'image': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="2" y="3" width="12" height="10" rx="1.6" /><circle cx="6" cy="6.4" r="1.2" /><path d="M2.6 11.5l3.4-3 2.4 2 2.2-2 2.8 2.5" strokeLinejoin="round" /></svg>;
    case 'video': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="M6.6 6v4l3.2-2z" fill={color} stroke="none" /></svg>;
    case 'game': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><rect x="1.8" y="4.5" width="12.4" height="7" rx="3.5" /><path d="M4.6 8h2M5.6 7v2" strokeLinecap="round" /><circle cx="10.4" cy="7.4" r=".8" fill={color} stroke="none" /><circle cx="11.6" cy="9" r=".8" fill={color} stroke="none" /></svg>;
    case 'test': return <svg style={s} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4"><path d="M4 2.2h6l2.2 2.2v9.4H4z" strokeLinejoin="round" /><path d="M6 8l1.4 1.4L10.4 6.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    default: return null;
  }
}
const TYPE_LABEL = { text: 'Text', image: 'Image', video: 'Video', game: 'Game', test: 'Final Test' };

let _sid = 100;
const sid = () => 's' + (++_sid);

function starterModule() {
  return {
    title: 'The History & Heritage of ΦΣΛ',
    collection: 'New Member Formation',
    audience: ['Candidates', 'Members'],
    status: 'Published',
    slides: [
      { id: sid(), type: 'text', title: 'Our Founding', body: 'Phi Sigma Lambda was founded in 1947 by twelve men who wanted a brotherhood serious about faith, character, and one another. What began on a single campus is now a movement — but the founding conviction has never changed: be the same man in private that you claim to be in public.' },
      { id: sid(), type: 'image', title: 'The Founders, 1947', caption: 'The original twelve on the steps of Whitfield Hall.', alt: 'Founders group photo' },
      { id: sid(), type: 'video', title: 'A Word from National', source: 'national-welcome.mp4', duration: '4:12', note: 'Our National Director on why heritage still matters.' },
      { id: sid(), type: 'game', title: 'Match the Pillars', prompt: 'Pair each pillar with what it means in practice.', game: 'match', pairs: MATCH_DEFAULT },
      { id: sid(), type: 'text', title: 'The Four Pillars', body: 'Devotion. Brotherhood. Service. Integrity. Every chapter, every member, every decision is measured against these four. They are not slogans — they are the standard we ask each other to live by.' },
    ],
    test: {
      passing: 75,
      questions: [
        { id: sid(), q: 'In what year was Phi Sigma Lambda founded?', options: ['1929', '1947', '1962', '1958'], correct: 1 },
        { id: sid(), q: 'How many founding members were there?', options: ['Seven', 'Ten', 'Twelve', 'Twenty'], correct: 2 },
        { id: sid(), q: 'Which is NOT one of the four pillars?', options: ['Devotion', 'Ambition', 'Service', 'Integrity'], correct: 1 },
        { id: sid(), q: 'The founding conviction is best summed up as…', options: ['Win at all costs', 'Be the same in private as in public', 'Grow the network', 'Tradition above all'], correct: 1 },
      ],
    },
  };
}

Object.assign(window, {
  EDIT_ROLES, canEdit, festive, Celebration, MatchGame, MATCH_DEFAULT,
  SlideTypeIcon, TYPE_LABEL, sid, starterModule,
});
