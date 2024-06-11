import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../config.ts';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: config.domain }),
  tagTypes: ['DeviceData', 'SetDetail'],
  endpoints: () => ({}),
});
