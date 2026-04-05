import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export const tasksAPI = createApi({
  reducerPath: 'tasksAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/tasks',
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
  endpoints: (builder: any) => {
    return {
      // @ts-expect-error - RTK Query strict mode compatibility
      getUserTasks: builder.query<Task[], void>({
        query: () => '/user',
        providesTags: ['Tasks'],
      }),
      
      // @ts-expect-error - RTK Query strict mode compatibility
      getAllTasks: builder.query<Task[], void>({
        query: () => '/all',
        providesTags: ['Tasks'],
      }),
      
      // @ts-expect-error - RTK Query strict mode compatibility
      getTask: builder.query<Task, string>({
        query: (id: string) => `/${id}`,
        providesTags: ['Tasks'],
      }),
      
      // @ts-expect-error - RTK Query strict mode compatibility
      createTask: builder.mutation<Task, Partial<Task>>({
        query: (newTask: Partial<Task>) => ({
          url: '/create',
          method: 'POST',
          body: newTask,
        }),
        invalidatesTags: ['Tasks'],
      }),
      
      // @ts-expect-error - RTK Query strict mode compatibility
      updateTask: builder.mutation<Task, { id: string; data: Partial<Task> }>({
        query: ({ id, data }: { id: string; data: Partial<Task> }) => ({
          url: `/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Tasks'],
      }),
      
      // @ts-expect-error - RTK Query strict mode compatibility
      deleteTask: builder.mutation<{ success: boolean }, string>({
        query: (id: string) => ({
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
