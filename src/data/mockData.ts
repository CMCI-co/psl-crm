// src/data/mockData.ts
// Seed data ported from the prototype (prototype/kit.jsx + collab.jsx),
// reshaped into the typed domain model. This is what the mock DataSource serves
// and what /supabase/seed.sql mirrors, so the app looks identical before and
// after the Supabase cutover.

import type {
  ActivityItem,
  Member,
  Milestone,
  PrayerRequest,
  Task,
  TeamMember,
} from '@/types/domain';

let _id = 0;
const id = (p: string) => `${p}_${++_id}`;

// ── Leadership team (owners / assignees) ──────────────────────────────────
export const TEAM: TeamMember[] = [
  { id: 'staff_jordan', name: 'Jordan Tate', role: 'Campus Director' },
  { id: 'staff_anthony', name: 'Anthony Reyes', role: 'Discipleship Lead' },
  { id: 'staff_devon', name: 'Devon Hayes', role: 'Alumni Chair' },
  { id: 'staff_marcus', name: 'Marcus Bellamy', role: 'Service Chair' },
];

export const ME_DEFAULT = 'Jordan Tate';

// ── Roster (candidates + members) ─────────────────────────────────────────
const ROSTER: Member[] = [
  m('Eli', 'Navarro', { classYear: 'Freshman', stage: 'candidate', status: 'active', major: 'Computer Science', hometown: 'Raleigh, NC', church: 'The Summit Church', cohort: 'Fall 2025' }),
  m('Jordan', 'Pace', { classYear: 'Freshman', stage: 'candidate', status: 'active', major: 'Business Admin', hometown: 'Durham, NC', church: 'The Summit Church', cohort: 'Fall 2025' }),
  m('Caleb', 'Whitfield', { classYear: 'Sophomore', stage: 'member', status: 'active', major: 'Mechanical Engineering', hometown: 'Greensboro, NC', church: 'Mercy Hill', cohort: 'Fall 2024', roles: [{ title: 'Recruitment Chair', term: '2025–26', current: true }] }),
  m('Marcus', 'Bellamy', { classYear: 'Junior', stage: 'member', status: 'active', major: 'Mechanical Engineering', hometown: 'Asheville, NC', church: 'Forest Hill Church', cohort: 'Fall 2024', roles: [{ title: 'Service Chair', term: '2025–26', current: true }, { title: 'Formation Mentor', term: '2024–25', current: false }] }),
  m('Anthony', 'Reyes', { classYear: 'Junior', stage: 'member', status: 'active', major: 'Electrical Engineering', hometown: 'Charlotte, NC', church: 'Forest Hill Church', cohort: 'Fall 2024', roles: [{ title: 'Formation Chair', term: '2025–26', current: true }] }),
  m('Sam', 'Okafor', { classYear: 'Junior', stage: 'member', status: 'inactive', major: 'Civil Engineering', hometown: 'Charlotte, NC', church: 'Elevation Church', cohort: 'Fall 2024' }),
  m('Tyler', 'Brooks', { classYear: 'Senior', stage: 'member', status: 'active', major: 'Finance', hometown: 'Wilmington, NC', church: 'Port City Community', cohort: 'Spring 2024', roles: [{ title: 'President', term: '2025–26', current: true }, { title: 'Treasurer', term: '2024–25', current: false }] }),
  m('Devon', 'Hayes', { classYear: 'Senior', stage: 'member', status: 'active', major: 'Biblical Studies', hometown: 'Charlotte, NC', church: 'Forest Hill Church', cohort: 'Spring 2024', roles: [{ title: 'Chaplain', term: '2025–26', current: true }, { title: 'Service Chair', term: '2024–25', current: false }] }),
  m('Isaiah', 'Cole', { classYear: 'Senior', stage: 'member', status: 'inactive', major: 'Computer Science', hometown: 'Concord, NC', church: 'Elevation Church', cohort: 'Spring 2024' }),
  m('Nathan', 'Ford', { classYear: 'Super Senior', stage: 'member', status: 'active', major: 'Mechanical Engineering', hometown: 'Hickory, NC', church: 'Mercy Hill', cohort: 'Fall 2023', roles: [{ title: 'Vice President', term: '2025–26', current: true }] }),
];

