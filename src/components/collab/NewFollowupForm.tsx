// NewFollowupForm.tsx — the working "Assign" popover/modal (port of collab.jsx
// NewFollowupForm). Composes a follow-up and assigns it via the collab store.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF } from '@/theme/tokens';
import { useCollab } from '@/lib/collab';
import type { Channel, Priority } from '@/types/domain';
import { MiniAvatar } from './atoms';

export interface PersonRef { f: string; l: string }

const CHANNELS: Channel[] = ['Call', 'Text', 'Email', 'Visit'];

export function NewFollowupForm({
  people = [], defaultWho, onClose, modal,
}: {
  people?: PersonRef[];
  defaultWho?: string;
  onClose: () => void;
  modal?: boolean;
}) {
  const { t } = useTheme();
  const { me, team, addTask } = useCollab();
  const [who, setWho] = useState(defaultWho ?? (people[0] ? `${people[0].f} ${people[0].l}` : ''));
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState(me);
  const [channel, setChannel] = useState<Channel>('Call');
  const [pri, setPri] = useState<Priority>('med');
  const [due] = useState('This week');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const lbl: CSSProperties = { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: t.faint, marginBottom: 5, display: 'block' };
  const inp: CSSProperties = { width: '100%', boxSizing: 'border-box', fontFamily: UI, fontSize: 13, color: t.ink, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 8, padding: '8px 10px', outline: 'none' };
  const canSave = title.trim().length > 0;
  const save = () => {
    if (!canSave) return;
    addTask({ title: title.trim(), who, owner, channel, pri, due });
    onClose();
  };

  const cardStyle: CSSProperties = modal
    ? { position: 'relative', width: 320, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, boxShadow: '0 24px 60px rgba(15,20,32,.3)', padding: 16, fontFamily: UI }
    : { position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 80, width: 300, background: t.bg, border: `1px solid ${t.line}`, borderRadius: 14, boxShadow: '0 16px 44px rgba(15,20,32,.22)', padding: 14, fontFamily: UI };

  const form = (
    <div ref={ref} onClick={(e) => e.stopPropagation()} style={cardStyle}>
      <div style={{ fontFamily: SERIF, fontSize: 16, marginBottom: 12 }}>New follow-up</div>

      <label style={lbl}>Task</label>
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q2 check-in call" style={{ ...inp, marginBottom: 12 }} />

      <label style={lbl}>About</label>
      <select value={who} onChange={(e) => setWho(e.target.value)} style={{ ...inp, marginBottom: 12 }}>
        {people.map((p) => { const n = `${p.f} ${p.l}`; return <option key={n} value={n}>{n}</option>; })}
      </select>

      <label style={lbl}>Assign to</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        {team.map((m) => {
          const on = m.name === owner;
          return (
            <div key={m.name} onClick={() => setOwner(m.name)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 7px', borderRadius: 8, cursor: 'pointer', background: on ? t.accentSoft : 'transparent', border: `1px solid ${on ? t.accent : 'transparent'}` }}>
              <MiniAvatar name={m.name} size={24} />
              <span style={{ fontSize: 12.5, fontWeight: on ? 600 : 500, color: on ? t.accent : t.ink }}>{m.name === me ? 'You' : m.name}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Channel</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)} style={inp}>
            {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Priority</label>
          <select value={pri} onChange={(e) => setPri(e.target.value as Priority)} style={inp}>
            <option value="high">High</option>
            <option value="med">Med</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onClose} style={{ flex: '0 0 auto', fontFamily: UI, fontSize: 12.5, fontWeight: 600, padding: '8px 14px', borderRadius: 9, border: `1px solid ${t.line}`, background: t.bg, color: t.sub, cursor: 'pointer' }}>Cancel</button>
        <button onClick={save} disabled={!canSave} style={{ flex: 1, fontFamily: UI, fontSize: 12.5, fontWeight: 600, padding: '8px 14px', borderRadius: 9, border: 'none', background: canSave ? t.accent : t.line, color: canSave ? t.onAccent : t.faint, cursor: canSave ? 'pointer' : 'default' }}>Assign follow-up</button>
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
