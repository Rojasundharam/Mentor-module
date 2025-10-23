-- =====================================================
-- MENTOR MODULE - Complete Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (Store JKKN authenticated users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jkkn_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  department_id TEXT,
  institution_id TEXT,
  phone_number TEXT,
  gender TEXT,
  designation TEXT,
  avatar_url TEXT,
  is_super_admin BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_jkkn_id ON public.users(jkkn_user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_department ON public.users(department_id);
CREATE INDEX idx_users_institution ON public.users(institution_id);

-- =====================================================
-- 2. USER SESSIONS TABLE (Track active sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON public.user_sessions(expires_at);

-- =====================================================
-- 3. MENTORS TABLE (Faculty/Teachers who mentor)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  department_id TEXT NOT NULL,
  institution_id TEXT NOT NULL,
  designation TEXT,
  specialization TEXT,
  total_students INTEGER DEFAULT 0,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_mentors_department ON public.mentors(department_id);
CREATE INDEX idx_mentors_institution ON public.mentors(institution_id);
CREATE INDEX idx_mentors_user_id ON public.mentors(user_id);

-- =====================================================
-- 4. STUDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  roll_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department_id TEXT NOT NULL,
  institution_id TEXT NOT NULL,
  year TEXT,
  section TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_roll ON public.students(roll_number);
CREATE INDEX idx_students_department ON public.students(department_id);
CREATE INDEX idx_students_institution ON public.students(institution_id);
CREATE INDEX idx_students_email ON public.students(email);

-- =====================================================
-- 5. MENTOR-STUDENT ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.mentor_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(mentor_id, student_id)
);

CREATE INDEX idx_mentor_students_mentor ON public.mentor_students(mentor_id);
CREATE INDEX idx_mentor_students_student ON public.mentor_students(student_id);

-- =====================================================
-- 6. COUNSELING SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.counseling_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  attachment_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_mentor ON public.counseling_sessions(mentor_id);
CREATE INDEX idx_sessions_student ON public.counseling_sessions(student_id);
CREATE INDEX idx_sessions_date ON public.counseling_sessions(date);
CREATE INDEX idx_sessions_status ON public.counseling_sessions(status);

-- =====================================================
-- 7. SESSION FEEDBACK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.session_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.counseling_sessions(id) ON DELETE CASCADE,
  counseling_queries TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  submitted_by UUID REFERENCES public.users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id)
);

CREATE INDEX idx_feedback_session ON public.session_feedback(session_id);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON public.mentors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.counseling_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (jkkn_user_id = current_setting('app.user_id', true));

-- Super admins can view all users
CREATE POLICY "Super admins view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE jkkn_user_id = current_setting('app.user_id', true)
      AND is_super_admin = true
    )
  );

-- =====================================================
-- MENTORS TABLE POLICIES
-- =====================================================

-- Faculty/HOD: View mentors from their department
CREATE POLICY "View department mentors" ON public.mentors
  FOR SELECT USING (
    department_id = current_setting('app.user_department', true)
    AND institution_id = current_setting('app.user_institution', true)
  );

-- Super Admin/Administrator/Principal: View all mentors
CREATE POLICY "Admins view all mentors" ON public.mentors
  FOR SELECT USING (
    current_setting('app.user_role', true) IN ('super_admin', 'administrator', 'principal', 'digital_coordinator')
  );

-- =====================================================
-- STUDENTS TABLE POLICIES
-- =====================================================

-- View students from same institution
CREATE POLICY "View institution students" ON public.students
  FOR SELECT USING (
    institution_id = current_setting('app.user_institution', true)
  );

-- Admins view all students
CREATE POLICY "Admins view all students" ON public.students
  FOR SELECT USING (
    current_setting('app.user_role', true) IN ('super_admin', 'administrator', 'principal', 'digital_coordinator')
  );

-- =====================================================
-- MENTOR_STUDENTS TABLE POLICIES
-- =====================================================

-- Mentors can view their assignments
CREATE POLICY "Mentors view own assignments" ON public.mentor_students
  FOR SELECT USING (
    mentor_id IN (
      SELECT id FROM public.mentors
      WHERE user_id IN (
        SELECT id FROM public.users
        WHERE jkkn_user_id = current_setting('app.user_id', true)
      )
    )
  );

-- =====================================================
-- COUNSELING SESSIONS TABLE POLICIES
-- =====================================================

-- Mentors view their sessions
CREATE POLICY "Mentors view own sessions" ON public.counseling_sessions
  FOR SELECT USING (
    mentor_id IN (
      SELECT id FROM public.mentors
      WHERE user_id IN (
        SELECT id FROM public.users
        WHERE jkkn_user_id = current_setting('app.user_id', true)
      )
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.users IS 'Stores JKKN authenticated users with role and department info';
COMMENT ON TABLE public.mentors IS 'Faculty members who act as mentors';
COMMENT ON TABLE public.students IS 'Students who are mentored';
COMMENT ON TABLE public.mentor_students IS 'Junction table for mentor-student assignments';
COMMENT ON TABLE public.counseling_sessions IS 'Counseling sessions between mentors and students';
COMMENT ON TABLE public.session_feedback IS 'Feedback submitted after counseling sessions';
