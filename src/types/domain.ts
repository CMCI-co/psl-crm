// domain.ts — the application's typed model. Field names follow the README's
// proposed Supabase schema; the shapes match the prototype data in kit.jsx.

import type { Stage } from '@/theme/tokens';
export type { Stage } from '@/theme/tokens';

export type UserRole =
  | 'national_staff'
  | 'campus_director'
  | 'member'
  | 'candidate'
  | 'applicant'
  | 'alumni';

export type MemberStatus = 'active' | 'inactive';

export type ClassYear =
  | 'Freshman'
  | 'Sophomore'
  | 'Junior'
  | 'Senior'
  | 'Super Senior'
  | 'Alumni';

/** Order class years for the grouped Active roster (Freshman → Super Senior). */
export const CLASS_ORDER: ClassYear[] = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Super Senior',
  'Alumni',
];

/** An office held — current offices ride with the card; past ones are historic. */
export interface Office {
  title: string;
  term: string | null;
  current: boolean;
}

/** The core person record — covers all four lifecycle stages. */
export interface Member {
  id: string;
  chapterId: string | null;
  firstName: string;
  lastName: string;
  middle?: string | null;
  stage: Stage;
  status: MemberStatus;

  email?: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;

  school?: string | null;
  major?: string | null;
  minor?: string | null;
  classYear: ClassYear;

  hometown?: string | null;
  church?: string | null;
  employer?: string | null;
  relationship?: string | null;

  cohort?: string | null;
  memberNo?: string | null;
  gradYear?: string | null;

  // Alumni-specific
  work?: string | null;
  location?: string | null;
  marital?: string | null;
  kids?: number | null;
  openToConnect?: boolean | null;

  ownerId?: string | null;
  ownerName?: string | null;
  avatarUrl?: string | null;

  offices: Office[];

  // Applicant-specific
  submitted?: string | null;
  interviewScore?: number | null;
}

export type Channel = 'Call' | 'Text' | 'Email' | 'Visit';
export type Priority = 'high' | 'med' | 'low';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  memberId: string | null;
  who: string;
  title: string;
  owner: string;
  createdBy?: string;
  channel: Channel;
  priority: Priority;
  due: string;
  status: TaskStatus;
}

export interface Interaction {
  id: string;
  memberId: string;
  who: string;
  by: string;
  type: Channel;
  note: string;
  occurredAt: string;
}

export type LifeTone = 'thriving' | 'steady' | 'watch';
export interface LifeArea {
  id: string;
  memberId: string;
  area: string;
  tone: LifeTone;
  note: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  to: string;
  text: string;
  sub: string;
  read: boolean;
  ts: string;
}

export interface StageTransition {
  id: string;
  memberId: string;
  fromStage: Stage | null;
  toStage: Stage;
  byName: string;
  occurredAt: string;
}

/** Full name convenience. */
export function fullName(m: Pick<Member, 'firstName' | 'lastName'>): string {
  return `${m.firstName} ${m.lastName}`.trim();
}

/** Interview-score → decision recommendation (prototype recommend()). */
export interface Recommendation {
  label: string;
  kind: 'await' | 'advance' | 'discuss' | 'hold';
  fg: string;
  bg: string;
}
export function recommend(score: number | null | undefined): Recommendation {
  if (score == null) return { label: 'Awaiting', kind: 'await', fg: '#8b91a0', bg: 'transparent' };
  if (score >= 8.5) return { label: 'Advance', kind: 'advance', fg: '#1f6b46', bg: '#e3f3ea' };
  if (score >= 6.5) return { label: 'Discuss', kind: 'discuss', fg: '#8a5a16', bg: '#fbefdd' };
  return { label: 'Hold', kind: 'hold', fg: '#9a3b3b', bg: '#f6e9e9' };
}

export const currentOffices = (m: Pick<Member, 'offices'>) => m.offices.filter((o) => o.current);
export const pastOffices = (m: Pick<Member, 'offices'>) => m.offices.filter((o) => !o.current);
export function topOffice(m: Pick<Member, 'offices'>): Office | null {
  return currentOffices(m)[0] ?? pastOffices(m)[0] ?? null;
}

/** Lifecycle state machine — single source for advance/promote/move labels. */
export const STAGE_FLOW: Record<Stage, { next: Stage; label: string; verb: string } | null> = {
  applicant: { next: 'candidate', label: 'Advance to Candidate', verb: 'advanced' },
  candidate: { next: 'member', label: 'Promote to Member', verb: 'promoted' },
  member: { next: 'alumni', label: 'Move to Alumni', verb: 'moved' },
  alumni: null,
};
