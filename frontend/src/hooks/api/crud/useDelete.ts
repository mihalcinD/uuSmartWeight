import { AxiosError } from 'axios';
import { useState } from 'react';
import { CacheAxiosResponse } from 'axios-cache-interceptor';
import { ResponseError } from '../../../types/api/Api.ts';
import { useApiContext } from '../../../providers/ApiContext.tsx';
import { useSnackbar } from 'notistack';

type Props = { url: string; params?: Record<string, string> };
const useDelete = <K>({ url, params }: Props) => {
  const { axios } = useApiContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<K>();
  const [error, setError] = useState<ResponseError>();
  const { enqueueSnackbar } = useSnackbar();

  const _delete = (newUrl?: string): Promise<K> => {
    const properURL = newUrl ?? url;
    console.log('[DELETE] url: ', properURL, ' PARAMS: ', params);
    setError(undefined);
    setIsLoading(true);
    return new Promise<K>((resolve, reject) =>
      axios
        .delete(properURL, { params: params })
        .then((res: CacheAxiosResponse<K, any>) => {
          setResponse(res.data);
          setIsLoading(false);
          resolve(res.data);
        })
        .catch(({ response: res }: AxiosError) => {
          console.error('[DELETE] url: ', url, res?.data, res?.status);
          setError({ message: res?.data, code: res?.status });
          setIsLoading(false);
          enqueueSnackbar('Ups, něco se nepovedlo :(', { variant: 'error' });
          reject(res?.status);
        }),
    );
  };

  return { isLoading, response, error, _delete };
};

export default useDelete;
