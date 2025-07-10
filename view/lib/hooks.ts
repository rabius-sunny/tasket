import useSWR, { Key } from 'swr';
import requests from './http';

export function useAsync<T>(key: Key) {
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate
  } = useSWR(key, requests.get, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000
  });

  return {
    data: data as T,
    error,
    isLoading,
    mutate: swrMutate
  };
}
