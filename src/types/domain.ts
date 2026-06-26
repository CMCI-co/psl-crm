// src/types/domain.ts
// Domain model — the typed shape of the data the app reads/writes.
// Mirrors the proposed Supabase schema in the README (and /supabase/schema.sql)
// while staying close to the prototype datasets so the mock adapter is a 1:1 seed.

import type { StageKey } from '@/theme/tokens';

export type Stage = StageKey; // 'applicant' | 'candidate' | 'member' | 'alumni'
export type MemberStatus = 'active' | 'inactive';
export type ClassYear =
  | 'Freshman'
  | 'Sophomore'
  | 'Junior'
  | 'Senior'
  | 'Super Senior'
  | 'Alumni';

export const CLASS_ORDER: ClassYear[] = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Super Senior',
  'Alumni',
];

/** Office/role held — current rides with the card; past become historic labels. */
export interface OfficeRole {
  id?: string;
  title: string;
  term: string; // e.g. "2025–26"
  current: boolean;
}

/** The core person record — covers all four lifecycle stages. */
export interface Member {
  id: string;
  chapterId?: string;

  firstName: string;
  lastName: string;
  middle?: string;

  stage: Stage;
  status: MemberStatus;

  // contact
  email?: string;
  phone?: string;
  address?: string;
  birthday?: string;

  // academic
  school?: string;
  major?: string;
  minor?: string;
  classYear?: ClassYear;

  // life
  hometown?: string;
  church?: string;
  employer?: string;
  relationship?: string;

  cohort?: string; // e.g. "Fall 2024"
  memberNo?: string; // e.g. "PSL-0418"
  gradYear?: string; // alumni

  // alumni-only
  work?: string;
  location?: string;
  marital?: string;
  kids?: number;
  openToConnect?: boolean;

  ownerId?: string; // relationship owner (a staff member name in mock)
  avatarUrl?: string;

  roles?: OfficeRole[];

  // applicant-only — interview score drives recommend()
  interviewScore?: number | null;
  submitted?: string;

  // derived cadence (mock today; computed from interactions in production)
  due?: 'overdue' | 'due' | 'ok';
  next?: string;
  cadence?: string;

  createdAt?: string;
  updatedAt?: string;
}

export type InteractionType = 'Call' | 'Text' | 'Email' | 'Visit';

export interface Interaction {
  id: string;
  memberId: string; // subject
  byId: string; // logger
  type: InteractionType;
  note?: string;
  occurredAt: string;
}

export type TaskChannel = InteractionType;
export type TaskPriority = 'high' | 'med' | 'low';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  memberId?: string; // about (mock keys on the person's display name)
  who?: string; // denormalized subject name for the mock UI
  ownerId: string; // assignee (name in mock)
  createdBy?: string;
  title: string;
  channel: TaskChannel;
  priority: TaskPriority;
  due?: string;
  status: TaskStatus;
  bucket?: 'today' | 'week' | 'overdue';
  createdAt?: string;
}

export type LifeArea = 'Personal' | 'Work' | 'Spiritual' | 'Family';
export type LifeTone = 'thriving' | 'steady' | 'watch';

export interface LifeAreaStatus {
  id: string;
  memberId: string;
  area: LifeArea;
  tone: LifeTone;
  note?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface PrayerRequest {
  id: string;
  memberId: string;
  text: string;
  status: 'open' | 'answered';
  praise?: string;
  date?: string;
}

export interface Milestone {
  id: string;
  memberId: string;
  date: string;
  title: string;
  kind: 'app' | 'interview' | 'stage' | 'personal' | 'next';
  done: boolean;
}

export interface NotificationItem {
  id: string;
  toId: string; // recipient name in mock
  text: string;
  sub?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  byId: string;
  type?: InteractionType | string;
  who?: string;
  note?: string;
  when: string;
}

export interface StageTransition {
  id: string;
  memberId: string;
  fromStage: Stage;
  toStage: Stage;
  byId: string;
  occurredAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

/** Lifecycle flow — the one-way journey. Mirrors collab.jsx STAGE_FLOW. */
export const STAGE_LABEL: Record<Stage, string> = {
  applicant: 'Applicant',
  candidate: 'Candidate',
  member: 'Active Member',
  alumni: 'Alumni',
};

export interface StageStep {
  next: Stage;
  label: string;
  verb: string;
}

export const STAGE_FLOW: Partial<Record<Stage, StageStep>> = {
  applicant: { next: 'candidate', label: 'Advance to Candidate', verb: 'advanced' },
  candidate: { next: 'member', label: 'Promote to Member', verb: 'promoted' },
  member: { next: 'alumni', label: 'Move to Alumni', verb: 'moved' },
};

export function fullName(m: Pick<Member, 'firstName' | 'lastName'>): string {
  return `${m.firstName} ${m.lastName}`;
}
