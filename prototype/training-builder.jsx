// training-builder.jsx — the slide-based authoring tool. Edit-gated to
// Campus Directors & National Staff (role passed from the Tweaks panel).
// Fully interactive: add / select / reorder / delete slides, edit content
// inline, build the final test, set the pass threshold & audience.

const PERSIST_KEY = 'psl_training_builder_v1';
function loadModule() {
  try { const raw = localStorage.getItem(PERSIST_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return starterModule();
}

const AUDIENCES = ['Applicants', 'Candidates', 'Members', 'Alumni', 'Leaders only'];

// A bare editable text field (single line) that looks like the value, edits in place.
function EditLine({ t, value, onChange, ph, big, mono }) {
  return (
    <input value={value} placeholder={ph} onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', border: 'none', borderBottom: `1.5px solid transparent`, outline: 'none', background: 'transparent',
        fontFamily: big ? SERIF : UI, fontSize: big ? 32 : 14, fontWeight: big ? 500 : 500, color: t.ink,
        padding: '4px 0', fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
      }}
      onFocus={(e) => e.target.style.borderBottomColor = t.accent}
      onBlur={(e) => e.target.style.borderBottomColor = 'transparent'} />
  );
}

// ───────────────────────────────────────────────────────────────────────
// Center editors per slide type
// ───────────────────────────────────────────────────────────────────────
function SlideEditor({ t, slide, patch }) {
  if (slide.type === 'text') {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <FieldLbl t={t}>Slide heading</FieldLbl>
        <EditLine t={t} big value={slide.title} onChange={(v) => patch({ title: v })} ph="Heading…" />
        <div style={{ height: 22 }} />
        <FieldLbl t={t}>Body text</FieldLbl>
        <textarea value={slide.body} onChange={(e) => patch({ body: e.target.value })} placeholder="Write the slide copy…"
          style={{ width: '100%', minHeight: 220, resize: 'vertical', border: `1px solid ${t.line}`, borderRadius: 12, padding: '14px 16px', fontFamily: UI, fontSize: 16, lineHeight: 1.65, color: t.sub, background: t.bg, outline: 'none' }} />
      </div>
    );
  }
  if (slide.type === 'image' || slide.type === 'video') {
    const isVid = slide.type === 'video';
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <FieldLbl t={t}>Slide title</FieldLbl>
        <EditLine t={t} big value={slide.title} onChange={(v) => patch({ title: v })} ph="Title…" />
        <div style={{ height: 18 }} />
        <div style={{ height: 260 }}><MediaPlaceholder t={t} kind={slide.type} label={isVid ? (slide.source || 'video file') : (slide.alt || 'image file')} /></div>
        <button style={uploadBtn(t)}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={t.accent} strokeWidth="1.6"><path d="M8 11V4M5 6.5L8 4l3 2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.5 11v1.5h9V11" strokeLinecap="round" /></svg>
          {isVid ? 'Replace video' : 'Replace image'}
        </button>
        <div style={{ height: 14 }} />
        {isVid ? (
          <React.Fragment>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 2 }}><FieldLbl t={t}>Source file</FieldLbl><BoxLine t={t} value={slide.source} onChange={(v) => patch({ source: v })} /></div>
              <div style={{ flex: 1 }}><FieldLbl t={t}>Duration</FieldLbl><BoxLine t={t} value={slide.duration} onChange={(v) => patch({ duration: v })} mono /></div>
            </div>
            <div style={{ height: 12 }} />
            <FieldLbl t={t}>Caption / note</FieldLbl><BoxLine t={t} value={slide.note} onChange={(v) => patch({ note: v })} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FieldLbl t={t}>Caption</FieldLbl><BoxLine t={t} value={slide.caption} onChange={(v) => patch({ caption: v })} />
            <div style={{ height: 12 }} />
            <FieldLbl t={t}>Alt text</FieldLbl><BoxLine t={t} value={slide.alt} onChange={(v) => patch({ alt: v })} />
          </React.Fragment>
        )}
      </div>
    );
  }
  if (slide.type === 'game') {
    const games = ['match', 'flashcards', 'sort', 'quiz-race'];
    const setGame = (g) => {
      const seed = gameDefaults(g);
      const merged = { game: g };
      Object.keys(seed).forEach((k) => { if (slide[k] == null) merged[k] = seed[k]; });
      patch(merged);
    };
    return (
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <FieldLbl t={t}>Game title</FieldLbl>
        <EditLine t={t} big value={slide.title} onChange={(v) => patch({ title: v })} ph="Title…" />
        <div style={{ height: 16 }} />
        <FieldLbl t={t}>Game type</FieldLbl>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {games.map((g) => {
            const on = (slide.game || 'match') === g;
            return <span key={g} onClick={() => setGame(g)} style={{ padding: '7px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: on ? t.accentSoft : t.bg, color: on ? t.accent : t.sub, border: `1.5px solid ${on ? t.accent : t.line}` }}>{GAME_LABEL[g]}</span>;
          })}
        </div>
        <FieldLbl t={t}>Prompt</FieldLbl><BoxLine t={t} value={slide.prompt} onChange={(v) => patch({ prompt: v })} />
        <div style={{ height: 20 }} />
        <FieldLbl t={t}>Content</FieldLbl>
        <GameContentEditor t={t} slide={slide} patch={patch} />
        <div style={{ height: 20 }} />
        <div style={{ border: `1px solid ${t.line}`, borderRadius: 14, padding: 18, background: t.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.faint }}>Live preview</span>
            <span style={{ fontSize: 10.5, color: t.faint }}>· playable, exactly as the learner sees it</span>
          </div>
          <GameRender t={t} slide={slide} compact />
        </div>
      </div>
    );
  }
  if (slide.type === 'test') {
    return <TestEditor t={t} test={slide._test} patch={slide._patchTest} />;
  }
  return null;
}

function TestEditor({ t, test, patch }) {
  const setQ = (qid, p) => patch({ questions: test.questions.map((q) => q.id === qid ? { ...q, ...p } : q) });
  const setOpt = (qid, oi, val) => { const q = test.questions.find((x) => x.id === qid); const options = q.options.map((o, i) => i === oi ? val : o); setQ(qid, { options }); };
  const addOpt = (qid) => { const q = test.questions.find((x) => x.id === qid); setQ(qid, { options: [...q.options, 'New option'] }); };
  const delOpt = (qid, oi) => { const q = test.questions.find((x) => x.id === qid); const options = q.options.filter((_, i) => i !== oi); setQ(qid, { options, correct: q.correct >= options.length ? 0 : q.correct }); };
  const addQ = () => patch({ questions: [...test.questions, { id: sid(), q: 'New question', options: ['Option A', 'Option B'], correct: 0 }] });
  const delQ = (qid) => patch({ questions: test.questions.filter((q) => q.id !== qid) });

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontFamily: SERIF, fontSize: 30, color: t.ink }}>Final Test</span>
        <span style={{ fontSize: 12, color: t.faint }}>· {test.questions.length} questions</span>
      </div>
      {/* pass threshold */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 12, background: t.bg, border: `1px solid ${t.line}`, marginBottom: 22 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>Passing score</span>
        <input type="range" min="50" max="100" step="5" value={test.passing} onChange={(e) => patch({ passing: +e.target.value })} style={{ flex: 1, accentColor: t.accent }} />
        <span style={{ fontFamily: SERIF, fontSize: 22, color: t.accent, minWidth: 56, textAlign: 'right' }}>{test.passing}%</span>
      </div>

      {test.questions.map((q, qi) => (
        <div key={q.id} style={{ border: `1px solid ${t.line}`, borderRadius: 14, padding: '16px 18px', marginBottom: 14, background: t.bg }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: t.accent, marginTop: 8 }}>{String(qi + 1).padStart(2, '0')}</span>
            <textarea value={q.q} onChange={(e) => setQ(q.id, { q: e.target.value })} rows={1}
              style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontFamily: UI, fontSize: 16, fontWeight: 600, color: t.ink, lineHeight: 1.35 }} />
            <span onClick={() => delQ(q.id)} style={{ cursor: 'pointer', color: t.faint, padding: 4, flexShrink: 0 }} title="Delete question">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 4.5h9M6.5 4.5V3h3v1.5M5 4.5l.5 8h5l.5-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingLeft: 28 }}>
            {q.options.map((opt, oi) => {
              const correct = q.correct === oi;
              return (
                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span onClick={() => setQ(q.id, { correct: oi })} title="Mark correct" style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, cursor: 'pointer', border: `2px solid ${correct ? '#1f6b46' : t.line}`, background: correct ? '#1f6b46' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {correct && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2"><path d="M2 6.2l2.4 2.4L10 3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  <input value={opt} onChange={(e) => setOpt(q.id, oi, e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 9, border: `1px solid ${correct ? '#bfe3cd' : t.line}`, background: correct ? '#f1f9f4' : t.bg, fontFamily: UI, fontSize: 13.5, color: t.ink, outline: 'none' }} />
                  {q.options.length > 2 && <span onClick={() => delOpt(q.id, oi)} style={{ cursor: 'pointer', color: t.faint, padding: 2 }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4l6 6M10 4l-6 6" strokeLinecap="round" /></svg>
                  </span>}
                </div>
              );
            })}
            <span onClick={() => addOpt(q.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: t.accent, cursor: 'pointer', marginTop: 4, paddingLeft: 30 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.8"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg> Add option
            </span>
          </div>
          <div style={{ fontSize: 11, color: t.faint, marginTop: 10, paddingLeft: 28 }}>Green = correct answer. Tap a circle to set it.</div>
        </div>
      ))}
      <button onClick={addQ} style={{ ...uploadBtn(t), width: '100%', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.8"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg> Add question
      </button>
    </div>
  );
}

// little shared helpers
function FieldLbl({ t, children }) { return <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 7 }}>{children}</div>; }
function BoxLine({ t, value, onChange, mono }) {
  return <input value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, fontFamily: UI, fontSize: 13.5, color: t.ink, outline: 'none', fontVariantNumeric: mono ? 'tabular-nums' : 'normal' }} />;
}
function uploadBtn(t) { return { display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 14px', borderRadius: 9, border: `1.5px dashed ${t.line}`, background: t.bg, color: t.accent, fontFamily: UI, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }; }

// ───────────────────────────────────────────────────────────────────────
// GameContentEditor — edits the deck/items/questions behind each game type.
// ───────────────────────────────────────────────────────────────────────
function smallInput(t) { return { flex: 1, minWidth: 0, padding: '8px 11px', borderRadius: 8, border: `1px solid ${t.line}`, background: t.bg, fontFamily: UI, fontSize: 13, color: t.ink, outline: 'none' }; }
function rowDel(t, onClick) {
  return <span onClick={onClick} style={{ cursor: 'pointer', color: t.faint, padding: 4, flexShrink: 0 }}>
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4l6 6M10 4l-6 6" strokeLinecap="round" /></svg>
  </span>;
}
function addRow(t, label, onClick) {
  return <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: t.accent, cursor: 'pointer', marginTop: 4 }}>
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.8"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg> {label}
  </span>;
}

