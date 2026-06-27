// normalize.ts — translate Supabase rows into the app's `Member` shape.
import type { Database } from '@/types/database';
import type { ClassYear, Member, Office, Stage } from '@/types/domain';

type MemberRow = Database['public']['Tables']['members']['Row'];
type RoleRow = Database['public']['Tables']['roles_history']['Row'];

export interface MemberRowWithRels extends MemberRow {
  roles_history?: RoleRow[] | null;
  owner?: { full_name: string | null } | null;
}

export function rowToMember(row: MemberRowWithRels): Member {
  const offices: Office[] = (row.roles_history ?? []).map((r) => ({
    title: r.title,
    term: r.term,
    current: r.is_current,
  }));
  return {
    id: row.id,
    chapterId: row.chapter_id,
    firstName: row.first_name,
    lastName: row.last_name,
    middle: row.middle,
    stage: row.stage as Stage,
    status: row.status,
    email: row.email,
    phone: row.phone,
    address: row.address,
    birthday: row.birthday,
    school: row.school,
    major: row.major,
    minor: row.minor,
    classYear: (row.class_year as ClassYear) ?? 'Freshman',
    hometown: row.hometown,
    church: row.church,
    employer: row.employer,
    relationship: row.relationship,
    cohort: row.cohort,
    memberNo: row.member_no,
    gradYear: row.grad_year,
    work: row.work,
    location: row.location,
    marital: row.marital,
    kids: row.kids,
    openToConnect: row.open_to_connect,
    ownerId: row.owner_id,
    ownerName: row.owner?.full_name ?? null,
    avatarUrl: row.avatar_url,
    submitted: row.submitted,
    interviewScore: row.interview_score,
    offices,
  };
}
