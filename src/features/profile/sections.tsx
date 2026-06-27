// sections.tsx — the six engagement section bodies for the Profile workspace
// (port of engagement.jsx). Static datasets render for everyone; live items from
// the collab store (activity, tasks) layer on top, filtered by the person. All
// write affordances are gated by `editable` (Campus Directors / National Staff).
import { useState } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI, SERIF, BP } from '@/theme/tokens';
import { useViewport } from '@/lib/useViewport';
import { useCollab } from '@/lib/collab';
import { Button } from '@/components/ui';
import {
  MiniAvatar, ChannelIcon, ChannelBadge, TaskStatusIcon, PriorityFlag, OwnerMenu,
} from '@/components/collab';
import type { Channel } from '@/types/domain';
import { AreaIcon, StatusPill } from './engagement-atoms';
import { LIFE_AREAS, CALLS, FOLLOWUPS, PRAYER, GIVING, HELP, type Followup } from './engagement-data';

const CHANNELS: Channel[] = ['Call', 'Text', 'Email', 'Visit'];

// ── How they're doing ──────────────────────────────────────────────────
export function HowDoingBody() {
  const { t } = useTheme();
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

// ── Call log ───────────────────────────────────────────────────────────
export function CallLogBody({ who, editable }: { who: string; editable: boolean }) {
  const { t } = useTheme();
  const { activity, logActivity } = useCollab();
  const [ch, setCh] = useState<Channel>('Call');
  const [note, setNote] = useState('');
  const liveCalls = activity.filter((e) => e.who === who);
  const save = () => { logActivity({ type: ch, who, note: note.trim() || `${ch} logged.` }); setNote(''); };
  return (
    <div style={{ paddingTop: 12 }}>
      {editable && (
        <div style={{ border: `1px solid ${t.line}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${t.line}`, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: t.panel, borderRadius: 9, border: `1px solid ${t.line}` }}>
              {CHANNELS.map((v) => {
                const on = v === ch;
                return (
                  <span key={v} onClick={() => setCh(v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: on ? t.bg : 'transparent', color: on ? t.ink : t.faint, boxShadow: on ? '0 1px 2px rgba(0,0,0,.1)' : 'none' }}>
                    <ChannelIcon kind={v} color={on ? t.accent : t.faint} />{v}
                  </span>
                );
              })}
            </div>
            <div style={{ padding: '7px 11px', borderRadius: 8, border: `1px solid ${t.line}`, fontSize: 12.5, color: t.ink }}>Today · Jun 25</div>
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes from your conversation — what you discussed, how they're doing, anything to remember…"
            style={{ width: '100%', minHeight: 60, resize: 'vertical', border: 'none', outline: 'none', padding: '12px 13px', fontFamily: UI, fontSize: 13, color: t.ink, background: t.bg, boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', borderTop: `1px solid ${t.line}`, background: t.panel }}>
            <span style={{ fontSize: 11.5, color: t.faint }}>Saves to this record &amp; the team activity feed.</span>
            <div style={{ marginLeft: 'auto' }}><Button kind="primary" label="Save log" onClick={save} /></div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {liveCalls.map((c) => (
          <div key={c.id} style={{ background: t.accentSoft, border: `1px solid ${t.accent}`, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <ChannelBadge type={c.type} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{c.when}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: t.accent }}>NEW</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MiniAvatar name={c.by} size={20} /><span style={{ fontSize: 11.5, color: t.faint }}>{c.by}</span>
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: t.sub, textWrap: 'pretty' }}>{c.note}</p>
          </div>
        ))}
        {CALLS.map((c, i) => (
          <div key={i} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <ChannelBadge type={c.type} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: t.ink }}>{c.date}</span>
              {c.dur && <span style={{ fontSize: 12, color: t.faint }}>· {c.dur}</span>}
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MiniAvatar name={c.by} size={20} /><span style={{ fontSize: 11.5, color: t.faint }}>{c.by}</span>
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: t.sub, textWrap: 'pretty' }}>{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Follow-ups ─────────────────────────────────────────────────────────
type FollowRow = (Followup & { id: string }) | (ReturnType<typeof useCollab>['tasks'][number]);

export function FollowupsBody({ who, editable }: { who: string; editable: boolean }) {
  const { t } = useTheme();
  const { tasks, toggleTask, reassignTask } = useCollab();
  const live = tasks.filter((tk) => tk.who === who);
  const all: FollowRow[] = [...live, ...FOLLOWUPS.map((f, i) => ({ ...f, id: 'static' + i }))];
  return (
    <div style={{ paddingTop: 6 }}>
      {all.map((f, i) => {
        const isLive = !String(f.id).startsWith('static');
        const canToggle = isLive && editable;
        return (
          <div key={f.id || i} style={{ display: 'flex', gap: 11, padding: '11px 2px', borderBottom: i < all.length - 1 ? `1px solid ${t.panel2}` : 'none', alignItems: 'flex-start' }}>
            <span onClick={() => { if (canToggle) toggleTask(f.id); }} style={{ marginTop: 1, flexShrink: 0, cursor: canToggle ? 'pointer' : 'default' }}><TaskStatusIcon status={f.status} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, lineHeight: 1.4, fontWeight: 500, color: f.status === 'done' ? t.faint : t.ink, textDecoration: f.status === 'done' ? 'line-through' : 'none', marginBottom: 6 }}>
                {f.title}
                {isLive && <span style={{ marginLeft: 7, fontSize: 10, fontWeight: 700, color: t.accent, background: t.accentSoft, padding: '1px 7px', borderRadius: 999, verticalAlign: 'middle' }}>New</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                {isLive && editable ? (
                  <OwnerMenu current={f.owner} onPick={(n) => reassignTask(f.id, n)} title="Reassign to">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                      <MiniAvatar name={f.owner} size={18} /><span style={{ fontSize: 11, color: t.sub }}>{f.owner.split(' ')[0]}</span>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={t.faint} strokeWidth="1.5"><path d="M3 4.5L6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </OwnerMenu>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <MiniAvatar name={f.owner} size={18} /><span style={{ fontSize: 11, color: t.sub }}>{f.owner.split(' ')[0]}</span>
                  </span>
                )}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.sub }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="2.5" width="9" height="8" rx="1.2" /><path d="M1.5 4.8h9M4 1.5v2M8 1.5v2" strokeLinecap="round" /></svg>{f.due}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.faint }}><ChannelIcon kind={f.channel} color={t.faint} size={11} />{f.channel}</span>
                {f.status !== 'done' && <PriorityFlag pri={f.pri} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Prayer requests ────────────────────────────────────────────────────
export function PrayerBody() {
  const { t } = useTheme();
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

// ── Giving ─────────────────────────────────────────────────────────────
export function GivingBody() {
  const { t } = useTheme();
  const stats: [string, string][] = [['This year', GIVING.ytd], ['Lifetime', GIVING.lifetime], ['Cadence', 'Monthly']];
  return (
    <div style={{ paddingTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: SERIF, fontSize: 26, color: t.ink, lineHeight: 1 }}>{GIVING.amount.split(' ')[0]}</span>
        <span style={{ fontSize: 13, color: t.faint }}>/ mo · since {GIVING.since}</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 999, background: '#e3f3ea', color: '#1f6b46', fontSize: 10.5, fontWeight: 700 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f6b46' }} />Active</span>
      </div>
      <div style={{ display: 'flex' }}>
        {stats.map(([l, v], i) => (
          <div key={l} style={{ flex: 1, paddingLeft: i ? 14 : 0, borderLeft: i ? `1px solid ${t.line}` : 'none' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', color: t.faint, marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Ways to help ───────────────────────────────────────────────────────
export function WaysToHelpBody() {
  const { t } = useTheme();
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
