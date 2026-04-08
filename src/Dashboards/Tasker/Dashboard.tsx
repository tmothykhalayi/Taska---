import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle,
  Flame,
  ListTodo,
  Moon,
  Plus,
  Sparkles,
  Sunrise,
  Trash2,
  Trophy,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../app/store';
import { clearUser } from '../../features/Auth/UserAuthSlice';
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetUserTasksQuery,
  useUpdateTaskMutation,
} from '../../features/Tasks/tasksApi';

type TaskCategory = 'work' | 'study' | 'personal';
type SortBy = 'priority' | 'status' | 'category' | 'dueDate';
type DashboardSection = 'overview' | 'tasks' | 'progress' | 'rewards' | 'inspiration' | 'checkins' | 'mindmap';

type TaskItem = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  reminder: boolean;
  dependsOnId?: number;
};

const categoryValues: TaskCategory[] = ['work', 'study', 'personal'];

const sectionItems: Array<{ id: DashboardSection; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Task Management' },
  { id: 'progress', label: 'Progress & Metrics' },
  { id: 'rewards', label: 'Gamification' },
  { id: 'inspiration', label: 'Daily Inspiration' },
  { id: 'checkins', label: 'Check-ins' },
  { id: 'mindmap', label: 'Mind Mapping' },
];

const priorityRank: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
const statusRank: Record<TaskStatus, number> = { pending: 1, 'in-progress': 2, completed: 3 };

const quotePool = [
  'Progress, not perfection. Finish one important task first.',
  'Tiny, consistent wins build unstoppable momentum.',
  'Discipline is a bridge between goals and achievements.',
  'Plan your day. Protect your focus. Finish with intention.',
  'Your streak is a promise you keep to yourself.',
];

const toTaskCategory = (value?: string | null): TaskCategory => {
  if (value === 'study') return 'study';
  if (value === 'personal') return 'personal';
  return 'work';
};

const todayIso = new Date().toISOString().slice(0, 10);

const normalizeTasks = (tasks: Task[]): TaskItem[] => {
  return tasks.map((task, index) => ({
    id: Number(task.id),
    title: task.title || 'Untitled Task',
    description: task.description || '',
    status: task.status || (task.completed ? 'completed' : 'pending'),
    priority: task.priority || 'medium',
    category: toTaskCategory(task.category),
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : todayIso,
    reminder: Boolean(task.dueDate),
    dependsOnId: index > 0 ? Number(tasks[index - 1].id) : undefined,
  }));
};

