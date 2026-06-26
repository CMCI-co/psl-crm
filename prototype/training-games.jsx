// training-games.jsx — the game-based HTML slide types beyond term-match.
//   • Flashcards — flip a deck, mark got-it / review
//   • SortGame   — sort items into the right buckets
//   • QuizRace   — timed rapid-fire multiple choice
//   • GameRender — dispatcher: picks the right game from slide.game + content
// MatchGame lives in training.jsx; referenced here via the global scope.

// Default content per game type — used to seed new game slides in the builder.
function gameDefaults(game) {
  switch (game) {
    case 'match':
      return { pairs: [
        { term: 'Devotion', def: 'A life ordered around Christ' },
        { term: 'Brotherhood', def: 'Fully known, fully committed' },
        { term: 'Service', def: 'Leading by carrying weight' },
        { term: 'Integrity', def: 'The same when no one watches' },
      ] };
    case 'flashcards':
      return { cards: [
        { front: '1947', back: 'The year Phi Sigma Lambda was founded.' },
        { front: 'Twelve', back: 'The number of founding members.' },
        { front: 'Whitfield Hall', back: 'Where the founders first met.' },
        { front: 'The Four Pillars', back: 'Devotion · Brotherhood · Service · Integrity.' },
      ] };
    case 'sort':
      return { buckets: ['A Pillar', 'Not a Pillar'], items: [
        { text: 'Devotion', bucket: 0 }, { text: 'Service', bucket: 0 },
        { text: 'Integrity', bucket: 0 }, { text: 'Brotherhood', bucket: 0 },
        { text: 'Ambition', bucket: 1 }, { text: 'Wealth', bucket: 1 },
      ] };
    case 'quiz-race':
      return { seconds: 30, questions: [
        { q: 'Founded in…', options: ['1947', '1962'], correct: 0 },
        { q: 'How many founders?', options: ['Twelve', 'Seven'], correct: 0 },
        { q: 'Not a pillar:', options: ['Ambition', 'Service'], correct: 0 },
        { q: 'Be the same in…', options: ['Private & public', 'Public only'], correct: 0 },
        { q: 'A pillar is…', options: ['Integrity', 'Influence'], correct: 0 },
      ] };
    default: return {};
  }
}
const GAME_LABEL = { match: 'Term match', flashcards: 'Flashcards', sort: 'Sorting', 'quiz-race': 'Quiz race' };

// ── Flashcards ────────────────────────────────────────────────────────────
function Flashcards({ t, cards = [], compact }) {
  const [i, setI] = React.useState(0);
  const [flip, setFlip] = React.useState(false);
  const [tagged, setTagged] = React.useState({});
  const card = cards[i] || { front: '', back: '' };
  const h = compact ? 150 : 220;
  const advance = (tag) => { setTagged((m) => ({ ...m, [i]: tag })); setFlip(false); setI((x) => Math.min(cards.length - 1, x + 1)); };
  const got = Object.values(tagged).filter((v) => v === 'got').length;

  return (
    <div>
      <div style={{ perspective: 1200, marginBottom: 16 }}>
        <div onClick={() => setFlip((f) => !f)} style={{ position: 'relative', height: h, cursor: 'pointer', transformStyle: 'preserve-3d', transition: 'transform .5s', transform: flip ? 'rotateY(180deg)' : 'none' }}>
          {/* front */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 16, border: `1px solid ${t.line}`, background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, boxShadow: '0 6px 20px rgba(20,26,40,.06)' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 12 }}>Term</span>
            <span style={{ fontFamily: SERIF, fontSize: compact ? 24 : 34, color: t.ink, textAlign: 'center', lineHeight: 1.2 }}>{card.front}</span>
            <span style={{ position: 'absolute', bottom: 14, fontSize: 11.5, color: t.faint }}>Tap to flip ↻</span>
          </div>
          {/* back */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 16, border: `1.5px solid ${t.accent}`, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <span style={{ fontSize: compact ? 15 : 18, color: t.ink, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' }}>{card.back}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span onClick={() => { setFlip(false); setI((x) => Math.max(0, x - 1)); }} style={ctrlBtn(t)}>‹ Prev</span>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 5 }}>
          {cards.map((_, k) => <span key={k} style={{ width: k === i ? 20 : 7, height: 7, borderRadius: 999, background: k === i ? t.accent : tagged[k] === 'got' ? '#3f7a52' : t.panel2, transition: 'all .2s' }} />)}
        </div>
        <span onClick={() => advance('review')} style={{ ...ctrlBtn(t), color: '#8a5a16' }}>Review later</span>
        <span onClick={() => advance('got')} style={{ ...ctrlBtn(t), background: '#e3f3ea', color: '#1f6b46', border: '1px solid #bfe3cd' }}>Got it ✓</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 12.5, color: t.faint }}>{got} of {cards.length} marked “got it”.</div>
    </div>
  );
}

