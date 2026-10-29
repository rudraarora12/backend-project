# ⚡ IntelliGrid 2.0 — Interview Intelligence

> **Next-Generation Student Interview Preparation & Campus Placement Intelligence Platform**  
> Built with **React 19**, **Vite**, **React Router v7**, and a **Consolidated Four-Pillar Dark Cyberpunk Architecture**.

---

## 🌟 Executive Overview

**IntelliGrid 2.0 (Interview Intelligence)** is a React/Vite interview-preparation demo with a MongoDB/Express API foundation. Company profiles and bundled examples are sample content; they are not independently verified hiring data or user accounts.

The application has been unified into **EXACTLY FOUR PRIMARY NAVIGATION PILLARS** to eliminate UI clutter while preserving comprehensive placement intelligence, personalized study schedules, peer mocks, and text advisory.

---

## 🏛️ The Four Core Intelligence Pillars

### 1. 🏢 Company Prep (`/company-prep`)
Everything related to researching companies and exploring explicitly illustrative sample interview content in one consolidated section:
- **Company Directory**: Searchable catalog of bundled sample company profiles with category tabs (Product, Fintech, Cloud/AI, Service) and difficulty ratings.
- **Company Interview Intelligence**: Sample topic weightages, recruitment loop examples, and frequently asked problems with direct LeetCode links.
- **Crowdsourced Experiences Feed**: Clearly labeled sample placement reports; they are not user-submitted or independently verified.
- **Universal Question Bank**: Filter problems by domain topic, difficulty, frequency, and company presence.
- **Share Interview Experience**: Multi-step submission wizard with dynamic round builder, difficulty slider, and placement integrity moderation flow.

### 2. ⚡ AI Roadmap (`/ai-roadmap`)
Actionable, personalized preparation schedules based on student goals, current ability, and available daily study time:
- **Customizable Setup**: Tailor by target company (FAANG or General Placement), target role (SDE Intern, SDE-1, Backend, AI/ML), current baseline (Beginner/Intermediate/Advanced), available daily hours (1-2h, 2-4h, 4-6h), and sprint duration (7, 14, 30 Days).
- **Rule-Based Algorithmic Planner (Demo Mode)**: Generates structured daily missions respecting time budgets with topic focus, problem checklists, and revision/mock milestones.
- **Integrated Pomodoro Focus Timer**: Built-in 25-minute study intervals, 5-minute rest breaks, audio alert, and session counter.
- **Progress Tracking & Readiness Score**: Persistent completion state in `localStorage` with dynamic percentage calculation.

### 3. 🤝 Mock Interviews (`/mock-interviews`)
1-on-1 interview practice APIs for verified experts; the bundled UI profiles are samples only:
- **Mentor Directory**: Bundled profiles are illustrative demo data, not verified professionals; live expert listings require verified accounts in the configured database.
- **Booking Flow**: Database-backed booking APIs reserve published availability atomically. The current demo interface does not publish real availability or charge payments.
- **My Bookings**: View upcoming and completed sessions with direct launch actions.
- **Simulated Video Room (Demo)**: Media controls (mic/camera/screen-share), elapsed timer, collaborative code editor/scratchpad with language selection, terminal execution console, problem prompt, and rating debrief modal for structured peer evaluation.

### 4. 💬 Expert Chat (`/expert-chat`)
Direct 1-on-1 text advisory with campus alumni and placed mentors:
- **Searchable Expert Sidebar**: Filter mentors by company (Amazon, Google, Microsoft, Goldman Sachs, Uber).
- **Conversation Thread**: Message bubbles distinguishing student and expert, timestamps, and domain-specific initial guidance.
- **Message Composer**: Multiline composer with `Enter` to send, `Shift+Enter` for a new line, validation, and sending state.
- **Local Demo Storage**: The current chat page stores local-only histories in `localStorage`; the API also provides authenticated, participant-authorized REST and Socket.IO chat for configured expert accounts.

---

