# Enterprise HRMS - Learning & Development (L&D) Module

A modern, responsive, and interactive enterprise frontend for the **Learning & Development (L&D) Management Module** built for Enterprise Human Resource Management Systems (HRMS), based on the SRS v1.0 specifications.

---

## Architecture & Technology Stack

- **Framework:** React 18+ (Functional Components & Hooks) with Vite & TypeScript
- **Styling:** Tailwind CSS (Enterprise slate/neutral palette, deep indigo/violet primary accents, glassmorphism panels, and status pill badges)
- **Icons:** Lucide React (`lucide-react`)
- **State Management:** Purely client-side reactive state using React Context API (`AppContext`), providing dynamic mutations across all CRUD operations, role perspectives, filters, and in-app notifications.
- **Export Engine:** Client-side CSV generator with automated browser download triggers.

---

## Key Modules & Features Implemented

### 1. Global Shell & Navigation
- **Role Switcher Dropdown:** Seamlessly switch perspectives in real time between:
  - `HR Administrator` (Elena Vance)
  - `Employee` (Alex Mercer)
  - `Reporting Manager` (Priya Sharma)
  - `Corporate Trainer` (Marcus Sterling)
- **Notification Popover:** In-app notification center displaying real-time alerts for assignments, upcoming sessions, overdue training, test results, and certificate expiries (with "Mark as Read" toggles and unread counters).
- **Collapsible Sidebar:** Role-aware navigation links for Dashboard, Programs & Courses, Assignments, Sessions & Attendance, Assessments & Results, Certificates & Skills, and Reports & Analytics.

### 2. Role-Based Dashboards
- **HR Administrator View:** KPI stat cards (Total Programs, Active Courses, Enrolled Employees, Ongoing vs. Completed, Overdue Assignments), department-wise training completion breakdown progress bars, and modal triggers for program creation and training assignment.
- **Employee View:** "My Learning Journey" card (progress percentage, learning streak, completed hours, active credentials), "In Progress" courses with resume triggers, and upcoming live session schedules.
- **Reporting Manager View:** Team training overview per direct report, department compliance meters, and direct "Recommend Training" actions based on skill gaps.
- **Trainer View:** Today's scheduled sessions with "Mark Attendance" triggers, grade pending assessments overview, and instructor ratings.

### 3. Training Programs & Course Catalog
- **Catalog View:** Search bar, category filters (`Technical`, `Soft Skills`, `Leadership`, `Compliance`), delivery mode chips (`Online`, `Offline`, `Hybrid`), and difficulty indicators (`Beginner`, `Intermediate`, `Advanced`).
- **Interactive Syllabus & Course Player:** Expandable module breakdown with video/reading/quiz simulation and live module completion tracking that auto-issues credentials upon 100% completion with celebration confetti!
- **Curriculum Modals:** "Create Program" and "Add Course" modals with prerequisite and skill tag management.

### 4. Training Assignment Engine
- **Assignment Management Table:** Employee, Department, Course Name, Assigned Date, Due Date, Priority (`High`, `Medium`, `Low`), and Status (`Not Started`, `In Progress`, `Completed`, `Overdue`).
- **Bulk / Individual Assignment Modal:** Assign to individual trainees or entire business units with priority selection and auto-notification trigger previews.

### 5. Attendance & Session Management
- **Interactive Attendance Sheet:** Session switcher, live attendance percentage calculation meter in real time, and segmented controls (`Present`, `Absent`, `Half Day`) for each enrolled trainee.
- **Session Scheduler:** Schedule webinars, workshops, or hybrid cohort sessions with location and video link configurations.

### 6. Assessments & Evaluation
- **Assessment Management Table:** Total marks, passing marks, obtained marks, percentage score, and auto-calculated `Pass` / `Fail` badges.
- **Grading Modal:** Enter or update scores, toggle reassessment eligibility, and leave constructive trainer feedback.

### 7. Certification & Skill Development
- **Certificates Hub:** Card/Grid view of employee credentials with serial numbers, issue/expiry dates, status badges (`Valid`, `Expiring Soon`, `Expired`), and an official printable certificate modal mockup with QR code verification.
- **Skill Gap Matrix:** Visual comparison of required competencies (1-5) vs. current employee skill levels with direct course recommendation triggers.
- **Course & Trainer Feedback:** 5-star rating matrix for course relevance, instructor effectiveness, and lab quality.

### 8. Reports & Analytics
- Tabbed reporting views:
  1. Department-wise & Employee-wise Completion Report
  2. Attendance & Compliance Audit Report
  3. Skill Gap & Certification Expiry Report
- Real CSV file export with simulated download execution.

---

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

