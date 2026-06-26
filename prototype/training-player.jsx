// training-player.jsx — the learner experience for a training module.
// Steps through the slides, then the final test. On a pass: fireworks + confetti
// + a completion certificate. Uses global atoms + Celebration / MatchGame.

// A striped media placeholder for image / video slides.
function MediaPlaceholder({ t, kind, label }) {
  const stripe = `repeating-linear-gradient(45deg, ${t.panel2}, ${t.panel2} 9px, ${t.panel} 9px, ${t.panel} 18px)`;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 14, background: stripe, border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {kind === 'video' && (
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.bg, boxShadow: '0 4px 18px rgba(0,0,0,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 16 16" fill={t.accent}><path d="M5 3.5v9l7-4.5z" /></svg>
        </div>
      )}
      <span style={{ position: 'absolute', bottom: 12, left: 12, fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 0.4, color: t.faint, background: t.bg, padding: '4px 9px', borderRadius: 6, border: `1px solid ${t.line}` }}>{label}</span>
    </div>
  );
}

// One content slide rendered for the learner.
function PlayerSlide({ t, slide }) {
  if (slide.type === 'text') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '14px 0' }}>
        <div style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.1, color: t.ink, marginBottom: 20 }}>{slide.title}</div>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: t.sub, textWrap: 'pretty', margin: 0 }}>{slide.body}</p>
      </div>
    );
  }
  if (slide.type === 'image') {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: SERIF, fontSize: 28, color: t.ink, marginBottom: 14 }}>{slide.title}</div>
        <div style={{ height: 360 }}><MediaPlaceholder t={t} kind="image" label={slide.alt || 'image'} /></div>
        {slide.caption && <div style={{ fontSize: 13.5, color: t.faint, marginTop: 12, fontStyle: 'italic' }}>{slide.caption}</div>}
      </div>
    );
  }
  if (slide.type === 'video') {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', width: '100%' }}>
        <div style={{ fontFamily: SERIF, fontSize: 28, color: t.ink, marginBottom: 14 }}>{slide.title}</div>
        <div style={{ height: 380 }}><MediaPlaceholder t={t} kind="video" label={`${slide.source || 'video'} · ${slide.duration || ''}`} /></div>
        {slide.note && <div style={{ fontSize: 14, color: t.sub, marginTop: 14 }}>{slide.note}</div>}
      </div>
    );
  }
  if (slide.type === 'game') {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.accent, background: t.accentSoft, padding: '4px 10px', borderRadius: 999, marginBottom: 14 }}>
          <SlideTypeIcon kind="game" color={t.accent} size={13} /> Interactive
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 28, color: t.ink, marginBottom: 6 }}>{slide.title}</div>
        <p style={{ fontSize: 15, color: t.sub, margin: '0 0 22px' }}>{slide.prompt}</p>
        <GameRender t={t} slide={slide} />
      </div>
    );
  }
  return null;
}

// The final test — all questions, radio answers, scored on submit.
function TestSheet({ t, test, answers, setAnswers, showErrors }) {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', width: '100%' }}>
      <div style={{ fontFamily: SERIF, fontSize: 34, color: t.ink, marginBottom: 6 }}>Final Test</div>
      <p style={{ fontSize: 14.5, color: t.faint, margin: '0 0 26px' }}>Answer all {test.questions.length} questions. You need {test.passing}% to pass.</p>
      {test.questions.map((q, qi) => {
        const unanswered = showErrors && answers[q.id] == null;
        return (
          <div key={q.id} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: unanswered ? '#b3402f' : t.accent }}>{String(qi + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 17, fontWeight: 600, color: t.ink, lineHeight: 1.35 }}>{q.q}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 30 }}>
              {q.options.map((opt, oi) => {
                const on = answers[q.id] === oi;
                return (
                  <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                    background: on ? t.accentSoft : t.bg, border: `1.5px solid ${on ? t.accent : t.line}` }}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: `2px solid ${on ? t.accent : t.line}`, background: on ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {on && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                    </span>
                    <span style={{ fontSize: 14.5, color: on ? t.accent : t.ink, fontWeight: on ? 600 : 400 }}>{opt}</span>
                  </label>
                );
              })}
            </div>
            {unanswered && <div style={{ fontSize: 12, color: '#b3402f', paddingLeft: 30, marginTop: 6 }}>Please choose an answer.</div>}
          </div>
        );
      })}
    </div>
  );
}

