'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthOperations } from '@/hooks/useAuth';
import { User } from '@/types/auth';
import { logger } from '@/utils/logger';

// Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (mobileNumber: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  verifyOTP: (otp: string, userId: string, type: 'login' | 'register') => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
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
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true, // Start with loading true to check session
    error: null,
  });
  const { verifyToken } = useAuthOperations();

  // Initialize auth state from localStorage and cookies on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for auth token in cookies (handled by middleware)
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setState(prev => ({
              ...prev,
              user: data.user,
              token: data.token,
              isLoading: false,
            }));
          } else {
            // Clear any invalid session data
            localStorage.removeItem('auth_user');
            setState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          // Clear any invalid session data
          localStorage.removeItem('auth_user');
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const clearError = () => setState(prev => ({ ...prev, error: null }));

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error }));
    toast.error(error);
  };

  const setLoading = (isLoading: boolean) => 
    setState(prev => ({ ...prev, isLoading }));

  const saveAuthData = (token: string, user: User) => {
    // Store user data in localStorage for persistence
    localStorage.setItem('auth_user', JSON.stringify(user));
    setState(prev => ({ ...prev, token, user, error: null }));
  };

  const clearAuthData = () => {
    // Clear both localStorage and cookies
    localStorage.removeItem('auth_user');
    // The cookie will be cleared by the logout API
    setState({ user: null, token: null, isLoading: false, error: null });
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const login = async (mobileNumber: string) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string, userId: string, type: 'login' | 'register') => {
    setLoading(true);
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

      if (!data.success || !data.token || !data.user) {
        throw new Error(data.message || 'Invalid OTP verification response');
      }

      saveAuthData(data.token, data.user);
      toast.success(type === 'login' ? 'Login successful!' : 'Registration completed!');
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', { method: 'POST' });
      clearAuthData();
      router.push('/auth/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      clearAuthData();
      router.push('/auth/login');
    }
  };

  const setUser = (user: User) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
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