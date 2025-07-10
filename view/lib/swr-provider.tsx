'use client';

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: ReactNode;
}

// Default fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as Error & {
      info?: unknown;
      status?: number;
    };
    // Attach extra info to the error object
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const SWRProvider = ({ children }: SWRProviderProps) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        onError: (error, key) => {
          console.error('SWR Error:', { error, key });
        }
      }}
    >
      {children}
    </SWRConfig>
  );
};
