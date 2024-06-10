import { apiSlice } from './apiSlice.ts';
import { DeviceDataExtended, DeviceDataResponse } from '../types/api/response/device.ts';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDeviceData: builder.query<DeviceDataExtended, string>({
      query: date => `deviceData/?&date=${date}`,
      providesTags: (_result, _error, arg) => [{ type: 'DeviceData', id: arg }],
      transformResponse: (responseData: DeviceDataResponse) => {
        //array destructuring just for json server, will be removed
        //@ts-expect-error
        const response = responseData[0];
        return {
          ...response,
          averageSetsPerExercise: response.series.length / response.numberOfExercises,
          averageTimePerSet: response.totalTime / response.series.length,
          averageTimePerExercise: response.totalTime / response.numberOfExercises,
        };
      },
    }),
  }),
});

export const { useGetDeviceDataQuery } = extendedApiSlice;
