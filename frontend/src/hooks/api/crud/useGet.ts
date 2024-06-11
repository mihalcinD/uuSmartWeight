import { AxiosError } from 'axios';
import { useState } from 'react';
import { CacheAxiosResponse, CacheProperties } from 'axios-cache-interceptor';
import { ResponseError } from '../../../types/api/Api.ts';
import { useApiContext } from '../../../providers/ApiContext.tsx';
import { useSnackbar } from 'notistack';

type Props = {
  url: string;
  params?: Record<string, number | string | undefined>;
  cache?: false | Partial<CacheProperties<never, never>> | undefined;
};
const useGet = <T>({ url, params, cache }: Props) => {
  const { axios } = useApiContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ResponseError>();
  const { enqueueSnackbar } = useSnackbar();

  const get = (newParams?: Record<string, number>): Promise<T | undefined> => {
    const currentParams = newParams ?? params;
    console.log('[GET] url: ', url, ' PARAMS: ', currentParams);
    setError(undefined);
    setIsLoading(true);
    return new Promise<T | undefined>(resolve =>
      axios
        .get(url, { params: currentParams, cache })
        .then((res: CacheAxiosResponse<T, never>) => {
          setData(res.data);
          setIsLoading(false);
          resolve(res.data);
        })
        .catch(({ response }: AxiosError) => {
          console.error('[GET] url: ', url, response?.data, response?.status);
          setError({ message: response?.data, code: response?.status });
          setIsLoading(false);
          enqueueSnackbar('Ups, něco se nepovedlo :(', { variant: 'error' });
          resolve(undefined);
        }),
    );
  };

  const refresh = () => {
    get();
  };

  return { isLoading, data, error, get, refresh, setData };
};

export default useGet;
