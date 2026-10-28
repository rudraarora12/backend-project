# ⚡ IntelliGrid — Interview Intelligence

> **Next-Generation Student Interview Preparation & Campus Placement Intelligence Platform**  
> Built with **React 19**, **Vite**, **React Router v7**, and a **Custom Dark Cyberpunk / Deep Glassmorphism Design System**.

---

## 🌟 Executive Overview

**IntelliGrid (Interview Intelligence)** is an end-to-end web platform engineered for engineering students, campus candidates, and aspiring software engineers preparing for Tier-1 product companies, fintech firms, FAANG, and tech campus placement drives.

It bridges the preparation gap by combining verified crowdsourced interview experiences, predictive topic weightage analytics, adaptive day-by-day study sprints, real-time peer mock interviews with a simulated video suite, and a community question repository.

---

## 🚀 Key Features

### 1. 🏢 Placement Intelligence & Verified Experiences
- **650+ Company Coverage**: In-depth profiles for Google, Amazon, Microsoft, Uber, Atlassian, Goldman Sachs, and more.
- **Round-by-Round Breakdown**: Granular logs covering Online Assessments (OA), Technical Coding, System Design / CS Fundamentals, and Hiring Manager / Leadership Principles.
- **Filter & Search Engine**: Filter by company tier, role (SDE-1, Intern, Backend), outcome (Selected, Rejected), and interview difficulty.
- **Community Upvotes & Bookmarks**: Save essential interview debriefs and upvote helpful community submissions.

### 2. 📊 Predictive Topic & Pattern Analytics
- **Exact Weightage Visualizations**: Interactive percentage distribution breakdown for DSA, System Design, DBMS, Operating Systems, OOPs, and Behavioral rounds per company.
- **Hiring Trends & Focus Areas**: Learn what each company prioritizes before stepping into the interview.

### 3. 🎯 Adaptive Day-by-Day Preparation Sprints
- **Customizable Roadmaps**: Choose between **7-Day Rapid Sprint**, **14-Day Targeted Prep**, or **30-Day Comprehensive Mastery**.
- **LeetCode & GFG Deep Links**: Direct problem links curated for each mission.
- **Built-in Pomodoro Focus Timer**: 25-minute study intervals, 5-minute rest breaks, audio chime notifications, and session counters.
- **Readiness Gauge**: Real-time readiness calculation based on completed daily checklists.

### 4. 🤝 Peer & Mentor Mock Connect (Interview Connect)
- **Verified Mentor Network**: Connect with candidates and senior engineers who have already cleared target companies.
- **Slot Booking Flow**: Schedule 1-on-1 mock interviews, resume critiques, and system design drills.
- **Simulated Video Interview Suite**:
  - Full-duplex simulated media room with mic, camera, screen-share, and layout toggles.
  - Interactive collaborative scratchpad / code editor with language selection.
  - Real-time rating debrief modal for structured peer evaluation.

### 5. 💡 Interactive Question Bank
- Real interview questions ranked by report frequency and tagged with difficulty (Easy / Medium / Hard).
- Filterable by topic (Arrays, Dynamic Programming, Graphs, Trees, System Design, SQL).
- Direct external links to LeetCode and GeeksforGeeks solutions.

### 6. 🔒 Modern Split-Card Auth Experience
- Dual-mode Sign In / Sign Up portal with seamless tab switching.
- University SSO simulation (Google, GitHub, Campus SSO).
- Live placement feed ticker showing real-time community activity and offer announcements.

