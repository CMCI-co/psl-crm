// src/data/DataSource.ts
// The data contract. Every screen talks to this interface — never to Supabase
// or the mock arrays directly. Two implementations exist:
//   • mockDataSource     — in-memory, seeded from the prototype (runs with no backend)
//   • supabaseDataSource — real Postgres + RLS
// Swapping is a one-line change in src/data/index.ts (driven by VITE_DATA_SOURCE).

import type { Member, Stage, StageTransition } from '@/types/domain';

export interface MemberQuery {
  stage?: Stage;
  status?: 'active' | 'inactive';
  search?: string;
}

export interface DataSource {
  /** List members, optionally filtered by stage/status/search. */
  listMembers(q?: MemberQuery): Promise<Member[]>;

  /** A single member by id. */
  getMember(id: string): Promise<Member | null>;

  /** Move one member to a new stage; returns the updated member. Writes an audit row. */
  setStage(memberId: string, toStage: Stage, byId: string): Promise<Member>;

  /** Move many members to a stage at once (batch transition). */
  setStageMany(memberIds: string[], toStage: Stage, byId: string): Promise<Member[]>;

  /** Reassign the relationship owner. */
  setOwner(memberId: string, ownerId: string): Promise<Member>;

  /** Audit trail for a member (or all). */
  listStageTransitions(memberId?: string): Promise<StageTransition[]>;
}
