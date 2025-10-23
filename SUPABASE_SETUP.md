# 🗄️ Supabase Setup Guide - Mentor Module

## 📋 Overview

This guide will help you set up Supabase for the Mentor Module with:
- ✅ Department/Institution-based data filtering
- ✅ Row Level Security (RLS) policies
- ✅ Role-based access control
- ✅ Complete data persistence (no localStorage!)

---

## 🚀 Step 1: Install Supabase Package

```bash
npm install @supabase/supabase-js
```

---

## 🔑 Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy the values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

---

## 🗄️ Step 3: Create Database Tables

### Option A: Using Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20250123000000_create_mentor_module_tables.sql`
4. Paste and click "Run"
5. Wait for success message

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## 🌱 Step 4: Seed Sample Data

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/seed.sql`
4. Paste and click "Run"
5. Check output for success messages

**Expected Output:**
```
Users created: 9
Mentors created: 5
Students created: 14
Assignments created: 13
Counseling sessions created: 2
Feedback entries: 1
```

---

## 🔒 Step 5: Verify RLS Policies

Go to Supabase Dashboard → Authentication → Policies

You should see policies for:
- ✅ `users` table
- ✅ `mentors` table (department filtering)
- ✅ `students` table (institution filtering)
- ✅ `mentor_students` table
- ✅ `counseling_sessions` table

---

## 🧪 Step 6: Test the System

### Test Login Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click "Sign in with MyJKKN"

4. Check the **terminal** for logs:
   ```
   ========================================
   Storing JKKN User in Supabase:
   User Role: faculty
   Department: CS-DEPT
   Institution: JKKN-COLLEGE
   ========================================
   ✅ Access granted for role: faculty
   ✅ User stored in Supabase with ID: [UUID]
   ✅ Session created with ID: [UUID]
   ✅ Redirecting faculty to: /mentor
   ```

5. Check **browser console** for:
   ```
   ========================================
   JKKN User Data Received:
   User Object: {...}
   Available User Fields: [...]
   ========================================
   ```

### Verify Data in Supabase

1. Go to Supabase Dashboard → Table Editor

2. Check `users` table:
   - Your logged-in user should appear
   - `last_login` should be updated

3. Check `user_sessions` table:
   - New session should be created
   - `expires_at` should be in the future

4. If you logged in as **faculty**, check `mentors` table:
   - A mentor record should be auto-created for you

---

## 🎯 Step 7: Test Department Filtering

### Test as Faculty (Department-specific)

1. Login as a faculty member from **CS-DEPT**
2. Go to `/mentor` page
3. You should ONLY see mentors from CS-DEPT
4. Search for students - ONLY see JKKN-COLLEGE students

### Test as Super Admin (See All)

1. Login as super_admin role
2. Go to `/mentor` or `/admin`
3. You should see ALL mentors from ALL departments

---

## 🔧 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** Ensure `.env.local` has all three Supabase variables

### Issue: "Row Level Security policy violation"

**Solution:**
1. Check that RLS policies are enabled
2. Verify user has correct department_id and institution_id
3. Check that you're using correct Supabase client (anon vs service role)

### Issue: Tables not created

**Solution:**
1. Check SQL Editor for error messages
2. Ensure UUID extension is enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
3. Run migrations again

### Issue: No data showing

**Solution:**
1. Check that seed data was inserted successfully
2. Verify RLS policies are not too restrictive
3. Check user's department_id matches data in database

---

## 📊 Database Schema Overview

```
users (JKKN authenticated users)
  ↓
mentors (faculty members)
  ↓
mentor_students (assignments)
  ↓
students (learners)
  ↓
counseling_sessions
  ↓
session_feedback
```

---

## 🎓 Allowed Roles

✅ **Can Access:**
- faculty (Mentors)
- hod (Head of Department)
- principal (Institution Head)
- administrator (System Admin)
- digital_coordinator (Institution Admin)
- super_admin (Full Access)

❌ **Cannot Access:**
- student
- staff
- admission
- accounts
- driver
- guest

---

## 🔐 Security Features

1. **Row Level Security (RLS)**
   - Faculty see only their department
   - HOD sees entire department
   - Admins see everything

2. **Department Filtering**
   - Automatic via RLS policies
   - No manual filtering needed in code

3. **Institution Filtering**
   - Students filtered by institution
   - Ensures data isolation

4. **Role-Based Access**
   - Checked at login
   - Enforced via API routes

---

## 📝 Next Steps

After setup, you can:

1. ✅ Replace mentor list API with Supabase
2. ✅ Replace student search API with Supabase
3. ✅ Replace counseling sessions API with Supabase
4. ✅ Update AuthProvider to use Supabase sessions
5. ✅ Add real-time subscriptions (optional)

**All mock APIs will be replaced in the next phase!**

---

## 🆘 Need Help?

- Check Supabase logs in Dashboard → Logs
- Review RLS policies in Dashboard → Authentication
- Check table data in Dashboard → Table Editor
- Review API route logs in terminal

---

**🎉 Congratulations! Your Supabase setup is complete!**
