'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { User } from '@/types/auth';
import { useLoading } from './LoadingContext';

// Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Track if initial auth check is complete
}

interface AuthContextType extends AuthState {
  login: (mobileNumber: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  verifyOTP: (otp: string, userId: string, type: 'login' | 'register') => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUserData: () => Promise<boolean>; // New function to refresh user data
  syncUserWithBackend: () => Promise<boolean>; // New function to sync with backend
  getCurrentUserFromStorage: () => User | null;
  debugRestoreUserData: () => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  mobile_number: string;
  birthdate: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  
  // Initialize auth state synchronously
  const getInitialAuthState = (): AuthState => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('auth_user');
        console.log('🔍 Checking localStorage for user data...');
        console.log('🔍 Raw localStorage value:', storedUser);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('✅ Found cached user data:', userData);
          return {
            user: userData,
            token: null,
            isLoading: false,
            error: null,
            isInitialized: false, // Will be set to true after backend sync
          };
        } else {
          console.log('❌ No user data found in localStorage');
        }
      } catch (error) {
        console.log('❌ Error parsing cached user data:', error);
        localStorage.removeItem('auth_user');
      }
    }
    
    console.log('📱 No cached user data found');
    return {
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isInitialized: false,
    };
  };

  const [state, setState] = useState<AuthState>(getInitialAuthState);

  // Keep localStorage in sync with user state
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('auth_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [state.user]);

  // Initialize auth state on mount - sync with backend if we have cached data
  useEffect(() => {
    const initializeAuth = async () => {
      if (state.user && !state.isInitialized) {
        console.log('🔄 Initializing auth state - syncing with backend...');
        const synced = await syncUserWithBackend();
        if (!synced) {
          console.log('❌ Failed to sync with backend, clearing local data');
          clearAuthData();
        }
        setState(prev => ({ ...prev, isInitialized: true }));
      } else {
        setState(prev => ({ ...prev, isInitialized: true }));
      }
    };

    initializeAuth();
  }, []);

  const clearError = () => setState(prev => ({ ...prev, error: null }));

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error }));
    toast.error(error);
  };

  const saveAuthData = (token: string, user: User) => {
    console.log('💾 Saving auth data to localStorage:', { token: '***', user });
    // Store user data in localStorage for persistence
    localStorage.setItem('auth_user', JSON.stringify(user));
    console.log('✅ User data saved to localStorage successfully');
    setState(prev => ({ 
      ...prev, 
      token, 
      user, 
      error: null,
      isLoading: false,
      isInitialized: true
    }));
  };

  const clearAuthData = () => {
    // Clear localStorage
    localStorage.removeItem('auth_user');
    // Clear auth state
    setState({ 
      user: null, 
      token: null, 
      isLoading: false, 
      error: null,
      isInitialized: true
    });
  };

  // New function to refresh user data from backend
  const refreshUserData = async (): Promise<boolean> => {
    try {
      console.log('🔄 Refreshing user data from backend...');
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.log('❌ Token expired, clearing auth data');
          clearAuthData();
          return false;
        }
        throw new Error(data.message || 'Failed to refresh user data');
      }

      if (!data.success || !data.data) {
        throw new Error(data.message || 'Invalid response from server');
      }

      console.log('✅ User data refreshed successfully:', data.data);
      setState(prev => ({ 
        ...prev, 
        user: data.data,
        error: null 
      }));
      
      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(data.data));
      
      return true;
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh user data');
      return false;
    }
  };

  // New function to sync user data with backend
  const syncUserWithBackend = async (): Promise<boolean> => {
    try {
      console.log('🔄 Syncing user data with backend...');
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.log('❌ Token expired during sync');
          return false;
        }
        console.log('❌ Failed to sync with backend:', data.message);
        return false;
      }

      if (!data.success || !data.data) {
        console.log('❌ Invalid sync response');
        return false;
      }

      console.log('✅ User data synced successfully:', data.data);
      setState(prev => ({ 
        ...prev, 
        user: data.data,
        error: null 
      }));
      
      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(data.data));
      
      return true;
    } catch (error) {
      console.error('❌ Failed to sync user data:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData) => {
    showLoading("Creating your account...");
    clearError();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (!data.success || !data.data?.user_id) {
        throw new Error(data.message || 'Invalid registration response');
      }

      toast.success('Registration successful! Please verify your OTP.');
      router.push(`/auth/otp?type=register&userId=${data.data.user_id}&mobile=${userData.mobile_number}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      hideLoading();
    }
  };

  const login = async (mobileNumber: string) => {
    showLoading("Sending OTP...");
    clearError();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success || !data.data?.user_id) {
        throw new Error(data.message || 'Invalid login response');
      }

      toast.success('OTP sent successfully!');
      router.push(`/auth/otp?type=login&userId=${data.data.user_id}&mobile=${mobileNumber}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      hideLoading();
    }
  };

  const verifyOTP = async (otp: string, userId: string, type: 'login' | 'register') => {
    showLoading("Verifying OTP...");
    clearError();

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, user_id: userId, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      if (!data.success || !data.data?.token || !data.data?.user) {
        throw new Error(data.message || 'Invalid OTP verification response');
      }

      saveAuthData(data.data.token, data.data.user);
      toast.success(type === 'login' ? 'Login successful!' : 'Registration completed!');
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session and cookies
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Always clear local data
      clearAuthData();
      router.push('/auth/login');
      toast.success('Logged out successfully');
    }
  };

  const setUser = (user: User) => {
    // Update localStorage immediately
    localStorage.setItem('auth_user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  const updateUser = (updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates } as User;
      // Update localStorage immediately with the new user data
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  // Helper function to get current user from localStorage
  const getCurrentUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('auth_user');
      console.log('🔍 getCurrentUserFromStorage - Raw value:', stored);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.log('❌ getCurrentUserFromStorage - Error parsing:', error);
      return null;
    }
  };

  // Debug function to manually restore user data
  const debugRestoreUserData = () => {
    console.log('🔧 Debug: Attempting to restore user data from localStorage...');
    const storedUser = getCurrentUserFromStorage();
    if (storedUser) {
      console.log('🔧 Debug: Found user data, restoring to state:', storedUser);
      setState(prev => ({ ...prev, user: storedUser }));
      return true;
    } else {
      console.log('🔧 Debug: No user data found in localStorage');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        verifyOTP,
        logout,
        clearError,
        setUser,
        updateUser,
        refreshUserData,
        syncUserWithBackend,
        getCurrentUserFromStorage,
        debugRestoreUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}