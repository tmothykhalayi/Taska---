import { useMemo, useState } from 'react';
import {
  Shield,
  Users,
  CheckCircle,
  TrendingUp,
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
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from '../../features/Tasks/tasksApi';

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

const tablePageSize = 10;

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

export const AdminDashboard = () => {
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

  const { data: users = [], isLoading: usersLoading, isFetching: usersFetching } = useGetUsersQuery();
  const { data: tasks = [], isLoading: tasksLoading, isFetching: tasksFetching } = useGetAllTasksQuery();

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();

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

  const analyticsTasks = useMemo(() => {
    const days = Number(analyticsRangeDays);
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);
    return normalizedTasks.filter((task) => {
      if (!task.createdAt) return false;
      const created = new Date(task.createdAt);
      return created.getTime() >= threshold.getTime();
    });
  }, [analyticsRangeDays, normalizedTasks]);

  const completionByUser = useMemo(() => {
    const bucket = new Map<string, { total: number; completed: number }>();
    analyticsTasks.forEach((task) => {
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
  }, [analyticsTasks]);

  const completionByCategory = useMemo(() => {
    const bucket = new Map<string, { total: number; completed: number }>();
    analyticsTasks.forEach((task) => {
      const key = task.category || 'General';
      const current = bucket.get(key) || { total: 0, completed: 0 };
      current.total += 1;
      if (task.status === 'completed') current.completed += 1;
      bucket.set(key, current);
    });
    return Array.from(bucket.entries())
      .map(([category, stats]) => ({
        category,
        total: stats.total,
        completed: stats.completed,
        percent: stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [analyticsTasks]);

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

  const closeTaskEditModal = () => {
    setIsTaskEditModalOpen(false);
    setEditingTaskId(null);
    setTaskFormError('');
  };

  const handleTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId) return;

    if (!taskForm.title.trim()) {
      setTaskFormError('Task title is required.');
      return;
    }

    if (!taskForm.userId) {
      setTaskFormError('Please assign this task to a user.');
      return;
    }

    try {
      await updateTask({
        id: editingTaskId,
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
      closeTaskEditModal();
    } catch (error: any) {
      setTaskFormError(error?.data?.message || 'Failed to update task.');
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 md:flex">
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
                <h3 className="text-xl font-bold text-slate-900">Edit / Reassign Task</h3>
                <p className="text-sm text-slate-500">Update details and reassign to another user.</p>
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
                <button type="submit" disabled={isUpdatingTask} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {isUpdatingTask ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {mobileOpen && (
        <button onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-900/50 md:hidden" aria-label="Close admin menu overlay" />
      )}

      <aside className={`fixed left-0 top-0 z-40 h-full w-72 border-r border-slate-200 bg-white p-4 shadow-xl transition-transform md:static md:translate-x-0 md:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Taska Admin</p>
              <p className="text-xs text-slate-500">Control Center</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Close admin menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
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
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <ItemIcon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50">
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
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
              </div>
            </div>
          </header>

          {activeItem === 'dashboard-overview' ? (
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Users className="h-8 w-8 text-blue-600" />
                <p className="mt-4 text-sm text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{normalizedUsers.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <ClipboardList className="h-8 w-8 text-indigo-600" />
                <p className="mt-4 text-sm text-slate-600">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{normalizedTasks.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <p className="mt-4 text-sm text-slate-600">Completed Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{normalizedTasks.filter((t) => t.status === 'completed').length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <CalendarClock className="h-8 w-8 text-rose-600" />
                <p className="mt-4 text-sm text-slate-600">Overdue Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{normalizedTasks.filter((t) => t.isOverdue).length}</p>
              </div>
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
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Task Completion Analytics</h2>
                  <p className="text-sm text-slate-500">Track completion trends per user and category.</p>
                </div>
                <select
                  value={analyticsRangeDays}
                  onChange={(e) => setAnalyticsRangeDays(e.target.value as '7' | '30' | '90')}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>

              <div className="mb-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Tasks In Range</p>
                  <p className="text-2xl font-bold text-slate-900">{analyticsTasks.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-emerald-700">{analyticsTasks.filter((t) => t.status === 'completed').length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Overdue</p>
                  <p className="text-2xl font-bold text-rose-700">{analyticsTasks.filter((t) => t.isOverdue).length}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Completion By User</h3>
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

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Completion By Category</h3>
                  <div className="space-y-3">
                    {completionByCategory.length === 0 ? <p className="text-sm text-slate-500">No category data in selected range.</p> : null}
                    {completionByCategory.map((row) => (
                      <div key={row.category}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-800">{row.category}</span>
                          <span className="text-slate-600">{row.percent}% ({row.completed}/{row.total})</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200">
                          <div className="h-2 rounded-full bg-linear-to-r from-emerald-500 to-teal-600" style={{ width: `${row.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {activeItem === 'rewards' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Rewards</h2>
              <p className="mt-2 text-sm text-slate-500">Reward tracking can be connected to completion analytics for badge automation.</p>
            </section>
          ) : null}

          {activeItem === 'settings' ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Settings</h2>
              <p className="mt-2 text-sm text-slate-500">Configure monitoring thresholds, reminder cadence, and notification templates.</p>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
};
