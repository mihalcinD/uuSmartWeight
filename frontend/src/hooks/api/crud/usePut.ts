import { AxiosError } from 'axios';
import { useState } from 'react';
import { CacheAxiosResponse } from 'axios-cache-interceptor';
import { ResponseError } from '../../../types/api/Api.ts';
import { useApiContext } from '../../../providers/ApiContext.tsx';
import { useSnackbar } from 'notistack';

type Props = { defaultURL: string; params?: Record<string, string> };
const usePut = <T, K>({ defaultURL, params }: Props) => {
  const { axios } = useApiContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<K>();
  const [error, setError] = useState<ResponseError>();
  const { enqueueSnackbar } = useSnackbar();

  const put = (data: T, url?: string): Promise<K> => {
    const properURL = url ?? defaultURL;
    console.log('[PUT] url: ', properURL, ' PARAMS: ', params, ' DATA: ', data);
    setError(undefined);
    setIsLoading(true);
    return new Promise<K>((resolve, reject) =>
      axios
        .put(properURL, data, { params: params })
        .then((res: CacheAxiosResponse<K, any>) => {
          setResponse(res.data);
          setIsLoading(false);
          resolve(res.data);
        })
        .catch(({ response: res }: AxiosError) => {
          console.error('[PUT] url: ', url, res?.data, res?.status);
          setError({ message: res?.data, code: res?.status });
          setIsLoading(false);
          enqueueSnackbar('Ups, něco se nepovedlo :(', { variant: 'error' });
          reject(res?.status);
        }),
    );
  };

  return { isLoading, response, error, put };
};

export default usePut;
