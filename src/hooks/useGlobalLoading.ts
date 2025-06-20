import { useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export function useGlobalLoading() {
  const { showLoading, hideLoading } = useLoading();

  const withLoading = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    loadingMessage: string = "Loading..."
  ): Promise<T> => {
    try {
      showLoading(loadingMessage);
      const result = await asyncOperation();
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return {
    showLoading,
    hideLoading,
    withLoading
  };
} 