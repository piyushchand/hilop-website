// hooks/userCartCount.ts

// Fetch cart count from API
export async function fetchCartCount(): Promise<number> {
  try {
    const res = await fetch('/api/cart/count', { credentials: 'include' });
    const data = await res.json();
    if (data?.success && typeof data?.data?.count === 'number') {
      return data.data.count;
    }
    return 0;
  } catch {
    return 0;
  }
}

// Optional: React hook for cart count (no SWR)
import { useEffect, useState } from 'react';

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const refresh = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const c = await fetchCartCount();
      setCount(c);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // Optionally, add polling or event-based updates here
  }, []);

  return { count, isLoading, isError, refresh };
}
