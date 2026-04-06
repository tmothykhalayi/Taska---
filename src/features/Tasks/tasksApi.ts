import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TaskUser {
  id: number;
  user_id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  category?: string;
  completed?: boolean;
  user?: TaskUser;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: string;
  dueDate?: string;
  userId: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: string;
  dueDate?: string | null;
  userId?: number;
}

export const tasksAPI = createApi({
  reducerPath: 'tasksAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/tasks`,
    prepareHeaders: (headers: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Tasks'] as const,
  endpoints: (builder) => {
    return {
      getUserTasks: builder.query<Task[], void>({
        query: () => '',
        providesTags: ['Tasks'],
      }),
      
      getAllTasks: builder.query<Task[], void>({
        query: () => '',
        providesTags: ['Tasks'],
      }),
      
      getTask: builder.query<Task, number>({
        query: (id: number) => `/${id}`,
        providesTags: ['Tasks'],
      }),
      
      createTask: builder.mutation<Task, CreateTaskPayload>({
        query: (newTask: CreateTaskPayload) => ({
          url: '',
          method: 'POST',
          body: newTask,
        }),
        invalidatesTags: ['Tasks'],
      }),
      
      updateTask: builder.mutation<Task, { id: number; data: UpdateTaskPayload }>({
        query: ({ id, data }: { id: number; data: UpdateTaskPayload }) => ({
          url: `/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['Tasks'],
      }),
      
      deleteTask: builder.mutation<{ success: boolean }, number>({
        query: (id: number) => ({
          url: `/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Tasks'],
      }),
    };
  },
});

export const {
  useGetUserTasksQuery,
  useGetAllTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksAPI;
