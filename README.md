# PMU Question Paper Generator System

A modern, full-stack college examination management and randomized question paper generation system built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**.

---

## Key Features

- 🔐 **Role-Based Authentication (Supabase Auth & RLS)**: Dedicated **Admin** and **Faculty** roles with Row Level Security (RLS) policies.
- 🗄️ **Normalized PostgreSQL Database**: 15 related tables covering Departments, Faculty, Courses, Modules, COs, K-Levels, Question Types, Marks, Questions, Options, Templates, and Snapshot-backed Generated Papers.
- 🎯 **Academic Criteria Workflow**:
  `Department → Course → Section configuration → Number of Questions → Marks → Course Outcome → K-Level → Generate Paper`
- 📊 **Real-Time Question Availability Indicator**: Displays live question bank counts before generation (e.g. `Required: 10 | Available: 18 | ✓ Ready`).
- 🎲 **Zero-Duplicate Randomization Engine**: Fast PostgreSQL RPC function and Fisher-Yates randomization ensuring zero duplicate question IDs within any generated paper.
- 🔀 **Internal Choice (OR Pattern) Support**: Automatically pairs alternative long answer questions (e.g. `16. a. Question ... (15) OR b. Question ... (15)`).
- 📄 **Snapshot-Backed Paper Saving**: Saves complete JSON snapshots so future question bank edits do not alter past examination papers.
- 🖨️ **A4 Print & PDF Rendering**: Pixel-perfect A4 college examination layout with institution headers, instructions, part sections, MCQ grids, browser native printing (`Ctrl+P`), and instant downloadable PDF.
- 📈 **Question Bank Analytics**: Live breakdown by Marks (1m, 2m, 10m, 15m, 20m), Course Outcomes (CO1..CO5), K-Levels (K1..K6), and Syllabus Modules.
- 📥 **Excel/CSV Bulk Importer**: Import question banks in bulk with template download support.

---

## Credentials

### System Administrator Account:
- **Email**: `admin@pmu.edu`
- **Password**: `admin@123`

### Faculty Account:
- **Email**: `faculty@pmu.edu`
- **Password**: `faculty@123`

---

## Database Setup (Supabase PostgreSQL)

1. Create a new project on [Supabase Console](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the SQL migration files located in `supabase/` in the following order:

### Step 1: Initial Schema (`supabase/migrations/001_initial_schema.sql`)
Creates normalized tables, foreign key relationships, constraints, and indexes.

### Step 2: Row Level Security Policies (`supabase/migrations/002_rls_policies.sql`)
Enables RLS policies and admin helper functions.

### Step 3: Random Selection RPC Function (`supabase/migrations/003_random_questions_rpc.sql`)
Installs `get_random_questions` PostgreSQL RPC function.

### Step 4: Seed Data (`supabase/seed.sql`)
Seeds Admin and Faculty accounts, Departments (CSE, ECE, MECH, EEE), Courses (CS8591, etc.), Modules, COs, K-Levels, Question Types, Marks, Templates, and 60+ pre-filled sample questions.

---

## Environment Variables Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_NAME=PMU Examination System
```

---

## Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Verification

```bash
# Build Next.js application for production
npm run build

# Start production server
npm start
```

---

## Directory Architecture

```
d:\PMU\
├── app/
│   ├── (auth)/
│   │   └── login/             # Supabase Auth Login screen
│   ├── (dashboard)/
│   │   ├── dashboard/          # Analytics overview & quick workflows
│   │   ├── question-bank/      # Search, multi-faceted filter drawer, CRUD, bulk import
│   │   ├── generate-paper/     # Interactive paper pattern generator & A4 preview
│   │   ├── generated-papers/   # Paper history dashboard
│   │   ├── departments/        # Department management
│   │   ├── courses/            # Degree course catalog
│   │   ├── modules/            # Syllabus module units
│   │   ├── course-outcomes/    # CO management
│   │   ├── k-levels/           # Bloom's K-Levels taxonomy
│   │   ├── exam-templates/     # Examination pattern blueprints
│   │   └── faculty/            # User role administration
│   ├── globals.css             # Tailwind & A4 print CSS
│   └── layout.tsx
├── components/
│   ├── layout/                 # Sidebar, TopHeader navigation
│   ├── ui/                     # Reusable Button, Card, Badge, Dialog
│   ├── question-bank/          # QuestionStats, QuestionForm
│   └── pdf/                    # PaperPreviewA4 print & PDF renderer
├── lib/
│   ├── supabase/               # Supabase SSR client helpers
│   ├── question-generator/     # QuestionGeneratorEngine
│   ├── auth-context.tsx        # Authentication provider
│   └── mock-data.ts            # Fallback dataset
├── services/
│   ├── master-data.service.ts  # Academic metadata service
│   ├── question.service.ts     # Question bank service
│   ├── paper.service.ts        # Paper snapshot service
│   └── analytics.service.ts    # Analytics service
├── supabase/
│   ├── migrations/             # 001_initial_schema, 002_rls_policies, 003_random_questions_rpc
│   └── seed.sql                # Initial seed script
└── types/
    └── index.ts                # TypeScript data interfaces
```
