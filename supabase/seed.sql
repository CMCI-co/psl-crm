-- ============================================================================
-- Phi Sigma Lambda CRM — seed data
-- Mirrors src/data/mock.ts so demo mode and a live database look identical.
-- Run AFTER schema.sql + policies.sql. Safe to re-run (idempotent upserts).
-- owner_id is left null: relationship owners attach once real profiles exist.
-- ============================================================================

insert into chapters (id, name, campus) values ('a0000000-0000-4000-8000-000000000001', 'UNC Charlotte', 'UNC Charlotte')
  on conflict (id) do nothing;

insert into members (id, chapter_id, first_name, last_name, stage, status, school, major, class_year, hometown, church, cohort, member_no, grad_year, work, location, marital, kids, open_to_connect, submitted, interview_score) values
  ('b8732f97-e6a2-5bcd-9e65-042eca021898', 'a0000000-0000-4000-8000-000000000001', 'Eli', 'Navarro', 'candidate', 'active', 'UNC Charlotte', 'Computer Science', 'Freshman', 'Raleigh, NC', 'The Summit Church', 'Fall 2025', 'PSL-0418', null, null, null, null, null, null, null, null),
  ('82fd60b8-275d-5a98-8e3e-65c840cbaa58', 'a0000000-0000-4000-8000-000000000001', 'Jordan', 'Pace', 'candidate', 'active', 'UNC Charlotte', 'Business Admin', 'Freshman', 'Durham, NC', 'The Summit Church', 'Fall 2025', 'PSL-0419', null, null, null, null, null, null, null, null),
  ('ae02c7ff-44a0-5ccc-9d22-586c243ada92', 'a0000000-0000-4000-8000-000000000001', 'Caleb', 'Whitfield', 'member', 'active', 'UNC Charlotte', 'Mechanical Engineering', 'Sophomore', 'Greensboro, NC', 'Mercy Hill', 'Fall 2024', 'PSL-0420', null, null, null, null, null, null, null, null),
  ('d2c416f4-2b57-571c-8c5c-b8402c20f8b4', 'a0000000-0000-4000-8000-000000000001', 'Marcus', 'Bellamy', 'member', 'active', 'UNC Charlotte', 'Mechanical Engineering', 'Junior', 'Asheville, NC', 'Forest Hill Church', 'Fall 2024', 'PSL-0421', null, null, null, null, null, null, null, null),
  ('8c88b609-21c5-55bc-82e5-353d0956c925', 'a0000000-0000-4000-8000-000000000001', 'Anthony', 'Reyes', 'member', 'active', 'UNC Charlotte', 'Electrical Engineering', 'Junior', 'Charlotte, NC', 'Forest Hill Church', 'Fall 2024', 'PSL-0422', null, null, null, null, null, null, null, null),
  ('5f025eba-87da-5cab-9026-a91d97fdd3fb', 'a0000000-0000-4000-8000-000000000001', 'Sam', 'Okafor', 'member', 'inactive', 'UNC Charlotte', 'Civil Engineering', 'Junior', 'Charlotte, NC', 'Elevation Church', 'Fall 2024', 'PSL-0423', null, null, null, null, null, null, null, null),
  ('375ff8c6-080b-5b41-96df-95c756824b8d', 'a0000000-0000-4000-8000-000000000001', 'Tyler', 'Brooks', 'member', 'active', 'UNC Charlotte', 'Finance', 'Senior', 'Wilmington, NC', 'Port City Community', 'Spring 2024', 'PSL-0424', null, null, null, null, null, null, null, null),
  ('60fcd709-08ad-55c6-9212-9457f2cd3e6e', 'a0000000-0000-4000-8000-000000000001', 'Devon', 'Hayes', 'member', 'active', 'UNC Charlotte', 'Biblical Studies', 'Senior', 'Charlotte, NC', 'Forest Hill Church', 'Spring 2024', 'PSL-0425', null, null, null, null, null, null, null, null),
  ('f853a710-d6fa-5a44-bc6d-5b05790f65d8', 'a0000000-0000-4000-8000-000000000001', 'Isaiah', 'Cole', 'member', 'inactive', 'UNC Charlotte', 'Computer Science', 'Senior', 'Concord, NC', 'Elevation Church', 'Spring 2024', 'PSL-0426', null, null, null, null, null, null, null, null),
  ('0362ec88-d48c-58db-8514-45bb8dd77a71', 'a0000000-0000-4000-8000-000000000001', 'Nathan', 'Ford', 'member', 'active', 'UNC Charlotte', 'Mechanical Engineering', 'Super Senior', 'Hickory, NC', 'Mercy Hill', 'Fall 2023', 'PSL-0427', null, null, null, null, null, null, null, null),
  ('d5dd3a8b-00d2-513c-91b7-8da40f15c3fd', 'a0000000-0000-4000-8000-000000000001', 'Grant', 'Mercer', 'alumni', 'active', 'UNC Charlotte', 'Mechanical Engineering', 'Alumni', 'Charlotte, NC', 'Forest Hill Church', 'Fall 2021', null, '2025', 'Design Engineer · Collins Aerospace', 'Charlotte, NC', 'Married', 1, true, null, null),
  ('d3988ebb-276d-5f78-b6e9-c07abc0966b8', 'a0000000-0000-4000-8000-000000000001', 'Patrick', 'Lowe', 'alumni', 'active', 'UNC Charlotte', 'Electrical Engineering', 'Alumni', 'Atlanta, GA', 'Passion City', 'Fall 2020', null, '2024', 'Power Systems Eng · Southern Co.', 'Atlanta, GA', 'Married', 2, true, null, null),
  ('6e216294-6c2a-5554-8dcb-7704289fc1fc', 'a0000000-0000-4000-8000-000000000001', 'Joel', 'Ramsey', 'alumni', 'active', 'UNC Charlotte', 'Computer Science', 'Alumni', 'Charlotte, NC', 'Elevation Church', 'Fall 2020', null, '2024', 'Software Engineer · Red Ventures', 'Charlotte, NC', 'Single', 0, true, null, null),
  ('e6b2755a-796a-5ab1-a26b-f5f2a9509a94', 'a0000000-0000-4000-8000-000000000001', 'Andre', 'Wallace', 'alumni', 'active', 'UNC Charlotte', 'Civil Engineering', 'Alumni', 'Raleigh, NC', 'The Summit Church', 'Fall 2019', null, '2023', 'Project Engineer · Kimley-Horn', 'Raleigh, NC', 'Married', 0, false, null, null),
  ('4b472513-c4de-5331-b391-187b2d262e90', 'a0000000-0000-4000-8000-000000000001', 'Caleb', 'Stone', 'alumni', 'active', 'UNC Charlotte', 'Mechanical Engineering', 'Alumni', 'Atlanta, GA', 'Passion City', 'Fall 2019', null, '2023', 'Grad Student · Georgia Tech', 'Atlanta, GA', 'Single', 0, true, null, null),
  ('a607230e-dcfe-5d0c-9a8b-ad2c58e411aa', 'a0000000-0000-4000-8000-000000000001', 'Trevor', 'Quinn', 'alumni', 'active', 'UNC Charlotte', 'Finance', 'Alumni', 'Charlotte, NC', 'Forest Hill Church', 'Fall 2018', null, '2022', 'Analyst · Bank of America', 'Charlotte, NC', 'Married', 2, true, null, null),
  ('ea2b52d8-73a3-5a63-9122-8efdb4bf1c8e', 'a0000000-0000-4000-8000-000000000001', 'Marcus', 'Doyle', 'alumni', 'active', 'UNC Charlotte', 'Electrical Engineering', 'Alumni', 'Austin, TX', 'The Austin Stone', 'Fall 2017', null, '2021', 'Hardware Engineer · NVIDIA', 'Austin, TX', 'Married', 1, true, null, null),
  ('0f31b3c0-029d-582c-aac1-64a0337e7822', 'a0000000-0000-4000-8000-000000000001', 'Brett', 'Halloway', 'alumni', 'active', 'UNC Charlotte', 'Business Admin', 'Alumni', 'Mooresville, NC', 'Mercy Hill', 'Fall 2016', null, '2020', 'Operations Lead · Lowe''s', 'Mooresville, NC', 'Married', 3, false, null, null),
  ('e7e97772-cc6e-5625-aa65-c46920b216e8', 'a0000000-0000-4000-8000-000000000001', 'Owen', 'Carter', 'applicant', 'active', 'UNC Charlotte', 'Computer Science', 'Freshman', 'Charlotte, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'Jun 2', 9.1),
  ('088dfc87-baf5-53c5-aa88-b12537cc4a29', 'a0000000-0000-4000-8000-000000000001', 'Liam', 'Foster', 'applicant', 'active', 'UNC Charlotte', 'Mechanical Engineering', 'Freshman', 'Gastonia, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'Jun 1', 8.7),
  ('872bd3bf-cb20-5d90-956c-e31f8670669b', 'a0000000-0000-4000-8000-000000000001', 'Noah', 'Pratt', 'applicant', 'active', 'UNC Charlotte', 'Business Admin', 'Freshman', 'Concord, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'May 30', 8.6),
  ('e4c7bb6c-b914-5f1a-94ee-b7e15dc9b617', 'a0000000-0000-4000-8000-000000000001', 'Mason', 'Reid', 'applicant', 'active', 'UNC Charlotte', 'Electrical Engineering', 'Sophomore', 'Charlotte, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'May 29', 7.4),
  ('f7ca2613-6cbf-5199-83ae-4d5120dc6d00', 'a0000000-0000-4000-8000-000000000001', 'Lucas', 'Byrd', 'applicant', 'active', 'UNC Charlotte', 'Civil Engineering', 'Freshman', 'Huntersville, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'May 28', 6.9),
  ('808f9d38-b2b6-5cdf-a597-6046750f60c2', 'a0000000-0000-4000-8000-000000000001', 'Henry', 'Dalton', 'applicant', 'active', 'UNC Charlotte', 'Finance', 'Freshman', 'Matthews, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'Jun 3', null),
  ('e2baf203-950e-551c-bb43-6feb39122fde', 'a0000000-0000-4000-8000-000000000001', 'Jack', 'Mercer', 'applicant', 'active', 'UNC Charlotte', 'Computer Science', 'Sophomore', 'Raleigh, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'Jun 3', null),
  ('9a17db58-b1a4-59a3-9abf-d3626da3986f', 'a0000000-0000-4000-8000-000000000001', 'Eli', 'Schwab', 'applicant', 'active', 'UNC Charlotte', 'Kinesiology', 'Freshman', 'Charlotte, NC', null, 'Fall 2025', null, null, null, null, null, null, null, 'May 27', 5.8)
  on conflict (id) do nothing;

-- Offices (current + historic)
insert into roles_history (member_id, title, term, is_current) values
  ('ae02c7ff-44a0-5ccc-9d22-586c243ada92', 'Recruitment Chair', '2025–26', true),
  ('d2c416f4-2b57-571c-8c5c-b8402c20f8b4', 'Service Chair', '2025–26', true),
  ('d2c416f4-2b57-571c-8c5c-b8402c20f8b4', 'Formation Mentor', '2024–25', false),
  ('8c88b609-21c5-55bc-82e5-353d0956c925', 'Formation Chair', '2025–26', true),
  ('375ff8c6-080b-5b41-96df-95c756824b8d', 'President', '2025–26', true),
  ('375ff8c6-080b-5b41-96df-95c756824b8d', 'Treasurer', '2024–25', false),
  ('60fcd709-08ad-55c6-9212-9457f2cd3e6e', 'Chaplain', '2025–26', true),
  ('60fcd709-08ad-55c6-9212-9457f2cd3e6e', 'Service Chair', '2024–25', false),
  ('0362ec88-d48c-58db-8514-45bb8dd77a71', 'Vice President', '2025–26', true),
  ('d5dd3a8b-00d2-513c-91b7-8da40f15c3fd', 'Alumni Mentor Lead', '2025–26', true),
  ('d5dd3a8b-00d2-513c-91b7-8da40f15c3fd', 'President', '2024–25', false),
  ('d3988ebb-276d-5f78-b6e9-c07abc0966b8', 'Treasurer', '2023–24', false),
  ('4b472513-c4de-5331-b391-187b2d262e90', 'Social Chair', '2022–23', false),
  ('a607230e-dcfe-5d0c-9a8b-ad2c58e411aa', 'Alumni Board Chair', '2025–26', true),
  ('a607230e-dcfe-5d0c-9a8b-ad2c58e411aa', 'President', '2021–22', false),
  ('ea2b52d8-73a3-5a63-9122-8efdb4bf1c8e', 'Vice President', '2020–21', false)
  on conflict do nothing;
