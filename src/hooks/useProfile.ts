import { useAuth } from '@/contexts/AuthContext';

export function useProfile() {
  const { 
    user, 
    isInitialized, 
    refreshUserData, 
    updateUser 
  } = useAuth();

  return {
    user,
    isInitialized,
    refreshUserData,
    updateUser,
    // Helper to check if user is loaded and ready
    isReady: isInitialized && !!user,
    // Helper to check if user is authenticated
    isAuthenticated: !!user,
  };
} 