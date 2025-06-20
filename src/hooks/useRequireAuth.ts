import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { user, isInitialized, isLoading } = useAuth();
  const router = useRouter();
  const { redirectTo = '/auth/login', requireAuth = true } = options;

  useEffect(() => {
    // Wait for auth to be initialized
    if (!isInitialized || isLoading) {
      return;
    }

    // If authentication is required and user is not authenticated
    if (requireAuth && !user) {
      console.log('🔒 Authentication required, redirecting to login');
      router.push(redirectTo);
      return;
    }

    // If user is authenticated and we're on an auth page, redirect to home
    if (user && redirectTo.includes('/auth/')) {
      console.log('🔄 Authenticated user, redirecting to home');
      router.push('/');
      return;
    }
  }, [user, isInitialized, isLoading, requireAuth, redirectTo, router]);

  return {
    user,
    isInitialized,
    isLoading,
    isAuthenticated: !!user,
  };
} 