// ── Alumni (expanded fields) ──────────────────────────────────────────────
const ALUMNI: Member[] = [
  m('Grant', 'Mercer', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2025', major: 'Mechanical Engineering', work: 'Design Engineer · Collins Aerospace', location: 'Charlotte, NC', marital: 'Married', kids: 1, openToConnect: true, church: 'Forest Hill Church', cohort: 'Fall 2021', roles: [{ title: 'Alumni Mentor Lead', term: '2025–26', current: true }, { title: 'President', term: '2024–25', current: false }] }),
  m('Patrick', 'Lowe', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2024', major: 'Electrical Engineering', work: 'Power Systems Eng · Southern Co.', location: 'Atlanta, GA', marital: 'Married', kids: 2, openToConnect: true, church: 'Passion City', cohort: 'Fall 2020', roles: [{ title: 'Treasurer', term: '2023–24', current: false }] }),
  m('Joel', 'Ramsey', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2024', major: 'Computer Science', work: 'Software Engineer · Red Ventures', location: 'Charlotte, NC', marital: 'Single', kids: 0, openToConnect: true, church: 'Elevation Church', cohort: 'Fall 2020' }),
  m('Andre', 'Wallace', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2023', major: 'Civil Engineering', work: 'Project Engineer · Kimley-Horn', location: 'Raleigh, NC', marital: 'Married', kids: 0, openToConnect: false, church: 'The Summit Church', cohort: 'Fall 2019' }),
  m('Caleb', 'Stone', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2023', major: 'Mechanical Engineering', work: 'Grad Student · Georgia Tech', location: 'Atlanta, GA', marital: 'Single', kids: 0, openToConnect: true, church: 'Passion City', cohort: 'Fall 2019', roles: [{ title: 'Social Chair', term: '2022–23', current: false }] }),
  m('Trevor', 'Quinn', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2022', major: 'Finance', work: 'Analyst · Bank of America', location: 'Charlotte, NC', marital: 'Married', kids: 2, openToConnect: true, church: 'Forest Hill Church', cohort: 'Fall 2018', roles: [{ title: 'Alumni Board Chair', term: '2025–26', current: true }, { title: 'President', term: '2021–22', current: false }] }),
  m('Marcus', 'Doyle', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2021', major: 'Electrical Engineering', work: 'Hardware Engineer · NVIDIA', location: 'Austin, TX', marital: 'Married', kids: 1, openToConnect: true, church: 'The Austin Stone', cohort: 'Fall 2017', roles: [{ title: 'Vice President', term: '2020–21', current: false }] }),
  m('Brett', 'Halloway', { classYear: 'Alumni', stage: 'alumni', status: 'active', gradYear: '2020', major: 'Business Admin', work: 'Operations Lead · Lowe’s', location: 'Mooresville, NC', marital: 'Married', kids: 3, openToConnect: false, church: 'Mercy Hill', cohort: 'Fall 2016' }),
];

// ── Applicants (interview score → recommend()) ────────────────────────────
const APPLICANTS: Member[] = [
  m('Owen', 'Carter', { classYear: 'Freshman', stage: 'applicant', status: 'active', major: 'Computer Science', hometown: 'Charlotte, NC', submitted: 'Jun 2', interviewScore: 9.1 }),
  m('Liam', 'Foster', { classYear: 'Freshman', stage: 'applicant', status: 'active', major: 'Mechanical Engineering', hometown: 'Gastonia, NC', submitted: 'Jun 1', interviewScore: 8.7 }),
  m('Noah', 'Pratt', { classYear: 'Freshman', stage: 'applicant', status: 'active', major: 'Business Admin', hometown: 'Concord, NC', submitted: 'May 30', interviewScore: 8.6 }),
  m('Mason', 'Reid', { classYear: 'Sophomore', stage: 'applicant', status: 'active', major: 'Electrical Engineering', hometown: 'Charlotte, NC', submitted: 'May 29', interviewScore: 7.4 }),
  m('Lucas', 'Byrd', { classYear: 'Freshman', stage: 'applicant', status: 'active', major: 'Civil Engineering', hometown: 'Huntersville, NC', submitted: 'May 28', interviewScore: 6.9 }),
  m('Henry', 'Dalton', { classYear: 'Freshman', stage: 'applicant', status: 'active', major: 'Finance', hometown: 'Matthews, NC', submitted: 'Jun 3', interviewScore: null }),
  m('Jack', 'Mercer', { classYear: 'Sophomore', stage: 'applicant', status: 'active', major: 'Computer Science', hometown: 'Raleigh, NC', submitted: 'Jun 3', interviewScore: null }),
  m('Eli', 'Schwab', { classYear: 'Freshman', stage: 'applicant', status: 'active', major: 'Kinesiology', hometown: 'Charlotte, NC', submitted: 'May 27', interviewScore: 5.8 }),
];

// The hero profile (Marcus Bellamy) carries the full field set + cadence data.
function hydrateHero(list: Member[]): Member[] {
  return list.map((p) =>
    p.firstName === 'Marcus' && p.lastName === 'Bellamy'
      ? {
          ...p,
          middle: 'J.',
          phone: '(704) 555-0182',
          email: 'marcus.bellamy@gmail.com',
          address: '412 Catawba Ave, Charlotte, NC 28206',
          birthday: 'March 9, 2004',
          school: 'UNC Charlotte',
          classYear: 'Junior',
          minor: 'Biblical Studies',
          employer: 'Summer Intern · Duke Energy',
          relationship: 'Single',
          memberNo: 'PSL-0418',
          due: 'due',
          next: 'Fri',
          cadence: 'Every 2 weeks',
        }
      : p,
  );
}

export const MEMBERS: Member[] = hydrateHero([...APPLICANTS, ...ROSTER, ...ALUMNI]);

// Give school/memberNo defaults so cards look complete in mock mode.
MEMBERS.forEach((p, i) => {
  if (!p.school) p.school = 'UNC Charlotte';
  if (!p.memberNo) p.memberNo = `PSL-${String(400 + i).padStart(4, '0')}`;
});

// ── Seed follow-ups (Relationship Tracker) ────────────────────────────────
export const SEED_TASKS: Task[] = [
  { id: id('task'), title: 'Q2 check-in call', who: 'Sam Okafor', ownerId: 'Jordan Tate', channel: 'Call', priority: 'high', due: 'Today', status: 'doing', bucket: 'overdue' },
  { id: id('task'), title: 'Invite to alumni mixer', who: 'Joel Ramsey', ownerId: 'Devon Hayes', channel: 'Text', priority: 'med', due: 'This week', status: 'todo', bucket: 'week' },
  { id: id('task'), title: 'Formation mentor pairing', who: 'Eli Navarro', ownerId: 'Anthony Reyes', channel: 'Visit', priority: 'med', due: 'Today', status: 'todo', bucket: 'today' },
  { id: id('task'), title: 'Send internship lead', who: 'Caleb Whitfield', ownerId: 'Jordan Tate', channel: 'Email', priority: 'low', due: 'This week', status: 'todo', bucket: 'week' },
];

// ── Seed activity feed ────────────────────────────────────────────────────
export const SEED_ACTIVITY: ActivityItem[] = [
  { id: id('act'), byId: 'Devon Hayes', type: 'Call', who: 'Grant Mercer', note: 'Caught up on the new role; open to mentoring.', when: '2h ago' },
  { id: id('act'), byId: 'Anthony Reyes', type: 'Visit', who: 'Eli Navarro', note: 'Coffee before formation night.', when: 'Yesterday' },
  { id: id('act'), byId: 'Jordan Tate', type: 'Text', who: 'Tyler Brooks', note: 'Confirmed retreat headcount.', when: 'Mon' },
];

// ── Profile sub-records for the hero (Marcus Bellamy) ──────────────────────
export const SEED_MILESTONES: Milestone[] = [
  { id: id('ms'), memberId: 'hero', date: 'Aug 28, 2024', title: 'Submitted application', kind: 'app', done: true },
  { id: id('ms'), memberId: 'hero', date: 'Sep 14, 2024', title: 'Completed interview', kind: 'interview', done: true },
  { id: id('ms'), memberId: 'hero', date: 'Sep 20, 2024', title: 'Accepted as Candidate', kind: 'stage', done: true },
  { id: id('ms'), memberId: 'hero', date: 'Oct 6, 2024', title: 'Baptized — Forest Hill', kind: 'personal', done: true },
  { id: id('ms'), memberId: 'hero', date: 'Nov 22, 2024', title: 'Completed New Member Formation', kind: 'stage', done: true },
  { id: id('ms'), memberId: 'hero', date: 'Dec 1, 2024', title: 'Initiated as Active Member', kind: 'stage', done: true },
  { id: id('ms'), memberId: 'hero', date: 'Upcoming', title: 'CPR Certification renewal', kind: 'next', done: false },
];

export const SEED_PRAYER: PrayerRequest[] = [
  { id: id('pr'), memberId: 'hero', text: 'Wisdom choosing between two co-op offers for spring.', date: 'Jun 2', status: 'open' },
  { id: id('pr'), memberId: 'hero', text: "Dad's recovery after surgery — peace for the family.", date: 'May 19', status: 'open' },
  { id: id('pr'), memberId: 'hero', text: 'Grandmother healed and home from the hospital.', date: 'Apr 28', status: 'answered', praise: 'Discharged Apr 30 — praise God.' },
  { id: id('pr'), memberId: 'hero', text: 'Found a steady summer internship near campus.', date: 'Mar 11', status: 'answered', praise: 'Accepted at Duke Energy.' },
];

// ── factory ───────────────────────────────────────────────────────────────
function m(firstName: string, lastName: string, rest: Partial<Member>): Member {
  return {
    id: id('mem'),
    firstName,
    lastName,
    stage: rest.stage || 'member',
    status: rest.status || 'active',
    ...rest,
  };
}
