'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthOperations } from '@/hooks/useAuth';
import { User } from '@/types/auth';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { verifyToken } = useAuthOperations();

  const clearError = () => setError(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const userData = await verifyToken(token);
        if (userData) {
          setUser(userData);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        logger.error('Auth initialization failed', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [verifyToken]);

  const login = (token: string, userData: User) => {
    try {
      localStorage.setItem('auth_token', token);
      setUser(userData);
      logger.success('User logged in', { userId: userData.id });
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('auth_token');
      setUser(null);
      logger.info('User logged out');
    } catch (error) {
      logger.error('Logout failed', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    try {
      setUser(prev => prev ? { ...prev, ...userData } : null);
      logger.info('User data updated', { userId: userData.id });
    } catch (error) {
      logger.error('User update failed', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    updateUser,
    setError,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}