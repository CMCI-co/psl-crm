// src/data/supabaseDataSource.ts
// Real DataSource backed by Postgres. Reads/writes the `members` and
// `stage_transitions` tables defined in /supabase/schema.sql, mapping snake_case
// rows to the camelCase domain model. RLS enforces who can see/do what.
//
// This is wired and type-correct; it activates when VITE_DATA_SOURCE=supabase.
// Until the schema is applied and seeded, leave the app on "mock".

import type { Member, Stage, StageTransition } from '@/types/domain';
import { getSupabase } from '@/lib/supabase';
import type { DataSource, MemberQuery } from './DataSource';

type Row = Record<string, any>;

function toMember(r: Row): Member {
  return {
    id: r.id,
    chapterId: r.chapter_id ?? undefined,
    firstName: r.first_name,
    lastName: r.last_name,
    middle: r.middle ?? undefined,
    stage: r.stage,
    status: r.status,
    email: r.email ?? undefined,
    phone: r.phone ?? undefined,
    address: r.address ?? undefined,
    birthday: r.birthday ?? undefined,
    school: r.school ?? undefined,
    major: r.major ?? undefined,
    minor: r.minor ?? undefined,
    classYear: r.class_year ?? undefined,
    hometown: r.hometown ?? undefined,
    church: r.church ?? undefined,
    employer: r.employer ?? undefined,
    relationship: r.relationship ?? undefined,
    cohort: r.cohort ?? undefined,
    memberNo: r.member_no ?? undefined,
    gradYear: r.grad_year ?? undefined,
    work: r.work ?? undefined,
    location: r.location ?? undefined,
    marital: r.marital ?? undefined,
    kids: r.kids ?? undefined,
    openToConnect: r.open_to_connect ?? undefined,
    ownerId: r.owner_id ?? undefined,
    avatarUrl: r.avatar_url ?? undefined,
    interviewScore: r.interview_score ?? undefined,
    submitted: r.submitted ?? undefined,
    due: r.due ?? undefined,
    next: r.next ?? undefined,
    cadence: r.cadence ?? undefined,
    roles: r.roles ?? undefined, // expects a joined/aggregated roles_history array
    createdAt: r.created_at ?? undefined,
    updatedAt: r.updated_at ?? undefined,
  };
}

const SELECT = '*, roles:roles_history(id,title,term,is_current)';

function normalizeRoles(r: Row): Row {
  if (Array.isArray(r.roles)) {
    r.roles = r.roles.map((x: Row) => ({ id: x.id, title: x.title, term: x.term, current: x.is_current }));
  }
  return r;
}

export const supabaseDataSource: DataSource = {
  async listMembers(q?: MemberQuery) {
    const sb = getSupabase();
    let query = sb.from('members').select(SELECT);
    if (q?.stage) query = query.eq('stage', q.stage);
    if (q?.status) query = query.eq('status', q.status);
    if (q?.search) {
      const s = `%${q.search}%`;
      query = query.or(`first_name.ilike.${s},last_name.ilike.${s},major.ilike.${s},hometown.ilike.${s}`);
    }
    const { data, error } = await query.order('last_name', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => toMember(normalizeRoles(r)));
  },

  async getMember(id) {
    const sb = getSupabase();
    const { data, error } = await sb.from('members').select(SELECT).eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? toMember(normalizeRoles(data)) : null;
  },

  async setStage(memberId, toStage, byId) {
    const sb = getSupabase();
    const { data: prev, error: e0 } = await sb.from('members').select('stage').eq('id', memberId).single();
    if (e0) throw e0;
    const fromStage = prev.stage as Stage;
    const { data, error } = await sb
      .from('members')
      .update({ stage: toStage, updated_at: new Date().toISOString() })
      .eq('id', memberId)
      .select(SELECT)
      .single();
    if (error) throw error;
    if (fromStage !== toStage) {
      await sb.from('stage_transitions').insert({
        member_id: memberId,
        from_stage: fromStage,
        to_stage: toStage,
        by_id: byId,
      });
    }
    return toMember(normalizeRoles(data));
  },

  async setStageMany(memberIds, toStage, byId) {
    const out: Member[] = [];
    for (const id of memberIds) out.push(await this.setStage(id, toStage, byId));
    return out;
  },

  async setOwner(memberId, ownerId) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('members')
      .update({ owner_id: ownerId, updated_at: new Date().toISOString() })
      .eq('id', memberId)
      .select(SELECT)
      .single();
    if (error) throw error;
    return toMember(normalizeRoles(data));
  },

  async listStageTransitions(memberId) {
    const sb = getSupabase();
    let query = sb.from('stage_transitions').select('*').order('occurred_at', { ascending: false });
    if (memberId) query = query.eq('member_id', memberId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((r: Row) => ({
      id: r.id,
      memberId: r.member_id,
      fromStage: r.from_stage,
      toStage: r.to_stage,
      byId: r.by_id,
      occurredAt: r.occurred_at,
    }));
  },
};
