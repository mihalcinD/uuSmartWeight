import { apiSlice } from './apiSlice.ts';
import { SetDetailResponse } from '../types/api/response/sets.ts';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSetDetail: builder.query<SetDetailResponse, number>({
      query: id => `series/detail?id=${id}`,
      providesTags: (_result, _error, arg) => [{ type: 'SetDetail', id: arg }],
    }),
  }),
});

export const { useGetSetDetailQuery } = extendedApiSlice;
