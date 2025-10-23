# Mentor-Mentee Module Documentation

## Overview

A comprehensive mentor-mentee management system built with Next.js 14, TypeScript, and Tailwind CSS. Features a beautiful UI with custom brand colors and full integration with JKKN authentication.

## Brand Design System

### Colors
- **Cream (#fbfbee)**: Primary background, light surfaces
- **Yellow (#ffde59)**: Primary actions, CTAs, highlights
- **Forest Green (#0b6d41)**: Primary text, headers, secondary buttons

### Design Principles
- Mobile-first responsive design
- WCAG AA accessibility compliance
- Consistent spacing and typography
- Brand color usage throughout

## Features Implemented

### 1. Mentor Directory (`/mentor`)
- **Search & Filter**: Search mentors by name, email, department, or designation
- **Mentor Cards**: Display mentor information with avatar, contact details, and student count
- **Responsive Grid**: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

### 2. Mentor Detail Page (`/mentor/[id]`)
- **Profile Display**: Complete mentor information with avatar and statistics
- **Tab Navigation**: Four main tabs for different functionalities
- **Back Navigation**: Easy return to mentor directory

### 3. Students Tab
**Features:**
- View all assigned students
- Search and add new students
- Remove students from mentor
- Student cards with avatars and details

**Workflow:**
1. Click "Add Student" button
2. Search for students by name, roll number, or email
3. Select student from results
4. Confirm assignment

### 4. Counseling Tab
**Features:**
- Create counseling sessions
- List all sessions with status badges
- View session details
- Submit feedback for completed sessions

**Session Creation Form:**
- Student selection (from assigned students)
- Session name
- Date and time
- Notes/remarks
- Attachment URL (optional)

**Feedback Form:**
- Counseling queries
- Action taken
- Automatic status update to "completed"

**Session Statuses:**
- 🟦 Scheduled
- 🟩 Completed (with/without feedback)
- 🟨 Cancelled

### 5. Attendance Tab
**Status**: Coming Soon (Q2 2025)

**Planned Features:**
- Daily attendance marking
- Attendance analytics
- Attendance reports
- Low attendance alerts

### 6. Exam Results Tab
**Status**: Coming Soon (Q2 2025)

**Planned Features:**
- Comprehensive results view
- Performance analytics
- Subject-wise breakdown
- Performance improvement plans
- Result export & reports

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Custom UI component library

### Authentication
- **Provider**: JKKN Auth (OAuth 2.0)
- **Tokens**: JWT with automatic refresh
- **Storage**: localStorage with secure token handling

### API Structure
```
/api/mentor/
├── list/                    # GET - List all mentors
├── [id]/                    # GET - Get mentor details
│   ├── students/            # GET/POST - Manage students
│   │   └── [studentId]/     # DELETE - Remove student
│   └── counseling/          # GET/POST - Manage sessions
│       └── [sessionId]/
│           └── feedback/    # POST - Submit feedback
└── /students/search/        # GET - Search students
```

## File Structure

```
app/
├── mentor/
│   ├── page.tsx                    # Mentor listing page
│   └── [id]/
│       ├── page.tsx                # Mentor detail page
│       └── components/
│           ├── StudentsTab.tsx     # Students management
│           ├── CounselingTab.tsx   # Counseling sessions
│           ├── AttendanceTab.tsx   # Coming soon
│           └── ExamResultsTab.tsx  # Coming soon
├── api/
│   ├── mentor/
│   │   ├── list/route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── students/
│   │       │   ├── route.ts
│   │       │   └── [studentId]/route.ts
│   │       └── counseling/
│   │           ├── route.ts
│   │           └── [sessionId]/feedback/route.ts
│   └── students/search/route.ts
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Tabs.tsx
│   │   ├── Modal.tsx
│   │   ├── SearchInput.tsx
│   │   ├── Badge.tsx
│   │   └── PageLayout.tsx
│   └── providers/
│       └── AuthProvider.tsx        # JKKN auth context
└── lib/
    ├── types/
    │   └── mentor.ts               # TypeScript interfaces
    └── auth/
        ├── config.ts               # Auth configuration
        └── token-validation.ts     # Token utilities
```

## Component Library

### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```
**Variants**: primary, secondary, outline
**Sizes**: sm, md, lg

### Card
```tsx
<Card variant="bordered" hoverable>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```
**Variants**: default, bordered, elevated, cream

### Input & TextArea
```tsx
<Input
  label="Email"
  type="email"
  required
  error={errors.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Modal
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Title"
  size="lg"
>
  {/* Modal content */}
</Modal>
```

### Tabs
```tsx
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <Component1 /> },
    { id: 'tab2', label: 'Tab 2', content: <Component2 /> }
  ]}
  defaultTab="tab1"
/>
```

## API Integration Guide

### Replacing Mock Data with JKKN API

All API routes currently use mock data. To integrate with JKKN APIs:

#### 1. Mentor List (`app/api/mentor/list/route.ts`)
```typescript
// Replace mock data with:
const response = await fetch('https://api.jkkn.ai/staff?role=mentor', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

#### 2. Student Search (`app/api/students/search/route.ts`)
```typescript
// Replace mock data with:
const response = await fetch(
  `https://api.jkkn.ai/students/search?q=${query}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

#### 3. Database Storage
Replace in-memory storage with database queries:
- Use Supabase, PostgreSQL, or your preferred database
- Update all routes to use database operations
- Add proper transaction handling and error recovery

## Environment Variables

```env
# Authentication
NEXT_PUBLIC_AUTH_SERVER_URL=https://auth.jkkn.ai
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
API_KEY=your_api_key

# Database (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Development

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

## User Workflows

### Mentor Assigns Students
1. Navigate to `/mentor` and search for a mentor
2. Click on mentor card to view details
3. Go to "Students" tab
4. Click "Add Student" button
5. Search for student by name/roll number
6. Select student and click "Assign Student"

### Create Counseling Session
1. From mentor detail page, go to "Counseling" tab
2. Click "Create Session" button
3. Select student from dropdown (only assigned students)
4. Fill in session name, date, time
5. Add optional notes and attachment
6. Click "Create Session"

### Submit Session Feedback
1. In "Counseling" tab, find the session
2. Click "View Details" button
3. Scroll to "Session Feedback" section
4. Fill in counseling queries and action taken
5. Click "Submit Feedback"
6. Session status automatically updates to "completed"

## Accessibility Features

✓ Keyboard navigation support
✓ ARIA labels on all interactive elements
✓ Semantic HTML structure
✓ Focus indicators
✓ Color contrast ratios meet WCAG AA
✓ Responsive touch targets (44x44px minimum)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### Phase 1 (Q1 2025)
- ✅ Mentor directory and search
- ✅ Student assignment
- ✅ Counseling session management
- ✅ Feedback submission

### Phase 2 (Q2 2025)
- ⏳ Attendance tracking
- ⏳ Exam results integration
- ⏳ Analytics dashboard
- ⏳ Export/reporting features

### Phase 3 (Q3 2025)
- 📋 Notifications system
- 📋 Calendar integration
- 📋 Mobile app
- 📋 Advanced analytics

## Troubleshooting

### Authentication Issues
- Verify `.env.local` contains correct JKKN auth credentials
- Check browser console for token refresh errors
- Clear localStorage and re-authenticate

### API Errors
- Check network tab for failed requests
- Verify API endpoints are accessible
- Ensure authorization header is being sent

### Styling Issues
- Run `npm run dev` to restart development server
- Check if Tailwind CSS is properly configured
- Verify custom colors are defined in `globals.css`

## Support & Contact

For issues or questions:
- Check existing issues on GitHub
- Review JKKN documentation
- Contact development team

## License

Proprietary - JKKN College of Engineering

---

**Built with ❤️ using the JKKN Design System**
