import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    AdminCreateUserPayload,
    AdminUpdateUserPayload,
    TUser,
} from '../../types/types';
import { API_BASE_URL } from '../../config/api';

export const usersAPI = createApi({
    reducerPath: 'usersAPI',
    baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/users`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
          },
     }),
    tagTypes: ['getUsers'],
    endpoints: (builder) => ({
        getUsers: builder.query<TUser[], void>({
            query: () => '',
            providesTags: ['getUsers'],
        }),

        getUser: builder.query<TUser, number>({
            query: (user_id) => `/${user_id}`,
            providesTags: ['getUsers'],
        }),

        createUser: builder.mutation<TUser, AdminCreateUserPayload>({
            query: (newUser) => ({
                url: '',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ['getUsers'],
        }),
        updateUser: builder.mutation<TUser, { id: number; data: AdminUpdateUserPayload }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['getUsers'],
        }),
        deleteUser: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['getUsers'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersAPI;

export default usersAPI;