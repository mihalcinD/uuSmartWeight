import { apiSlice } from './apiSlice.ts';
import { DeviceDataExtended, DeviceDataResponse } from '../types/api/response/device.ts';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDeviceData: builder.query<DeviceDataExtended, string>({
      query: date => `device/detail?date=${date}&id=3&detailed=1`,
      providesTags: (_result, _error, arg) => [{ type: 'DeviceData', id: arg }],
      transformResponse: (responseData: DeviceDataResponse) => {
        const sets = responseData.exercises.reduce((acc, exercise) => acc + exercise.series.length, 0);
        return {
          ...responseData,
          averageSetsPerExercise: Math.round(sets / responseData.numberOfExercises),
          averageTimePerSet: responseData.totalTime / sets,
          averageTimePerExercise: responseData.totalTime / responseData.numberOfExercises,
          numberOfSets: sets,
        };
      },
    }),
  }),
});

export const { useGetDeviceDataQuery, useLazyGetDeviceDataQuery } = extendedApiSlice;
