import { useAuth } from '@/contexts/AuthContext';

export function useProfile() {
  const { 
    user, 
    isInitialized, 
    refreshUserData, 
    syncUserWithBackend,
    updateUser 
  } = useAuth();

  return {
    user,
    isInitialized,
    refreshUserData,
    syncUserWithBackend,
    updateUser,
    // Helper to check if user is loaded and ready
    isReady: isInitialized && !!user,
    // Helper to check if user is authenticated
    isAuthenticated: !!user,
  };
} 