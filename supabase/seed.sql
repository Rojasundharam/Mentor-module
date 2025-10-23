-- =====================================================
-- MENTOR MODULE - Sample Seed Data
-- =====================================================

-- Clear existing data (for development only)
TRUNCATE public.session_feedback CASCADE;
TRUNCATE public.counseling_sessions CASCADE;
TRUNCATE public.mentor_students CASCADE;
TRUNCATE public.students CASCADE;
TRUNCATE public.mentors CASCADE;
TRUNCATE public.user_sessions CASCADE;
TRUNCATE public.users CASCADE;

-- =====================================================
-- 1. SEED USERS (Sample JKKN users)
-- =====================================================

INSERT INTO public.users (jkkn_user_id, email, full_name, role, department_id, institution_id, designation, is_super_admin, profile_completed) VALUES
-- Super Admin
('admin-001', 'admin@jkkn.ac.in', 'System Administrator', 'super_admin', NULL, NULL, 'System Admin', true, true),

-- Principals
('principal-001', 'principal@jkkn.ac.in', 'Dr. Kumar Rajesh', 'principal', NULL, 'JKKN-COLLEGE', 'Principal', false, true),

-- HODs
('hod-cs-001', 'hod.cs@jkkn.ac.in', 'Dr. Priya Sharma', 'hod', 'CS-DEPT', 'JKKN-COLLEGE', 'Professor & HOD', false, true),
('hod-it-001', 'hod.it@jkkn.ac.in', 'Dr. Amit Patel', 'hod', 'IT-DEPT', 'JKKN-COLLEGE', 'Professor & HOD', false, true),

-- Faculty (Mentors) - Computer Science
('faculty-cs-001', 'rajesh.kumar@jkkn.ac.in', 'Dr. Rajesh Kumar', 'faculty', 'CS-DEPT', 'JKKN-COLLEGE', 'Professor', false, true),
('faculty-cs-002', 'lakshmi.iyer@jkkn.ac.in', 'Dr. Lakshmi Iyer', 'faculty', 'CS-DEPT', 'JKKN-COLLEGE', 'Associate Professor', false, true),
('faculty-cs-003', 'suresh.reddy@jkkn.ac.in', 'Prof. Suresh Reddy', 'faculty', 'CS-DEPT', 'JKKN-COLLEGE', 'Assistant Professor', false, true),

-- Faculty (Mentors) - IT Department
('faculty-it-001', 'anitha.nair@jkkn.ac.in', 'Dr. Anitha Nair', 'faculty', 'IT-DEPT', 'JKKN-COLLEGE', 'Professor', false, true),
('faculty-it-002', 'vikram.singh@jkkn.ac.in', 'Prof. Vikram Singh', 'faculty', 'IT-DEPT', 'JKKN-COLLEGE', 'Assistant Professor', false, true);

-- =====================================================
-- 2. SEED MENTORS (From faculty users)
-- =====================================================

INSERT INTO public.mentors (user_id, department_id, institution_id, designation, specialization, total_students)
SELECT
  id,
  department_id,
  institution_id,
  designation,
  CASE
    WHEN full_name LIKE '%Rajesh%' THEN 'Artificial Intelligence & Machine Learning'
    WHEN full_name LIKE '%Lakshmi%' THEN 'Data Science & Analytics'
    WHEN full_name LIKE '%Suresh%' THEN 'Web Development & Cloud Computing'
    WHEN full_name LIKE '%Anitha%' THEN 'Cybersecurity & Network Security'
    WHEN full_name LIKE '%Vikram%' THEN 'Software Engineering & DevOps'
    ELSE 'General Computer Science'
  END,
  0
FROM public.users
WHERE role = 'faculty';

-- =====================================================
-- 3. SEED STUDENTS
-- =====================================================

