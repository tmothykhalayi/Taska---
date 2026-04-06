import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Cloud,
  Eye,
  KeyRound,
  Languages,
  LayoutGrid,
  Link,
  Lock,
  Mail,
  Moon,
  Shield,
  Sun,
  Trash2,
  User,
  UserRoundCog,
  Zap,
} from 'lucide-react';

type ThemeMode = 'light' | 'dark' | 'system';
type DensityMode = 'comfortable' | 'compact';
type LayoutMode = 'list' | 'grid';
type DuePreset = '1-day' | '3-days' | '1-week';

export const Dashboard = () => {
  const [profile, setProfile] = useState({
    name: 'John Tasker',
    email: 'john.tasker@example.com',
    profilePicture: 'https://i.pravatar.cc/120?img=12',
    bio: 'I enjoy planning deep-work sessions and closing high-impact tasks.',
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    github: false,
  });

  const [notifications, setNotifications] = useState({
    taskReminders: true,
    dailyInspirations: true,
    checkInAlerts: false,
    deliveryChannel: 'both' as 'email' | 'push' | 'both',
  });

  const [privacy, setPrivacy] = useState({
    twoFactorEnabled: false,
    showProfile: true,
    showAchievements: true,
    showGamificationData: true,
  });

  const [appPreferences, setAppPreferences] = useState({
    theme: 'system' as ThemeMode,
    language: 'English',
    density: 'comfortable' as DensityMode,
    layoutMode: 'list' as LayoutMode,
  });

  const [gamificationSettings, setGamificationSettings] = useState({
    showBadgesPublicly: true,
    showRewardsPublicly: false,
    streakNotifications: true,
  });

  const [taskDefaults, setTaskDefaults] = useState({
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDatePreset: '1-week' as DuePreset,
    category: 'General',
  });

  const [integrations, setIntegrations] = useState({
    googleCalendar: true,
    outlookCalendar: false,
    cloudBackup: true,
  });

  const activeSessions = [
    { device: 'Windows Chrome', location: 'Nairobi, KE', lastSeen: 'Active now' },
    { device: 'Android App', location: 'Nairobi, KE', lastSeen: '2 hours ago' },
  ];

  const activityLog = [
    { event: 'Password updated', timestamp: 'Apr 5, 2026 - 18:40' },
    { event: 'Logged in from new browser', timestamp: 'Apr 4, 2026 - 09:10' },
    { event: 'Connected Google account', timestamp: 'Apr 2, 2026 - 14:32' },
  ];

  const apiTokens = [
    { name: 'Automation Bot', createdAt: 'Mar 20, 2026', lastUsed: 'Apr 5, 2026' },
    { name: 'Analytics Exporter', createdAt: 'Feb 11, 2026', lastUsed: 'Apr 1, 2026' },
  ];

  const handleSave = (sectionName: string) => {
    window.alert(`${sectionName} saved successfully.`);
  };

  const handleDangerAction = (action: 'deactivate' | 'delete' | 'export') => {
    const label = action === 'deactivate' ? 'Account deactivated' : action === 'delete' ? 'Account deleted' : 'Data export started';
    window.alert(label);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Tasker Dashboard</h1>
          <p className="text-sm text-slate-600">Track your tasks, streaks, and rewards</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <p className="mt-4 text-sm text-slate-600">Active Tasks</p>
            <p className="text-3xl font-bold text-slate-900">12</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <p className="mt-4 text-sm text-slate-600">Upcoming</p>
            <p className="text-3xl font-bold text-slate-900">4</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Zap className="h-8 w-8 text-amber-600" />
            <p className="mt-4 text-sm text-slate-600">Streak</p>
            <p className="text-3xl font-bold text-slate-900">9 days</p>
          </div>
        </div>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Settings</h2>
            <p className="text-sm text-slate-600">Configure your account, preferences, notifications, integrations, and defaults.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <UserRoundCog className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">1. Profile Management</h3>
              </div>
              <div className="grid gap-3">
                <label className="text-sm text-slate-700">
                  Name
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Email
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Profile Picture URL
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={profile.profilePicture}
                    onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Bio
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-3">
                  <label className="text-sm text-slate-700">
                    Current Password
                    <input
                      type="password"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    />
                  </label>
                  <label className="text-sm text-slate-700">
                    New Password
                    <input
                      type="password"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={passwordForm.next}
                      onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                    />
                  </label>
                  <label className="text-sm text-slate-700">
                    Confirm Password
                    <input
                      type="password"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    />
                  </label>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-medium">Linked Accounts</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setLinkedAccounts((prev) => ({ ...prev, google: !prev.google }))}
                      className="rounded-lg border border-slate-300 px-3 py-1.5"
                    >
                      {linkedAccounts.google ? 'Disconnect Google' : 'Connect Google'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLinkedAccounts((prev) => ({ ...prev, github: !prev.github }))}
                      className="rounded-lg border border-slate-300 px-3 py-1.5"
                    >
                      {linkedAccounts.github ? 'Disconnect GitHub' : 'Connect GitHub'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500">Benefit: Users can manage personal info and secure their accounts.</p>
                <button type="button" onClick={() => handleSave('Profile Management')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                  Save Profile
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">2. Notification Preferences</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Task Reminders
                  <input type="checkbox" checked={notifications.taskReminders} onChange={(e) => setNotifications({ ...notifications, taskReminders: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Daily Inspirations
                  <input type="checkbox" checked={notifications.dailyInspirations} onChange={(e) => setNotifications({ ...notifications, dailyInspirations: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Check-in Alerts
                  <input type="checkbox" checked={notifications.checkInAlerts} onChange={(e) => setNotifications({ ...notifications, checkInAlerts: e.target.checked })} />
                </label>
                <label>
                  Delivery Channel
                  <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={notifications.deliveryChannel} onChange={(e) => setNotifications({ ...notifications, deliveryChannel: e.target.value as 'email' | 'push' | 'both' })}>
                    <option value="both">Email + Push</option>
                    <option value="email">Email only</option>
                    <option value="push">Push only</option>
                  </select>
                </label>
                <p className="text-xs text-slate-500">Benefit: Users control how and when they are notified.</p>
                <button type="button" onClick={() => handleSave('Notification Preferences')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                  Save Notifications
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-900">3. Privacy & Security</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Two-Factor Authentication (2FA)
                  <input type="checkbox" checked={privacy.twoFactorEnabled} onChange={(e) => setPrivacy({ ...privacy, twoFactorEnabled: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Show Profile Publicly
                  <input type="checkbox" checked={privacy.showProfile} onChange={(e) => setPrivacy({ ...privacy, showProfile: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Show Achievements
                  <input type="checkbox" checked={privacy.showAchievements} onChange={(e) => setPrivacy({ ...privacy, showAchievements: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Share Gamification Data
                  <input type="checkbox" checked={privacy.showGamificationData} onChange={(e) => setPrivacy({ ...privacy, showGamificationData: e.target.checked })} />
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 font-medium text-slate-800">Account Activity Logs</p>
                  <div className="space-y-1 text-xs">
                    {activityLog.map((log) => (
                      <p key={log.timestamp}>{log.event} - {log.timestamp}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 font-medium text-slate-800">Active Sessions</p>
                  <div className="space-y-2 text-xs">
                    {activeSessions.map((session) => (
                      <p key={`${session.device}-${session.lastSeen}`}>{session.device} - {session.location} - {session.lastSeen}</p>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">Benefit: Ensures account security and gives control over personal data.</p>
                <button type="button" onClick={() => handleSave('Privacy & Security')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                  Save Security Settings
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-fuchsia-600" />
                <h3 className="font-semibold text-slate-900">4. App Preferences</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <label>
                  Theme
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setAppPreferences({ ...appPreferences, theme: 'light' })} className={`rounded-lg border px-3 py-2 ${appPreferences.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}`}><Sun className="mx-auto h-4 w-4" />Light</button>
                    <button type="button" onClick={() => setAppPreferences({ ...appPreferences, theme: 'dark' })} className={`rounded-lg border px-3 py-2 ${appPreferences.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}`}><Moon className="mx-auto h-4 w-4" />Dark</button>
                    <button type="button" onClick={() => setAppPreferences({ ...appPreferences, theme: 'system' })} className={`rounded-lg border px-3 py-2 ${appPreferences.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}`}><User className="mx-auto h-4 w-4" />System</button>
                  </div>
                </label>

                <label>
                  Language
                  <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={appPreferences.language} onChange={(e) => setAppPreferences({ ...appPreferences, language: e.target.value })}>
                    <option>English</option>
                    <option>Swahili</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </label>

                <label>
                  Card Density
                  <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={appPreferences.density} onChange={(e) => setAppPreferences({ ...appPreferences, density: e.target.value as DensityMode })}>
                    <option value="comfortable">Comfortable</option>
                    <option value="compact">Compact</option>
                  </select>
                </label>

                <label>
                  Layout Mode
                  <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={appPreferences.layoutMode} onChange={(e) => setAppPreferences({ ...appPreferences, layoutMode: e.target.value as LayoutMode })}>
                    <option value="list">List</option>
                    <option value="grid">Grid</option>
                  </select>
                </label>
                <p className="text-xs text-slate-500">Benefit: Improves usability and accessibility for diverse users.</p>
                <button type="button" onClick={() => handleSave('App Preferences')} className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white">
                  Save App Preferences
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900">5. Gamification Settings</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Show Badges Publicly
                  <input type="checkbox" checked={gamificationSettings.showBadgesPublicly} onChange={(e) => setGamificationSettings({ ...gamificationSettings, showBadgesPublicly: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Show Rewards Publicly
                  <input type="checkbox" checked={gamificationSettings.showRewardsPublicly} onChange={(e) => setGamificationSettings({ ...gamificationSettings, showRewardsPublicly: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Streak Notifications
                  <input type="checkbox" checked={gamificationSettings.streakNotifications} onChange={(e) => setGamificationSettings({ ...gamificationSettings, streakNotifications: e.target.checked })} />
                </label>
                <p className="text-xs text-slate-500">Benefit: Lets users control gamification visibility and engagement.</p>
                <button type="button" onClick={() => handleSave('Gamification Settings')} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white">
                  Save Gamification Settings
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-900">6. Task Defaults</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <label>
                  Default Task Priority
                  <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={taskDefaults.priority} onChange={(e) => setTaskDefaults({ ...taskDefaults, priority: e.target.value as 'high' | 'medium' | 'low' })}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
                <label>
                  Default Due Date
                  <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={taskDefaults.dueDatePreset} onChange={(e) => setTaskDefaults({ ...taskDefaults, dueDatePreset: e.target.value as DuePreset })}>
                    <option value="1-day">+1 day</option>
                    <option value="3-days">+3 days</option>
                    <option value="1-week">+1 week</option>
                  </select>
                </label>
                <label>
                  Default Category
                  <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={taskDefaults.category} onChange={(e) => setTaskDefaults({ ...taskDefaults, category: e.target.value })} />
                </label>
                <p className="text-xs text-slate-500">Benefit: Speeds up task creation and keeps workflow consistent.</p>
                <button type="button" onClick={() => handleSave('Task Defaults')} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white">
                  Save Task Defaults
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Link className="h-5 w-5 text-violet-600" />
                <h3 className="font-semibold text-slate-900">7. Connected Services & Integrations</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Google Calendar Integration
                  <input type="checkbox" checked={integrations.googleCalendar} onChange={(e) => setIntegrations({ ...integrations, googleCalendar: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Outlook Calendar Integration
                  <input type="checkbox" checked={integrations.outlookCalendar} onChange={(e) => setIntegrations({ ...integrations, outlookCalendar: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  Cloud Backup
                  <input type="checkbox" checked={integrations.cloudBackup} onChange={(e) => setIntegrations({ ...integrations, cloudBackup: e.target.checked })} />
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-slate-700" />
                    <p className="font-medium text-slate-800">API Tokens</p>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    {apiTokens.map((token) => (
                      <div key={token.name} className="rounded-md border border-slate-200 bg-white px-2 py-1">
                        <p>{token.name}</p>
                        <p>Created: {token.createdAt} | Last Used: {token.lastUsed}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">Benefit: Increases productivity by connecting Taska to external tools.</p>
                <button type="button" onClick={() => handleSave('Connected Services')} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white">
                  Save Integrations
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-rose-200 bg-rose-50 p-4 lg:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-rose-600" />
                <h3 className="font-semibold text-rose-900">8. Account Actions</h3>
              </div>
              <p className="mb-4 text-sm text-rose-800">Use these carefully. Deactivation is temporary; deletion is permanent.</p>
              <div className="grid gap-3 md:grid-cols-3">
                <button type="button" onClick={() => handleDangerAction('deactivate')} className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700">
                  Deactivate Account
                </button>
                <button type="button" onClick={() => handleDangerAction('delete')} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white">
                  <Trash2 className="mr-2 inline h-4 w-4" />
                  Delete Account
                </button>
                <button type="button" onClick={() => handleDangerAction('export')} className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700">
                  <Cloud className="mr-2 inline h-4 w-4" />
                  Export Data
                </button>
              </div>
              <p className="mt-3 text-xs text-rose-700">Benefit: Gives full control over user data and account lifecycle.</p>
            </article>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="inline-flex items-center gap-2"><Languages className="h-4 w-4" />This settings layout is ready for backend integration by replacing local state with API mutations.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
