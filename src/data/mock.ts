// mock.ts — the prototype's hard-coded datasets (kit.jsx ROSTER / ALUMNI /
// APPLICANTS / PROFILE), normalized into the production `Member` shape. Used as
// the demo data source when Supabase isn't configured, and mirrored 1:1 by
// supabase/seed.sql so demo and live look identical.

import type { ClassYear, Member, Office, Stage } from '@/types/domain';

export const DEMO_CHAPTER = { id: 'chapter-uncc', name: 'UNC Charlotte', campus: 'UNC Charlotte' };

/** The leadership team that can own relationships & receive assignments. */
export const MOCK_TEAM = [
  { name: 'Jordan Tate', role: 'Campus Director' },
  { name: 'Anthony Reyes', role: 'Discipleship Lead' },
  { name: 'Devon Hayes', role: 'Alumni Chair' },
  { name: 'Marcus Bellamy', role: 'Service Chair' },
];

const slug = (f: string, l: string) => `m-${f}-${l}`.toLowerCase().replace(/[^a-z0-9-]/g, '');

interface RawRoster {
  f: string; l: string; year: ClassYear; stage: Stage; status: 'active' | 'inactive';
  major: string; town: string; church: string; cohort: string; roles?: Office[];
}
interface RawAlum {
  f: string; l: string; grad: string; major: string; work: string; loc: string;
  marital: string; kids: number; connect: boolean; church: string; cohort: string; roles?: Office[];
}
interface RawApplicant {
  f: string; l: string; year: ClassYear; major: string; town: string;
  submitted: string; score: number | null;
}

const ROSTER: RawRoster[] = [
  { f: 'Eli', l: 'Navarro', year: 'Freshman', stage: 'candidate', status: 'active', major: 'Computer Science', town: 'Raleigh, NC', church: 'The Summit Church', cohort: 'Fall 2025' },
  { f: 'Jordan', l: 'Pace', year: 'Freshman', stage: 'candidate', status: 'active', major: 'Business Admin', town: 'Durham, NC', church: 'The Summit Church', cohort: 'Fall 2025' },
  { f: 'Caleb', l: 'Whitfield', year: 'Sophomore', stage: 'member', status: 'active', major: 'Mechanical Engineering', town: 'Greensboro, NC', church: 'Mercy Hill', cohort: 'Fall 2024', roles: [{ title: 'Recruitment Chair', term: '2025–26', current: true }] },
  { f: 'Marcus', l: 'Bellamy', year: 'Junior', stage: 'member', status: 'active', major: 'Mechanical Engineering', town: 'Asheville, NC', church: 'Forest Hill Church', cohort: 'Fall 2024', roles: [{ title: 'Service Chair', term: '2025–26', current: true }, { title: 'Formation Mentor', term: '2024–25', current: false }] },
  { f: 'Anthony', l: 'Reyes', year: 'Junior', stage: 'member', status: 'active', major: 'Electrical Engineering', town: 'Charlotte, NC', church: 'Forest Hill Church', cohort: 'Fall 2024', roles: [{ title: 'Formation Chair', term: '2025–26', current: true }] },
  { f: 'Sam', l: 'Okafor', year: 'Junior', stage: 'member', status: 'inactive', major: 'Civil Engineering', town: 'Charlotte, NC', church: 'Elevation Church', cohort: 'Fall 2024' },
  { f: 'Tyler', l: 'Brooks', year: 'Senior', stage: 'member', status: 'active', major: 'Finance', town: 'Wilmington, NC', church: 'Port City Community', cohort: 'Spring 2024', roles: [{ title: 'President', term: '2025–26', current: true }, { title: 'Treasurer', term: '2024–25', current: false }] },
  { f: 'Devon', l: 'Hayes', year: 'Senior', stage: 'member', status: 'active', major: 'Biblical Studies', town: 'Charlotte, NC', church: 'Forest Hill Church', cohort: 'Spring 2024', roles: [{ title: 'Chaplain', term: '2025–26', current: true }, { title: 'Service Chair', term: '2024–25', current: false }] },
  { f: 'Isaiah', l: 'Cole', year: 'Senior', stage: 'member', status: 'inactive', major: 'Computer Science', town: 'Concord, NC', church: 'Elevation Church', cohort: 'Spring 2024' },
  { f: 'Nathan', l: 'Ford', year: 'Super Senior', stage: 'member', status: 'active', major: 'Mechanical Engineering', town: 'Hickory, NC', church: 'Mercy Hill', cohort: 'Fall 2023', roles: [{ title: 'Vice President', term: '2025–26', current: true }] },
];