-- Computer Science Students
INSERT INTO public.students (roll_number, name, email, department_id, institution_id, year, section) VALUES
('21CS101', 'Arun Kumar', 'arun.kumar@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '3rd Year', 'A'),
('21CS102', 'Priya Raj', 'priya.raj@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '3rd Year', 'A'),
('21CS103', 'Divya Krishnan', 'divya.krishnan@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '3rd Year', 'A'),
('21CS104', 'Anjali Nair', 'anjali.nair@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '3rd Year', 'B'),
('22CS101', 'Rahul Menon', 'rahul.menon@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '2nd Year', 'A'),
('22CS102', 'Sneha Iyer', 'sneha.iyer@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '2nd Year', 'A'),
('23CS101', 'Karthik Raman', 'karthik.raman@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '1st Year', 'A'),
('23CS102', 'Meera Balaji', 'meera.balaji@student.jkkn.ac.in', 'CS-DEPT', 'JKKN-COLLEGE', '1st Year', 'A'),

-- IT Department Students
('21IT101', 'Arjun Sharma', 'arjun.sharma@student.jkkn.ac.in', 'IT-DEPT', 'JKKN-COLLEGE', '3rd Year', 'A'),
('21IT102', 'Kavya Reddy', 'kavya.reddy@student.jkkn.ac.in', 'IT-DEPT', 'JKKN-COLLEGE', '3rd Year', 'A'),
('22IT101', 'Rohan Patel', 'rohan.patel@student.jkkn.ac.in', 'IT-DEPT', 'JKKN-COLLEGE', '2nd Year', 'A'),
('22IT102', 'Deepika Kumar', 'deepika.kumar@student.jkkn.ac.in', 'IT-DEPT', 'JKKN-COLLEGE', '2nd Year', 'A'),
('23IT101', 'Siddharth Nair', 'siddharth.nair@student.jkkn.ac.in', 'IT-DEPT', 'JKKN-COLLEGE', '1st Year', 'A'),
('23IT102', 'Asha Krishnan', 'asha.krishnan@student.jkkn.ac.in', 'IT-DEPT', 'JKKN-COLLEGE', '1st Year', 'A');

-- =====================================================
-- 4. SEED MENTOR-STUDENT ASSIGNMENTS
-- =====================================================

-- Dr. Rajesh Kumar's students (CS)
INSERT INTO public.mentor_students (mentor_id, student_id, assigned_by, notes)
SELECT
  m.id,
  s.id,
  u.id,
  'Assigned based on academic performance and interest area'
FROM public.mentors m
CROSS JOIN public.students s
CROSS JOIN public.users u
WHERE m.user_id = (SELECT id FROM public.users WHERE email = 'rajesh.kumar@jkkn.ac.in')
  AND s.roll_number IN ('21CS101', '21CS102', '22CS101')
  AND u.email = 'hod.cs@jkkn.ac.in';

-- Dr. Lakshmi Iyer's students (CS)
INSERT INTO public.mentor_students (mentor_id, student_id, assigned_by)
SELECT
  m.id,
  s.id,
  u.id
FROM public.mentors m
CROSS JOIN public.students s
CROSS JOIN public.users u
WHERE m.user_id = (SELECT id FROM public.users WHERE email = 'lakshmi.iyer@jkkn.ac.in')
  AND s.roll_number IN ('21CS103', '22CS102', '23CS101')
  AND u.email = 'hod.cs@jkkn.ac.in';

-- Prof. Suresh Reddy's students (CS)
INSERT INTO public.mentor_students (mentor_id, student_id, assigned_by)
SELECT
  m.id,
  s.id,
  u.id
FROM public.mentors m
CROSS JOIN public.students s
CROSS JOIN public.users u
WHERE m.user_id = (SELECT id FROM public.users WHERE email = 'suresh.reddy@jkkn.ac.in')
  AND s.roll_number IN ('21CS104', '23CS102')
  AND u.email = 'hod.cs@jkkn.ac.in';

-- Dr. Anitha Nair's students (IT)
INSERT INTO public.mentor_students (mentor_id, student_id, assigned_by)
SELECT
  m.id,
  s.id,
  u.id
FROM public.mentors m
CROSS JOIN public.students s
CROSS JOIN public.users u
WHERE m.user_id = (SELECT id FROM public.users WHERE email = 'anitha.nair@jkkn.ac.in')
  AND s.roll_number IN ('21IT101', '22IT101', '23IT101')
  AND u.email = 'hod.it@jkkn.ac.in';

-- Prof. Vikram Singh's students (IT)
INSERT INTO public.mentor_students (mentor_id, student_id, assigned_by)
SELECT
  m.id,
  s.id,
  u.id
FROM public.mentors m
CROSS JOIN public.students s
CROSS JOIN public.users u
WHERE m.user_id = (SELECT id FROM public.users WHERE email = 'vikram.singh@jkkn.ac.in')
  AND s.roll_number IN ('21IT102', '22IT102', '23IT102')
  AND u.email = 'hod.it@jkkn.ac.in';

-- Update total_students count
UPDATE public.mentors SET total_students = (
  SELECT COUNT(*) FROM public.mentor_students WHERE mentor_id = mentors.id
);

-- =====================================================
-- 5. SEED COUNSELING SESSIONS
-- =====================================================

-- Sample counseling sessions
INSERT INTO public.counseling_sessions (mentor_id, student_id, session_name, date, time, notes, status, created_by)
SELECT
  m.id,
  s.id,
  'Academic Progress Review - Semester 5',
  CURRENT_DATE + INTERVAL '3 days',
  '10:00:00',
  'Discuss semester performance, career planning, and internship opportunities',
  'scheduled',
  m.user_id
FROM public.mentors m
CROSS JOIN public.students s
WHERE m.user_id = (SELECT id FROM public.users WHERE email = 'rajesh.kumar@jkkn.ac.in')
  AND s.roll_number = '21CS101'
LIMIT 1;

-- Completed session with feedback
INSERT INTO public.counseling_sessions (mentor_id, student_id, session_name, date, time, notes, status, created_by)
SELECT
  m.id,
  s.id,
  'Mid-Semester Progress Check',
  CURRENT_DATE - INTERVAL '5 days',
  '14:00:00',
  'Review academic performance and address any concerns',
  'completed',
  m.user_id
FROM public.mentors m
CROSS JOIN public.students s
WHERE m.user_id = (SELECT id FROM public.users WHERE email = 'lakshmi.iyer@jkkn.ac.in')
  AND s.roll_number = '21CS103'
LIMIT 1;

-- =====================================================
-- 6. SEED SESSION FEEDBACK
-- =====================================================

-- Feedback for completed session
INSERT INTO public.session_feedback (session_id, counseling_queries, action_taken, submitted_by)
SELECT
  cs.id,
  'Student inquired about internship opportunities in AI/ML domain. Expressed concerns about project work complexity and time management. Discussed career paths in data science.',
  'Provided guidance on top internship portals and recommended online courses (Coursera AI Specialization). Scheduled follow-up session for project mentoring. Shared LinkedIn profiles of alumni working in AI companies.',
  cs.created_by
FROM public.counseling_sessions cs
WHERE cs.status = 'completed'
LIMIT 1;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check data counts
DO $$
BEGIN
  RAISE NOTICE 'Users created: %', (SELECT COUNT(*) FROM public.users);
  RAISE NOTICE 'Mentors created: %', (SELECT COUNT(*) FROM public.mentors);
  RAISE NOTICE 'Students created: %', (SELECT COUNT(*) FROM public.students);
  RAISE NOTICE 'Assignments created: %', (SELECT COUNT(*) FROM public.mentor_students);
  RAISE NOTICE 'Counseling sessions created: %', (SELECT COUNT(*) FROM public.counseling_sessions);
  RAISE NOTICE 'Feedback entries: %', (SELECT COUNT(*) FROM public.session_feedback);
END $$;