function GameContentEditor({ t, slide, patch }) {
  const g = slide.game || 'match';

  if (g === 'match') {
    const pairs = slide.pairs || gameDefaults('match').pairs;
    const set = (i, k, v) => patch({ pairs: pairs.map((p, j) => j === i ? { ...p, [k]: v } : p) });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', gap: 9, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint }}>
          <span style={{ flex: 1 }}>Term</span><span style={{ flex: 1 }}>Meaning</span><span style={{ width: 21 }} />
        </div>
        {pairs.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
            <input value={p.term} onChange={(e) => set(i, 'term', e.target.value)} style={smallInput(t)} />
            <input value={p.def} onChange={(e) => set(i, 'def', e.target.value)} style={smallInput(t)} />
            {pairs.length > 2 && rowDel(t, () => patch({ pairs: pairs.filter((_, j) => j !== i) }))}
          </div>
        ))}
        {addRow(t, 'Add pair', () => patch({ pairs: [...pairs, { term: 'New term', def: 'Its meaning' }] }))}
      </div>
    );
  }

  if (g === 'flashcards') {
    const cards = slide.cards || gameDefaults('flashcards').cards;
    const set = (i, k, v) => patch({ cards: cards.map((c, j) => j === i ? { ...c, [k]: v } : c) });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', gap: 9, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint }}>
          <span style={{ flex: 1 }}>Front</span><span style={{ flex: 1.5 }}>Back</span><span style={{ width: 21 }} />
        </div>
        {cards.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
            <input value={c.front} onChange={(e) => set(i, 'front', e.target.value)} style={smallInput(t)} />
            <input value={c.back} onChange={(e) => set(i, 'back', e.target.value)} style={{ ...smallInput(t), flex: 1.5 }} />
            {cards.length > 1 && rowDel(t, () => patch({ cards: cards.filter((_, j) => j !== i) }))}
          </div>
        ))}
        {addRow(t, 'Add card', () => patch({ cards: [...cards, { front: 'Front', back: 'Back' }] }))}
      </div>
    );
  }

  if (g === 'sort') {
    const buckets = slide.buckets || gameDefaults('sort').buckets;
    const items = slide.items || gameDefaults('sort').items;
    const setBucket = (i, v) => patch({ buckets: buckets.map((b, j) => j === i ? v : b) });
    const setItem = (i, k, v) => patch({ items: items.map((it, j) => j === i ? { ...it, [k]: v } : it) });
    return (
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 7 }}>Buckets</div>
        <div style={{ display: 'flex', gap: 9, marginBottom: 16, flexWrap: 'wrap' }}>
          {buckets.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <input value={b} onChange={(e) => setBucket(i, e.target.value)} style={{ ...smallInput(t), width: 150, flex: 'none' }} />
              {buckets.length > 2 && rowDel(t, () => patch({ buckets: buckets.filter((_, j) => j !== i), items: items.map((it) => it.bucket >= buckets.length - 1 ? { ...it, bucket: 0 } : it) }))}
            </div>
          ))}
          {buckets.length < 3 && addRow(t, 'Add bucket', () => patch({ buckets: [...buckets, 'New bucket'] }))}
        </div>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 7 }}>Items & correct bucket</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <input value={it.text} onChange={(e) => setItem(i, 'text', e.target.value)} style={smallInput(t)} />
              <select value={it.bucket} onChange={(e) => setItem(i, 'bucket', +e.target.value)} style={{ ...smallInput(t), flex: 'none', width: 160, cursor: 'pointer' }}>
                {buckets.map((b, bi) => <option key={bi} value={bi}>{b}</option>)}
              </select>
              {items.length > 2 && rowDel(t, () => patch({ items: items.filter((_, j) => j !== i) }))}
            </div>
          ))}
          {addRow(t, 'Add item', () => patch({ items: [...items, { text: 'New item', bucket: 0 }] }))}
        </div>
      </div>
    );
  }

  if (g === 'quiz-race') {
    const seconds = slide.seconds || gameDefaults('quiz-race').seconds;
    const questions = slide.questions || gameDefaults('quiz-race').questions;
    const setQ = (i, p) => patch({ questions: questions.map((q, j) => j === i ? { ...q, ...p } : q) });
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, background: t.bg, border: `1px solid ${t.line}`, marginBottom: 14 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>Time limit</span>
          <input type="range" min="10" max="90" step="5" value={seconds} onChange={(e) => patch({ seconds: +e.target.value })} style={{ flex: 1, accentColor: t.accent }} />
          <span style={{ fontFamily: SERIF, fontSize: 18, color: t.accent, minWidth: 44, textAlign: 'right' }}>{seconds}s</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ border: `1px solid ${t.line}`, borderRadius: 11, padding: '11px 13px', background: t.bg }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: t.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <input value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} style={{ ...smallInput(t), fontWeight: 600 }} />
                {questions.length > 1 && rowDel(t, () => patch({ questions: questions.filter((_, j) => j !== i) }))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 24 }}>
                {q.options.map((opt, oi) => {
                  const correct = q.correct === oi;
                  return (
                    <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span onClick={() => setQ(i, { correct: oi })} title="Mark correct" style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, cursor: 'pointer', border: `2px solid ${correct ? '#1f6b46' : t.line}`, background: correct ? '#1f6b46' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {correct && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2"><path d="M2 6.2l2.4 2.4L10 3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </span>
                      <input value={opt} onChange={(e) => setQ(i, { options: q.options.map((o, j) => j === oi ? e.target.value : o) })} style={{ ...smallInput(t), background: correct ? '#f1f9f4' : t.bg, border: `1px solid ${correct ? '#bfe3cd' : t.line}` }} />
                      {q.options.length > 2 && rowDel(t, () => setQ(i, { options: q.options.filter((_, j) => j !== oi), correct: q.correct >= q.options.length - 1 ? 0 : q.correct }))}
                    </div>
                  );
                })}
                {q.options.length < 4 && addRow(t, 'Add option', () => setQ(i, { options: [...q.options, 'New option'] }))}
              </div>
            </div>
          ))}
          {addRow(t, 'Add question', () => patch({ questions: [...questions, { id: sid(), q: 'New question', options: ['Option A', 'Option B'], correct: 0 }] }))}
        </div>
      </div>
    );
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────────
// The builder shell
// ───────────────────────────────────────────────────────────────────────
function PermissionLock({ t, role }) {
  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="resources" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
        <div style={{ maxWidth: 440, textAlign: 'center', background: t.bg, border: `1px solid ${t.line}`, borderRadius: 16, padding: '36px 40px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: t.panel2, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={t.faint} strokeWidth="1.8"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" /></svg>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 24, marginBottom: 10 }}>Editing is restricted</div>
          <p style={{ fontSize: 14.5, color: t.sub, lineHeight: 1.6, margin: '0 0 18px' }}>
            Building and editing training modules is reserved for <strong style={{ color: t.ink }}>Campus Directors</strong> and <strong style={{ color: t.ink }}>National Staff</strong>. You're signed in as <strong style={{ color: t.ink }}>{role}</strong>.
          </p>
          <div style={{ fontSize: 12.5, color: t.faint }}>You can still take any published module from the library.</div>
          <div style={{ fontSize: 11.5, color: t.faint, marginTop: 16, fontStyle: 'italic' }}>Switch role in the Tweaks panel to see the editor.</div>
        </div>
      </div>
    </div>
  );
}

function TrainingBuilder({ theme: t, role = 'Campus Director' }) {
  if (!canEdit(role)) return <PermissionLock t={t} role={role} />;

  const [module, setModule] = React.useState(loadModule);
  const [selId, setSelId] = React.useState(module.slides[0].id);
  const [addOpen, setAddOpen] = React.useState(false);
  React.useEffect(() => { try { localStorage.setItem(PERSIST_KEY, JSON.stringify(module)); } catch (e) {} }, [module]);

  const onTest = selId === 'TEST';
  const setSlides = (fn) => setModule((m) => ({ ...m, slides: fn(m.slides) }));
  const patchSlide = (id, p) => setSlides((s) => s.map((x) => x.id === id ? { ...x, ...p } : x));
  const addSlide = (type) => {
    const base = { id: sid(), type, title: type === 'game' ? 'New game' : type === 'image' ? 'New image' : type === 'video' ? 'New video' : 'New slide' };
    const seed = type === 'text' ? { body: '' } : type === 'game' ? { game: 'match', prompt: 'Match each pair.', pairs: MATCH_DEFAULT } : type === 'video' ? { source: '', duration: '' } : { caption: '', alt: '' };
    const s = { ...base, ...seed };
    setSlides((arr) => [...arr, s]); setSelId(s.id); setAddOpen(false);
  };
  const move = (id, dir) => setSlides((arr) => { const i = arr.findIndex((x) => x.id === id); const j = i + dir; if (j < 0 || j >= arr.length) return arr; const c = arr.slice();[c[i], c[j]] = [c[j], c[i]]; return c; });
  const del = (id) => setSlides((arr) => { const n = arr.filter((x) => x.id !== id); if (selId === id) setSelId((n[0] || { id: 'TEST' }).id); return n; });
  const patchTest = (p) => setModule((m) => ({ ...m, test: { ...m.test, ...p } }));

  const selSlide = onTest
    ? { type: 'test', _test: module.test, _patchTest: patchTest }
    : module.slides.find((s) => s.id === selId);

  const toggleAud = (a) => setModule((m) => ({ ...m, audience: m.audience.includes(a) ? m.audience.filter((x) => x !== a) : [...m.audience, a] }));

  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <TopBar t={t} section="resources" />
      {/* builder bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 22px', background: t.bg, borderBottom: `1px solid ${t.line}`, flexShrink: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: t.faint }}><span onClick={() => window.PSLNav && window.PSLNav.go('resources')} style={{ cursor: 'pointer' }}>Resources</span> <span style={{ opacity: .5 }}>/</span> <span onClick={() => window.PSLNav && window.PSLNav.go('training')} style={{ cursor: 'pointer' }}>Training</span> <span style={{ opacity: .5 }}>/</span> <span style={{ color: t.ink, fontWeight: 600 }}>Edit</span></span>
        {/* role gate badge */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontSize: 11.5, fontWeight: 700 }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={t.accent} strokeWidth="1.6"><path d="M7 1.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.7 3.2 11l.6-3.6L1.2 5.3l3.6-.5z" strokeLinejoin="round" /></svg>
          Editing as {role}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn t={t} kind="ghost" label="Preview" icon={<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1.5 8s2.4-4 6.5-4 6.5 4 6.5 4-2.4 4-6.5 4-6.5-4-6.5-4z" /><circle cx="8" cy="8" r="1.8" /></svg>} />
          <Btn t={t} kind="ghost" label="Save draft" />
          <Btn t={t} kind="primary" label="Publish"
            icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 10V3M4.2 5.8L7 3l2.8 2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* LEFT — slide list */}
        <div style={{ width: 256, flexShrink: 0, background: t.bg, borderRight: `1px solid ${t.line}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 10px', fontSize: 10.5, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: t.faint }}>Slides · {module.slides.length}</div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0 10px' }}>
            {module.slides.map((s, i) => {
              const on = s.id === selId;
              return (
                <div key={s.id} onClick={() => setSelId(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 10, cursor: 'pointer', marginBottom: 3, position: 'relative', background: on ? t.accentSoft : 'transparent', boxShadow: on ? `inset 2.5px 0 0 ${t.accent}` : 'none' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10.5, color: on ? t.accent : t.faint, width: 16, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ flexShrink: 0 }}><SlideTypeIcon kind={s.type} color={on ? t.accent : t.faint} size={14} /></span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: on ? t.accent : t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title || 'Untitled'}</div>
                    <div style={{ fontSize: 10.5, color: t.faint }}>{TYPE_LABEL[s.type]}</div>
                  </div>
                  {on && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
                      <span onClick={(e) => { e.stopPropagation(); move(s.id, -1); }} style={arrowBtn(t)}><svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke={t.sub} strokeWidth="1.6"><path d="M2.5 6L5 3.5 7.5 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                      <span onClick={(e) => { e.stopPropagation(); move(s.id, 1); }} style={arrowBtn(t)}><svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke={t.sub} strokeWidth="1.6"><path d="M2.5 4L5 6.5 7.5 4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </div>
                  )}
                  {on && module.slides.length > 1 && <span onClick={(e) => { e.stopPropagation(); del(s.id); }} style={{ ...arrowBtn(t), flexShrink: 0 }}><svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke={t.faint} strokeWidth="1.5"><path d="M3 4h8M5.5 4V2.8h3V4M4.5 4l.4 7h4.2l.4-7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
                </div>
              );
            })}

            {/* add slide */}
            <div style={{ position: 'relative', margin: '6px 0 10px' }}>
              <div onClick={() => setAddOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px', borderRadius: 10, border: `1.5px dashed ${t.line}`, color: t.accent, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={t.accent} strokeWidth="1.8"><path d="M6 2.5v7M2.5 6h7" strokeLinecap="round" /></svg> Add slide
              </div>
              {addOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 11, boxShadow: '0 14px 40px rgba(20,26,40,.18)', padding: 5, zIndex: 30 }}>
                  {['text', 'image', 'video', 'game'].map((ty) => (
                    <div key={ty} onClick={() => addSlide(ty)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: t.ink }}
                      onMouseEnter={(e) => e.currentTarget.style.background = t.panel} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <SlideTypeIcon kind={ty} color={t.accent} size={15} /> {TYPE_LABEL[ty]} slide
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* final test (pinned) */}
            <div style={{ height: 1, background: t.line, margin: '4px 6px 10px' }} />
            <div onClick={() => setSelId('TEST')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 10px', borderRadius: 10, cursor: 'pointer', background: onTest ? t.accentSoft : t.panel, boxShadow: onTest ? `inset 2.5px 0 0 ${t.accent}` : 'none', border: `1px solid ${onTest ? 'transparent' : t.line}` }}>
              <SlideTypeIcon kind="test" color={onTest ? t.accent : t.gold || '#a9852f'} size={15} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: onTest ? t.accent : t.ink }}>Final Test</div>
                <div style={{ fontSize: 10.5, color: t.faint }}>{module.test.questions.length} Q · pass {module.test.passing}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — editor */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: '30px 36px', background: t.panel }}>
          {selSlide && <SlideEditor t={t} slide={selSlide} patch={(p) => patchSlide(selId, p)} />}
        </div>

        {/* RIGHT — inspector */}
        <div style={{ width: 280, flexShrink: 0, background: t.bg, borderLeft: `1px solid ${t.line}`, overflow: 'auto', padding: '20px 20px' }}>
          <FieldLbl t={t}>Module</FieldLbl>
          <input value={module.title} onChange={(e) => setModule((m) => ({ ...m, title: e.target.value }))} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: SERIF, fontSize: 19, color: t.ink, marginBottom: 4 }} />
          <div style={{ height: 16 }} />
          <FieldLbl t={t}>Collection</FieldLbl>
          <BoxLine t={t} value={module.collection} onChange={(v) => setModule((m) => ({ ...m, collection: v }))} />
          <div style={{ height: 18 }} />
          <FieldLbl t={t}>Visible to</FieldLbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {AUDIENCES.map((a) => { const on = module.audience.includes(a); return (
              <span key={a} onClick={() => toggleAud(a)} style={{ padding: '5px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: on ? t.accentSoft : t.panel, color: on ? t.accent : t.sub, border: `1px solid ${on ? t.accent : t.line}` }}>{a}</span>
            ); })}
          </div>
          <div style={{ height: 22 }} />
          <div style={{ height: 1, background: t.line, marginBottom: 18 }} />
          <FieldLbl t={t}>Who can edit</FieldLbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EDIT_ROLES.map((r) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: t.ink }}>
                <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#1f6b46" /><path d="M4.7 8.2l2.1 2.1 4.3-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {r}
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: t.faint }}>
              <span style={{ width: 15, height: 15, borderRadius: '50%', border: `1.5px solid ${t.line}` }} /> Members & Candidates — view only
            </div>
          </div>
          <div style={{ marginTop: 20, padding: '12px 13px', borderRadius: 10, background: t.panel, fontSize: 11.5, lineHeight: 1.55, color: t.faint }}>
            Edits autosave as you type. Publishing pushes this module to everyone in the <strong style={{ color: t.sub }}>Visible to</strong> list.
          </div>
        </div>
      </div>
    </div>
  );
}
function arrowBtn(t) { return { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 13, cursor: 'pointer', borderRadius: 3 }; }

Object.assign(window, { TrainingBuilder, PermissionLock, SlideEditor, TestEditor });
