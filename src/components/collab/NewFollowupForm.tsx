// src/components/collab/NewFollowupForm.tsx
// The working "Assign" popover/modal (ported from collab.jsx). Creates a
// follow-up task via the collab store, which fans out a notification + toast to
// the assignee.

import { useEffect, useRef, useState } from 'react';
import type { Theme } from '@/theme/tokens';
import { SERIF, UI } from '@/theme/tokens';
import { TEAM } from '@/data/mockData';
import { useCollab } from '@/store/collab';
import { MiniA } from '@/components/atoms/Avatar';
import type { Member, TaskChannel, TaskPriority } from '@/types/domain';
import { fullName } from '@/types/domain';

export function NewFollowupForm({
  theme: t,
  people = [],
  defaultWho,
  onClose,
  modal,
}: {
  theme: Theme;
  people?: Member[];
  defaultWho?: string;
  onClose: () => void;
  modal?: boolean;
}) {
  const me = useCollab((s) => s.me);
  const addTask = useCollab((s) => s.addTask);

  const [who, setWho] = useState(defaultWho || (people[0] ? fullName(people[0]) : ''));
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState(me);
  const [channel, setChannel] = useState<TaskChannel>('Call');
  const [pri, setPri] = useState<TaskPriority>('med');
  const [due, setDue] = useState('This week');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lbl: React.CSSProperties = {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: t.faint,
    marginBottom: 5,
    display: 'block',
  };
  const inp: React.CSSProperties = {
    width: '100%',
    fontFamily: UI,
    fontSize: 13,
    color: t.ink,
    background: t.bg,
    border: `1px solid ${t.line}`,
    borderRadius: 8,
    padding: '8px 10px',
    outline: 'none',
  };
  const canSave = title.trim().length > 0;
  const save = () => {
    if (!canSave) return;
    addTask({ title: title.trim(), who, ownerId: owner, channel, priority: pri, due });
    onClose();
  };

  const cardStyle: React.CSSProperties = modal
    ? {
        position: 'relative',
        width: 320,
        background: t.bg,
        border: `1px solid ${t.line}`,
        borderRadius: 14,
        boxShadow: '0 24px 60px rgba(15,20,32,.3)',
        padding: 16,
        fontFamily: UI,
      }
    : {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        zIndex: 80,
        width: 300,
        background: t.bg,
        border: `1px solid ${t.line}`,
        borderRadius: 14,
        boxShadow: '0 16px 44px rgba(15,20,32,.22)',
        padding: 14,
        fontFamily: UI,
      };

  const form = (
    <div ref={ref} onClick={(e) => e.stopPropagation()} style={cardStyle}>
      <div style={{ fontFamily: SERIF, fontSize: 16, marginBottom: 12 }}>New follow-up</div>

      <label style={lbl}>Task</label>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Q2 check-in call"
        style={{ ...inp, marginBottom: 12 }}
      />

      <label style={lbl}>About</label>
      <select value={who} onChange={(e) => setWho(e.target.value)} style={{ ...inp, marginBottom: 12 }}>
        {people.map((p) => {
          const n = fullName(p);
          return (
            <option key={p.id} value={n}>
              {n}
            </option>
          );
        })}
      </select>

      <label style={lbl}>Assign to</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        {TEAM.map((mTeam) => {
          const on = mTeam.name === owner;
          return (
            <div
              key={mTeam.name}
              onClick={() => setOwner(mTeam.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '6px 7px',
                borderRadius: 8,
                cursor: 'pointer',
                background: on ? t.accentSoft : 'transparent',
                border: `1px solid ${on ? t.accent : 'transparent'}`,
              }}
            >
              <MiniA name={mTeam.name} theme={t} size={24} />
              <span style={{ fontSize: 12.5, fontWeight: on ? 600 : 500, color: on ? t.accent : t.ink }}>
                {mTeam.name === me ? 'You' : mTeam.name}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Channel</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value as TaskChannel)} style={inp}>
            {(['Call', 'Text', 'Email', 'Visit'] as TaskChannel[]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Priority</label>
          <select value={pri} onChange={(e) => setPri(e.target.value as TaskPriority)} style={inp}>
            <option value="high">High</option>
            <option value="med">Med</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onClose}
          style={{
            flex: '0 0 auto',
            fontFamily: UI,
            fontSize: 12.5,
            fontWeight: 600,
            padding: '8px 14px',
            borderRadius: 9,
            border: `1px solid ${t.line}`,
            background: t.bg,
            color: t.sub,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={!canSave}
          style={{
            flex: 1,
            fontFamily: UI,
            fontSize: 12.5,
            fontWeight: 600,
            padding: '8px 14px',
            borderRadius: 9,
            border: 'none',
            background: canSave ? t.accent : t.line,
            color: canSave ? t.onAccent : t.faint,
            cursor: canSave ? 'pointer' : 'default',
          }}
        >
          Assign follow-up
        </button>
      </div>
    </div>
  );

  if (!modal) return form;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15,20,32,.46)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      {form}
    </div>
  );
}
