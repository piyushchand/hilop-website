'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { User } from '@/types/auth';
import { useLoading } from './LoadingContext';

// Types
export interface AuthState {
  user: User | null;
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
  refreshUserData: () => Promise<boolean>; // Function to refresh user data from /api/auth/me
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
  
  // Initialize auth state - no localStorage dependency
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isInitialized: false,
  });

  // Initialize auth state on mount - call /api/auth/me to check authentication
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 Initializing auth state...');
      await refreshUserData();
      setState(prev => ({ ...prev, isInitialized: true }));
      console.log('✅ Auth initialization complete');
    };

    initializeAuth();
  }, []);

  const clearError = () => setState(prev => ({ ...prev, error: null }));

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error }));
    toast.error(error);
  };

  // Function to refresh user data from /api/auth/me
  const refreshUserData = async (): Promise<boolean> => {
    try {
      console.log('🔄 Fetching user data from /api/auth/me...');
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.log('❌ User not authenticated (401)');
          setState(prev => ({ 
            ...prev, 
            user: null,
            error: null,
            isLoading: false
          }));
          return false;
        }
        throw new Error(data.message || 'Failed to fetch user data');
      }

      if (!data.success || !data.data) {
        console.log('❌ Invalid response from /api/auth/me');
        setState(prev => ({ 
          ...prev, 
          user: null,
          error: null,
          isLoading: false
        }));
        return false;
      }

      console.log('✅ User data fetched successfully:', data.data);
      setState(prev => ({ 
        ...prev, 
        user: data.data,
        error: null,
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Failed to fetch user data:', error);
      setState(prev => ({ 
        ...prev, 
        user: null,
        error: error instanceof Error ? error.message : 'Failed to fetch user data',
        isLoading: false
      }));
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

      // Cookies are automatically set by the API response
      console.log('✅ OTP verified, cookies set automatically');
      
      // Fetch fresh user data from /api/auth/me
      const userFetched = await refreshUserData();
      
      if (userFetched) {
        // Show success message
        toast.success(type === 'login' ? 'Login successful!' : 'Registration completed!');
        
        // Redirect to home page
        console.log('🔄 Redirecting to home page...');
        router.push('/');
      } else {
        throw new Error('Failed to fetch user data after authentication');
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session and cookies
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state
      setState(prev => ({ 
        ...prev, 
        user: null,
        error: null,
        isLoading: false
      }));
      router.push('/auth/login');
      toast.success('Logged out successfully');
    }
  };

  const setUser = (user: User) => {
    setState(prev => ({ ...prev, user }));
  };

  const updateUser = (updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates } as User;
      return { ...prev, user: updatedUser };
    });
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