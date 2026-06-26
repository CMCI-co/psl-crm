// src/data/queries.ts
// TanStack Query hooks over the DataSource. Components use these instead of
// touching `db` directly, so caching, refetching, and (later) realtime
// invalidation live in one place.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Member, Stage } from '@/types/domain';
import { db, type MemberQuery } from './index';

export const keys = {
  members: (q?: MemberQuery) => ['members', q ?? {}] as const,
  member: (id: string) => ['member', id] as const,
  transitions: (id?: string) => ['transitions', id ?? 'all'] as const,
};

export function useMembers(q?: MemberQuery) {
  return useQuery({ queryKey: keys.members(q), queryFn: () => db.listMembers(q) });
}

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: keys.member(id ?? ''),
    queryFn: () => db.getMember(id as string),
    enabled: !!id,
  });
}

/** Move one member to a new stage. Invalidates all member lists + the member. */
export function useSetStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, toStage, byId }: { memberId: string; toStage: Stage; byId: string }) =>
      db.setStage(memberId, toStage, byId),
    onSuccess: (m: Member) => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: keys.member(m.id) });
      qc.invalidateQueries({ queryKey: ['transitions'] });
    },
  });
}

/** Batch stage transition. */
export function useSetStageMany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberIds, toStage, byId }: { memberIds: string[]; toStage: Stage; byId: string }) =>
      db.setStageMany(memberIds, toStage, byId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: ['transitions'] });
    },
  });
}

export function useSetOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, ownerId }: { memberId: string; ownerId: string }) =>
      db.setOwner(memberId, ownerId),
    onSuccess: (m: Member) => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: keys.member(m.id) });
    },
  });
}
