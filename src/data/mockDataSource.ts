// src/data/mockDataSource.ts
// In-memory DataSource over the seeded prototype data. Mutations persist for the
// session (page refresh resets — same as the prototype). Note: live stage/owner
// overrides during a session are ALSO mirrored in the collab store so every open
// screen updates instantly; this adapter is the source of truth for reads/writes.

import type { Member, Stage, StageTransition } from '@/types/domain';
import { fullName } from '@/types/domain';
import type { DataSource, MemberQuery } from './DataSource';
import { MEMBERS } from './mockData';

// Clone so the seed module stays pristine across hot-reloads.
let members: Member[] = MEMBERS.map((m) => ({ ...m }));
let transitions: StageTransition[] = [];

let tid = 0;
const delay = <T,>(v: T, ms = 120) => new Promise<T>((r) => setTimeout(() => r(v), ms));

function matches(m: Member, q?: MemberQuery): boolean {
  if (!q) return true;
  if (q.stage && m.stage !== q.stage) return false;
  if (q.status && m.status !== q.status) return false;
  if (q.search) {
    const hay = `${fullName(m)} ${m.major ?? ''} ${m.hometown ?? ''} ${m.church ?? ''} ${m.cohort ?? ''}`.toLowerCase();
    if (!hay.includes(q.search.toLowerCase())) return false;
  }
  return true;
}

export const mockDataSource: DataSource = {
  async listMembers(q) {
    return delay(members.filter((m) => matches(m, q)).map((m) => ({ ...m })));
  },

  async getMember(id) {
    return delay(members.find((m) => m.id === id) ?? null);
  },

  async setStage(memberId, toStage, byId) {
    const m = members.find((x) => x.id === memberId);
    if (!m) throw new Error(`member ${memberId} not found`);
    if (m.stage !== toStage) {
      transitions.unshift({
        id: `tr_${++tid}`,
        memberId,
        fromStage: m.stage,
        toStage,
        byId,
        occurredAt: new Date().toISOString(),
      });
      m.stage = toStage;
      if (toStage === 'alumni' && !m.gradYear) m.classYear = 'Alumni';
      m.updatedAt = new Date().toISOString();
    }
    return delay({ ...m });
  },

  async setStageMany(memberIds, toStage, byId) {
    const out: Member[] = [];
    for (const id of memberIds) out.push(await this.setStage(id, toStage, byId));
    return out;
  },

  async setOwner(memberId, ownerId) {
    const m = members.find((x) => x.id === memberId);
    if (!m) throw new Error(`member ${memberId} not found`);
    m.ownerId = ownerId;
    m.updatedAt = new Date().toISOString();
    return delay({ ...m });
  },

  async listStageTransitions(memberId) {
    return delay(transitions.filter((t) => !memberId || t.memberId === memberId).map((t) => ({ ...t })));
  },
};

// Test/dev helper to reset state (not used in the UI).
export function __resetMock() {
  members = MEMBERS.map((m) => ({ ...m }));
  transitions = [];
  tid = 0;
}
