-- supabase/seed.sql
-- Seed data mirroring src/data/mockData.ts so the app looks the same before and
-- after flipping VITE_DATA_SOURCE from "mock" to "supabase".
-- Apply AFTER schema.sql and policies.sql.
--
-- Note: profiles are created automatically when users sign up (see the
-- handle_new_user trigger in schema.sql). After you create your own account,
-- grant yourself access to this seeded chapter — see the commented UPDATE at the
-- bottom of this file.

-- Fixed chapter id so child rows can reference it deterministically.
insert into chapters (id, name, school)
values ('11111111-1111-1111-1111-111111111111', 'Phi Sigma Lambda', 'UNC Charlotte')
on conflict (id) do nothing;

-- ── Members ─────────────────────────────────────────────────────────────────
insert into members
  (chapter_id, first_name, last_name, middle, stage, status, class_year, major, minor,
   hometown, church, cohort, school, member_no, phone, email, address, birthday,
   employer, relationship, submitted, interview_score, grad_year, work, location,
   marital, kids, open_to_connect, due, next, cadence)
values
  -- Applicants (interview_score → recommend())
  ('11111111-1111-1111-1111-111111111111','Owen','Carter',null,'applicant','active','Freshman','Computer Science',null,'Charlotte, NC',null,null,'UNC Charlotte','PSL-0400',null,null,null,null,null,null,'Jun 2',9.1,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Liam','Foster',null,'applicant','active','Freshman','Mechanical Engineering',null,'Gastonia, NC',null,null,'UNC Charlotte','PSL-0401',null,null,null,null,null,null,'Jun 1',8.7,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Noah','Pratt',null,'applicant','active','Freshman','Business Admin',null,'Concord, NC',null,null,'UNC Charlotte','PSL-0402',null,null,null,null,null,null,'May 30',8.6,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Mason','Reid',null,'applicant','active','Sophomore','Electrical Engineering',null,'Charlotte, NC',null,null,'UNC Charlotte','PSL-0403',null,null,null,null,null,null,'May 29',7.4,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Lucas','Byrd',null,'applicant','active','Freshman','Civil Engineering',null,'Huntersville, NC',null,null,'UNC Charlotte','PSL-0404',null,null,null,null,null,null,'May 28',6.9,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Henry','Dalton',null,'applicant','active','Freshman','Finance',null,'Matthews, NC',null,null,'UNC Charlotte','PSL-0405',null,null,null,null,null,null,'Jun 3',null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Jack','Mercer',null,'applicant','active','Sophomore','Computer Science',null,'Raleigh, NC',null,null,'UNC Charlotte','PSL-0406',null,null,null,null,null,null,'Jun 3',null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Eli','Schwab',null,'applicant','active','Freshman','Kinesiology',null,'Charlotte, NC',null,null,'UNC Charlotte','PSL-0407',null,null,null,null,null,null,'May 27',5.8,null,null,null,null,null,false,null,null,null),

  -- Candidates + Active Members (roster)
  ('11111111-1111-1111-1111-111111111111','Eli','Navarro',null,'candidate','active','Freshman','Computer Science',null,'Raleigh, NC','The Summit Church','Fall 2025','UNC Charlotte','PSL-0408',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Jordan','Pace',null,'candidate','active','Freshman','Business Admin',null,'Durham, NC','The Summit Church','Fall 2025','UNC Charlotte','PSL-0409',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Caleb','Whitfield',null,'member','active','Sophomore','Mechanical Engineering',null,'Greensboro, NC','Mercy Hill','Fall 2024','UNC Charlotte','PSL-0410',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Marcus','Bellamy','J.','member','active','Junior','Mechanical Engineering','Biblical Studies','Asheville, NC','Forest Hill Church','Fall 2024','UNC Charlotte','PSL-0418','(704) 555-0182','marcus.bellamy@gmail.com','412 Catawba Ave, Charlotte, NC 28206','March 9, 2004','Summer Intern · Duke Energy','Single',null,null,null,null,null,null,null,false,'due','Fri','Every 2 weeks'),
  ('11111111-1111-1111-1111-111111111111','Anthony','Reyes',null,'member','active','Junior','Electrical Engineering',null,'Charlotte, NC','Forest Hill Church','Fall 2024','UNC Charlotte','PSL-0412',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Sam','Okafor',null,'member','inactive','Junior','Civil Engineering',null,'Charlotte, NC','Elevation Church','Fall 2024','UNC Charlotte','PSL-0413',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Tyler','Brooks',null,'member','active','Senior','Finance',null,'Wilmington, NC','Port City Community','Spring 2024','UNC Charlotte','PSL-0414',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Devon','Hayes',null,'member','active','Senior','Biblical Studies',null,'Charlotte, NC','Forest Hill Church','Spring 2024','UNC Charlotte','PSL-0415',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Isaiah','Cole',null,'member','inactive','Senior','Computer Science',null,'Concord, NC','Elevation Church','Spring 2024','UNC Charlotte','PSL-0416',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Nathan','Ford',null,'member','active','Super Senior','Mechanical Engineering',null,'Hickory, NC','Mercy Hill','Fall 2023','UNC Charlotte','PSL-0417',null,null,null,null,null,null,null,null,null,null,null,null,null,false,null,null,null),

  -- Alumni (expanded fields)
  ('11111111-1111-1111-1111-111111111111','Grant','Mercer',null,'alumni','active','Alumni','Mechanical Engineering',null,null,'Forest Hill Church','Fall 2021','UNC Charlotte','PSL-0420',null,null,null,null,null,null,null,null,'2025','Design Engineer · Collins Aerospace','Charlotte, NC','Married',1,true,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Patrick','Lowe',null,'alumni','active','Alumni','Electrical Engineering',null,null,'Passion City','Fall 2020','UNC Charlotte','PSL-0421',null,null,null,null,null,null,null,null,'2024','Power Systems Eng · Southern Co.','Atlanta, GA','Married',2,true,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Joel','Ramsey',null,'alumni','active','Alumni','Computer Science',null,null,'Elevation Church','Fall 2020','UNC Charlotte','PSL-0422',null,null,null,null,null,null,null,null,'2024','Software Engineer · Red Ventures','Charlotte, NC','Single',0,true,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Andre','Wallace',null,'alumni','active','Alumni','Civil Engineering',null,null,'The Summit Church','Fall 2019','UNC Charlotte','PSL-0423',null,null,null,null,null,null,null,null,'2023','Project Engineer · Kimley-Horn','Raleigh, NC','Married',0,false,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Caleb','Stone',null,'alumni','active','Alumni','Mechanical Engineering',null,null,'Passion City','Fall 2019','UNC Charlotte','PSL-0424',null,null,null,null,null,null,null,null,'2023','Grad Student · Georgia Tech','Atlanta, GA','Single',0,true,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Trevor','Quinn',null,'alumni','active','Alumni','Finance',null,null,'Forest Hill Church','Fall 2018','UNC Charlotte','PSL-0425',null,null,null,null,null,null,null,null,'2022','Analyst · Bank of America','Charlotte, NC','Married',2,true,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Marcus','Doyle',null,'alumni','active','Alumni','Electrical Engineering',null,null,'The Austin Stone','Fall 2017','UNC Charlotte','PSL-0426',null,null,null,null,null,null,null,null,'2021','Hardware Engineer · NVIDIA','Austin, TX','Married',1,true,null,null,null),
  ('11111111-1111-1111-1111-111111111111','Brett','Halloway',null,'alumni','active','Alumni','Business Admin',null,null,'Mercy Hill','Fall 2016','UNC Charlotte','PSL-0427',null,null,null,null,null,null,null,null,'2020','Operations Lead · Lowe''s','Mooresville, NC','Married',3,false,null,null,null)
on conflict (member_no) do nothing;

-- ── Roles / offices history (referenced by member_no) ───────────────────────
insert into roles_history (member_id, title, term, is_current)
select id, v.title, v.term, v.is_current from members,
  (values
    ('PSL-0410','Recruitment Chair','2025–26',true),
    ('PSL-0418','Service Chair','2025–26',true),
    ('PSL-0418','Formation Mentor','2024–25',false),
    ('PSL-0412','Formation Chair','2025–26',true),
    ('PSL-0414','President','2025–26',true),
    ('PSL-0414','Treasurer','2024–25',false),
    ('PSL-0415','Chaplain','2025–26',true),
    ('PSL-0415','Service Chair','2024–25',false),
    ('PSL-0417','Vice President','2025–26',true),
    ('PSL-0420','Alumni Mentor Lead','2025–26',true),
    ('PSL-0420','President','2024–25',false),
    ('PSL-0421','Treasurer','2023–24',false),
    ('PSL-0424','Social Chair','2022–23',false),
    ('PSL-0425','Alumni Board Chair','2025–26',true),
    ('PSL-0425','President','2021–22',false),
    ('PSL-0426','Vice President','2020–21',false)
  ) as v(member_no, title, term, is_current)
where members.member_no = v.member_no;

-- ── Milestones (hero: Marcus Bellamy, PSL-0418) ─────────────────────────────
insert into milestones (member_id, date, title, kind, done)
select id, v.date, v.title, v.kind::milestone_kind, v.done from members,
  (values
    ('Aug 28, 2024','Submitted application','app',true),
    ('Sep 14, 2024','Completed interview','interview',true),
    ('Sep 20, 2024','Accepted as Candidate','stage',true),
    ('Oct 6, 2024','Baptized — Forest Hill','personal',true),
    ('Nov 22, 2024','Completed New Member Formation','stage',true),
    ('Dec 1, 2024','Initiated as Active Member','stage',true),
    ('Upcoming','CPR Certification renewal','next',false)
  ) as v(date, title, kind, done)
where members.member_no = 'PSL-0418';

-- ── Prayer requests (hero) ──────────────────────────────────────────────────
insert into prayer_requests (member_id, text, status, praise, date)
select id, v.text, v.status::prayer_status, v.praise, v.date from members,
  (values
    ('Wisdom choosing between two co-op offers for spring.','open',null,'Jun 2'),
    ('Dad''s recovery after surgery — peace for the family.','open',null,'May 19'),
    ('Grandmother healed and home from the hospital.','answered','Discharged Apr 30 — praise God.','Apr 28'),
    ('Found a steady summer internship near campus.','answered','Accepted at Duke Energy.','Mar 11')
  ) as v(text, status, praise, date)
where members.member_no = 'PSL-0418';

-- ── Interview scorecard (hero) ──────────────────────────────────────────────
insert into interview_scores (member_id, criterion, score)
select id, v.criterion, v.score from members,
  (values
    ('Character & Integrity',9.0),
    ('Sense of Calling',8.7),
    ('Teachability',9.3),
    ('Communication',7.8),
    ('Commitment',8.2)
  ) as v(criterion, score)
where members.member_no = 'PSL-0418';

-- ── Follow-up tasks (Relationship Tracker) ──────────────────────────────────
insert into tasks (title, about_member, about_who, owner_id, channel, priority, status, due, bucket)
select v.title, m.id, v.about_who, v.owner_id, v.channel::task_channel, v.priority::task_priority, v.status::task_status, v.due, v.bucket
from (values
    ('Q2 check-in call','Sam Okafor','Jordan Tate','Call','high','doing','Today','overdue'),
    ('Invite to alumni mixer','Joel Ramsey','Devon Hayes','Text','med','todo','This week','week'),
    ('Formation mentor pairing','Eli Navarro','Anthony Reyes','Visit','med','todo','Today','today'),
    ('Send internship lead','Caleb Whitfield','Jordan Tate','Email','low','todo','This week','week')
  ) as v(title, about_who, owner_id, channel, priority, status, due, bucket)
left join members m on (m.first_name || ' ' || m.last_name) = v.about_who;

-- ── Activity feed (logged interactions) ─────────────────────────────────────
insert into interactions (member_id, type, by_id, note)
select m.id, v.type, v.by_id, v.note
from (values
    ('Grant Mercer','Call','Devon Hayes','Caught up on the new role; open to mentoring.'),
    ('Eli Navarro','Visit','Anthony Reyes','Coffee before formation night.'),
    ('Tyler Brooks','Text','Jordan Tate','Confirmed retreat headcount.')
  ) as v(who, type, by_id, note)
left join members m on (m.first_name || ' ' || m.last_name) = v.who;

-- ── Sample resources ────────────────────────────────────────────────────────
insert into resources (chapter_id, title, category, uploaded_by)
values
  ('11111111-1111-1111-1111-111111111111','New Member Formation Guide','Formation','Anthony Reyes'),
  ('11111111-1111-1111-1111-111111111111','Chapter Bylaws 2025','Governance','Tyler Brooks'),
  ('11111111-1111-1111-1111-111111111111','Service Project Planning Template','Service','Marcus Bellamy')
on conflict do nothing;

-- ───────────────────────────────────────────────────────────────────────────
-- AFTER you create your own account in Supabase Auth, link it to this chapter so
-- RLS lets you see the seeded roster (replace the email):
--
--   update profiles
--      set role = 'campus_director',
--          chapter_id = '11111111-1111-1111-1111-111111111111'
--    where email = 'you@example.com';
-- ───────────────────────────────────────────────────────────────────────────
