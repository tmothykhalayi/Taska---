💧 TASKA – The Daily Drip Edition (Frontend)
Welcome to the frontend of Taska, a mindful task management application designed to bridge the gap between functional productivity and emotional motivation. Built with the MERN stack, this interface focuses on minimalism, consistency, and gamified rewards.

🚀 Tech Stack
Core: React.js (Vite)

Routing: React Router (Client-side navigation)

Styling: Tailwind CSS (Responsive utility-first CSS)

State Management: Redux Toolkit & RTK Query (Server-state synchronization)

Authentication: JWT (Stored via secure HTTP-only cookies/local state)

Icons & UI: Lucide React

✨ Key Features
1. The Drip Dashboard 📊
A central hub where users can see their Daily Streak and Badge Progress at a glance. It integrates a daily motivational quote to start the day with a positive mindset.

2. Gamified Habit Building 🏆
Streaks: Visual indicators that track consecutive days of task completion.

Badges: Unlocked milestones for 1, 3, 7, and 14-day consistency.

Visual Feedback: Monthly heatmaps and progress charts to visualize productivity trends.

3. Mindful Task Management 📝
Full CRUD operations (Create, Read, Update, Delete).

Priority labeling (Low, Medium, High).

Filtering by category and completion status.

4. Adaptive UI 🌙
Light/Dark Mode: Full support for system preferences or manual toggle.

Responsive: Optimized for students and entrepreneurs on both desktop and mobile devices.

🛠️ Getting Started
Prerequisites
Node.js (v18 or higher)

npm or pnpm

Installation
Install dependencies:

```bash
npm install
```

Create a .env file in the root:

```
VITE_API_URL=http://localhost:8000
VITE_QUOTE_API=https://api.quotable.io/random
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

📁 Project Structure
```
src/
├── assets/              # Images, logos, and global assets
├── components/          # Reusable UI components
│   ├── layout/         # Layout wrappers (Header, Footer, Sidebar)
│   ├── ui/             # Atomic UI components (Button, Card, Input)
│   └── data/           # Component data/constants
├── Dashboards/          # Dashboard pages (Customer, Admin)
│   ├── Customer/       # Customer task & wellness dashboards
│   └── Admin/          # Admin monitoring dashboards
├── features/            # Redux slices & RTK Query APIs
│   ├── Auth/           # Authentication logic (Login, Registration)
│   ├── Tasks/          # Task API calls (CRUD operations)
│   └── Users/          # User slice & API
├── pages/               # Page components (Landing, Login, etc)
├── types/               # TypeScript type definitions
├── app/                 # Redux store configuration
└── index.css            # Global styles with Tailwind CSS
```

🧪 Testing & Validation
To ensure the UI meets the requirements outlined in the methodology:

Usability Testing: Checking for response times under 1s for task updates.

Input Validation: Frontend checks for non-empty titles and valid future dates.