### 7. 📈 Student Portal & Personal Dashboard
- **Target Company Track Switcher**: Toggle your active preparation goal between Amazon, Google, Microsoft, etc.
- **GitHub-style 52-Week Practice Heatmap**: Track your daily consistency and coding streaks.
- **Practice Challenge Checklist**: Mark questions as completed, in-progress, or flagged.
- **Categorized Bookmarks**: Easy access to saved companies, questions, and reports.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 (`^19.0.0`) | Modern React hooks, Context API, Zero bloated component libraries |
| **Tooling & Bundler** | Vite (`^6.2.0`) | Lightning-fast HMR and optimized production builds |
| **Routing** | React Router v7 (`^7.2.0`) | Declarative client-side routing, URL query state, automatic scroll restoration |
| **Canvas & VFX** | HTML5 Canvas API | Interactive floating constellation particles & 3D card tilt parallax |
| **Styling & Theme** | Custom CSS3 & CSS Variables | Dark Cyberpunk / Deep Glassmorphism (`#00D4FF` Electric Cyan, `#6C63FF` Purple) |
| **Typography** | Google Fonts | *Plus Jakarta Sans* (UI & Headings) and *JetBrains Mono* (Code & Metrics) |
| **State & Persistence** | React Context + LocalStorage | Synchronized session, bookmarks, practice checklist, and toast notifications |

---

## 📂 Project Structure

```
backend-project/
├── index.html                      # HTML5 entry with Google Fonts & viewport meta
├── package.json                    # Dependencies & build scripts
├── vite.config.js                  # Vite configuration with React plugin
├── src/
│   ├── main.jsx                    # React root mount point (StrictMode)
│   ├── App.jsx                     # Route definitions, layout providers, background effects
│   ├── index.css                   # Global reset & baseline layout
│   │
│   ├── context/
│   │   └── AppContext.jsx          # User session, login/logout, toasts, modals, bookmark toggles
│   │
│   ├── services/
│   │   ├── experienceService.js    # Experience querying, LeetCode matching, submission persistence
│   │   └── connectService.js       # Mentor querying, booking slots creation, mock session reviews
│   │
│   ├── data/
│   │   ├── companies.js            # 12+ company profiles, patterns, frequently asked questions
│   │   ├── experiences.js          # Detailed historical interview experiences with round logs
│   │   ├── preparation.js          # Topic banks, daily sprint generator (7/14/30 days), priority tips
│   │   ├── interviewers.js         # Peer mentors & candidates available for mock interviews
│   │   ├── questions.js            # Universal question repository with difficulty & frequency tags
│   │   ├── dashboard.js            # Track configs (Amazon, Google, Microsoft) & default challenges
│   │   └── users.js                # Default user profile, admin moderation queue, bookmark storage
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js      # Synchronized localStorage state hook
│   │   └── useScrollReveal.js      # IntersectionObserver hook for subtle on-scroll transitions
│   │
│   ├── components/
│   │   ├── layout/                 # Navbar, Footer, Preloader
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
│   ├── pages/                      # All 16 complete page views
│   │   ├── Landing.jsx
│   │   ├── Companies.jsx
│   │   ├── CompanyDetail.jsx
│   │   ├── Experiences.jsx
│   │   ├── ExperienceDetail.jsx
│   │   ├── Preparation.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Questions.jsx
│   │   ├── InterviewConnect.jsx
│   │   ├── CandidateProfile.jsx
│   │   ├── VideoSession.jsx
│   │   ├── Submit.jsx
│   │   ├── Admin.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   └── styles/                     # Modular pure CSS stylesheets
│       ├── global.css
│       ├── auth.css
│       ├── landing.css
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

### Installation

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
   Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 🎨 Design System & Color Tokens

- **Background Base**: `#070B14` (Deep Space Obsidian)
- **Surface Elevation**: `#0D1527` / `#131E3A` with Glassmorphism blur
- **Primary Accent**: `#00D4FF` (Electric Cyan)
- **Secondary Accent**: `#6C63FF` (Cyber Violet)
- **Success / Selected**: `#00F5A0` (Emerald Glow)
- **Warning / Medium**: `#FFB800` (Amber Flare)
- **Danger / Hard**: `#FF4D6D` (Neon Crimson)
- **Font Stack**: `Plus Jakarta Sans`, `Inter`, `JetBrains Mono`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
