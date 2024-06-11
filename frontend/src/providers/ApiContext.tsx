import { createContext, useContext, useEffect, useMemo, JSX } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { AxiosCacheInstance, setupCache } from 'axios-cache-interceptor';
import { config } from '../config.ts';

type Props = {
  children: JSX.Element | JSX.Element[];
};

type ApiContextType = {
  axios: AxiosCacheInstance;
};

export const useApiContext = () => {
  return useContext(ApiContext);
};

export const ApiContext = createContext<ApiContextType>(undefined!);

export const ApiProvider = ({ children }: Props) => {
  const BASE_URL = config.domain;

  const axiosInstance = useMemo(() => {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      baseURL: BASE_URL,
    };
    //here we can configure caching properties for axios
    return setupCache(axios.create(axiosConfig), { ttl: 0 });
  }, [BASE_URL]);

  useEffect(() => {
    axiosInstance.interceptors.request.use(async config => {
      config.baseURL = BASE_URL;
      return config;
    });
  }, [BASE_URL, axiosInstance.interceptors.request]);

  return <ApiContext.Provider value={{ axios: axiosInstance }}>{children}</ApiContext.Provider>;
};
