# ⚡ IntelliGrid 2.0 — Interview Intelligence

> **Next-Generation Student Interview Preparation & Campus Placement Intelligence Platform**  
> Built with **React 19**, **Vite**, **React Router v7**, and a **Consolidated Four-Pillar Dark Cyberpunk Architecture**.

---

## 🌟 Executive Overview

**IntelliGrid 2.0 (Interview Intelligence)** is an end-to-end web platform engineered for engineering students, campus candidates, and software engineers preparing for Tier-1 product companies, fintech firms, and FAANG recruitment drives.

The application has been unified into **EXACTLY FOUR PRIMARY NAVIGATION PILLARS** to eliminate UI clutter while preserving comprehensive placement intelligence, personalized study schedules, peer mocks, and text advisory.

---

## 🏛️ The Four Core Intelligence Pillars

### 1. 🏢 Company Prep (`/company-prep`)
Everything related to researching companies, understanding hiring bars, and analyzing real rounds in one consolidated section:
- **Company Directory**: Searchable catalog of 650+ tech leaders with category tabs (Product, Fintech, Cloud/AI, Service) and difficulty ratings.
- **Company Interview Intelligence**: Historical topic weightages (% DSA, System Design, DBMS, OS, OOP, Behavioral), recruitment loop architecture, culture notes, and frequently asked problems with direct LeetCode links.
- **Crowdsourced Experiences Feed**: Student placement logs filterable by outcome (Selected/Rejected), recruitment drive type, and difficulty, with nested round-by-round breakdown views and helpful upvotes.
- **Universal Question Bank**: Filter problems by domain topic, difficulty, frequency, and company presence.
- **Share Interview Experience**: Multi-step submission wizard with dynamic round builder, difficulty slider, and placement integrity moderation flow.

### 2. ⚡ AI Roadmap (`/ai-roadmap`)
Actionable, personalized preparation schedules based on student goals, current ability, and available daily study time:
- **Customizable Setup**: Tailor by target company (FAANG or General Placement), target role (SDE Intern, SDE-1, Backend, AI/ML), current baseline (Beginner/Intermediate/Advanced), available daily hours (1-2h, 2-4h, 4-6h), and sprint duration (7, 14, 30 Days).
- **Rule-Based Algorithmic Planner (Demo Mode)**: Generates structured daily missions respecting time budgets with topic focus, problem checklists, and revision/mock milestones.
- **Integrated Pomodoro Focus Timer**: Built-in 25-minute study intervals, 5-minute rest breaks, audio alert, and session counter.
- **Progress Tracking & Readiness Score**: Persistent completion state in `localStorage` with dynamic percentage calculation.

### 3. 🤝 Mock Interviews (`/mock-interviews`)
1-on-1 interview practice with verified placed seniors from top tech enterprises:
- **Mentor Directory**: Searchable mentor profiles with company badges, ratings, hourly rates, available slots, and focus topics.
- **Booking Flow**: Select date, time slot, and session type with instant booking validation and storage.
- **My Bookings**: View upcoming and completed sessions with direct launch actions.
- **Simulated Video Room (Demo)**: Media controls (mic/camera/screen-share), elapsed timer, collaborative code editor/scratchpad with language selection, terminal execution console, problem prompt, and rating debrief modal for structured peer evaluation.

### 4. 💬 Expert Chat (`/expert-chat`)
Direct 1-on-1 text advisory with campus alumni and placed mentors:
- **Searchable Expert Sidebar**: Filter mentors by company (Amazon, Google, Microsoft, Goldman Sachs, Uber).
- **Conversation Thread**: Message bubbles distinguishing student and expert, timestamps, and domain-specific initial guidance.
- **Message Composer**: Multiline composer with `Enter` to send, `Shift+Enter` for a new line, validation, and sending state.
- **Local Demo Storage**: Offline encrypted chat history saved locally in `localStorage` per user and mentor.

---

## 🔒 Contextual & Account Utilities
- **My Target Dashboard (`/dashboard`)**: Active company track switcher (Amazon/Google/Microsoft), GitHub-style 52-week activity heatmap, and practice table.
- **Student Profile & Bookmarks (`/profile`)**: Manage profile details and categorized saved companies, experiences, and questions.
- **Moderation Desk (`/admin`)**: Queue to verify, index, or flag crowdsourced placement reports.
- **Authentication Portal (`/login`, `/register`)**: Unified dark cyberpunk split-card authentication with Google, GitHub, and Campus SSO simulation.

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
| **State & Persistence** | React Context + LocalStorage | Synchronized session, bookmarks, practice checklist, chat history, and toast alerts |

---

## 📂 Project Directory Structure

```
backend-project/
├── index.html                      # HTML5 entry with Google Fonts & viewport meta
├── package.json                    # Dependencies & build scripts
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
