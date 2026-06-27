// collab.tsx — the live team-collaboration store, ported from collab.jsx's
// PSLStore into the app's Context+Provider pattern (matching lifecycle.tsx).
// Owns the working assignment layer: who you are ("View as"), relationship
// owners, follow-up tasks, the activity feed, and in-app notifications. All
// in-memory (demo), but fully interactive so the collaboration flow can be felt.
//
// Composed INSIDE LifecycleProvider so its confirmation toasts route through the
// single lifecycle toast stack. Promotion lives in lifecycle.tsx, not here.
import {
  createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode,
} from 'react';
import { useLifecycle } from '@/lib/lifecycle';
import { MOCK_TEAM } from '@/data/mock';
import type { Channel, Priority, TaskStatus, Notification } from '@/types/domain';

// Who may edit engagement records (port of training.jsx EDIT_ROLES / canEdit).
export const EDIT_ROLES = ['Campus Director', 'National Staff'];
export const canEdit = (role: string): boolean => EDIT_ROLES.includes(role);

/** A live follow-up task (prototype shape: `pri`, plus `by` = creator). */
export interface CollabTask {
  id: string;
  title: string;
  who: string;
  owner: string;
  due: string;
  channel: Channel;
  pri: Priority;
  status: TaskStatus;
  by: string;
}

/** A logged interaction prepended onto the static call log. */
export interface ActivityEvent {
  id: string;
  type: Channel;
  who: string;
  note: string;
  by: string;
  when: string;
}

export interface NewTaskInput {
  title: string; who: string; owner: string; channel: Channel; pri: Priority; due: string;
}
export interface NewActivityInput {
  type: Channel; who: string; note: string;
}

interface CollabState {
  me: string;
  owners: Record<string, string>;
  tasks: CollabTask[];
  activity: ActivityEvent[];
  notifs: Notification[];
}

export interface TeamMember { name: string; role: string }

interface CollabValue {
  me: string;
  role: string;
  canEdit: boolean;
  team: TeamMember[];
  owners: Record<string, string>;
  tasks: CollabTask[];
  activity: ActivityEvent[];
  notifs: Notification[];
  setMe: (name: string) => void;
  ownerOf: (key: string, fallback: string) => string;
  reassign: (key: string, label: string, toName: string) => void;
  addTask: (task: NewTaskInput) => void;
  reassignTask: (id: string, toName: string) => void;
  toggleTask: (id: string) => void;
  logActivity: (ev: NewActivityInput) => void;
  markRead: (to: string) => void;
}

const Ctx = createContext<CollabValue | null>(null);
const first = (n: string) => (n || '').split(' ')[0];
const roleOf = (name: string) => MOCK_TEAM.find((m) => m.name === name)?.role ?? 'Member';

export function CollabProvider({ children }: { children: ReactNode }) {
  const { pushToast } = useLifecycle();
  const [state, setState] = useState<CollabState>({
    me: MOCK_TEAM[0]?.name ?? 'Jordan Tate',
    owners: {}, tasks: [], activity: [], notifs: [],
  });

  // Refs give actions a fresh snapshot of `me`/state for conditional side
  // effects (notify/toast) without stale closures or dependency churn.
  const meRef = useRef(state.me);
  meRef.current = state.me;
  const stateRef = useRef(state);
  stateRef.current = state;
  const idRef = useRef(1);
  const nid = () => 'c' + (idRef.current++);

  // In-app notification (never notify yourself — see RESUME principle).
  const pushNotif = useCallback((to: string, text: string, sub: string) => {
    if (to === meRef.current) return;
    setState((s) => ({ ...s, notifs: [{ id: nid(), to, text, sub, read: false, ts: 'just now' }, ...s.notifs] }));
  }, []);

  const setMe = useCallback((name: string) => setState((s) => ({ ...s, me: name })), []);

  const ownerOf = useCallback((key: string, fallback: string) => state.owners[key] ?? fallback, [state.owners]);

  const reassign = useCallback((key: string, label: string, toName: string) => {
    const me = meRef.current;
    if (stateRef.current.owners[key] === toName) return;
    setState((s) => ({ ...s, owners: { ...s.owners, [key]: toName } }));
    pushNotif(toName, `${first(me)} gave you ${label}`, 'Relationship owner');
    pushToast(`${label} → ${toName === me ? 'you' : first(toName)}`);
  }, [pushNotif, pushToast]);

  const addTask = useCallback((input: NewTaskInput) => {
    const me = meRef.current;
    const tk: CollabTask = { id: nid(), status: 'todo', by: me, ...input };
    setState((s) => ({ ...s, tasks: [tk, ...s.tasks] }));
    pushNotif(input.owner, `${first(me)} assigned you a follow-up`, input.title);
    pushToast(`Follow-up assigned to ${input.owner === me ? 'you' : first(input.owner)}`);
  }, [pushNotif, pushToast]);

  const reassignTask = useCallback((id: string, toName: string) => {
    const me = meRef.current;
    const tk = stateRef.current.tasks.find((x) => x.id === id);
    if (!tk || tk.owner === toName) return;
    setState((s) => ({ ...s, tasks: s.tasks.map((x) => (x.id === id ? { ...x, owner: toName } : x)) }));
    pushNotif(toName, `${first(me)} reassigned a follow-up to you`, tk.title);
    pushToast(`Reassigned to ${toName === me ? 'you' : first(toName)}`);
  }, [pushNotif, pushToast]);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((x) => (x.id === id ? { ...x, status: x.status === 'done' ? 'todo' : 'done' } : x)) }));
  }, []);

  const logActivity = useCallback((ev: NewActivityInput) => {
    const me = meRef.current;
    const e: ActivityEvent = { id: nid(), by: me, when: 'just now', ...ev };
    setState((s) => ({ ...s, activity: [e, ...s.activity] }));
    pushToast(`Logged ${ev.type.toLowerCase()} with ${first(ev.who)}`);
  }, [pushToast]);

  const markRead = useCallback((to: string) => {
    setState((s) => ({ ...s, notifs: s.notifs.map((n) => (n.to === to ? { ...n, read: true } : n)) }));
  }, []);

  const role = roleOf(state.me);
  const editable = canEdit(role);

  const value = useMemo<CollabValue>(() => ({
    me: state.me, role, canEdit: editable, team: MOCK_TEAM,
    owners: state.owners, tasks: state.tasks, activity: state.activity, notifs: state.notifs,
    setMe, ownerOf, reassign, addTask, reassignTask, toggleTask, logActivity, markRead,
  }), [state, role, editable, setMe, ownerOf, reassign, addTask, reassignTask, toggleTask, logActivity, markRead]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCollab(): CollabValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCollab must be used within a CollabProvider');
  return v;
}
