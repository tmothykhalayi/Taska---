import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';
import type { TaskPriority } from '../Tasks/tasksApi';

export type PlatformSettings = {
  workspaceName: string;
  timezone: string;
  defaultTaskPriority: TaskPriority;
  reminderCadenceHours: number;
  overdueThresholdDays: number;
  autoArchiveCompletedDays: number;
};

export type NotificationSettings = {
  emailDigest: boolean;
  dueSoonAlerts: boolean;
  overdueEscalation: boolean;
  weeklySummaryDay: string;
};

export type SecuritySettings = {
  enforceTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  passwordRotationDays: number;
  loginAttemptLimit: number;
};

export type SettingsOptions = {
  timezones: string[];
  taskPriorities: TaskPriority[];
  weeklySummaryDays: string[];
};

export type SettingsResponse = {
  platformSettings: PlatformSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  options: SettingsOptions;
  updatedAt: string;
};

export type UpdateSettingsPayload = {
  platformSettings: PlatformSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
};

export const settingsAPI = createApi({
  reducerPath: 'settingsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/settings`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsResponse, void>({
      query: () => '',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<SettingsResponse, UpdateSettingsPayload>({
      query: (body) => ({
        url: '',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsAPI;