## 🔒 Contextual & Account Utilities
- **My Target Dashboard (`/dashboard`)**: Active company track switcher (Amazon/Google/Microsoft), GitHub-style 52-week activity heatmap, and practice table.
- **Student Profile & Bookmarks (`/profile`)**: Manage profile details and categorized saved companies, experiences, and questions.
- **Moderation Desk (`/admin`)**: API-backed queue to approve or flag submitted reports; only server-authorized administrator accounts can use moderation actions.
- **Authentication Portal (`/login`, `/register`)**: Database-backed email/password accounts with HTTP-only sessions. Social sign-in is unavailable until an OAuth provider is configured.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 (`^19.0.0`) | Modern React hooks, Context API, Zero bloated component libraries |
| **Tooling & Bundler** | Vite (`^6.2.0`) | Lightning-fast HMR and optimized production builds |
| **Routing** | React Router v7 (`^7.2.0`) | Consolidated 4-pillar routing, legacy route redirects with parameter preservation |
| **Canvas & VFX** | HTML5 Canvas API | Interactive floating constellation particles & 3D card tilt parallax |
| **Styling & Theme** | Custom CSS3 & CSS Variables | Dark Cyberpunk / Deep Glassmorphism (`#00D4FF` Electric Cyan, `#6C63FF` Purple) |
| **Typography** | Google Fonts | *Plus Jakarta Sans* (UI & Headings) and *JetBrains Mono* (Code & Metrics) |
| **State & Persistence** | React Context + LocalStorage + MongoDB | Server sessions and API-backed identity; selected demo UI state remains local |

---

## MongoDB API Setup (Windows PowerShell)

Requirements: Node.js 20+, npm, and a reachable MongoDB database. The project targets MongoDB Atlas or any replica-set-compatible MongoDB deployment; the API does not include a MongoDB server. Because Prisma's MongoDB connector relies on the configured URI and server topology, the backend should only start when the project-root `.env` contains a valid `MONGODB_URI` and matching database name.

1. Install dependencies and create a local environment file from the safe template:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

2. Configure `.env` before starting the backend. Update `MONGODB_URI` to your Atlas connection string (or another MongoDB deployment) and set `SESSION_SECRET` to a new value generated with:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64'))"
   ```

   Keep `.env` private and never place database credentials in frontend variables or Postman files.

3. Generate the MongoDB Prisma client and synchronize the schema with the active database:

   ```powershell
   npm run db:generate
   npm run db:push
   ```

   `db:push` is the active MongoDB schema setup path. Historical PostgreSQL SQL migration files remain under `prisma/migrations` as a backup/reference and must not be applied to MongoDB. The project does not run destructive resets or delete any existing data.

4. Start the API and frontend in separate PowerShell terminals. From the project root, start the API with `npm run dev:api` and the frontend with `npm run dev`. Alternatively, when your terminal is inside `backend`, `npm run dev` starts only the API:

   ```powershell
   # From the project root:
   npm run dev:api
   ```

   ```powershell
   # From the backend folder:
   Set-Location backend
   npm run dev
   ```

   ```powershell
   # Start the frontend separately, from the project root:
   Set-Location ..
   npm run dev
   ```

   The API listens at `http://localhost:3001` by default. Existing routes stay under `/api`; check `http://localhost:3001/api/health` and `http://localhost:3001/api/ready`. Startup waits for a successful MongoDB ping before accepting requests. Shutdown closes the HTTP/Socket.IO servers and Prisma connection.

### Postman

Import `postman/IntelliGrid.postman_collection.json` and `postman/local.postman_environment.json`. Select the `IntelliGrid Local` environment and set `testPassword` to a unique password. Postman retains the HTTP-only session cookie automatically; this API does not use bearer tokens. Requests exercise registration/login/current-user/logout, protected-route rejection, experiences, companies/questions, roadmaps/progress, booking validation/conflicts, and messages.

A successful booking and live message flow require an operator-provisioned, verified expert, a future availability slot, and a conversation. The included sample seed intentionally does not create verified experts or publish availability. The experience-submission endpoint returns a pending moderation record; public retrieval stays unavailable until an administrator approves it. No default admin account is created.

The API includes profile/password updates, experience moderation, bookmarks, rule-based persisted roadmaps, mentor applications/availability/bookings/reviews, and participant-authorized REST/Socket.IO messaging. OAuth, email-based password recovery, payments, production deployment hardening, and real video calls are not configured. Several frontend demo areas remain local: roadmap checklist progress, profile bookmarks, Expert Chat, and the simulated video room.

### Validation

