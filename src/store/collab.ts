// src/store/collab.ts
// The live team-collaboration layer, ported from the prototype's PSLStore
// (prototype/collab.jsx) to Zustand. Owns the session-collaboration state:
// current identity, follow-up tasks, the activity feed, toasts, and in-app
// notifications. Stage transitions + owner changes are PERSISTED via the
// DataSource; this store fans out the matching toast / notification / activity
// so every open screen reacts instantly (the Supabase-realtime seam later).
//
// Rule preserved from the prototype: you never notify yourself.

import { create } from 'zustand';
import type { ActivityItem, NotificationItem, Task } from '@/types/domain';
import { ME_DEFAULT, SEED_ACTIVITY, SEED_TASKS } from '@/data/mockData';

const firstName = (n: string) => (n || '').split(' ')[0];

let _uid = 0;
const nid = () => `n${++_uid}`;

interface CollabState {
  me: string;
  tasks: Task[];
  activity: ActivityItem[];
  toasts: { id: string; text: string }[];
  notifs: NotificationItem[];

  // identity
  setMe: (name: string) => void;

  // toasts
  pushToast: (text: string) => void;
  dropToast: (id: string) => void;

  // notifications
  notify: (toId: string, text: string, sub?: string) => void;
  markRead: (toId: string) => void;

  // tasks (follow-ups)
  addTask: (t: Omit<Task, 'id' | 'status' | 'createdBy'> & { status?: Task['status'] }) => void;
  reassignTask: (id: string, toId: string) => void;
  toggleTask: (id: string) => void;

  // activity
  logActivity: (ev: Omit<ActivityItem, 'id' | 'byId' | 'when'> & { when?: string }) => void;

  // announcements for persisted changes (called after a successful db mutation)
  announceStage: (label: string, toStageLabel: string) => void;
  announceStageMany: (count: number, verb: string, toStageLabel: string) => void;
  announceReassign: (label: string, toName: string) => void;
}

export const useCollab = create<CollabState>((set, get) => ({
  me: ME_DEFAULT,
  tasks: SEED_TASKS.map((t) => ({ ...t })),
  activity: SEED_ACTIVITY.map((a) => ({ ...a })),
  toasts: [],
  notifs: [],

  setMe: (name) => set({ me: name }),

  pushToast: (text) => {
    const id = nid();
    set((s) => ({ toasts: [{ id, text }, ...s.toasts] }));
    setTimeout(() => get().dropToast(id), 3400);
  },
  dropToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),

  notify: (toId, text, sub) => {
    if (toId === get().me) return; // never notify yourself
    set((s) => ({
      notifs: [
        { id: nid(), toId, text, sub, read: false, createdAt: 'just now' },
        ...s.notifs,
      ],
    }));
  },
  markRead: (toId) =>
    set((s) => ({ notifs: s.notifs.map((n) => (n.toId === toId ? { ...n, read: true } : n)) })),

  addTask: (t) => {
    const me = get().me;
    const task: Task = { id: nid(), status: t.status ?? 'todo', createdBy: me, ...t } as Task;
    set((s) => ({ tasks: [task, ...s.tasks] }));
    get().notify(task.ownerId, `${firstName(me)} assigned you a follow-up`, task.title);
    get().pushToast(`Follow-up assigned to ${task.ownerId === me ? 'you' : firstName(task.ownerId)}`);
  },
  reassignTask: (id, toId) => {
    const me = get().me;
    const tk = get().tasks.find((x) => x.id === id);
    if (!tk || tk.ownerId === toId) return;
    set((s) => ({ tasks: s.tasks.map((x) => (x.id === id ? { ...x, ownerId: toId } : x)) }));
    get().notify(toId, `${firstName(me)} reassigned a follow-up to you`, tk.title);
    get().pushToast(`Reassigned to ${toId === me ? 'you' : firstName(toId)}`);
  },
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((x) =>
        x.id === id ? { ...x, status: x.status === 'done' ? 'todo' : 'done' } : x,
      ),
    })),

  logActivity: (ev) => {
    const me = get().me;
    set((s) => ({ activity: [{ id: nid(), byId: me, when: ev.when ?? 'just now', ...ev }, ...s.activity] }));
    get().pushToast(`Logged ${(ev.type || 'note').toString().toLowerCase()} with ${firstName(ev.who || '')}`);
  },

  announceStage: (label, toStageLabel) => get().pushToast(`${label} → ${toStageLabel}`),
  announceStageMany: (count, verb, toStageLabel) =>
    get().pushToast(`${count} ${count === 1 ? 'profile' : 'profiles'} ${verb} → ${toStageLabel}`),
  announceReassign: (label, toName) => {
    const me = get().me;
    get().notify(toName, `${firstName(me)} gave you ${label}`, 'Relationship owner');
    get().pushToast(`${label} → ${toName === me ? 'you' : firstName(toName)}`);
  },
}));
