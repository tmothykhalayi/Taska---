import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  CheckCircle,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Gift,
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  Trash2,
  UserPlus,
  Pencil,
  BellRing,
  CalendarClock,
  Plus,
  Download,
  FileSpreadsheet,
  Printer,
  Award,
  Zap,
  Package,
} from 'lucide-react';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../features/Users/usersApi';
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from '../../features/Tasks/tasksApi';
import {
  type NotificationSettings,
  type PlatformSettings,
  type SecuritySettings,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../features/Settings/settingsApi';
import type { AppDispatch, RootState } from '../../app/store';
import type { TUser } from '../../types/types';
import { clearUser, setUserDetails } from '../../features/Auth/UserAuthSlice';

const adminNavItems = [
  { id: 'dashboard-overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  role: 'tasker' | 'admin';
  status: 'active' | 'inactive';
};

type AdminTaskRow = {
  id: number;
  title: string;
  description: string;
  assignedUserId: number;
  assignedUserName: string;
  assignedUserEmail: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
};

type RewardItem = {
  id: number;
  name: string;
  pointCost: number;
  category: string;
  description: string;
};

const tablePageSize = 10;

type AnalyticsGranularity = 'day' | 'week' | 'month';

const taskStatusValues: TaskStatus[] = ['pending', 'in-progress', 'completed'];
const taskPriorityValues: TaskPriority[] = ['high', 'medium', 'low'];

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString();
};

const normalizeStatus = (value?: string | null): TaskStatus => {
  if (value === 'completed') return 'completed';
  if (value === 'in-progress') return 'in-progress';
  return 'pending';
};

const normalizePriority = (value?: string | null): TaskPriority => {
  if (value === 'high') return 'high';
  if (value === 'low') return 'low';
  return 'medium';
};

const statusBadgeClass = (status: TaskStatus) => {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700';
  if (status === 'in-progress') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
};

const priorityBadgeClass = (priority: TaskPriority) => {
  if (priority === 'high') return 'bg-rose-100 text-rose-700';
  if (priority === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const isoDate = (value: Date) => value.toISOString().slice(0, 10);

const getWeekKey = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

const getDateBucket = (dateValue: string, granularity: AnalyticsGranularity) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;
  if (granularity === 'day') return isoDate(parsed);
  if (granularity === 'week') return getWeekKey(parsed);
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
};

const downloadTextFile = (fileName: string, content: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userAuth);

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

  useEffect(() => {
    setMyDetailsForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      newPassword: '',
    });
  }, [user]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsError('');
      await updateSettings({
        platformSettings,
        notificationSettings,
        securitySettings,
      }).unwrap();
      setSettingsSavedAt(new Date().toLocaleTimeString());
    } catch {
      setSettingsError('Failed to save settings. Please try again.');
    }
  };

  const handleUpdateMyDetails = async () => {
    setMyDetailsMessage('');
    setMyDetailsError('');

    const userId = Number(user?.user_id ?? 0);
    if (!userId) {
      setMyDetailsError('Unable to identify your account. Please login again.');
      return;
    }

    const name = myDetailsForm.name.trim();
    const email = myDetailsForm.email.trim();
    const phone = myDetailsForm.phone.trim();
    const newPassword = myDetailsForm.newPassword.trim();

    if (!name || !email) {
      setMyDetailsError('Name and email are required.');
      return;
    }

    try {
      const payload = {
        name,
        email,
        phone,
        ...(newPassword ? { password: newPassword } : {}),
      };

      await updateUser({ id: userId, data: payload }).unwrap();

      const updatedLocalUser = {
        ...(user || {}),
        name,
        email,
        phone,
      } as TUser;

      dispatch(setUserDetails(updatedLocalUser));
      setMyDetailsForm((prev) => ({ ...prev, newPassword: '' }));
      setMyDetailsMessage('Your details were updated successfully.');
      setSettingsSavedAt(new Date().toLocaleTimeString());
    } catch {
      setMyDetailsError('Failed to update your details. Please try again.');
    }
  };

  const [activeItem, setActiveItem] = useState<(typeof adminNavItems)[number]['id']>('dashboard-overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<'create' | 'edit'>('create');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tasker' as 'tasker' | 'admin',
    status: 'active' as 'active' | 'inactive',
  });
  const [userFormError, setUserFormError] = useState('');

  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilters, setTaskStatusFilters] = useState<TaskStatus[]>([]);
  const [taskPriorityFilters, setTaskPriorityFilters] = useState<TaskPriority[]>([]);
  const [taskSortBy, setTaskSortBy] = useState<'title' | 'assignedUserName' | 'priority' | 'status' | 'dueDate' | 'createdAt'>('createdAt');
  const [taskSortOrder, setTaskSortOrder] = useState<'asc' | 'desc'>('desc');
  const [taskPage, setTaskPage] = useState(1);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [taskDetails, setTaskDetails] = useState<AdminTaskRow | null>(null);
  const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<'create' | 'edit'>('edit');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskFormError, setTaskFormError] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    status: 'pending' as TaskStatus,
    category: '',
    dueDate: '',
    userId: 0,
  });
  const [analyticsRangeDays, setAnalyticsRangeDays] = useState<'7' | '30' | '90'>('30');
  const [analyticsGranularity, setAnalyticsGranularity] = useState<AnalyticsGranularity>('day');
  const [analyticsStartDate, setAnalyticsStartDate] = useState('');
  const [analyticsEndDate, setAnalyticsEndDate] = useState('');
  const [reportUserFilter, setReportUserFilter] = useState<string>('all');
  const [reportTeamFilter, setReportTeamFilter] = useState<'all' | 'Admin Team' | 'Tasker Team'>('all');
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | TaskStatus>('all');
  const [reportPriorityFilter, setReportPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [reportCategoryFilter, setReportCategoryFilter] = useState<string>('all');
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({} as PlatformSettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({} as NotificationSettings);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({} as SecuritySettings);
  const [settingsSavedAt, setSettingsSavedAt] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState('');
  const [myDetailsForm, setMyDetailsForm] = useState({
    name: '',
    email: '',
    phone: '',
    newPassword: '',
  });
  const [myDetailsMessage, setMyDetailsMessage] = useState('');
  const [myDetailsError, setMyDetailsError] = useState('');

  // Gamification State
  const [gamificationTab, setGamificationTab] = useState<'badges' | 'points' | 'challenges' | 'leaderboard' | 'redemptions' | 'analytics' | 'rules'>('badges');
  const [badges, setBadges] = useState<Array<{ id: number; name: string; tier: 'bronze' | 'silver' | 'gold'; criteria: string; color: string; icon: string }>>([
    { id: 1, name: 'Task Master', tier: 'gold', criteria: 'Complete 20 tasks', color: 'text-yellow-600', icon: 'Trophy' },
    { id: 2, name: 'Quick Starter', tier: 'silver', criteria: 'Complete 5 tasks in 1 week', color: 'text-slate-300', icon: 'Zap' },
    { id: 3, name: 'High Priority Hero', tier: 'gold', criteria: 'Complete 10 high-priority tasks', color: 'text-red-600', icon: 'AlertTriangle' },
    { id: 4, name: 'Streaker', tier: 'silver', criteria: 'Maintain 7-day streak', color: 'text-slate-300', icon: 'Zap' },
    { id: 5, name: 'Dedicated', tier: 'bronze', criteria: 'Login 5 consecutive days', color: 'text-amber-600', icon: 'Star' },
  ]);
  const [pointsRules, setPointsRules] = useState({
    taskComplete: 10,
    highPriority: 5,
    lowPriority: 2,
    streakDay: 3,
    loginDaily: 1,
    challengeComplete: 20,
  });
  const [challenges, setChallenges] = useState<Array<{ id: number; name: string; description: string; type: string; target: number; reward: number; isActive: boolean; startDate: string; endDate: string }>>([
    { id: 1, name: 'Weekly Warrior', description: 'Complete 10 tasks this week', type: 'weekly', target: 10, reward: 50, isActive: true, startDate: '2026-04-07', endDate: '2026-04-13' },
    { id: 2, name: 'Daily Doer', description: 'Complete 3 tasks today', type: 'daily', target: 3, reward: 15, isActive: true, startDate: '2026-04-06', endDate: '2026-04-07' },
    { id: 3, name: 'Priority Rush', description: 'Complete 5 high-priority tasks', type: 'special', target: 5, reward: 75, isActive: false, startDate: '2026-04-01', endDate: '2026-04-30' },
  ]);
  const [rewardItems] = useState<RewardItem[]>([
    { id: 1, name: 'Extra Vacation Day', pointCost: 500, category: 'time-off', description: 'Claim one extra vacation day' },
    { id: 2, name: 'Coffee Card $10', pointCost: 200, category: 'gift', description: 'Digital coffee gift card' },
    { id: 3, name: 'Priority Task Badge', pointCost: 100, category: 'feature', description: 'Custom badge for profile' },
    { id: 4, name: 'Team Recognition', pointCost: 150, category: 'recognition', description: 'Feature in team highlights' },
  ]);
  const [gamificationRules, setGamificationRules] = useState({
    streakResetDays: 1,
    leaderboardVisibility: 'team' as 'team' | 'global',
    badgeAutoUnlock: true,
    pointMultiplier: 1.0,
    seasonalBonus: 0,
  });
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [badgeModalMode, setBadgeModalMode] = useState<'create' | 'edit'>('create');
  const [editingBadgeId, setEditingBadgeId] = useState<number | null>(null);
  const [badgeForm, setBadgeForm] = useState({ name: '', tier: 'bronze' as 'bronze' | 'silver' | 'gold', criteria: '', color: 'text-slate-600', icon: 'Star' });
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeModalMode, setChallengeModalMode] = useState<'create' | 'edit'>('create');
  const [editingChallengeId, setEditingChallengeId] = useState<number | null>(null);
  const [challengeForm, setChallengeForm] = useState({ name: '', description: '', type: 'weekly', target: 0, reward: 0, isActive: true, startDate: '', endDate: '' });
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false);
  const [selectedRedemptionReward, setSelectedRedemptionReward] = useState<number | null>(null);
  const [selectedRedemptionUser, setSelectedRedemptionUser] = useState<number | null>(null);

  const { data: users = [], isLoading: usersLoading, isFetching: usersFetching } = useGetUsersQuery();
  const { data: tasks = [], isLoading: tasksLoading, isFetching: tasksFetching } = useGetAllTasksQuery();
  const { data: settingsData, isLoading: settingsLoading } = useGetSettingsQuery();

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateSettingsMutation();

  useEffect(() => {
    if (!settingsData) return;
    setPlatformSettings(settingsData.platformSettings);
    setNotificationSettings(settingsData.notificationSettings);
    setSecuritySettings(settingsData.securitySettings);
    const timestamp = settingsData.updatedAt
      ? new Date(settingsData.updatedAt).toLocaleTimeString()
      : null;
    setSettingsSavedAt(timestamp);
  }, [settingsData]);

  const normalizedUsers = useMemo<AdminUserRow[]>(() => {
    return (users as any[]).map((user) => {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const fallbackName = `${firstName} ${lastName}`.trim();
      const normalizedRole = user.role === 'admin' ? 'admin' : 'tasker';
      const normalizedStatus = user.status === 'inactive' ? 'inactive' : 'active';

      return {
        id: Number(user.id ?? user.user_id ?? 0),
        name: user.name || fallbackName || 'Unknown User',
        email: user.email || '-',
        role: normalizedRole,
        status: normalizedStatus,
      };
    });
  }, [users]);

  const normalizedTasks = useMemo<AdminTaskRow[]>(() => {
    const now = new Date();
    return (tasks as Task[]).map((task: any) => {
      const relationUser = task.user || {};
      const firstName = relationUser.firstName || '';
      const lastName = relationUser.lastName || '';
      const assignedName =
        relationUser.name || `${firstName} ${lastName}`.trim() || relationUser.email || 'Unassigned';
      const assignedId = Number(relationUser.id ?? relationUser.user_id ?? task.userId ?? 0);
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      const status = normalizeStatus(task.status || (task.completed ? 'completed' : 'pending'));

      return {
        id: Number(task.id),
        title: task.title || 'Untitled Task',
        description: task.description || '',
        assignedUserId: assignedId,
        assignedUserName: assignedName,
        assignedUserEmail: relationUser.email || '-',
        priority: normalizePriority(task.priority),
        status,
        category: task.category || 'General',
        dueDate: task.dueDate || '',
        createdAt: task.createdAt || '',
        updatedAt: task.updatedAt || '',
        isOverdue:
          Boolean(dueDate) &&
          dueDate!.getTime() < now.getTime() &&
          status !== 'completed',
      };
    });
  }, [tasks]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return normalizedUsers.filter((user) => {
      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [normalizedUsers, searchTerm, roleFilter, statusFilter]);

  const filteredAndSortedTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();
    const result = normalizedTasks.filter((task) => {
      const matchesSearch =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        task.assignedUserName.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);
      const matchesStatus =
        taskStatusFilters.length === 0 || taskStatusFilters.includes(task.status);
      const matchesPriority =
        taskPriorityFilters.length === 0 || taskPriorityFilters.includes(task.priority);
      return matchesSearch && matchesStatus && matchesPriority;
    });

    result.sort((a, b) => {
      const direction = taskSortOrder === 'asc' ? 1 : -1;
      if (taskSortBy === 'dueDate' || taskSortBy === 'createdAt') {
        const left = a[taskSortBy] ? new Date(a[taskSortBy]).getTime() : 0;
        const right = b[taskSortBy] ? new Date(b[taskSortBy]).getTime() : 0;
        return (left - right) * direction;
      }
      const left = String(a[taskSortBy] || '').toLowerCase();
      const right = String(b[taskSortBy] || '').toLowerCase();
      return left.localeCompare(right) * direction;
    });

    return result;
  }, [normalizedTasks, taskPriorityFilters, taskSearch, taskSortBy, taskSortOrder, taskStatusFilters]);

  const totalTaskPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / tablePageSize));
  const paginatedTasks = useMemo(() => {
    const page = Math.min(taskPage, totalTaskPages);
    const start = (page - 1) * tablePageSize;
    return filteredAndSortedTasks.slice(start, start + tablePageSize);
  }, [filteredAndSortedTasks, taskPage, totalTaskPages]);

  const overdueTasks = useMemo(
    () => filteredAndSortedTasks.filter((task) => task.isOverdue),
    [filteredAndSortedTasks],
  );

  const overviewInsights = useMemo(() => {
    const totalUsers = normalizedUsers.length;
    const activeUsers = normalizedUsers.filter((user) => user.status === 'active').length;
    const adminUsers = normalizedUsers.filter((user) => user.role === 'admin').length;
    const taskerUsers = Math.max(0, totalUsers - adminUsers);

    const totalTasks = normalizedTasks.length;
    const completedTasks = normalizedTasks.filter((task) => task.status === 'completed').length;
    const pendingTasks = normalizedTasks.filter((task) => task.status === 'pending').length;
    const inProgressTasks = normalizedTasks.filter((task) => task.status === 'in-progress').length;
    const overdueCount = normalizedTasks.filter((task) => task.isOverdue).length;

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const overdueRate = totalTasks === 0 ? 0 : Math.round((overdueCount / totalTasks) * 100);
    const avgTasksPerUser = totalUsers === 0 ? 0 : Number((totalTasks / totalUsers).toFixed(1));

    const priorityCounts: Record<TaskPriority, number> = { high: 0, medium: 0, low: 0 };
    normalizedTasks.forEach((task) => {
      priorityCounts[task.priority] += 1;
    });

    const assignedCount = new Map<string, { total: number; completed: number }>();
    normalizedTasks.forEach((task) => {
      const key = task.assignedUserName || 'Unassigned';
      const current = assignedCount.get(key) || { total: 0, completed: 0 };
      current.total += 1;
      if (task.status === 'completed') current.completed += 1;
      assignedCount.set(key, current);
    });

    const topPerformers = Array.from(assignedCount.entries())
      .map(([name, stats]) => ({
        name,
        total: stats.total,
        completed: stats.completed,
        completionRate: stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100),
      }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 3);

    const recentTasks = [...normalizedTasks]
      .sort((a, b) => {
        const left = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const right = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return right - left;
      })
      .slice(0, 5);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: Math.max(0, totalUsers - activeUsers),
      adminUsers,
      taskerUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueCount,
      completionRate,
      overdueRate,
      avgTasksPerUser,
      priorityCounts,
      topPerformers,
      recentTasks,
    };
  }, [normalizedTasks, normalizedUsers]);

  const analyticsDateRange = useMemo(() => {
    const end = analyticsEndDate ? new Date(`${analyticsEndDate}T23:59:59`) : new Date();
    const fallbackStart = new Date(end);
    fallbackStart.setDate(fallbackStart.getDate() - Number(analyticsRangeDays));
    const start = analyticsStartDate ? new Date(`${analyticsStartDate}T00:00:00`) : fallbackStart;
    return { start, end };
  }, [analyticsEndDate, analyticsRangeDays, analyticsStartDate]);

  const analyticsTasks = useMemo(() => {
    return normalizedTasks.filter((task) => {
      if (!task.createdAt) return false;
      const created = new Date(task.createdAt);
      if (Number.isNaN(created.getTime())) return false;
      return created >= analyticsDateRange.start && created <= analyticsDateRange.end;
    });
  }, [analyticsDateRange, normalizedTasks]);

  const userTeamById = useMemo(() => {
    const map = new Map<number, 'Admin Team' | 'Tasker Team'>();
    normalizedUsers.forEach((user) => {
      map.set(user.id, user.role === 'admin' ? 'Admin Team' : 'Tasker Team');
    });
    return map;
  }, [normalizedUsers]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(analyticsTasks.map((task) => task.category || 'General'))).sort();
  }, [analyticsTasks]);

  const reportTasks = useMemo(() => {
    return analyticsTasks.filter((task) => {
      const matchesUser = reportUserFilter === 'all' || String(task.assignedUserId) === reportUserFilter;
      const taskTeam = userTeamById.get(task.assignedUserId) || 'Tasker Team';
      const matchesTeam = reportTeamFilter === 'all' || taskTeam === reportTeamFilter;
      const matchesStatus = reportStatusFilter === 'all' || task.status === reportStatusFilter;
      const matchesPriority = reportPriorityFilter === 'all' || task.priority === reportPriorityFilter;
      const matchesCategory = reportCategoryFilter === 'all' || task.category === reportCategoryFilter;
      return matchesUser && matchesTeam && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [analyticsTasks, reportUserFilter, userTeamById, reportTeamFilter, reportStatusFilter, reportPriorityFilter, reportCategoryFilter]);

  const completionByUser = useMemo(() => {
    const bucket = new Map<string, { total: number; completed: number }>();
    reportTasks.forEach((task) => {
      const key = task.assignedUserName;
      const current = bucket.get(key) || { total: 0, completed: 0 };
      current.total += 1;
      if (task.status === 'completed') current.completed += 1;
      bucket.set(key, current);
    });
    return Array.from(bucket.entries())
      .map(([user, stats]) => ({
        user,
        total: stats.total,
        completed: stats.completed,
        percent: stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [reportTasks]);

  const statusDistribution = useMemo(() => {
    const counts: Record<TaskStatus, number> = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
    };
    reportTasks.forEach((task) => {
      counts[task.status] += 1;
    });
    return counts;
  }, [reportTasks]);

  const priorityDistribution = useMemo(() => {
    const counts: Record<TaskPriority, number> = {
      high: 0,
      medium: 0,
      low: 0,
    };
    reportTasks.forEach((task) => {
      counts[task.priority] += 1;
    });
    return counts;
  }, [reportTasks]);

  const categoryStatusBreakdown = useMemo(() => {
    const bucket = new Map<string, Record<TaskStatus, number>>();
    reportTasks.forEach((task) => {
      const key = task.category || 'General';
      const current = bucket.get(key) || { pending: 0, 'in-progress': 0, completed: 0 };
      current[task.status] += 1;
      bucket.set(key, current);
    });
    return Array.from(bucket.entries()).map(([category, stats]) => ({ category, ...stats }));
  }, [reportTasks]);

  const completionTrend = useMemo(() => {
    const bucket = new Map<string, { created: number; completed: number; overdue: number }>();
    reportTasks.forEach((task) => {
      const key = getDateBucket(task.createdAt, analyticsGranularity);
      if (!key) return;
      const row = bucket.get(key) || { created: 0, completed: 0, overdue: 0 };
      row.created += 1;
      if (task.status === 'completed') row.completed += 1;
      if (task.isOverdue) row.overdue += 1;
      bucket.set(key, row);
    });
    return Array.from(bucket.entries())
      .map(([period, stats]) => ({ period, ...stats }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }, [reportTasks, analyticsGranularity]);

  const engagementHeatmap = useMemo(() => {
    const matrix = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
    reportTasks.forEach((task) => {
      const created = new Date(task.createdAt);
      if (!Number.isNaN(created.getTime())) {
        matrix[created.getDay()][created.getHours()] += 1;
      }
      const updated = new Date(task.updatedAt);
      if (!Number.isNaN(updated.getTime())) {
        matrix[updated.getDay()][updated.getHours()] += 1;
      }
    });
    return matrix;
  }, [reportTasks]);

  const individualUserReports = useMemo(() => {
    return normalizedUsers
      .map((user) => {
        const userTasks = reportTasks.filter((task) => task.assignedUserId === user.id);
        const completedTasks = userTasks.filter((task) => task.status === 'completed');
        const totalCompletionHours = completedTasks.reduce((sum, task) => {
          if (!task.createdAt || !task.updatedAt) return sum;
          const created = new Date(task.createdAt).getTime();
          const updated = new Date(task.updatedAt).getTime();
          if (Number.isNaN(created) || Number.isNaN(updated) || updated < created) return sum;
          return sum + (updated - created) / 3600000;
        }, 0);
        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          team: user.role === 'admin' ? 'Admin Team' : 'Tasker Team',
          assigned: userTasks.length,
          completed: completedTasks.length,
          pending: userTasks.filter((task) => task.status === 'pending').length,
          inProgress: userTasks.filter((task) => task.status === 'in-progress').length,
          overdue: userTasks.filter((task) => task.isOverdue).length,
          avgCompletionHours:
            completedTasks.length === 0 ? 0 : Number((totalCompletionHours / completedTasks.length).toFixed(1)),
        };
      })
      .filter((row) => row.assigned > 0)
      .sort((a, b) => b.completed - a.completed);
  }, [normalizedUsers, reportTasks]);

  const teamReports = useMemo(() => {
    const teams = new Map<string, {
      tasks: number;
      completed: number;
      overdue: number;
      priorityScore: number;
      users: Set<number>;
    }>();

    reportTasks.forEach((task) => {
      const team = userTeamById.get(task.assignedUserId) || 'Tasker Team';
      const row = teams.get(team) || { tasks: 0, completed: 0, overdue: 0, priorityScore: 0, users: new Set<number>() };
      row.tasks += 1;
      if (task.status === 'completed') row.completed += 1;
      if (task.isOverdue) row.overdue += 1;
      row.priorityScore += task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1;
      row.users.add(task.assignedUserId);
      teams.set(team, row);
    });

    return Array.from(teams.entries()).map(([team, stats]) => ({
      team,
      tasks: stats.tasks,
      completionRate: stats.tasks === 0 ? 0 : Math.round((stats.completed / stats.tasks) * 100),
      overdue: stats.overdue,
      avgPriority: stats.tasks === 0 ? 0 : Number((stats.priorityScore / stats.tasks).toFixed(2)),
      activeUsers: stats.users.size,
    }));
  }, [reportTasks, userTeamById]);

  const analyticsKpis = useMemo(() => {
    const completed = reportTasks.filter((task) => task.status === 'completed').length;
    const pending = reportTasks.filter((task) => task.status === 'pending').length;
    const inProgress = reportTasks.filter((task) => task.status === 'in-progress').length;
    const overdue = reportTasks.filter((task) => task.isOverdue).length;
    const activeUsers = new Set(reportTasks.map((task) => task.assignedUserId)).size;
    const completionRate = reportTasks.length === 0 ? 0 : Math.round((completed / reportTasks.length) * 100);
    return {
      total: reportTasks.length,
      completed,
      pending,
      inProgress,
      overdue,
      activeUsers,
      completionRate,
    };
  }, [reportTasks]);

  const exportReportAsCsv = () => {
    const header = [
      'Task ID',
      'Title',
      'Assigned User',
      'Team',
      'Priority',
      'Status',
      'Category',
      'Due Date',
      'Created At',
      'Updated At',
      'Overdue',
    ];

    const rows = reportTasks.map((task) => [
      task.id,
      `"${task.title.replaceAll('"', '""')}"`,
      `"${task.assignedUserName.replaceAll('"', '""')}"`,
      userTeamById.get(task.assignedUserId) || 'Tasker Team',
      task.priority,
      task.status,
      `"${(task.category || 'General').replaceAll('"', '""')}"`,
      task.dueDate || '-',
      task.createdAt || '-',
      task.updatedAt || '-',
      task.isOverdue ? 'Yes' : 'No',
    ]);

    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadTextFile(`admin-report-${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;');
  };

  const exportUserReportAsCsv = () => {
    const header = ['User', 'Email', 'Team', 'Assigned', 'Completed', 'Pending', 'In Progress', 'Overdue', 'Avg Completion Hours'];
    const rows = individualUserReports.map((row) => [
      `"${row.name.replaceAll('"', '""')}"`,
      row.email,
      row.team,
      row.assigned,
      row.completed,
      row.pending,
      row.inProgress,
      row.overdue,
      row.avgCompletionHours,
    ]);
    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    downloadTextFile(`user-report-${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;');
  };

  // Gamification Computations
  const userPoints = useMemo(() => {
    const pointMap = new Map<number, { userId: number; name: string; email: string; totalPoints: number; weeklyPoints: number; badgesEarned: number; streakDays: number }>();
    
    normalizedUsers.forEach((user) => {
      const userTasks = normalizedTasks.filter((task) => task.assignedUserId === user.id);
      const completedTasks = userTasks.filter((task) => task.status === 'completed');
      
      let weekPoints = 0;
      let totalPts = 0;
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      completedTasks.forEach((task) => {
        const taskPoints = 
          task.priority === 'high' ? pointsRules.taskComplete + pointsRules.highPriority :
          task.priority === 'low' ? pointsRules.taskComplete + pointsRules.lowPriority :
          pointsRules.taskComplete;
        
        totalPts += taskPoints;
        
        if (task.updatedAt) {
          const updated = new Date(task.updatedAt);
          if (updated >= weekAgo) weekPoints += taskPoints;
        }
      });

      const streak = userTasks.length > 0 ? Math.floor(Math.random() * 14) + 1 : 0;

      const badgesForUser = badges.filter((badge) => {
        // Task Master: Complete 20 tasks total
        if (badge.criteria.includes('20 tasks')) return completedTasks.length >= 20;
        
        // Quick Starter: Complete 5 tasks in 1 week
        if (badge.criteria.includes('5 tasks') && badge.criteria.includes('week')) {
          const weeklyCompletedTasks = completedTasks.filter((task) => {
            if (!task.updatedAt) return false;
            const updated = new Date(task.updatedAt);
            return updated >= weekAgo;
          });
          return weeklyCompletedTasks.length >= 5;
        }
        
        // High Priority Hero: Complete 10 high-priority tasks
        if (badge.criteria.includes('10 high-priority')) {
          return completedTasks.filter((t) => t.priority === 'high').length >= 10;
        }
        
        // Streaker: Maintain 7-day streak
        if (badge.criteria.includes('7-day streak')) {
          return streak >= 7;
        }
        
        // Dedicated: Login 5 consecutive days (mock check - 5+ tasks over 5 days)
        if (badge.criteria.includes('5 consecutive days')) {
          return userTasks.length >= 5;
        }
        
        return false;
      }).length;

      pointMap.set(user.id, {
        userId: user.id,
        name: user.name,
        email: user.email,
        totalPoints: Math.floor(totalPts * gamificationRules.pointMultiplier),
        weeklyPoints: Math.floor(weekPoints * gamificationRules.pointMultiplier),
        badgesEarned: badgesForUser,
        streakDays: streak,
      });
    });

    return Array.from(pointMap.values());
  }, [normalizedUsers, normalizedTasks, pointsRules, badges, gamificationRules]);

  const leaderboard = useMemo(() => {
    return [...userPoints].sort((a, b) => b.totalPoints - a.totalPoints);
  }, [userPoints]);

  const badgeUnlockRates = useMemo(() => {
    return badges.map((badge) => {
      const usersWithBadge = userPoints.filter((up) => up.badgesEarned > 0).length;
      return {
        badgeName: badge.name,
        tier: badge.tier,
        unlockedCount: usersWithBadge,
        totalUsers: normalizedUsers.length,
        unlockRate: normalizedUsers.length === 0 ? 0 : Math.round((usersWithBadge / normalizedUsers.length) * 100),
      };
    });
  }, [badges, userPoints, normalizedUsers]);

  const challengeStats = useMemo(() => {
    return challenges.map((challenge) => {
      const usersAttempting = Math.floor(Math.random() * normalizedUsers.length);
      const usersCompleting = Math.floor(usersAttempting * (Math.random() * 0.7));
      return {
        challengeName: challenge.name,
        type: challenge.type,
        active: challenge.isActive,
        participants: usersAttempting,
        completions: usersCompleting,
        completionRate: usersAttempting === 0 ? 0 : Math.round((usersCompleting / usersAttempting) * 100),
        reward: challenge.reward,
      };
    });
  }, [challenges, normalizedUsers]);

  const totalPointsDistributed = useMemo(() => {
    return userPoints.reduce((sum, up) => sum + up.totalPoints, 0);
  }, [userPoints]);

  const handleSaveBadge = () => {
    if (badgeModalMode === 'create') {
      const newBadge = { id: Math.max(...badges.map((b) => b.id), 0) + 1, ...badgeForm };
      setBadges([...badges, newBadge]);
    } else if (editingBadgeId) {
      setBadges(badges.map((b) => (b.id === editingBadgeId ? { ...b, ...badgeForm } : b)));
    }
    setIsBadgeModalOpen(false);
    setBadgeForm({ name: '', tier: 'bronze', criteria: '', color: 'text-slate-600', icon: 'Star' });
  };

  const handleDeleteBadge = (badgeId: number) => {
    setBadges(badges.filter((b) => b.id !== badgeId));
  };

  const handleSaveChallenge = () => {
    if (challengeModalMode === 'create') {
      const newChallenge = { id: Math.max(...challenges.map((c) => c.id), 0) + 1, ...challengeForm };
      setChallenges([...challenges, newChallenge]);
    } else if (editingChallengeId) {
      setChallenges(challenges.map((c) => (c.id === editingChallengeId ? { ...c, ...challengeForm } : c)));
    }
    setIsChallengeModalOpen(false);
    setChallengeForm({ name: '', description: '', type: 'weekly', target: 0, reward: 0, isActive: true, startDate: '', endDate: '' });
  };

  const handleDeleteChallenge = (challengeId: number) => {
    setChallenges(challenges.filter((c) => c.id !== challengeId));
  };

  const handleAwardReward = () => {
    window.alert(`Reward processed for user. Points deducted.`);
    setIsRedemptionModalOpen(false);
  };

  const sortTasksBy = (field: 'title' | 'assignedUserName' | 'priority' | 'status' | 'dueDate' | 'createdAt') => {
    if (taskSortBy === field) {
      setTaskSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setTaskSortBy(field);
    setTaskSortOrder('asc');
  };

  const toggleTaskStatusFilter = (status: TaskStatus) => {
    setTaskPage(1);
    setTaskStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((v) => v !== status) : [...prev, status],
    );
  };

  const toggleTaskPriorityFilter = (priority: TaskPriority) => {
    setTaskPage(1);
    setTaskPriorityFilters((prev) =>
      prev.includes(priority) ? prev.filter((v) => v !== priority) : [...prev, priority],
    );
  };

  const handleToggleStatus = async (user: AdminUserRow) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    await updateUser({ id: user.id, data: { status: nextStatus } }).unwrap();
  };

  const handleRoleChange = async (userId: number, nextRole: 'tasker' | 'admin') => {
    await updateUser({ id: userId, data: { role: nextRole } }).unwrap();
  };

  const handleDelete = async (user: AdminUserRow) => {
    const approved = window.confirm(`Delete ${user.name}? This cannot be undone.`);
    if (!approved) return;
    await deleteUser(user.id).unwrap();
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'tasker',
      status: 'active',
    });
    setEditingUserId(null);
    setUserFormError('');
  };

  const openCreateUserModal = () => {
    setUserModalMode('create');
    resetUserForm();
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: AdminUserRow) => {
    setUserModalMode('edit');
    setEditingUserId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setUserFormError('');
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    resetUserForm();
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');

    if (!userForm.name.trim() || !userForm.email.trim()) {
      setUserFormError('Name and email are required.');
      return;
    }

    if (userModalMode === 'create' && !userForm.password.trim()) {
      setUserFormError('Password is required when creating a user.');
      return;
    }

    try {
      if (userModalMode === 'create') {
        await createUser({
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          password: userForm.password,
          role: userForm.role,
          status: userForm.status,
        }).unwrap();
      } else if (editingUserId) {
        const payload: {
          name: string;
          email: string;
          role: 'tasker' | 'admin';
          status: 'active' | 'inactive';
          password?: string;
        } = {
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          role: userForm.role,
          status: userForm.status,
        };

        if (userForm.password.trim()) payload.password = userForm.password;

        await updateUser({ id: editingUserId, data: payload }).unwrap();
      }

      closeUserModal();
    } catch (error: any) {
      setUserFormError(error?.data?.message || 'Failed to save user.');
    }
  };

  const openTaskDetails = (task: AdminTaskRow) => setTaskDetails(task);

  const openTaskEditModal = (task: AdminTaskRow) => {
    setTaskModalMode('edit');
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      userId: task.assignedUserId,
    });
    setTaskFormError('');
    setIsTaskEditModalOpen(true);
  };

  const openTaskCreateModal = () => {
    setTaskModalMode('create');
    setEditingTaskId(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      category: '',
      dueDate: '',
      userId: normalizedUsers[0]?.id || 0,
    });
    setTaskFormError('');
    setIsTaskEditModalOpen(true);
  };

  const closeTaskEditModal = () => {
    setIsTaskEditModalOpen(false);
    setEditingTaskId(null);
    setTaskFormError('');
  };

  const handleTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskModalMode === 'edit' && !editingTaskId) return;

    if (!taskForm.title.trim()) {
      setTaskFormError('Task title is required.');
      return;
    }

    if (!taskForm.userId) {
      setTaskFormError('Please assign this task to a user.');
      return;
    }

    try {
      if (taskModalMode === 'create') {
        await createTask({
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          priority: taskForm.priority,
          status: taskForm.status,
          category: taskForm.category.trim() || 'General',
          dueDate: taskForm.dueDate || undefined,
          userId: taskForm.userId,
        }).unwrap();
      } else {
        await updateTask({
          id: editingTaskId!,
          data: {
            title: taskForm.title.trim(),
            description: taskForm.description.trim(),
            priority: taskForm.priority,
            status: taskForm.status,
            category: taskForm.category.trim() || 'General',
            dueDate: taskForm.dueDate || null,
            userId: taskForm.userId,
          },
        }).unwrap();
      }
      closeTaskEditModal();
    } catch (error: any) {
      setTaskFormError(
        error?.data?.message ||
          (taskModalMode === 'create' ? 'Failed to create task.' : 'Failed to update task.'),
      );
    }
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId],
    );
  };

  const sendBulkReminders = () => {
    if (selectedTaskIds.length === 0) return;
    window.alert(`Reminder queued for ${selectedTaskIds.length} overdue task(s).`);
    setSelectedTaskIds([]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex">
      {isUserModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {userModalMode === 'create' ? 'Create New User' : 'Edit User'}
                </h3>
                <p className="text-sm text-slate-500">
                  {userModalMode === 'create'
                    ? 'Add staff, team members, admins, or demo users.'
                    : 'Update user details, role, and status.'}
                </p>
              </div>
              <button onClick={closeUserModal} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleUserFormSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password {userModalMode === 'edit' ? '(optional)' : ''}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder={userModalMode === 'edit' ? 'Leave blank to keep current password' : 'Minimum 6 characters'}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value as 'tasker' | 'admin' }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="tasker">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {userFormError ? <p className="text-sm text-rose-600">{userFormError}</p> : null}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeUserModal} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser || isUpdatingUser}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreatingUser || isUpdatingUser ? 'Saving...' : userModalMode === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {taskDetails ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Task Details</h3>
                <p className="text-sm text-slate-500">Deep view of task metadata and assignment.</p>
              </div>
              <button onClick={() => setTaskDetails(null)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <p className="text-slate-500">Title</p>
                <p className="font-semibold text-slate-900">{taskDetails.title}</p>
              </div>
              <div>
                <p className="text-slate-500">Assigned User</p>
                <p className="font-semibold text-slate-900">{taskDetails.assignedUserName}</p>
              </div>
              <div>
                <p className="text-slate-500">Priority</p>
                <p className="font-semibold text-slate-900 capitalize">{taskDetails.priority}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-semibold text-slate-900 capitalize">{taskDetails.status}</p>
              </div>
              <div>
                <p className="text-slate-500">Category</p>
                <p className="font-semibold text-slate-900">{taskDetails.category}</p>
              </div>
              <div>
                <p className="text-slate-500">Due Date</p>
                <p className="font-semibold text-slate-900">{formatDate(taskDetails.dueDate)}</p>
              </div>
              <div>
                <p className="text-slate-500">Created</p>
                <p className="font-semibold text-slate-900">{formatDate(taskDetails.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-500">Updated</p>
                <p className="font-semibold text-slate-900">{formatDate(taskDetails.updatedAt)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-slate-500">Description</p>
                <p className="font-medium text-slate-800">{taskDetails.description || 'No description'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isTaskEditModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {taskModalMode === 'create' ? 'Create Task' : 'Edit / Reassign Task'}
                </h3>
                <p className="text-sm text-slate-500">
                  {taskModalMode === 'create'
                    ? 'Create a new task and assign it to a user.'
                    : 'Update details and reassign to another user.'}
                </p>
              </div>
              <button onClick={closeTaskEditModal} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleTaskUpdate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value as TaskPriority }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value as TaskStatus }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                  <input
                    value={taskForm.category}
                    onChange={(e) => setTaskForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Assigned User</label>
                <select
                  value={taskForm.userId}
                  onChange={(e) => setTaskForm((p) => ({ ...p, userId: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value={0}>Select user</option>
                  {normalizedUsers.map((user) => (
                    <option key={user.id} value={user.id}>{`${user.name} (${user.email})`}</option>
                  ))}
                </select>
              </div>
              {taskFormError ? <p className="text-sm text-rose-600">{taskFormError}</p> : null}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeTaskEditModal} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdatingTask || isCreatingTask} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {isUpdatingTask || isCreatingTask
                    ? 'Saving...'
                    : taskModalMode === 'create'
                    ? 'Create Task'
                    : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {mobileOpen && (
        <button onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-900/50 md:hidden" aria-label="Close admin menu overlay" />
      )}

      <aside className={`fixed md:relative left-0 top-0 z-40 h-screen w-72 border-r border-slate-700 bg-linear-to-b from-slate-800 to-slate-900 p-6 shadow-xl transition-transform md:translate-x-0 md:shadow-none overflow-y-auto flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-teal-600 text-white shadow-lg">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Taska Admin</p>
              <p className="text-xs text-slate-400">Control Center</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-slate-400 hover:bg-slate-700 transition-colors md:hidden" aria-label="Close admin menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {adminNavItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-700 text-teal-400 shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <ItemIcon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col">
          <div className="mb-6 h-px bg-gradient-to-r from-slate-700 via-slate-700 to-slate-700" />
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-rose-400 transition-all duration-200 hover:bg-slate-700/50 hover:text-rose-300">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 p-4 md:p-6">
        <button onClick={() => setMobileOpen(true)} className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm md:hidden">
          <Menu className="h-4 w-4" />
          Menu
        </button>

        <div className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">Task monitoring, user governance, and productivity insights</p>
                <p className="text-base font-semibold text-blue-700">Welcome, {displayName}</p>
              </div>
            </div>
          </header>

          {activeItem === 'dashboard-overview' ? (
            <div className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Users className="h-7 w-7 text-blue-600" />
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{overviewInsights.activeUsers} active</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900">{overviewInsights.totalUsers}</p>
                  <p className="mt-2 text-xs text-slate-500">{overviewInsights.adminUsers} admins • {overviewInsights.taskerUsers} taskers</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <ClipboardList className="h-7 w-7 text-blue-600" />
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{overviewInsights.avgTasksPerUser} / user</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">{overviewInsights.totalTasks}</p>
                  <p className="mt-2 text-xs text-slate-500">{overviewInsights.inProgressTasks} in progress • {overviewInsights.pendingTasks} pending</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="h-7 w-7 text-emerald-600" />
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{overviewInsights.completionRate}%</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Completed Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">{overviewInsights.completedTasks}</p>
                  <p className="mt-2 text-xs text-slate-500">Delivery performance this cycle</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <CalendarClock className="h-7 w-7 text-rose-600" />
                    <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">{overviewInsights.overdueRate}%</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Overdue Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">{overviewInsights.overdueCount}</p>
                  <p className="mt-2 text-xs text-slate-500">Needs attention and follow-up</p>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Task Pipeline</h3>
                    <BarChart3 className="h-5 w-5 text-slate-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Pending</span>
                        <span className="text-slate-500">{overviewInsights.pendingTasks}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-amber-500"
                          style={{ width: `${overviewInsights.totalTasks === 0 ? 0 : Math.max(6, Math.round((overviewInsights.pendingTasks / overviewInsights.totalTasks) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">In Progress</span>
                        <span className="text-slate-500">{overviewInsights.inProgressTasks}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${overviewInsights.totalTasks === 0 ? 0 : Math.max(6, Math.round((overviewInsights.inProgressTasks / overviewInsights.totalTasks) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Completed</span>
                        <span className="text-slate-500">{overviewInsights.completedTasks}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${overviewInsights.totalTasks === 0 ? 0 : Math.max(6, Math.round((overviewInsights.completedTasks / overviewInsights.totalTasks) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                      <p className="text-xs text-rose-600">High Priority</p>
                      <p className="text-xl font-bold text-rose-700">{overviewInsights.priorityCounts.high}</p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                      <p className="text-xs text-amber-700">Medium Priority</p>
                      <p className="text-xl font-bold text-amber-800">{overviewInsights.priorityCounts.medium}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs text-emerald-700">Low Priority</p>
                      <p className="text-xl font-bold text-emerald-800">{overviewInsights.priorityCounts.low}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Top Performers</h3>
                    <div className="space-y-3">
                      {overviewInsights.topPerformers.length === 0 ? (
                        <p className="text-sm text-slate-500">No task activity yet.</p>
                      ) : (
                        overviewInsights.topPerformers.map((performer) => (
                          <div key={performer.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-sm font-medium text-slate-900">{performer.name}</p>
                            <p className="text-xs text-slate-600">{performer.completed}/{performer.total} completed</p>
                            <p className="mt-1 text-xs font-semibold text-blue-700">{performer.completionRate}% completion</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveItem('tasks')}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2 text-left text-sm font-medium text-blue-700 hover:bg-blue-50"
                      >
                        Open Task Monitoring
                      </button>
                      <button
                        onClick={openTaskCreateModal}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Create New Task
                      </button>
                      <button
                        onClick={openCreateUserModal}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Add New User
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Latest Task Activity</h3>
                  <button
                    onClick={() => setActiveItem('tasks')}
                    className="text-sm font-medium text-blue-700 hover:text-blue-800"
                  >
                    View all tasks
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-2 py-2">Task</th>
                        <th className="px-2 py-2">Assignee</th>
                        <th className="px-2 py-2">Priority</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overviewInsights.recentTasks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-2 py-6 text-center text-slate-500">No task activity found.</td>
                        </tr>
                      ) : (
                        overviewInsights.recentTasks.map((task) => (
                          <tr key={task.id} className="border-b border-slate-100 text-slate-700">
                            <td className="px-2 py-3 font-medium text-slate-900">{task.title}</td>
                            <td className="px-2 py-3">{task.assignedUserName}</td>
                            <td className="px-2 py-3 capitalize">{task.priority}</td>
                            <td className="px-2 py-3">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-2 py-3">{formatDate(task.dueDate)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : null}

          {activeItem === 'users' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">User Management</h2>
                  <p className="text-sm text-slate-500">{filteredUsers.length} of {normalizedUsers.length} users</p>
                </div>
                <button onClick={openCreateUserModal} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <UserPlus className="h-4 w-4" />
                  + Add User
                </button>
              </div>

              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <div className="relative md:col-span-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="tasker">Tasker</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Role</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {usersLoading || usersFetching ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading users...</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No users match your filters.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                          <td className="px-4 py-3 text-slate-700">{user.email}</td>
                          <td className="px-4 py-3">
                            <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as 'tasker' | 'admin')} disabled={isUpdatingUser} className="rounded-md border border-slate-300 px-2 py-1 text-xs uppercase text-slate-700">
                              <option value="tasker">Tasker</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditUserModal(user)} className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50">
                                <Pencil className="h-3 w-3" />
                                Edit
                              </button>
                              <button onClick={() => handleToggleStatus(user)} disabled={isUpdatingUser} className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button onClick={() => handleDelete(user)} disabled={isDeletingUser} className="inline-flex items-center gap-1 rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeItem === 'tasks' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Task Monitoring</h2>
                  <p className="text-sm text-slate-500">{filteredAndSortedTasks.length} tasks matched</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openTaskCreateModal}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create Task
                  </button>
                  <button
                    onClick={sendBulkReminders}
                    disabled={selectedTaskIds.length === 0}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-300 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <BellRing className="h-4 w-4" />
                    Send Reminders ({selectedTaskIds.length})
                  </button>
                </div>
              </div>

              <div className="mb-4 grid gap-3 lg:grid-cols-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={taskSearch}
                    onChange={(e) => {
                      setTaskSearch(e.target.value);
                      setTaskPage(1);
                    }}
                    placeholder="Search by title, user, or category"
                    className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Status Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map((status) => {
                      const active = taskStatusFilters.includes(status);
                      return (
                        <button
                          key={status}
                          onClick={() => toggleTaskStatusFilter(status)}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${active ? statusBadgeClass(status) : 'bg-slate-100 text-slate-600'}`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Priority Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {(['high', 'medium', 'low'] as TaskPriority[]).map((priority) => {
                      const active = taskPriorityFilters.includes(priority);
                      return (
                        <button
                          key={priority}
                          onClick={() => toggleTaskPriorityFilter(priority)}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${active ? priorityBadgeClass(priority) : 'bg-slate-100 text-slate-600'}`}
                        >
                          {priority}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {overdueTasks.length > 0 ? (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {overdueTasks.length} overdue task(s) detected. Select rows and send reminders.
                </div>
              ) : null}

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-3 text-left font-semibold text-slate-700">Sel</th>
                      <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => sortTasksBy('title')}>Task Title</th>
                      <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => sortTasksBy('assignedUserName')}>Assigned User</th>
                      <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => sortTasksBy('priority')}>Priority</th>
                      <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => sortTasksBy('status')}>Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                      <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => sortTasksBy('dueDate')}>Due Date</th>
                      <th className="cursor-pointer px-4 py-3 text-left font-semibold text-slate-700" onClick={() => sortTasksBy('createdAt')}>Creation Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {tasksLoading || tasksFetching ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-slate-500">Loading tasks...</td>
                      </tr>
                    ) : paginatedTasks.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-slate-500">No tasks match your filters.</td>
                      </tr>
                    ) : (
                      paginatedTasks.map((task) => (
                        <tr key={task.id} className={task.isOverdue ? 'bg-rose-50/40' : ''}>
                          <td className="px-3 py-3">
                            <input
                              type="checkbox"
                              checked={selectedTaskIds.includes(task.id)}
                              onChange={() => toggleTaskSelection(task.id)}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            <button onClick={() => openTaskDetails(task)} className="text-left hover:text-blue-700 hover:underline">
                              {task.title}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{task.assignedUserName}</td>
                          <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityBadgeClass(task.priority)}`}>{task.priority}</span></td>
                          <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass(task.status)}`}>{task.status}</span></td>
                          <td className="px-4 py-3 text-slate-700">{task.category}</td>
                          <td className="px-4 py-3 text-slate-700">
                            <div className="flex items-center gap-2">
                              {task.isOverdue ? <span className="inline-block h-2 w-2 rounded-full bg-rose-600" /> : null}
                              {formatDate(task.dueDate)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{formatDate(task.createdAt)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => openTaskEditModal(task)} className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50">
                              <Pencil className="h-3 w-3" />
                              Edit/Reassign
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <p className="text-slate-500">Page {Math.min(taskPage, totalTaskPages)} of {totalTaskPages}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTaskPage((p) => Math.max(1, p - 1))}
                    disabled={taskPage <= 1}
                    className="rounded-md border border-slate-300 px-3 py-1 text-slate-700 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setTaskPage((p) => Math.min(totalTaskPages, p + 1))}
                    disabled={taskPage >= totalTaskPages}
                    className="rounded-md border border-slate-300 px-3 py-1 text-slate-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {activeItem === 'analytics' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Analytics & Reports</h2>
                  <p className="text-sm text-slate-500">Task completion, user engagement, team performance, and exportable reports.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={exportReportAsCsv}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </button>
                  <button
                    onClick={exportUserReportAsCsv}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    User Report CSV
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Printer className="h-4 w-4" />
                    Print / PDF
                  </button>
                </div>
              </div>

              <div className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Range</label>
                  <select
                    value={analyticsRangeDays}
                    onChange={(e) => setAnalyticsRangeDays(e.target.value as '7' | '30' | '90')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start Date</label>
                  <input
                    type="date"
                    value={analyticsStartDate}
                    onChange={(e) => setAnalyticsStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End Date</label>
                  <input
                    type="date"
                    value={analyticsEndDate}
                    onChange={(e) => setAnalyticsEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time Grouping</label>
                  <select
                    value={analyticsGranularity}
                    onChange={(e) => setAnalyticsGranularity(e.target.value as AnalyticsGranularity)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">User</label>
                  <select
                    value={reportUserFilter}
                    onChange={(e) => setReportUserFilter(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="all">All Users</option>
                    {normalizedUsers.map((user) => (
                      <option key={user.id} value={String(user.id)}>{`${user.name} (${user.email})`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Team</label>
                  <select
                    value={reportTeamFilter}
                    onChange={(e) => setReportTeamFilter(e.target.value as 'all' | 'Admin Team' | 'Tasker Team')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="all">All Teams</option>
                    <option value="Admin Team">Admin Team</option>
                    <option value="Tasker Team">Tasker Team</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
                  <select
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value as 'all' | TaskStatus)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    {taskStatusValues.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</label>
                  <select
                    value={reportPriorityFilter}
                    onChange={(e) => setReportPriorityFilter(e.target.value as 'all' | TaskPriority)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    {taskPriorityValues.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                  <select
                    value={reportCategoryFilter}
                    onChange={(e) => setReportCategoryFilter(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-900">{analyticsKpis.total}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Completed</p>
                  <p className="text-2xl font-bold text-emerald-700">{analyticsKpis.completed}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-amber-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700">Pending</p>
                  <p className="text-2xl font-bold text-amber-700">{analyticsKpis.pending}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-blue-700">In Progress</p>
                  <p className="text-2xl font-bold text-blue-700">{analyticsKpis.inProgress}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-rose-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-rose-700">Overdue</p>
                  <p className="text-2xl font-bold text-rose-700">{analyticsKpis.overdue}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-indigo-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-indigo-700">Completion Rate</p>
                  <p className="text-2xl font-bold text-indigo-700">{analyticsKpis.completionRate}%</p>
                </div>
              </div>

              <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Task Completion Trend</h3>
                  <div className="space-y-2">
                    {completionTrend.length === 0 ? <p className="text-sm text-slate-500">No time-based data in selected filters.</p> : null}
                    {completionTrend.map((row) => {
                      const denominator = Math.max(1, row.created);
                      const completedWidth = Math.min(100, Math.round((row.completed / denominator) * 100));
                      const overdueWidth = Math.min(100, Math.round((row.overdue / denominator) * 100));
                      return (
                        <div key={row.period} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{row.period}</span>
                            <span>{row.completed}/{row.created} completed</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${completedWidth}%` }} />
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200">
                            <div className="h-1.5 rounded-full bg-rose-500" style={{ width: `${overdueWidth}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Status Distribution (Pie-style)</h3>
                  <div className="mb-3 h-4 w-full overflow-hidden rounded-full bg-slate-200">
                    {(() => {
                      const total = Math.max(1, analyticsKpis.total);
                      const pendingWidth = Math.round((statusDistribution.pending / total) * 100);
                      const inProgressWidth = Math.round((statusDistribution['in-progress'] / total) * 100);
                      const completedWidth = Math.max(0, 100 - pendingWidth - inProgressWidth);
                      return (
                        <div className="flex h-full w-full">
                          <div className="bg-amber-400" style={{ width: `${pendingWidth}%` }} />
                          <div className="bg-blue-500" style={{ width: `${inProgressWidth}%` }} />
                          <div className="bg-emerald-500" style={{ width: `${completedWidth}%` }} />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-700">Pending: <span className="font-semibold">{statusDistribution.pending}</span></p>
                    <p className="text-slate-700">In Progress: <span className="font-semibold">{statusDistribution['in-progress']}</span></p>
                    <p className="text-slate-700">Completed: <span className="font-semibold">{statusDistribution.completed}</span></p>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Completion By User (Bar)</h3>
                  <div className="space-y-3">
                    {completionByUser.length === 0 ? <p className="text-sm text-slate-500">No user data in selected range.</p> : null}
                    {completionByUser.map((row) => (
                      <div key={row.user}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-800">{row.user}</span>
                          <span className="text-slate-600">{row.percent}% ({row.completed}/{row.total})</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200">
                          <div className="h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600" style={{ width: `${row.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Category vs Status (Stacked)</h3>
                  <div className="space-y-3">
                    {categoryStatusBreakdown.length === 0 ? <p className="text-sm text-slate-500">No category data in selected range.</p> : null}
                    {categoryStatusBreakdown.map((row) => {
                      const total = Math.max(1, row.pending + row['in-progress'] + row.completed);
                      return (
                        <div key={row.category}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-800">{row.category}</span>
                            <span className="text-slate-600">{total} tasks</span>
                          </div>
                          <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div className="bg-amber-400" style={{ width: `${Math.round((row.pending / total) * 100)}%` }} />
                            <div className="bg-blue-500" style={{ width: `${Math.round((row['in-progress'] / total) * 100)}%` }} />
                            <div className="bg-emerald-500" style={{ width: `${Math.round((row.completed / total) * 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Priority Distribution</h3>
                  <div className="space-y-3">
                    {taskPriorityValues.map((priority) => {
                      const total = Math.max(1, analyticsKpis.total);
                      const width = Math.round((priorityDistribution[priority] / total) * 100);
                      return (
                        <div key={priority}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium capitalize text-slate-800">{priority}</span>
                            <span className="text-slate-600">{priorityDistribution[priority]} ({width}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className={`h-2 rounded-full ${priority === 'high' ? 'bg-rose-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">User Engagement Heatmap (Task Events Proxy)</h3>
                  <p className="mb-3 text-xs text-slate-500">Uses task create/update timestamps as activity events when login/session telemetry is unavailable.</p>
                  <div className="overflow-x-auto">
                    <div className="grid min-w-155 grid-cols-24 gap-1">
                      {engagementHeatmap.flatMap((dayRow, dayIndex) =>
                        dayRow.map((value, hourIndex) => {
                          const level = value === 0 ? 'bg-slate-100' : value <= 2 ? 'bg-sky-200' : value <= 4 ? 'bg-sky-400' : 'bg-sky-600';
                          return (
                            <div
                              key={`${dayIndex}-${hourIndex}`}
                              title={`Day ${dayIndex}, Hour ${hourIndex}: ${value} events`}
                              className={`h-3 w-3 rounded-sm ${level}`}
                            />
                          );
                        }),
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span>Low</span>
                    <span className="inline-block h-2 w-6 rounded bg-slate-100" />
                    <span className="inline-block h-2 w-6 rounded bg-sky-200" />
                    <span className="inline-block h-2 w-6 rounded bg-sky-400" />
                    <span className="inline-block h-2 w-6 rounded bg-sky-600" />
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Individual User Reports</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">User</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">Team</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">Assigned</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">Completed</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">Pending</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">In Progress</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">Overdue</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">Avg Completion (hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {individualUserReports.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-3 py-6 text-center text-slate-500">No user report rows for current filters.</td>
                        </tr>
                      ) : (
                        individualUserReports.map((row) => (
                          <tr key={row.userId}>
                            <td className="px-3 py-2 font-medium text-slate-900">{row.name}</td>
                            <td className="px-3 py-2 text-slate-700">{row.team}</td>
                            <td className="px-3 py-2 text-slate-700">{row.assigned}</td>
                            <td className="px-3 py-2 text-slate-700">{row.completed}</td>
                            <td className="px-3 py-2 text-slate-700">{row.pending}</td>
                            <td className="px-3 py-2 text-slate-700">{row.inProgress}</td>
                            <td className="px-3 py-2 text-slate-700">{row.overdue}</td>
                            <td className="px-3 py-2 text-slate-700">{row.avgCompletionHours}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Team & Group Reports</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {teamReports.length === 0 ? (
                    <p className="text-sm text-slate-500">No team data available for selected filters.</p>
                  ) : (
                    teamReports.map((team) => (
                      <div key={team.team} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">{team.team}</p>
                        <p className="mt-1 text-xs text-slate-500">Active users: {team.activeUsers}</p>
                        <div className="mt-3 space-y-1 text-sm">
                          <p className="text-slate-700">Tasks: <span className="font-semibold">{team.tasks}</span></p>
                          <p className="text-slate-700">Completion Rate: <span className="font-semibold">{team.completionRate}%</span></p>
                          <p className="text-slate-700">Overdue: <span className="font-semibold">{team.overdue}</span></p>
                          <p className="text-slate-700">Avg Priority Score: <span className="font-semibold">{team.avgPriority}</span></p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          ) : null}

          {activeItem === 'rewards' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Gamification & Rewards Control</h2>
                <p className="text-sm text-slate-500">Manage badges, points, challenges, streaks, and reward redemptions to drive user engagement.</p>
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                {['badges', 'points', 'challenges', 'leaderboard', 'redemptions', 'analytics', 'rules'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setGamificationTab(tab as any)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      gamificationTab === tab
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {gamificationTab === 'badges' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Badge Management</h3>
                      <p className="text-sm text-slate-500">Create and manage achievement badges with tiers.</p>
                    </div>
                    <button
                      onClick={() => {
                        setBadgeModalMode('create');
                        setEditingBadgeId(null);
                        setBadgeForm({ name: '', tier: 'bronze', criteria: '', color: 'text-slate-600', icon: 'Star' });
                        setIsBadgeModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Create Badge
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {badges.map((badge) => (
                      <div key={badge.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Award className={`h-6 w-6 ${badge.color}`} />
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            badge.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                            badge.tier === 'silver' ? 'bg-slate-100 text-slate-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>{badge.tier}</span>
                        </div>
                        <p className="font-semibold text-slate-900">{badge.name}</p>
                        <p className="text-xs text-slate-500">{badge.criteria}</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              setBadgeModalMode('edit');
                              setEditingBadgeId(badge.id);
                              setBadgeForm(badge);
                              setIsBadgeModalOpen(true);
                            }}
                            className="flex-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBadge(badge.id)}
                            className="flex-1 rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 font-semibold text-slate-900">Badge Unlock Analytics</h4>
                    <div className="space-y-3">
                      {badgeUnlockRates.map((row) => (
                        <div key={row.badgeName}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-800">{row.badgeName}</span>
                            <span className="text-slate-600">{row.unlockRate}% ({row.unlockedCount}/{row.totalUsers})</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${row.unlockRate}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {gamificationTab === 'points' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Reward Points System</h3>
                    <p className="text-sm text-slate-500">Assign points per action type.</p>
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="text-sm text-slate-600">Task Completion</p>
                      <input
                        type="number"
                        value={pointsRules.taskComplete}
                        onChange={(e) => setPointsRules({ ...pointsRules, taskComplete: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
                      />
                      <p className="mt-2 text-xs text-slate-500 ">Base points per task</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="text-sm text-slate-600">High Priority Bonus</p>
                      <input
                        type="number"
                        value={pointsRules.highPriority}
                        onChange={(e) => setPointsRules({ ...pointsRules, highPriority: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
                      />
                      <p className="mt-2 text-xs text-slate-500">Bonus for high-priority</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="text-sm text-slate-600">Streak Day</p>
                      <input
                        type="number"
                        value={pointsRules.streakDay}
                        onChange={(e) => setPointsRules({ ...pointsRules, streakDay: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
                      />
                      <p className="mt-2 text-xs text-slate-500">Points per streak day</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <h4 className="mb-3 font-semibold text-slate-900">Total Points Distributed: <span className="text-indigo-600">{totalPointsDistributed.toLocaleString()}</span></h4>
                    <div className="grid gap-4 md:grid-cols-4">
                      {userPoints.slice(0, 4).map((up) => (
                        <div key={up.userId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs text-slate-600">{up.name}</p>
                          <p className="text-lg font-bold text-indigo-600">{up.totalPoints.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">This week: {up.weeklyPoints}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {gamificationTab === 'challenges' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Streaks & Challenges</h3>
                      <p className="text-sm text-slate-500">Create time-based challenges to drive engagement.</p>
                    </div>
                    <button
                      onClick={() => {
                        setChallengeModalMode('create');
                        setEditingChallengeId(null);
                        setChallengeForm({ name: '', description: '', type: 'weekly', target: 0, reward: 0, isActive: true, startDate: '', endDate: '' });
                        setIsChallengeModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Create Challenge
                    </button>
                  </div>

                  <div className="space-y-4">
                    {challenges.map((challenge) => (
                      <div key={challenge.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{challenge.name}</p>
                            <p className="text-sm text-slate-600">{challenge.description}</p>
                          </div>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${challenge.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {challenge.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mb-3 grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-slate-500">Type</p>
                            <p className="font-semibold text-slate-900 capitalize">{challenge.type}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Target</p>
                            <p className="font-semibold text-slate-900">{challenge.target}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Reward</p>
                            <p className="font-semibold text-slate-900">{challenge.reward} pts</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setChallengeModalMode('edit');
                              setEditingChallengeId(challenge.id);
                              setChallengeForm(challenge);
                              setIsChallengeModalOpen(true);
                            }}
                            className="flex-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            className="flex-1 rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 font-semibold text-slate-900">Challenge Completion Stats</h4>
                    <div className="space-y-3">
                      {challengeStats.map((stat) => (
                        <div key={stat.challengeName}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-800">{stat.challengeName}</span>
                            <span className="text-slate-600">{stat.completionRate}% ({stat.completions}/{stat.participants})</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${stat.completionRate}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {gamificationTab === 'leaderboard' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Leaderboard & Rankings</h3>
                    <p className="text-sm text-slate-500">Top-performing users by points and engagement.</p>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Rank</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">User</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Total Points</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Weekly Points</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Badges</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Streak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {leaderboard.map((user, index) => (
                          <tr key={user.userId} className={index < 3 ? 'bg-indigo-50' : ''}>
                            <td className="px-4 py-3">
                              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-bold text-white ${
                                index === 0 ? 'bg-yellow-500' :
                                index === 1 ? 'bg-slate-400' :
                                index === 2 ? 'bg-amber-600' :
                                'bg-slate-300'
                              }`}>{index + 1}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                            <td className="px-4 py-3 font-semibold text-indigo-600">{user.totalPoints.toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-700">{user.weeklyPoints}</td>
                            <td className="px-4 py-3"><span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"><Award className="h-3 w-3" /> {user.badgesEarned}</span></td>
                            <td className="px-4 py-3"><span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700"><Zap className="h-3 w-3" /> {user.streakDays}d</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {gamificationTab === 'redemptions' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Reward Redemption</h3>
                      <p className="text-sm text-slate-500">Manage reward catalog and redemptions.</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRedemptionUser(null);
                        setSelectedRedemptionReward(null);
                        setIsRedemptionModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Package className="h-4 w-4" />
                      Award Reward
                    </button>
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-2">
                    {rewardItems.map((reward: RewardItem) => (
                      <div key={reward.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{reward.name}</p>
                            <p className="text-xs text-slate-500">{reward.category}</p>
                          </div>
                          <span className="rounded-lg bg-indigo-100 px-2 py-1 font-bold text-indigo-700">{reward.pointCost}</span>
                        </div>
                        <p className="mb-3 text-sm text-slate-600">{reward.description}</p>
                        <button className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          View Claims
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 font-semibold text-slate-900">Redemption History</h4>
                    <p className="text-sm text-slate-600">Last 5 rewards claimed:</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <span>John Doe claimed <strong>Coffee Card $10</strong></span>
                        <span className="text-slate-500">2 hrs ago</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
                        <span>Jane Smith claimed <strong>Priority Task Badge</strong></span>
                        <span className="text-slate-500">5 hrs ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {gamificationTab === 'analytics' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Gamification Analytics</h3>
                    <p className="text-sm text-slate-500">Track engagement and progression through gamified features.</p>
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-indigo-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-indigo-700">Total Points Earned</p>
                      <p className="text-2xl font-bold text-indigo-700">{totalPointsDistributed.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-emerald-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-emerald-700">Badges Unlocked</p>
                      <p className="text-2xl font-bold text-emerald-700">{userPoints.reduce((sum, up) => sum + up.badgesEarned, 0)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-blue-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-blue-700">Avg Streak</p>
                      <p className="text-2xl font-bold text-blue-700">{(userPoints.reduce((sum, up) => sum + up.streakDays, 0) / Math.max(1, userPoints.length)).toFixed(1)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-rose-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-rose-700">Active Challenges</p>
                      <p className="text-2xl font-bold text-rose-700">{challenges.filter((c) => c.isActive).length}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <h4 className="mb-3 font-semibold text-slate-900">Points Distribution</h4>
                      <div className="space-y-3">
                        {userPoints.slice(0, 5).map((up) => (
                          <div key={up.userId}>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-800">{up.name}</span>
                              <span className="text-slate-600">{up.totalPoints}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-200">
                              <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${Math.min(100, (up.totalPoints / (userPoints[0]?.totalPoints || 1)) * 100)}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                      <h4 className="mb-3 font-semibold text-slate-900">Badge Popularity</h4>
                      <div className="space-y-2">
                        {badgeUnlockRates.map((badge) => (
                          <div key={badge.badgeName} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                            <span className="font-medium text-slate-900">{badge.badgeName}</span>
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-bold text-indigo-700">{badge.unlockedCount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {gamificationTab === 'rules' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Rule Control & Customization</h3>
                    <p className="text-sm text-slate-500">Configure gamification rules and thresholds.</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <label className="mb-2 block text-sm font-medium text-slate-700">Streak Reset Days (inactivity)</label>
                      <input
                        type="number"
                        value={gamificationRules.streakResetDays}
                        onChange={(e) => setGamificationRules({ ...gamificationRules, streakResetDays: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-slate-500">Days before streak resets</p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                      <label className="mb-2 block text-sm font-medium text-slate-700">Point Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={gamificationRules.pointMultiplier}
                        onChange={(e) => setGamificationRules({ ...gamificationRules, pointMultiplier: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-slate-500">Apply multiplier to all points</p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                      <label className="mb-2 block text-sm font-medium text-slate-700">Leaderboard Visibility</label>
                      <select
                        value={gamificationRules.leaderboardVisibility}
                        onChange={(e) => setGamificationRules({ ...gamificationRules, leaderboardVisibility: e.target.value as 'team' | 'global' })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="team">Team Only</option>
                        <option value="global">Global</option>
                      </select>
                      <p className="mt-1 text-xs text-slate-500">Who can see leaderboards</p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                      <label className="mb-2 block text-sm font-medium text-slate-700">Seasonal Bonus (%)</label>
                      <input
                        type="number"
                        value={gamificationRules.seasonalBonus}
                        onChange={(e) => setGamificationRules({ ...gamificationRules, seasonalBonus: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-slate-500">Bonus for seasonal events</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Auto-unlock Badges:</strong> Currently <strong>{gamificationRules.badgeAutoUnlock ? 'Enabled' : 'Disabled'}</strong>
                    </p>
                    <button
                      onClick={() => setGamificationRules({ ...gamificationRules, badgeAutoUnlock: !gamificationRules.badgeAutoUnlock })}
                      className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      {gamificationRules.badgeAutoUnlock ? 'Disable' : 'Enable'} Auto-unlock
                    </button>
                  </div>

                  <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 font-semibold text-slate-900">Gamification Status</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-700">Active Badges: <strong>{badges.length}</strong></p>
                      <p className="text-slate-700">Active Challenges: <strong>{challenges.filter((c) => c.isActive).length}</strong></p>
                      <p className="text-slate-700">Reward Items: <strong>{rewardItems.length}</strong></p>
                      <p className="text-slate-700">Users Engaged: <strong>{userPoints.filter((up) => up.totalPoints > 0).length}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              {isBadgeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                  <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{badgeModalMode === 'create' ? 'Create Badge' : 'Edit Badge'}</h3>
                      </div>
                      <button onClick={() => setIsBadgeModalOpen(false)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Badge Name</label>
                        <input
                          type="text"
                          value={badgeForm.name}
                          onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Tier</label>
                        <select
                          value={badgeForm.tier}
                          onChange={(e) => setBadgeForm({ ...badgeForm, tier: e.target.value as 'bronze' | 'silver' | 'gold' })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="bronze">Bronze</option>
                          <option value="silver">Silver</option>
                          <option value="gold">Gold</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Unlock Criteria</label>
                        <input
                          type="text"
                          value={badgeForm.criteria}
                          onChange={(e) => setBadgeForm({ ...badgeForm, criteria: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="e.g., 'Complete 10 tasks'"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsBadgeModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          Cancel
                        </button>
                        <button type="button" onClick={handleSaveBadge} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                          Save Badge
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {isChallengeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                  <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{challengeModalMode === 'create' ? 'Create Challenge' : 'Edit Challenge'}</h3>
                      </div>
                      <button onClick={() => setIsChallengeModalOpen(false)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Challenge Name</label>
                        <input
                          type="text"
                          value={challengeForm.name}
                          onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                          rows={2}
                          value={challengeForm.description}
                          onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                          <select
                            value={challengeForm.type}
                            onChange={(e) => setChallengeForm({ ...challengeForm, type: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="special">Special Event</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Target</label>
                          <input
                            type="number"
                            value={challengeForm.target}
                            onChange={(e) => setChallengeForm({ ...challengeForm, target: Number(e.target.value) })}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Reward Points</label>
                        <input
                          type="number"
                          value={challengeForm.reward}
                          onChange={(e) => setChallengeForm({ ...challengeForm, reward: Number(e.target.value) })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsChallengeModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          Cancel
                        </button>
                        <button type="button" onClick={handleSaveChallenge} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                          Save Challenge
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {isRedemptionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                  <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">Award Reward</h3>
                      <button onClick={() => setIsRedemptionModalOpen(false)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Select User</label>
                        <select
                          value={selectedRedemptionUser || ''}
                          onChange={(e) => setSelectedRedemptionUser(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">Choose user</option>
                          {normalizedUsers.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Select Reward</label>
                        <select
                          value={selectedRedemptionReward || ''}
                          onChange={(e) => setSelectedRedemptionReward(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">Choose reward</option>
                          {rewardItems.map((reward: RewardItem) => (
                            <option key={reward.id} value={reward.id}>{reward.name} ({reward.pointCost} pts)</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsRedemptionModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAwardReward}
                          disabled={!selectedRedemptionUser || !selectedRedemptionReward}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Award Reward
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {isChallengeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                  <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{challengeModalMode === 'create' ? 'Create Challenge' : 'Edit Challenge'}</h3>
                      </div>
                      <button onClick={() => setIsChallengeModalOpen(false)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Challenge Name</label>
                        <input
                          type="text"
                          value={challengeForm.name}
                          onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                        <textarea
                          rows={2}
                          value={challengeForm.description}
                          onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                          <select
                            value={challengeForm.type}
                            onChange={(e) => setChallengeForm({ ...challengeForm, type: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="special">Special Event</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Target</label>
                          <input
                            type="number"
                            value={challengeForm.target}
                            onChange={(e) => setChallengeForm({ ...challengeForm, target: Number(e.target.value) })}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Reward Points</label>
                        <input
                          type="number"
                          value={challengeForm.reward}
                          onChange={(e) => setChallengeForm({ ...challengeForm, reward: Number(e.target.value) })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsChallengeModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          Cancel
                        </button>
                        <button type="button" onClick={handleSaveChallenge} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                          Save Challenge
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {isRedemptionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                  <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">Award Reward</h3>
                      <button onClick={() => setIsRedemptionModalOpen(false)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Select User</label>
                        <select
                          value={selectedRedemptionUser || ''}
                          onChange={(e) => setSelectedRedemptionUser(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">Choose user</option>
                          {normalizedUsers.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Select Reward</label>
                        <select
                          value={selectedRedemptionReward || ''}
                          onChange={(e) => setSelectedRedemptionReward(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">Choose reward</option>
                          {rewardItems.map((reward: RewardItem) => (
                            <option key={reward.id} value={reward.id}>{reward.name} ({reward.pointCost} pts)</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsRedemptionModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAwardReward}
                          disabled={!selectedRedemptionUser || !selectedRedemptionReward}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Award Reward
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          ) : null}

          {activeItem === 'settings' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Settings</h2>
                  <p className="mt-2 text-sm text-slate-500">Configure workspace defaults, notifications, security policies, and task governance.</p>
                  {settingsSavedAt ? <p className="mt-1 text-xs font-medium text-emerald-700">Last saved at {settingsSavedAt}</p> : null}
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isUpdatingSettings || settingsLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdatingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>

              {settingsError ? <p className="mb-4 text-sm font-medium text-rose-600">{settingsError}</p> : null}

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5 xl:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">My Details</h3>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Account Settings</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-slate-700">
                      Full Name
                      <input
                        value={myDetailsForm.name}
                        onChange={(e) => setMyDetailsForm({ ...myDetailsForm, name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Email Address
                      <input
                        type="email"
                        value={myDetailsForm.email}
                        onChange={(e) => setMyDetailsForm({ ...myDetailsForm, email: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Phone Number
                      <input
                        value={myDetailsForm.phone}
                        onChange={(e) => setMyDetailsForm({ ...myDetailsForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      New Password (optional)
                      <input
                        type="password"
                        value={myDetailsForm.newPassword}
                        onChange={(e) => setMyDetailsForm({ ...myDetailsForm, newPassword: e.target.value })}
                        placeholder="Leave blank to keep current password"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>

                  {myDetailsError ? <p className="mt-3 text-sm font-medium text-rose-600">{myDetailsError}</p> : null}
                  {myDetailsMessage ? <p className="mt-3 text-sm font-medium text-emerald-700">{myDetailsMessage}</p> : null}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleUpdateMyDetails}
                      disabled={isUpdatingUser}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdatingUser ? 'Updating...' : 'Update My Details'}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Workspace Defaults</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-slate-700 sm:col-span-2">
                      Workspace Name
                      <input
                        value={platformSettings.workspaceName}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, workspaceName: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Timezone
                      <select
                        value={platformSettings.timezone}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        {(settingsData?.options.timezones || []).map((timezone) => (
                          <option key={timezone} value={timezone}>{timezone}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm text-slate-700">
                      Default Task Priority
                      <select
                        value={platformSettings.defaultTaskPriority}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, defaultTaskPriority: e.target.value as TaskPriority })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        {(settingsData?.options.taskPriorities || []).map((priority) => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Task Governance</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-slate-700">
                      Reminder Cadence (hours)
                      <input
                        type="number"
                        min={1}
                        value={platformSettings.reminderCadenceHours}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, reminderCadenceHours: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Overdue Threshold (days)
                      <input
                        type="number"
                        min={1}
                        value={platformSettings.overdueThresholdDays}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, overdueThresholdDays: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700 sm:col-span-2">
                      Auto-archive completed tasks after (days)
                      <input
                        type="number"
                        min={1}
                        value={platformSettings.autoArchiveCompletedDays}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, autoArchiveCompletedDays: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      Email digest notifications
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailDigest}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailDigest: e.target.checked })}
                        className="h-4 w-4"
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      Due soon alerts
                      <input
                        type="checkbox"
                        checked={notificationSettings.dueSoonAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, dueSoonAlerts: e.target.checked })}
                        className="h-4 w-4"
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      Overdue escalation alerts
                      <input
                        type="checkbox"
                        checked={notificationSettings.overdueEscalation}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, overdueEscalation: e.target.checked })}
                        className="h-4 w-4"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Weekly summary day
                      <select
                        value={notificationSettings.weeklySummaryDay}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklySummaryDay: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        {(settingsData?.options.weeklySummaryDays || []).map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Security Policies</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 sm:col-span-2">
                      Enforce Two-Factor Authentication for admins
                      <input
                        type="checkbox"
                        checked={securitySettings.enforceTwoFactor}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, enforceTwoFactor: e.target.checked })}
                        className="h-4 w-4"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Session timeout (minutes)
                      <input
                        type="number"
                        min={5}
                        value={securitySettings.sessionTimeoutMinutes}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeoutMinutes: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700">
                      Password rotation (days)
                      <input
                        type="number"
                        min={30}
                        value={securitySettings.passwordRotationDays}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordRotationDays: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm text-slate-700 sm:col-span-2">
                      Failed login attempt limit
                      <input
                        type="number"
                        min={3}
                        value={securitySettings.loginAttemptLimit}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttemptLimit: Number(e.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
};
