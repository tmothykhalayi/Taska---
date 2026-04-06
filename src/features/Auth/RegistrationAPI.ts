import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RUser } from '../../types/types';
import { API_BASE_URL } from '../../config/api';

export const registrationAPI = createApi({
    reducerPath: 'registrationAPI',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        registerUser: builder.mutation<{ message: string; user: { id: number; email: string; firstName: string; lastName: string; role: string } }, RUser>({
            query: (newUser) => ({
                url: '/auth/register',
                method: 'POST',
                body: newUser,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
    }),
});

export const { useRegisterUserMutation } = registrationAPI;

export default registrationAPI;