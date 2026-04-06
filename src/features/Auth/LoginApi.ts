import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginResponse, LoginRequest } from '../../types/types';
import { API_BASE_URL } from '../../config/api';

export const loginApi = createApi({
  reducerPath: 'authApi',  
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (user) => ({
        url: '/auth/login',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;

export default loginApi;