const ALUMNI: RawAlum[] = [
  { f: 'Grant', l: 'Mercer', grad: '2025', major: 'Mechanical Engineering', work: 'Design Engineer · Collins Aerospace', loc: 'Charlotte, NC', marital: 'Married', kids: 1, connect: true, church: 'Forest Hill Church', cohort: 'Fall 2021', roles: [{ title: 'Alumni Mentor Lead', term: '2025–26', current: true }, { title: 'President', term: '2024–25', current: false }] },
  { f: 'Patrick', l: 'Lowe', grad: '2024', major: 'Electrical Engineering', work: 'Power Systems Eng · Southern Co.', loc: 'Atlanta, GA', marital: 'Married', kids: 2, connect: true, church: 'Passion City', cohort: 'Fall 2020', roles: [{ title: 'Treasurer', term: '2023–24', current: false }] },
  { f: 'Joel', l: 'Ramsey', grad: '2024', major: 'Computer Science', work: 'Software Engineer · Red Ventures', loc: 'Charlotte, NC', marital: 'Single', kids: 0, connect: true, church: 'Elevation Church', cohort: 'Fall 2020' },
  { f: 'Andre', l: 'Wallace', grad: '2023', major: 'Civil Engineering', work: 'Project Engineer · Kimley-Horn', loc: 'Raleigh, NC', marital: 'Married', kids: 0, connect: false, church: 'The Summit Church', cohort: 'Fall 2019' },
  { f: 'Caleb', l: 'Stone', grad: '2023', major: 'Mechanical Engineering', work: 'Grad Student · Georgia Tech', loc: 'Atlanta, GA', marital: 'Single', kids: 0, connect: true, church: 'Passion City', cohort: 'Fall 2019', roles: [{ title: 'Social Chair', term: '2022–23', current: false }] },
  { f: 'Trevor', l: 'Quinn', grad: '2022', major: 'Finance', work: 'Analyst · Bank of America', loc: 'Charlotte, NC', marital: 'Married', kids: 2, connect: true, church: 'Forest Hill Church', cohort: 'Fall 2018', roles: [{ title: 'Alumni Board Chair', term: '2025–26', current: true }, { title: 'President', term: '2021–22', current: false }] },
  { f: 'Marcus', l: 'Doyle', grad: '2021', major: 'Electrical Engineering', work: 'Hardware Engineer · NVIDIA', loc: 'Austin, TX', marital: 'Married', kids: 1, connect: true, church: 'The Austin Stone', cohort: 'Fall 2017', roles: [{ title: 'Vice President', term: '2020–21', current: false }] },
  { f: 'Brett', l: 'Halloway', grad: '2020', major: 'Business Admin', work: "Operations Lead · Lowe's", loc: 'Mooresville, NC', marital: 'Married', kids: 3, connect: false, church: 'Mercy Hill', cohort: 'Fall 2016' },
];