```powershell
npm run db:generate
npm run test:api
npm run build
```

Live database tests and schema synchronization require a running replica-set MongoDB and must only be run against the dedicated development/test database configured in `.env`.

---

## 📂 Project Directory Structure

```
backend-project/
├── index.html                      # HTML5 entry with Google Fonts & viewport meta
├── package.json                    # Dependencies & build scripts
├── backend/
│   └── package.json                # API-only dev/start scripts (npm run dev here starts the API)
├── vite.config.js                  # Vite configuration with React plugin
├── src/
│   ├── main.jsx                    # React root mount point (StrictMode)
│   ├── App.jsx                     # 4 consolidated primary routes + legacy redirects
│   ├── index.css                   # Global reset & baseline layout
│   │
│   ├── context/
│   │   └── AppContext.jsx          # User session, login/logout, toasts, modals, bookmark toggles
│   │
│   ├── services/
│   │   ├── experienceService.js    # Experience querying, LeetCode matching, submission persistence
│   │   └── connectService.js       # Mentor querying, booking slots creation, mock reviews
│   │
│   ├── data/
│   │   ├── companies.js            # 12+ company profiles, patterns, frequently asked questions
│   │   ├── experiences.js          # Historical interview experiences with round logs
│   │   ├── preparation.js          # Topic banks, customizable roadmap generator (7/14/30 days)
│   │   ├── interviewers.js         # Peer mentors & candidates available for mock interviews & chat
│   │   ├── questions.js            # Universal question repository with difficulty & frequency tags
│   │   ├── dashboard.js            # Track configs (Amazon, Google, Microsoft) & default challenges
│   │   └── users.js                # Default user profile, admin moderation queue, bookmarks
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js      # Synchronized localStorage state hook
│   │   └── useScrollReveal.js      # IntersectionObserver hook for subtle on-scroll transitions
│   │
│   ├── components/
│   │   ├── layout/                 # Navbar (Exactly 4 primary items), Footer, Preloader
│   │   ├── effects/                # ParticleBackground, GlobalBackground, CardTilt
│   │   ├── common/                 # Icons, Modal, Toast, Badge, ProgressBar, ScrollReveal
│   │   ├── landing/                # HologramHero, StatsSection
│   │   ├── company/                # CompanyCard, CompanyGrid, InterviewPattern
│   │   ├── experience/             # ExperienceCard, ExperienceRound, HelpfulVoteBtn
│   │   ├── preparation/            # PrepDay, PrepProgress, PomodoroTimer
│   │   ├── dashboard/              # TrackSwitcher, PracticeTable, Heatmap, BookmarksList
│   │   ├── connect/                # InterviewerCard, BookingModal
│   │   ├── questions/              # QuestionCard
│   │   ├── auth/                   # LiveFeed
│   │   └── submit/                 # StepIndicator, RoundBuilder
│   │
│   ├── pages/                      # 4 Primary Pillars + Landing & Utility Views
│   │   ├── CompanyPrep.jsx         # Pillar 1: Directory, Intelligence, Experiences, Questions, Submit
│   │   ├── AiRoadmap.jsx           # Pillar 2: Setup Form, Daily Missions, Pomodoro Timer
│   │   ├── MockInterviews.jsx      # Pillar 3: Mentor Directory, Booking Flow, Video Room
│   │   ├── ExpertChat.jsx          # Pillar 4: 1-on-1 Direct Text Advisory Chat
│   │   ├── Landing.jsx             # Public Home
│   │   ├── Dashboard.jsx           # Student Target Dashboard
│   │   ├── Profile.jsx             # Student Profile & Bookmarks
│   │   ├── Admin.jsx               # Placement Moderation Desk
│   │   ├── Login.jsx               # Unified Auth Portal
│   │   └── Register.jsx            # Sign Up Redirect
│   │
│   └── styles/                     # Modular pure CSS stylesheets
│       ├── global.css
│       ├── auth.css
│       ├── landing.css
│       ├── company-prep.css
│       ├── expert-chat.css
│       ├── companies.css
│       ├── company.css
│       ├── experiences.css
│       ├── experience.css
│       ├── preparation.css
│       ├── dashboard.css
│       ├── connect.css
│       └── submit.css
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm** or **yarn**

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rudraarora12/backend-project.git
   cd backend-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
