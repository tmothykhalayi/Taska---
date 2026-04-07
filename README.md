# Taska - Task Management Application with Gamification
![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.14.0-CA4245?logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.3-646cff?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764abc?logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Latest-38b2ac?logo=tailwind-css&logoColor=white)

Welcome to Taska - A modern React application built with TypeScript and React Router, designed to help students, professionals, and entrepreneurs master their tasks with psychological motivation mechanisms including gamification, badges, and daily inspirational quotes.

## 📋 Table of Contents

- [System Overview](#-system-overview)
- [System Flow](#-system-flow)
- [Architecture](#-architecture)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Routing](#-routing-with-react-router)
- [State Management](#-state-management)
- [UI Components](#-ui-components)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Styling](#-styling)
- [Linting & Formatting](#-linting--formatting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 🏢 System Overview

Taska is a modern React application providing an intuitive interface for comprehensive task management. The application empowers users to organize tasks, track progress, earn rewards through gamification, and receive daily motivation through inspirational quotes.

### Key Technologies:

- **Framework:** React 19.2.4 with TypeScript 5.9.3
- **Routing:** React Router 7.14.0 for client-side routing
- **Build Tool:** Vite 8.0.3 for fast development and building
- **State Management:** Redux Toolkit 2.11.2 with RTK Query
- **Animations:** Framer Motion 12.38.0 for smooth UI transitions
- **UI Components:** Custom components with Lucide Icons 1.7.0
- **Styling:** Tailwind CSS with modern CSS features
- **API Client:** Axios for HTTP requests

## 🧩 System Flow

High-level flow diagrams for core user roles in Taska.

### User Flow

Users can browse and manage their tasks, track completion progress, earn badges and rewards for completing tasks, and receive daily inspirational quotes for motivation.

### Admin Flow

Administrators manage users, track application analytics, monitor task completion trends, and manage reward system via the admin dashboard.

## Roles In Taska

Taska has two roles in the system:

1. Tasker
2. Admin

### Role Feature Access

| Feature | Tasker | Admin |
|---------|--------|-------|
| Create Tasks | ✅ | ✅ |
| Manage Streaks | ✅ | ✅ |
| Earn Badges | ✅ | ✅ |
| View Quotes | ✅ | ✅ |
| Manage All Users | ❌ | ✅ |
| Manage Quotes | ❌ | ✅ |
| Manage Badges | ❌ | ✅ |
| System Admin Panel | ❌ | ✅ |

## 🏗️ Architecture

### Project Structure

```text
src/
├── main.tsx                     # Application entry point
├── App.tsx                      # Root application component with routes
├── index.css                    # Global styles
├── pages/                       # Page components
│   ├── Landing.tsx              # Home/landing page with features
│   ├── Login.tsx                # User login page
│   ├── Register.tsx             # User registration page
│   ├── About.tsx                # About page
│   ├── Contact.tsx              # Contact page
│   └── Locations.tsx            # Task Dashboard with task management
├── Dashboards/                  # Dashboard pages
│   ├── Tasker/                  # Tasker dashboard
│   │   ├── Dashboard.tsx        # Tasker main dashboard
│   │   ├── MiningCheck-in.tsx   # Morning motivation check-in
│   │   ├── NightCheck-in.tsx    # Night reflection check-in
│   │   ├── MindMap.tsx          # Task mind mapping
│   │   ├── Session.tsx          # Task sessions
│   │   └── bot.tsx              # Chat bot assistant
│   └── Admin/                   # Admin dashboard
│       ├── Dashboard.tsx        # Admin main dashboard
│       └── conversation.tsx     # Admin conversations
├── components/                  # Reusable UI components
│   ├── ui/                      # Basic UI components (Button, Input, Card, etc.)
│   ├── layout/                  # Layout components (Header, Footer, etc.)
│   ├── ChatBot.tsx              # Chat bot component
│   ├── LocationCard.tsx         # Task/Coaching card component
│   └── BookingModal.tsx         # Session booking modal
├── features/                    # Redux features
│   ├── Auth/                    # Authentication slice and API
│   ├── Tasks/                   # Tasks API (tasksApi.ts)
│   ├── Users/                   # Users slice and API
│   └── index/                   # Additional features
├── app/                         # Redux store configuration
│   └── store.ts                 # Store setup
### React Router Configuration

The application uses React Router for client-side routing:

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskerDashboard from './Dashboards/Tasker/Dashboard';
import AdminDashboard from './Dashboards/Admin/Dashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard/tasker" 
          element={
            <ProtectedRoute>
              <TaskerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```ath: '$vehicleId',
  parseParams: (params) => ({
    vehicleId: z.string().parse(params.vehicleId),
  }),
  component: VehicleDetailPage,
});
```
## ✨ Features

### User-Facing Features
- **Task Dashboard:** Create, view, edit, and complete tasks with smart filtering
- **Task Management:** Organize tasks by priority (high, medium, low), status (pending, in-progress, completed), and categories
- **Progress Tracking:** Real-time completion rates and task statistics (completed, in-progress, pending counts)
- **Gamification System:** Earn badges and rewards for completing tasks and maintaining streaks
- **Daily Inspiration:** Daily inspirational quotes to boost motivation and psychological well-being
- **User Authentication:** Secure login/registration with JWT tokens
- **Personal Dashboard:** Track progress, view achievements, and manage profile
- **Responsive Design:** Mobile-first responsive design optimized for all devices

### Engagement Features
- **Morning Check-ins:** Start your day with motivation and task planning
- **Night Check-ins:** Reflect on achievements and plan for tomorrow
- **Mind Mapping:** Visualize task relationships and dependencies
- **Chat Bot Assistant:** AI-powered task guidance and motivation support
- **Badges & Rewards:** Unlock achievements for task completion milestones

### Admin Features
- **Dashboard Analytics:** Charts and metrics for user engagement and task completion insights
- **User Management:** Admin controls for user accounts and activity
- **Task Monitoring:** View and monitor all user tasks and progress
- **Reporting System:** Task completion reports and engagement analytics
- **System Management:** Configure gamification rules and reward system

### Technical Features
- **Type-Safe Development:** Full TypeScript integration for robust code
- **State Management:** Centralized state with Redux Toolkit
- **API Integration:** RTK Query for efficient, cached data fetching
- **Smooth Animations:** Framer Motion for delightful UI transitions
- **Error Boundaries:** Graceful error handling and recovery
- **Loading States:** Skeleton loaders and loading indicators
- **Icon Library:** Comprehensive Lucide React icons for intuitive UI

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- pnpm package manager

### Step-by-Step Setup
1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Taska.git
cd Taska
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment configuration**
```bash
cp .env.example .env
## 🧭 Routing with React Router

### Route Configuration
React Router provides declarative routing for the application:

```typescript
// Protected Route wrapper
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useSelector((state: RootState) => state.auth);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

### Navigation
```typescript
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate('/dashboard/tasker');
  };
  
  return <button onClick={handleNavigate}>Go to Dashboard</button>;
}
```

### Adding Links
```tsx
import { Link } from "react-router-dom";

// In your JSX
<Link to="/about">About</Link>
<Link to="/contact">Contact</Link>
```
### Using A Layout
In the File Based Routing setup, the layout is located in `src/routes/__root.tsx`. Example:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```
## 🗃️ State Management

### Redux Store Structure
```typescript
// store/slices/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
```typescript
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/UserAuthSlice';
import userReducer from '../features/Users/userSlice';
import { usersAPI } from '../features/Users/usersApi';
import { tasksAPI } from '../features/Tasks/tasksApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    [tasksAPI.reducerPath]: tasksAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      usersAPI.middleware,
      tasksAPI.middleware
    ),
});
```

### Task Card Component Example
```tsx
export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };
  
  return (
    <div className="rounded-lg border shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      <div className="flex justify-between items-end">
        <span className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        <button 
          onClick={() => onComplete(task.id)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Complete
        </button>
      </div>
    </div>
  );
};
```
## 🔌 API Integration

### RTK Query Setup for Tasks
```typescript
// features/Tasks/tasksApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export const tasksAPI = createApi({
  reducerPath: 'tasksAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/tasks',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserTasks: builder.query<Task[], string>({
      query: (userId) => `/user/${userId}`,
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: '/',
        method: 'POST',
        body: task,
      }),
    }),
    updateTask: builder.mutation<Task, Task>({
      query: (task) => ({
        url: `/${task.id}`,
        method: 'PUT',
        body: task,
      }),
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetUserTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksAPI;
```
## 🚀 Deployment

### Build for Production
```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

### Environment Variables for Production
```env
VITE_API_URL="https://api.taska.example.com"
VITE_APP_NAME="Taska"
```

### Deployment Platforms

#### Vercel
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### Netlify
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "pnpm build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use React Router for all navigation and client-side routing
- Write tests for new components and features
- Follow the established component structure
- Use Tailwind CSS and Framer Motion for styling and animations
- Update documentation for new features
- Test task management workflows thoroughly

### Commit Message Convention
```
feat: add task creation modal
fix: resolve task filtering issue
docs: update task management documentation
style: improve task dashboard responsive design
refactor: simplify task state management
test: add tests for task completion feature
```

## 📞 Support

For support regarding Taska:
- Check the documentation and README first
- Review existing GitHub Issues
- Create a new issue with detailed description
- Include steps to reproduce any bugs
- Follow the issue template when reporting problems

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Taska - Master Your Tasks, Transform Your Life**

Built with React 19.2.4, TypeScript 5.9.3, React Router 7.14.0, Redux Toolkit 2.11.2, Framer Motion 12.38.0, and Tailwind CSS