const APPLICANTS: RawApplicant[] = [
  { f: 'Owen', l: 'Carter', year: 'Freshman', major: 'Computer Science', town: 'Charlotte, NC', submitted: 'Jun 2', score: 9.1 },
  { f: 'Liam', l: 'Foster', year: 'Freshman', major: 'Mechanical Engineering', town: 'Gastonia, NC', submitted: 'Jun 1', score: 8.7 },
  { f: 'Noah', l: 'Pratt', year: 'Freshman', major: 'Business Admin', town: 'Concord, NC', submitted: 'May 30', score: 8.6 },
  { f: 'Mason', l: 'Reid', year: 'Sophomore', major: 'Electrical Engineering', town: 'Charlotte, NC', submitted: 'May 29', score: 7.4 },
  { f: 'Lucas', l: 'Byrd', year: 'Freshman', major: 'Civil Engineering', town: 'Huntersville, NC', submitted: 'May 28', score: 6.9 },
  { f: 'Henry', l: 'Dalton', year: 'Freshman', major: 'Finance', town: 'Matthews, NC', submitted: 'Jun 3', score: null },
  { f: 'Jack', l: 'Mercer', year: 'Sophomore', major: 'Computer Science', town: 'Raleigh, NC', submitted: 'Jun 3', score: null },
  { f: 'Eli', l: 'Schwab', year: 'Freshman', major: 'Kinesiology', town: 'Charlotte, NC', submitted: 'May 27', score: 5.8 },
];

// Deterministic owner assignment so the relationship views feel real in demo.
const OWNERS = MOCK_TEAM.map((m) => m.name);
const ownerFor = (i: number) => OWNERS[i % OWNERS.length];

function fromRoster(r: RawRoster, i: number): Member {
  return {
    id: slug(r.f, r.l),
    chapterId: DEMO_CHAPTER.id,
    firstName: r.f, lastName: r.l, middle: null,
    stage: r.stage, status: r.status,
    school: 'UNC Charlotte', major: r.major, classYear: r.year,
    hometown: r.town, church: r.church, cohort: r.cohort,
    offices: r.roles ?? [],
    ownerName: ownerFor(i),
    memberNo: `PSL-${(418 + i).toString().padStart(4, '0')}`,
  };
}

function fromAlum(a: RawAlum, i: number): Member {
  return {
    id: slug(a.f, a.l),
    chapterId: DEMO_CHAPTER.id,
    firstName: a.f, lastName: a.l, middle: null,
    stage: 'alumni', status: 'active',
    school: 'UNC Charlotte', major: a.major, classYear: 'Alumni',
    hometown: a.loc, church: a.church, cohort: a.cohort,
    gradYear: a.grad, work: a.work, location: a.loc, marital: a.marital,
    kids: a.kids, openToConnect: a.connect,
    offices: a.roles ?? [],
    ownerName: ownerFor(i + 3),
  };
}

function fromApplicant(a: RawApplicant): Member {
  return {
    id: slug(a.f, a.l),
    chapterId: DEMO_CHAPTER.id,
    firstName: a.f, lastName: a.l, middle: null,
    stage: 'applicant', status: 'active',
    school: 'UNC Charlotte', major: a.major, classYear: a.year,
    hometown: a.town, cohort: 'Fall 2025',
    submitted: a.submitted, interviewScore: a.score,
    offices: [],
  };
}

export const MOCK_MEMBERS: Member[] = [
  ...APPLICANTS.map(fromApplicant),
  ...ROSTER.map(fromRoster),
  ...ALUMNI.map(fromAlum),
];

/** The hero profile (kit.jsx PROFILE) — the record that travels Apply → Alumni. */
export const HERO_PROFILE: Member = {
  ...(MOCK_MEMBERS.find((m) => m.id === 'm-marcus-bellamy') as Member),
  middle: 'J.',
  phone: '(704) 555-0182',
  email: 'marcus.bellamy@gmail.com',
  address: '412 Catawba Ave, Charlotte, NC 28206',
  birthday: 'March 9, 2004',
  minor: 'Biblical Studies',
  employer: 'Summer Intern · Duke Energy',
  relationship: 'Single',
};
