💧 TASKA – The Daily Drip Edition (Frontend)
Welcome to the frontend of Taska, a mindful task management application designed to bridge the gap between functional productivity and emotional motivation. Built with the MERN stack, this interface focuses on minimalism, consistency, and gamified rewards.

🚀 Tech Stack
Core: React.js (Vite)

Routing: TanStack Router (Standardized navigation and nested layouts)

Styling: Tailwind CSS (Responsive utility-first CSS)

State Management: TanStack Query (Server-state synchronization)

Authentication: JWT (Stored via secure HTTP-only cookies/local state)

Icons & UI: Lucide React & Headless UI

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

npm or yarn

Installation
Navigate to the client directory:

Bash
cd taska-client
Install dependencies:

Bash
npm install
Create a .env file in the root:

🧪 Testing & Validation
To ensure the UI meets the requirements outlined in the methodology:

Usability Testing: Checking for response times under 1s for task updates.

Input Validation: Frontend checks for non-empty titles and valid future dates.