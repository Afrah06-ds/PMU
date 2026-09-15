# PMU Examination Management System

PMU is a full-stack examination management system for colleges and universities. It helps academic teams maintain a structured question bank, map questions to course outcomes and cognitive levels, generate balanced examination papers, and save print-ready paper snapshots.

The application is built with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase PostgreSQL.

## What It Does

- Provides separate Admin and Faculty workflows with Supabase Auth and database-level access policies.
- Organizes academic data across departments, courses, semesters, modules, course outcomes, K-levels, marks, and question types.
- Creates and manages MCQ, short-answer, and long-answer questions.
- Filters questions by course, module, marks, course outcome, K-level, and question type.
- Imports question banks from CSV or Excel files.
- Shows question-bank analytics by marks, course outcomes, K-levels, and modules.
- Builds examination papers from configurable sections and mark patterns.
- Supports internal-choice sections using an `OR` question pair.
- Randomizes questions without reusing a question ID within a generated paper.
- Randomizes MCQ option order when a paper is generated.
- Saves generated papers as JSON snapshots, so later question-bank edits do not change previously saved papers.
- Renders papers in an A4 examination layout for browser printing and PDF download.

## Typical Workflow

1. Sign in as an administrator or faculty member.
2. Configure departments, courses, modules, course outcomes, K-levels, and question types.
3. Add questions individually or import them in bulk.
4. Open **Generate Paper** and choose the course and paper sections.
5. Set the number of questions, marks, filters, and optional internal-choice behavior for each section.
6. Check the availability summary before generating the paper.
7. Review the A4 preview, save the paper, and print or download it as a PDF.

## Application Areas

| Area | Purpose |
| --- | --- |
| Dashboard | View question, course, module, and generated-paper metrics plus recent activity. |
| Question Bank | Search, filter, create, edit, and delete questions. |
| Bulk Import | Upload CSV or Excel question-bank data using the provided template. |
| Generate Paper | Configure sections, select constraints, randomize questions, and preview the paper. |
| Generated Papers | Browse saved paper history and reopen saved snapshots. |
| Academic Setup | Manage departments, courses, modules, course outcomes, and K-levels. |
| Faculty | Manage faculty profiles and role-based access. |
| Settings | Manage application-level settings exposed by the dashboard. |

## Technology

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend and database:** Supabase Auth, Supabase SSR, PostgreSQL, Row Level Security
- **UI:** Reusable local components and Lucide icons
- **Charts:** Recharts
- **Import and document output:** `xlsx`, `jspdf`, and `html2canvas`
- **Validation:** Zod

## Requirements

- Node.js 18.17 or newer
- npm
- A Supabase project for persistent authentication and data

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_NAME=PMU Examination Management System
```

The service-role key is server-side sensitive configuration. Never expose it in browser code, commit it to Git, or publish it in a client-side environment variable.

### 3. Set up Supabase

Run the SQL files in the Supabase SQL Editor in this order:

1. `supabase/migrations/001_initial_schema.sql` creates the normalized academic, question-bank, template, and generated-paper tables.
2. `supabase/migrations/002_rls_policies.sql` enables Row Level Security and access policies.
3. `supabase/migrations/003_random_questions_rpc.sql` installs the random-question database function.
4. `supabase/migrations/20260911_academic_setup_permissions.sql` adds the latest academic setup and permission fields.
5. `supabase/seed.sql` inserts sample departments, courses, academic metadata, users, and questions.

For a production deployment, review the seed data and replace sample accounts and content with institution-managed records.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

The project also exposes the following package scripts:

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm start       # Serve the production build
npm run lint    # Run the configured Next.js lint command
```

## Repository Structure

```text
app/
├── (auth)/login/              Authentication screen
├── (dashboard)/               Protected dashboard routes
│   ├── dashboard/             Overview and analytics
│   ├── academic-setup/        Academic configuration
│   ├── question-bank/         Question CRUD and bulk import
│   ├── generate-paper/        Paper builder and preview
│   ├── generated-papers/      Saved paper history
│   ├── departments/           Department management
│   ├── courses/               Course catalog
│   ├── modules/               Syllabus modules
│   ├── course-outcomes/       Course outcome management
│   ├── k-levels/              Cognitive-level management
│   ├── faculty/               Faculty and role management
│   └── settings/              Application settings
├── globals.css                Application and A4 print styles
└── layout.tsx                 Root layout and authentication provider

components/                    Shared UI, layout, question, and paper components
lib/
├── auth-context.tsx           Client authentication state
├── question-generator/        Paper generation and randomization engine
├── supabase/                  Browser and server Supabase clients
└── mock-data.ts               Local fallback data
services/                      Data-access services for questions, papers, analytics, and master data
types/                          Shared TypeScript models
supabase/
├── migrations/                Database schema, RLS, RPC, and permission changes
└── seed.sql                   Sample development data
```

## Data and Security Notes

- Supabase Row Level Security is part of the persistence model; review the policies before deploying to an institution.
- The included seed data is for development and demonstration. Change all sample credentials and remove unnecessary sample data before production use.
- Keep `.env.local` out of source control. The repository should contain only public Supabase configuration placeholders.
- Generated papers store a complete snapshot of the selected questions and layout in `snapshot_json`.
- The question generator reports section availability before generation and tracks used question IDs across the entire paper.

## Contributing

1. Create a feature branch.
2. Make a focused change consistent with the existing TypeScript and Next.js patterns.
3. Run `npm run build` and the relevant checks locally.
4. Open a pull request describing the user-facing behavior and database changes, if any.

## License

No open-source license has been declared yet. Treat this repository as source-available and obtain permission from the project owners before redistributing or using it commercially.