import { apiSlice } from './apiSlice.ts';
import { DeviceDataExtended, DeviceDataResponse } from '../types/api/response/device.ts';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDeviceData: builder.query<DeviceDataExtended, string>({
      //TODO change path to /device/detail when api is ready
      query: date => `device?date=${date}&id=1&detailed=1`,
      providesTags: (_result, _error, arg) => [{ type: 'DeviceData', id: arg }],
      transformResponse: (responseData: DeviceDataResponse) => {
        //TODO remove this when api is ready
        //@ts-expect-error array destructuring just for json server, will be removed
        if (responseData.length === 0) {
          return undefined;
        }
        //@ts-expect-error array destructuring just for json server, will be removed
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

export const { useGetDeviceDataQuery, useLazyGetDeviceDataQuery } = extendedApiSlice;
