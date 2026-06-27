// members.ts — the members repository + React Query hooks. Reads from Supabase
// when configured, otherwise from the in-memory mock dataset. Callers (the
// directory bodies) never know which source they got.
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { dataSource } from '@/env';
import type { Member, Stage } from '@/types/domain';
import { MOCK_MEMBERS } from './mock';
import { rowToMember, type MemberRowWithRels } from './normalize';

const MEMBER_SELECT =
  '*, roles_history(*), owner:profiles!members_owner_id_fkey(full_name)';

export async function fetchMembers(): Promise<Member[]> {
  if (!supabase) {
    // Demo mode — clone so callers can't mutate the source array.
    return MOCK_MEMBERS.map((m) => ({ ...m }));
  }
  const { data, error } = await supabase
    .from('members')
    .select(MEMBER_SELECT)
    .order('last_name', { ascending: true });
  if (error) throw error;
  return (data as unknown as MemberRowWithRels[]).map(rowToMember);
}

export const membersKey = ['members'] as const;

/** All members for the current user's scope (RLS handles visibility server-side). */
export function useMembers() {
  return useQuery({
    queryKey: membersKey,
    queryFn: fetchMembers,
    staleTime: 30_000,
  });
}

/** Members at one lifecycle stage, sorted for display. */
export function useMembersByStage(stage: Stage) {
  const q = useMembers();
  const all = q.data ?? [];
  const data = all
    .filter((m) => m.stage === stage)
    .sort((a, b) => a.lastName.localeCompare(b.lastName));
  return { ...q, data };
}

export { dataSource };