// Pass / fail result screen.
function ResultScreen({ t, passed, score, threshold, module, onRetry, onReview }) {
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <Celebration active={passed} colors={festive(t)} />
      <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', maxWidth: 560, padding: 30 }}>
        {passed ? (
          <React.Fragment>
            {/* certificate */}
            <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 18, padding: '34px 40px 30px', boxShadow: '0 24px 70px rgba(20,26,40,.20)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e3f3ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#1f6b46" /><path d="M9.5 16.4l4.2 4.2 8.8-9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: t.gold || '#a9852f', marginBottom: 8 }}>Certificate of Completion</div>
              <div style={{ fontFamily: SERIF, fontSize: 30, color: t.ink, lineHeight: 1.15, marginBottom: 10 }}>You passed!</div>
              <p style={{ fontSize: 15, color: t.sub, lineHeight: 1.55, margin: '0 0 18px' }}>
                <span style={{ fontWeight: 600, color: t.ink }}>Marcus Bellamy</span> completed<br />
                <span style={{ fontStyle: 'italic' }}>{module.title}</span>
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, padding: '8px 18px', borderRadius: 999, background: t.accentSoft }}>
                <span style={{ fontFamily: SERIF, fontSize: 28, color: t.accent, lineHeight: 1 }}>{score}%</span>
                <span style={{ fontSize: 13, color: t.faint }}>· passed at {threshold}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
              <Btn t={t} kind="ghost" label="Review module" onClick={onReview} />
              <Btn t={t} kind="good" label="Mark complete & continue"
                icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6.5h6M6.5 3.5L9.5 6.5 6.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
            </div>
          </React.Fragment>
        ) : (
          <div style={{ background: t.bg, border: `1px solid ${t.line}`, borderRadius: 18, padding: '34px 40px', boxShadow: '0 24px 70px rgba(20,26,40,.16)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fbefdd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8a5a16" strokeWidth="2.4"><path d="M14 7v8" strokeLinecap="round" /><circle cx="14" cy="20" r="1.2" fill="#8a5a16" stroke="none" /></svg>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 27, color: t.ink, marginBottom: 8 }}>Not quite yet</div>
            <p style={{ fontSize: 15, color: t.sub, lineHeight: 1.55, margin: '0 0 18px' }}>
              You scored <span style={{ fontWeight: 700, color: '#8a5a16' }}>{score}%</span> — you need {threshold}% to pass. Review the material and give it another go.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Btn t={t} kind="ghost" label="Review module" onClick={onReview} />
              <Btn t={t} kind="primary" label="Retry test" onClick={onRetry}
                icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M11.5 7a4.5 4.5 0 11-1.3-3.2M11.5 1.5V4h-2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// The full player. `start` lets an artboard open directly on the test or result.
function TrainingPlayer({ theme: t, module: mod, start }) {
  const module = mod || starterModule();
  const slides = module.slides;
  const TEST = slides.length;          // index that means "the test"
  const [idx, setIdx] = React.useState(start === 'test' ? TEST : 0);
  const [answers, setAnswers] = React.useState({});
  const [result, setResult] = React.useState(start === 'pass' ? { passed: true, score: 100 } : null);
  const [showErrors, setShowErrors] = React.useState(false);

  const onTest = idx === TEST;
  const total = TEST + 1;
  const step = onTest ? total : idx + 1;
  const pct = Math.round((step / total) * 100);

  const submit = () => {
    const qs = module.test.questions;
    if (qs.some((q) => answers[q.id] == null)) { setShowErrors(true); return; }
    const right = qs.filter((q) => answers[q.id] === q.correct).length;
    const score = Math.round((right / qs.length) * 100);
    setResult({ passed: score >= module.test.passing, score });
  };
  const retry = () => { setAnswers({}); setShowErrors(false); setResult(null); setIdx(TEST); };
  const review = () => { setAnswers({}); setShowErrors(false); setResult(null); setIdx(0); };

  return (
    <div style={{ fontFamily: UI, height: '100%', background: t.panel, color: t.ink, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* player chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', background: t.bg, borderBottom: `1px solid ${t.line}`, flexShrink: 0 }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SlideTypeIcon kind="text" color={t.accent} size={16} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: 17, lineHeight: 1.1 }}>{module.title}</div>
          <div style={{ fontSize: 11.5, color: t.faint, marginTop: 2 }}>{module.collection} · for {module.audience.join(' & ')}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: t.faint, fontVariantNumeric: 'tabular-nums' }}>{result ? 'Complete' : onTest ? 'Final test' : `Slide ${idx + 1} of ${slides.length}`}</span>
          <span onClick={() => window.PSLNav && window.PSLNav.back()} style={{ cursor: 'pointer', color: t.faint }}>
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" strokeLinecap="round" /></svg>
          </span>
        </div>
      </div>
      {/* progress */}
      <div style={{ height: 4, background: t.panel2, flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${result ? 100 : pct}%`, background: t.accent, transition: 'width .3s' }} />
      </div>

      {/* stage */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: result ? 0 : '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: onTest || result ? 'flex-start' : 'center' }}>
        {result ? (
          <ResultScreen t={t} passed={result.passed} score={result.score} threshold={module.test.passing} module={module} onRetry={retry} onReview={review} />
        ) : onTest ? (
          <TestSheet t={t} test={module.test} answers={answers} setAnswers={setAnswers} showErrors={showErrors} />
        ) : (
          <PlayerSlide t={t} slide={slides[idx]} />
        )}
      </div>

      {/* footer nav */}
      {!result && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', background: t.bg, borderTop: `1px solid ${t.line}`, flexShrink: 0 }}>
          <Btn t={t} kind="ghost" label="Back" onClick={() => setIdx((i) => Math.max(0, i - 1))} />
          {/* dots */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {slides.map((s, i) => (
              <span key={s.id} style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 999, background: i === idx ? t.accent : i < idx ? t.accent : t.panel2, opacity: i < idx ? 0.5 : 1, transition: 'all .2s' }} />
            ))}
            <span style={{ width: onTest ? 22 : 8, height: 8, borderRadius: 999, background: onTest ? t.accent : t.panel2, border: `1.5px solid ${onTest ? t.accent : t.line}` }} />
          </div>
          {onTest ? (
            <Btn t={t} kind="primary" label="Submit test" onClick={submit}
              icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2.5 7.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
          ) : idx === slides.length - 1 ? (
            <Btn t={t} kind="primary" label="Start final test" onClick={() => setIdx(TEST)}
              icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 2.5L9.5 7 4 11.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
          ) : (
            <Btn t={t} kind="primary" label="Next" onClick={() => setIdx((i) => Math.min(TEST, i + 1))}
              icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 2.5L9.5 7 4 11.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TrainingPlayer, MediaPlaceholder, PlayerSlide, TestSheet, ResultScreen });