const quoteOfDay = () => {
  const dayIndex = new Date().getDate() % quotePool.length;
  return quotePool[dayIndex];
};

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userAuth);
  const currentUserId = Number(user?.user_id ?? 0);
  const displayName = useMemo(() => {
    const rawName = (user?.name || '').trim();
    if (!rawName) return 'User';

    const normalized = rawName.replace(/\s+/g, ' ');
    const tokens = normalized.split(' ');
    const deduped = tokens
      .filter((token, index) => index === 0 || token.toLowerCase() !== tokens[index - 1].toLowerCase())
      .join(' ');

    if (deduped.includes('@')) {
      return deduped.split('@')[0];
    }

    return deduped;
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskError, setTaskError] = useState('');

  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TaskCategory>('all');
  const [sortBy, setSortBy] = useState<SortBy>('priority');

  const [taskForm, setTaskForm] = useState<Omit<TaskItem, 'id'>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'work',
    dueDate: '',
    reminder: false,
    dependsOnId: undefined,
  });

  const [morningCheckIn, setMorningCheckIn] = useState({
    intentions: 'Finish my top-2 tasks before lunch.',
    topPriority: 'Complete my main work task',
    done: false,
  });

  const [nightCheckIn, setNightCheckIn] = useState({
    reflection: 'I stayed focused and reduced context switching.',
    nextPlan: 'Start with one high-priority task at 8:00 AM.',
    done: false,
  });

  const { data: apiTasks = [], isLoading, isFetching } = useGetUserTasksQuery(currentUserId);
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks = useMemo(() => normalizeTasks(apiTasks), [apiTasks]);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const statusOk = statusFilter === 'all' || task.status === statusFilter;
      const priorityOk = priorityFilter === 'all' || task.priority === priorityFilter;
      const categoryOk = categoryFilter === 'all' || task.category === categoryFilter;
      return statusOk && priorityOk && categoryOk;
    });

    result.sort((a, b) => {
      if (sortBy === 'priority') return priorityRank[b.priority] - priorityRank[a.priority];
      if (sortBy === 'status') return statusRank[a.status] - statusRank[b.status];
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const metrics = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const total = tasks.length;
    const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);
    const streak = Math.max(1, Math.min(30, completed + inProgress));
    const points = completed * 10 + tasks.filter((t) => t.priority === 'high' && t.status === 'completed').length * 5;
    return { completed, pending, inProgress, total, completionPct, streak, points };
  }, [tasks]);

  const weeklyBars = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((day, index) => ({ day, value: Math.min(100, ((metrics.completed + index) % 7) * 14 + 12) }));
  }, [metrics.completed]);

  const badges = useMemo(() => {
    const completedHigh = tasks.filter((t) => t.status === 'completed' && t.priority === 'high').length;
    return [
      { name: 'Starter', unlocked: metrics.completed >= 3, rule: 'Complete 3 tasks' },
      { name: 'Focus Runner', unlocked: metrics.streak >= 5, rule: 'Maintain 5-day streak' },
      { name: 'Priority Pro', unlocked: completedHigh >= 5, rule: 'Complete 5 high-priority tasks' },
    ];
  }, [metrics.completed, metrics.streak, tasks]);

  const resetForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: 'work',
      dueDate: '',
      reminder: false,
      dependsOnId: undefined,
    });
    setEditingTaskId(null);
    setTaskError('');
  };

  const handleSaveTask = async () => {
    setTaskError('');

    if (!taskForm.title.trim()) {
      setTaskError('Task title is required.');
      return;
    }

    if (!taskForm.dueDate) {
      setTaskError('Due date is required.');
      return;
    }

    try {
      if (editingTaskId) {
        await updateTask({
          id: editingTaskId,
          data: {
            title: taskForm.title.trim(),
            description: taskForm.description.trim(),
            priority: taskForm.priority,
            status: taskForm.status,
            category: taskForm.category,
            dueDate: taskForm.dueDate,
          },
        }).unwrap();
      } else {
        if (!currentUserId) {
          setTaskError('Unable to detect current user. Please re-login and try again.');
          return;
        }

        await createTask({
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          priority: taskForm.priority,
          status: taskForm.status,
          category: taskForm.category,
          dueDate: taskForm.dueDate,
          userId: currentUserId,
        }).unwrap();
      }

      resetForm();
    } catch (error: any) {
      setTaskError(error?.data?.message || 'Failed to save task.');
    }
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate,
      reminder: task.reminder,
      dependsOnId: task.dependsOnId,
    });
    setTaskError('');
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id).unwrap();
    } catch (error: any) {
      setTaskError(error?.data?.message || 'Failed to delete task.');
    }
  };

  const toggleComplete = async (task: TaskItem) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask({ id: task.id, data: { status: nextStatus } }).unwrap();
    } catch (error: any) {
      setTaskError(error?.data?.message || 'Failed to update task status.');
    }
  };

  const renderActiveSection = () => {
    if (activeSection === 'overview') {
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dashboard Overview</h2>
              <p className="text-sm text-slate-600">A quick snapshot of your workload, momentum, and motivation.</p>
            </div>
            <div className="rounded-xl bg-blue-50 px-3 py-2 text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Today</p>
              <p className="text-sm font-medium text-blue-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100 p-4">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <p className="mt-2 text-sm text-emerald-700">Completion Rate</p>
              <p className="text-2xl font-bold text-emerald-900">{metrics.completionPct}%</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-linear-to-br from-rose-50 to-rose-100 p-4">
              <Flame className="h-6 w-6 text-rose-600" />
              <p className="mt-2 text-sm text-rose-700">Current Streak</p>
              <p className="text-2xl font-bold text-rose-900">{metrics.streak} days</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-linear-to-br from-amber-50 to-amber-100 p-4">
              <Trophy className="h-6 w-6 text-amber-600" />
              <p className="mt-2 text-sm text-amber-700">Reward Points</p>
              <p className="text-2xl font-bold text-amber-900">{metrics.points}</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <p className="mt-2 text-sm text-blue-700">Tasks Today</p>
              <p className="text-2xl font-bold text-blue-900">{metrics.total}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-indigo-200 bg-linear-to-br from-indigo-50 to-indigo-100 p-4">
              <p className="mb-3 text-sm font-semibold text-indigo-900">Quick Health</p>
              <div className="space-y-3 text-sm font-medium">
                <div className="flex items-center justify-between rounded-lg bg-indigo-100 px-3 py-2 text-indigo-800">
                  <span>Pending Tasks</span>
                  <strong className="text-indigo-900">{metrics.pending}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-amber-100 px-3 py-2 text-amber-800">
                  <span>In Progress</span>
                  <strong className="text-amber-900">{metrics.inProgress}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-emerald-100 px-3 py-2 text-emerald-800">
                  <span>Badges Unlocked</span>
                  <strong className="text-emerald-900">{badges.filter((badge) => badge.unlocked).length}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-cyan-200 bg-linear-to-br from-cyan-50 to-cyan-100 p-4">
              <p className="mb-3 text-sm font-semibold text-cyan-900">Focus Reminder</p>
              <div className="rounded-lg bg-linear-to-br from-cyan-100 to-blue-100 p-4 text-sm text-cyan-900">
                <div className="mb-2 inline-flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4" /> Quote of the day</div>
                <p>"{quoteOfDay()}"</p>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (activeSection === 'tasks') {
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">1. Task Management</h2>

          <div className="mb-3 grid gap-2 md:grid-cols-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)} className="rounded-lg border-2 border-teal-300 bg-linear-to-br from-teal-50 to-cyan-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:outline-none">
              <option value="all">📋 All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)} className="rounded-lg border-2 border-rose-300 bg-linear-to-br from-rose-50 to-red-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:outline-none">
              <option value="all">🎯 All Priority</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as 'all' | TaskCategory)} className="rounded-lg border-2 border-purple-300 bg-linear-to-br from-purple-50 to-pink-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-purple-500 focus:outline-none">
              <option value="all">📁 All Categories</option>
              <option value="work">💼 Work</option>
              <option value="study">📚 Study</option>
              <option value="personal">🎨 Personal</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="rounded-lg border-2 border-orange-300 bg-linear-to-br from-orange-50 to-amber-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-orange-500 focus:outline-none">
              <option value="priority">🔼 Sort by Priority</option>
              <option value="status">📊 Sort by Status</option>
              <option value="category">📁 Sort by Category</option>
              <option value="dueDate">📅 Sort by Due Date</option>
            </select>
          </div>

          <div className="mb-4 space-y-2">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`rounded-lg border-2 p-3 ${
                task.status === 'completed'
                  ? 'border-emerald-300 bg-linear-to-r from-emerald-50 to-emerald-100'
                  : task.status === 'in-progress'
                  ? 'border-amber-300 bg-linear-to-r from-amber-50 to-amber-100'
                  : 'border-indigo-300 bg-linear-to-r from-indigo-50 to-indigo-100'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-600">{task.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                        task.category === 'work'
                          ? 'bg-blue-200 text-blue-800'
                          : task.category === 'study'
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-pink-200 text-pink-800'
                      }`}>{task.category}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                        task.priority === 'high'
                          ? 'bg-rose-200 text-rose-800'
                          : task.priority === 'medium'
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-emerald-200 text-emerald-800'
                      }`}>{task.priority}</span>
                      <span className="text-xs text-slate-500">due {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => toggleComplete(task)} className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-600">Done</button>
                    <button type="button" onClick={() => handleEditTask(task)} className="rounded-md bg-blue-500 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-600">Edit</button>
                    <button type="button" onClick={() => handleDeleteTask(task.id)} className="rounded-md bg-rose-500 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-600"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 ? <p className="text-sm text-slate-500">No tasks found for the selected filters.</p> : null}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <input value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} placeholder="Task title" className="rounded-lg border-2 border-blue-300 bg-linear-to-br from-blue-50 to-cyan-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
            <input value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="rounded-lg border-2 border-blue-300 bg-linear-to-br from-blue-50 to-cyan-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
            <select value={taskForm.priority} onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value as TaskPriority }))} className="rounded-lg border-2 border-amber-300 bg-linear-to-br from-amber-50 to-orange-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:outline-none">
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <select value={taskForm.status} onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value as TaskStatus }))} className="rounded-lg border-2 border-indigo-300 bg-linear-to-br from-indigo-50 to-purple-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none">
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
            <select value={taskForm.category} onChange={(e) => setTaskForm((p) => ({ ...p, category: e.target.value as TaskCategory }))} className="rounded-lg border-2 border-purple-300 bg-linear-to-br from-purple-50 to-pink-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-purple-500 focus:outline-none">
              {categoryValues.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))} className="rounded-lg border-2 border-rose-300 bg-linear-to-br from-rose-50 to-red-50 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:outline-none" />
          </div>

          {taskError ? <p className="mt-2 text-sm text-rose-600">{taskError}</p> : null}

          <div className="mt-3 flex gap-2">
            <button type="button" onClick={handleSaveTask} disabled={isCreatingTask || isUpdatingTask} className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50">
              <Plus className="h-4 w-4" />
              {editingTaskId ? 'Update Task' : 'Create Task'}
            </button>
            {editingTaskId ? (
              <button type="button" onClick={resetForm} className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </section>
      );
    }

    if (activeSection === 'progress') {
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">2. Progress Tracking & Dashboard Metrics</h2>
          <p className="mb-3 text-sm text-slate-600">Completion rate: {metrics.completionPct}%</p>
          <div className="mb-4 h-3 w-full rounded-full bg-slate-200">
            <div className="h-3 rounded-full bg-linear-to-r from-emerald-400 to-teal-500" style={{ width: `${metrics.completionPct}%` }} />
          </div>

          <p className="mb-3 text-sm font-semibold text-slate-700">Weekly Productivity</p>
          <div className="grid grid-cols-7 gap-2">
            {weeklyBars.map((bar) => (
              <div key={bar.day} className="text-center">
                <div className="mx-auto flex h-24 w-6 items-end rounded-lg bg-linear-to-b from-slate-100 to-slate-200">
                  <div className="w-full rounded-lg bg-linear-to-t from-blue-500 to-blue-400" style={{ height: `${bar.value}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-600">{bar.day}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === 'rewards') {
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">3. Gamification & Rewards</h2>
          <p className="text-sm text-slate-600">Earn points, badges, and streak milestones by completing tasks.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border-2 border-amber-300 bg-linear-to-br from-amber-50 to-amber-100 p-4">
              <p className="text-sm text-amber-700">Points</p>
              <p className="text-2xl font-bold text-amber-900">{metrics.points}</p>
            </div>
            <div className="rounded-lg border-2 border-rose-300 bg-linear-to-br from-rose-50 to-rose-100 p-4">
              <p className="text-sm text-rose-700">Current Streak</p>
              <p className="text-2xl font-bold text-rose-900">{metrics.streak} days</p>
            </div>
            <div className="rounded-lg border-2 border-cyan-300 bg-linear-to-br from-cyan-50 to-cyan-100 p-4">
              <p className="text-sm text-cyan-700">Leaderboard</p>
              <p className="text-2xl font-bold text-cyan-900">#2</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Badges</p>
            {badges.map((badge) => (
              <div key={badge.name} className={`rounded-md border-2 px-4 py-3 ${
                badge.unlocked
                  ? 'border-emerald-300 bg-linear-to-r from-emerald-50 to-emerald-100'
                  : 'border-slate-300 bg-linear-to-r from-slate-50 to-slate-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className={`h-5 w-5 ${
                      badge.unlocked ? 'text-amber-600' : 'text-slate-400'
                    }`} />
                    <span className={`font-bold ${
                      badge.unlocked ? 'text-emerald-900' : 'text-slate-600'
                    }`}>{badge.name}</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    badge.unlocked
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>{badge.unlocked ? 'Unlocked' : 'Locked'}</span>
                </div>
                <p className={`mt-1 text-xs ${
                  badge.unlocked ? 'text-emerald-700' : 'text-slate-500'
                }`}>{badge.rule}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === 'inspiration') {
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">4. Daily Inspiration & Motivation</h2>
          <div className="rounded-lg border-2 border-purple-300 bg-linear-to-br from-purple-50 to-purple-100 p-4">
            <div className="mb-2 inline-flex items-center gap-2 font-bold text-purple-900"><Sparkles className="h-5 w-5 text-purple-600" /> Quote of the day</div>
            <p className="text-sm text-purple-800">"{quoteOfDay()}"</p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border-2 border-amber-300 bg-linear-to-br from-amber-50 to-amber-100 p-4">
              <div className="mb-2 inline-flex items-center gap-2 font-bold text-amber-900"><Sunrise className="h-5 w-5 text-amber-600" /> Morning Prompt</div>
              <p className="text-sm text-amber-800">Start with your hardest task for 45 focused minutes.</p>
            </div>
            <div className="rounded-lg border-2 border-indigo-300 bg-linear-to-br from-indigo-50 to-indigo-100 p-4">
              <div className="mb-2 inline-flex items-center gap-2 font-bold text-indigo-900"><Moon className="h-5 w-5 text-indigo-600" /> Evening Reflection</div>
              <p className="text-sm text-indigo-800">Capture one win and one improvement for tomorrow.</p>
            </div>
          </div>
        </section>
      );
    }

    if (activeSection === 'checkins') {
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-slate-900">5. Morning & Night Check-ins</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border-2 border-amber-300 bg-linear-to-br from-amber-50 to-amber-100 p-4">
              <div className="mb-3 inline-flex items-center gap-2 font-bold text-amber-900"><Sunrise className="h-5 w-5 text-amber-600" /> Morning Check-in</div>
              <textarea rows={3} value={morningCheckIn.intentions} onChange={(e) => setMorningCheckIn((p) => ({ ...p, intentions: e.target.value }))} className="w-full rounded-lg border-2 border-amber-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:outline-none" />
              <input value={morningCheckIn.topPriority} onChange={(e) => setMorningCheckIn((p) => ({ ...p, topPriority: e.target.value }))} placeholder="Top priority" className="mt-2 w-full rounded-lg border-2 border-amber-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:outline-none" />
              <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-amber-900"><input type="checkbox" checked={morningCheckIn.done} onChange={(e) => setMorningCheckIn((p) => ({ ...p, done: e.target.checked }))} className="h-4 w-4 rounded" />Completed</label>
            </div>
            <div className="rounded-lg border-2 border-indigo-300 bg-linear-to-br from-indigo-50 to-indigo-100 p-4">
              <div className="mb-3 inline-flex items-center gap-2 font-bold text-indigo-900"><Moon className="h-5 w-5 text-indigo-600" /> Night Check-in</div>
              <textarea rows={3} value={nightCheckIn.reflection} onChange={(e) => setNightCheckIn((p) => ({ ...p, reflection: e.target.value }))} className="w-full rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none" />
              <textarea rows={2} value={nightCheckIn.nextPlan} onChange={(e) => setNightCheckIn((p) => ({ ...p, nextPlan: e.target.value }))} placeholder="Tomorrow's plan" className="mt-2 w-full rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none" />
              <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-indigo-900"><input type="checkbox" checked={nightCheckIn.done} onChange={(e) => setNightCheckIn((p) => ({ ...p, done: e.target.checked }))} className="h-4 w-4 rounded" />Completed</label>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-slate-900">6. Mind Mapping & Task Visualization</h2>
        <p className="mb-3 text-sm text-slate-600">Visualize task dependencies and priority flows.</p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            let cardClass = 'rounded-lg border-2 p-3 ';
            if (task.priority === 'high') {
              cardClass += 'border-rose-300 bg-linear-to-br from-rose-50 to-rose-100';
            } else if (task.priority === 'medium') {
              cardClass += 'border-amber-300 bg-linear-to-br from-amber-50 to-amber-100';
            } else {
              cardClass += 'border-emerald-300 bg-linear-to-br from-emerald-50 to-emerald-100';
            }
            return (
              <div key={task.id} className={cardClass}>
                <p className="font-bold text-slate-900">{task.title}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className={task.category === 'work' ? 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-200 text-blue-800' : task.category === 'study' ? 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-purple-200 text-purple-800' : 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-pink-200 text-pink-800'}>{task.category}</span>
                  <span className={task.status === 'completed' ? 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-200 text-emerald-800' : task.status === 'in-progress' ? 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-200 text-amber-800' : 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-800'}>{task.status}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{task.dependsOnId ? `Depends on task #${task.dependsOnId}` : 'No dependency'}</p>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div className={task.priority === 'high' ? 'h-2 rounded-full bg-linear-to-r from-rose-400 to-rose-500' : task.priority === 'medium' ? 'h-2 rounded-full bg-linear-to-r from-amber-400 to-amber-500' : 'h-2 rounded-full bg-linear-to-r from-emerald-400 to-emerald-500'} style={{ width: task.status === 'completed' ? '100%' : task.status === 'in-progress' ? '60%' : '25%' }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-6 shadow-sm lg:pl-80">
          <h1 className="text-3xl font-bold text-blue-900">Tasker Dashboard</h1>
          <p className="text-sm text-blue-700">Plan smart, stay consistent, and gamify your productivity.</p>
          <p className="mt-2 text-base font-bold text-cyan-700">Welcome, {displayName}</p>
          <p className="mt-1 text-xs text-blue-600">{isLoading || isFetching ? 'Syncing tasks...' : `Loaded ${tasks.length} task(s)`}</p>
        </header>

        <aside className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:fixed lg:left-6 lg:top-6 lg:z-40 lg:h-[calc(100vh-3rem)] lg:w-72 lg:overflow-y-auto lg:shadow-xl">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ListTodo className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tasker</h2>
              <p className="text-xs text-slate-500">Productivity Hub</p>
            </div>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Navigation</p>
          <nav className="space-y-1">
            {sectionItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                  activeSection === item.id ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id ? <span className="text-white font-bold">✓</span> : null}
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-teal-200 bg-linear-to-br from-teal-50 to-teal-100 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-teal-900">Dashboard Snapshot</span>
              <Calendar className="h-4 w-4 text-teal-600" />
            </div>
            <div className="space-y-1 text-xs text-teal-700">
              <p className="text-teal-800">Tasks synced and ready</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Burnout Status</span>
              <span className="text-sm font-bold text-emerald-700">Low</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-white">
              <div className="h-2 rounded-full bg-linear-to-r from-emerald-500 to-teal-500" style={{ width: '35%' }} />
            </div>
            <p className="mt-3 text-xs text-slate-600">Keep up the great work! Your stress levels are well-managed.</p>
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
            <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50">
              Settings
            </button>
            <button type="button" onClick={handleLogout} className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50">
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-4 lg:pl-80">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <p className="mt-1 text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.completed}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <ListTodo className="h-6 w-6 text-amber-600" />
              <p className="mt-1 text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.pending}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Flame className="h-6 w-6 text-amber-600" />
              <p className="mt-1 text-sm text-slate-600">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.inProgress}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Flame className="h-6 w-6 text-rose-600" />
              <p className="mt-1 text-sm text-slate-600">Streak</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.streak} days</p>
            </div>
          </section>

          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};
