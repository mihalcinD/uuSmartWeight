import { apiSlice } from './apiSlice.ts';
import { DeviceDataExtended, DeviceDataResponse } from '../types/api/response/device.ts';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDeviceData: builder.query<DeviceDataExtended, string>({
      query: date => `device/detail?date=${date}&id=3&detailed=1`,
      providesTags: (_result, _error, arg) => [{ type: 'DeviceData', id: arg }],
      transformResponse: (responseData: DeviceDataResponse) => {
        const sets = responseData.exercises.reduce((acc, exercise) => acc + exercise.series.length, 0);
        const exercises = responseData.exercises.length;
        return {
          ...responseData,
          averageSetsPerExercise: Math.ceil(sets / exercises),
          averageTimePerSet: responseData.totalTime / sets,
          averageTimePerExercise: responseData.totalTime / exercises,
          numberOfSets: sets,
          numberOfExercises: exercises,
        };
      },
    }),
  }),
});

export const { useGetDeviceDataQuery, useLazyGetDeviceDataQuery } = extendedApiSlice;