// ── Sorting ────────────────────────────────────────────────────────────────
function SortGame({ t, buckets = [], items = [], compact }) {
  const [placed, setPlaced] = React.useState({});   // itemIdx -> bucketIdx
  const [sel, setSel] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const tray = items.map((it, idx) => idx).filter((idx) => placed[idx] == null);
  const allPlaced = tray.length === 0;
  const correctCount = items.filter((it, idx) => placed[idx] === it.bucket).length;

  const drop = (bIdx) => { if (sel == null) return; setPlaced((m) => ({ ...m, [sel]: bIdx })); setSel(null); setChecked(false); };
  const pull = (idx) => { if (checked) return; setPlaced((m) => { const n = { ...m }; delete n[idx]; return n; }); };
  const pad = compact ? '7px 11px' : '9px 13px';

  return (
    <div>
      {/* tray */}
      <div style={{ minHeight: 44, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 10, borderRadius: 12, background: t.panel, border: `1px dashed ${t.line}`, marginBottom: 14 }}>
        {tray.length === 0 ? <span style={{ fontSize: 12, color: t.faint, padding: '4px 6px' }}>All sorted — check your answers →</span>
          : tray.map((idx) => (
            <span key={idx} onClick={() => setSel(idx)} style={{ padding: pad, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: sel === idx ? t.accent : t.bg, color: sel === idx ? t.onAccent : t.ink, border: `1.5px solid ${sel === idx ? t.accent : t.line}` }}>{items[idx].text}</span>
          ))}
      </div>
      {/* buckets */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${buckets.length}, 1fr)`, gap: 12 }}>
        {buckets.map((b, bIdx) => (
          <div key={bIdx} onClick={() => drop(bIdx)} style={{ minHeight: compact ? 90 : 130, borderRadius: 12, border: `1.5px solid ${sel != null ? t.accent : t.line}`, background: sel != null ? t.accentSoft : t.bg, padding: 12, transition: 'all .12s', cursor: sel != null ? 'pointer' : 'default' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: t.faint, marginBottom: 9 }}>{b}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {items.map((it, idx) => placed[idx] === bIdx ? (
                <span key={idx} onClick={(e) => { e.stopPropagation(); pull(idx); }} style={{ padding: pad, borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: checked ? 'default' : 'pointer',
                  background: checked ? (it.bucket === bIdx ? '#e3f3ea' : '#fbe6e2') : t.panel, color: checked ? (it.bucket === bIdx ? '#1f6b46' : '#b3402f') : t.ink,
                  border: `1px solid ${checked ? (it.bucket === bIdx ? '#bfe3cd' : '#e8b3aa') : t.line}`, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {checked && (it.bucket === bIdx ? '✓' : '✕')} {it.text}
                </span>
              ) : null)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <span onClick={() => allPlaced && setChecked(true)} style={{ ...ctrlBtn(t), opacity: allPlaced ? 1 : 0.45, cursor: allPlaced ? 'pointer' : 'default', background: t.accent, color: t.onAccent, border: 'none', padding: '9px 16px' }}>Check answers</span>
        {checked && <span style={{ fontSize: 13, fontWeight: 700, color: correctCount === items.length ? '#1f6b46' : '#8a5a16' }}>{correctCount} / {items.length} correct{correctCount === items.length ? ' — perfect!' : ''}</span>}
        {checked && correctCount !== items.length && <span onClick={() => { setChecked(false); setPlaced({}); }} style={{ ...ctrlBtn(t), marginLeft: 'auto' }}>Try again ↻</span>}
      </div>
    </div>
  );
}

// ── Quiz Race ───────────────────────────────────────────────────────────────
function QuizRace({ t, seconds = 30, questions = [], compact }) {
  const [phase, setPhase] = React.useState('ready'); // ready | run | done
  const [i, setI] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [left, setLeft] = React.useState(seconds);
  const [flash, setFlash] = React.useState(null); // {oi, ok}

  React.useEffect(() => {
    if (phase !== 'run') return;
    if (left <= 0) { setPhase('done'); return; }
    const id = setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, left]);

  const start = () => { setPhase('run'); setI(0); setScore(0); setLeft(seconds); setFlash(null); };
  const answer = (oi) => {
    const q = questions[i]; const ok = oi === q.correct;
    setFlash({ oi, ok }); if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFlash(null);
      if (i + 1 >= questions.length) setPhase('done');
      else setI((x) => x + 1);
    }, 360);
  };

  if (phase === 'ready') {
    return (
      <div style={{ textAlign: 'center', padding: compact ? '18px 0' : '34px 0' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.5"><circle cx="8" cy="9" r="5.5" /><path d="M8 9V6M6.5 2.5h3" strokeLinecap="round" /></svg>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: compact ? 20 : 24, color: t.ink, marginBottom: 6 }}>Beat the clock</div>
        <p style={{ fontSize: 13.5, color: t.faint, margin: '0 0 16px' }}>{questions.length} questions · {seconds} seconds. Answer as many as you can.</p>
        <span onClick={start} style={{ ...ctrlBtn(t), display: 'inline-flex', background: t.accent, color: t.onAccent, border: 'none', padding: '11px 22px', fontSize: 14 }}>Start race ▶</span>
      </div>
    );
  }
  if (phase === 'done') {
    const perfect = score === questions.length;
    return (
      <div style={{ textAlign: 'center', padding: compact ? '18px 0' : '30px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: t.faint, marginBottom: 8 }}>Time!</div>
        <div style={{ fontFamily: SERIF, fontSize: compact ? 36 : 48, color: t.accent, lineHeight: 1 }}>{score}<span style={{ fontSize: compact ? 18 : 22, color: t.faint }}> / {questions.length}</span></div>
        <p style={{ fontSize: 14, color: t.sub, margin: '12px 0 16px' }}>{perfect ? 'Perfect run! 🏁' : score >= questions.length * 0.6 ? 'Nicely done.' : 'Run it back and beat your score.'}</p>
        <span onClick={start} style={{ ...ctrlBtn(t) }}>Race again ↻</span>
      </div>
    );
  }
  const q = questions[i];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: t.faint }}>Q{i + 1}/{questions.length}</span>
        <div style={{ flex: 1, height: 7, borderRadius: 7, background: t.panel2, overflow: 'hidden' }}>
          <span style={{ display: 'block', height: '100%', width: `${(left / seconds) * 100}%`, background: left <= 5 ? '#b3402f' : t.accent, borderRadius: 7, transition: 'width 1s linear' }} />
        </div>
        <span style={{ fontFamily: SERIF, fontSize: 20, color: left <= 5 ? '#b3402f' : t.ink, minWidth: 34, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{left}s</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: t.accent }}>★ {score}</span>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: compact ? 20 : 26, color: t.ink, marginBottom: 16, lineHeight: 1.25 }}>{q.q}</div>
      <div style={{ display: 'grid', gridTemplateColumns: q.options.length > 2 ? '1fr 1fr' : '1fr', gap: 10 }}>
        {q.options.map((opt, oi) => {
          const isFlash = flash && flash.oi === oi;
          const bg = isFlash ? (flash.ok ? '#e3f3ea' : '#fbe6e2') : t.bg;
          const bd = isFlash ? (flash.ok ? '#bfe3cd' : '#e8b3aa') : t.line;
          const fg = isFlash ? (flash.ok ? '#1f6b46' : '#b3402f') : t.ink;
          return <span key={oi} onClick={() => !flash && answer(oi)} style={{ padding: '14px 16px', borderRadius: 11, fontSize: 15, fontWeight: 600, cursor: 'pointer', background: bg, color: fg, border: `1.5px solid ${bd}`, transition: 'all .1s' }}>{opt}</span>;
        })}
      </div>
    </div>
  );
}

function ctrlBtn(t) { return { padding: '8px 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: t.bg, color: t.sub, border: `1px solid ${t.line}`, whiteSpace: 'nowrap', userSelect: 'none' }; }

// ── Dispatcher ──────────────────────────────────────────────────────────────
function GameRender({ t, slide, compact }) {
  const g = slide.game || 'match';
  const c = { ...gameDefaults(g), ...slide };
  if (g === 'flashcards') return <Flashcards t={t} cards={c.cards} compact={compact} />;
  if (g === 'sort') return <SortGame t={t} buckets={c.buckets} items={c.items} compact={compact} />;
  if (g === 'quiz-race') return <QuizRace t={t} seconds={c.seconds} questions={c.questions} compact={compact} />;
  return <MatchGame t={t} pairs={c.pairs} compact={compact} />;
}

Object.assign(window, { gameDefaults, GAME_LABEL, Flashcards, SortGame, QuizRace, GameRender, ctrlBtn });
