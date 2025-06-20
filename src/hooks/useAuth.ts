'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api';
import { 
  User, 
  LoginResponse, 
  RegisterResponse, 
  RegisterRequest, 
  LoginRequest, 
  VerifyOTPRequest, 
  VerifyLoginRequest,
  VerifyOTPResponse,
  VerifyLoginResponse
} from '@/types/auth';
import { logger } from '@/utils/logger';

export function useAuthOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const register = async (formData: RegisterRequest): Promise<RegisterResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(formData);
      logger.success('Registration successful', { mobile: formData.mobile_number });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      logger.error('Registration failed', err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyRegistrationOTP = async (request: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyRegistrationOTP(request);
      logger.success('Registration OTP verified', { userId: request.user_id });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OTP verification failed';
      logger.error('Registration OTP verification failed', err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMobile = async (request: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(request);
      logger.success('Login OTP sent', { mobile: request.mobile_number });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      logger.error('Login failed', err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLoginOTP = async (request: VerifyLoginRequest): Promise<VerifyLoginResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyLoginOTP(request);
      logger.success('Login successful', { userId: request.user_id });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OTP verification failed';
      logger.error('Login OTP verification failed', err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (): Promise<User | null> => {
    try {
      // TODO: Implement token verification endpoint
      // For now, return null as the endpoint is not implemented
      return null;
    } catch (err) {
      logger.error('Token verification failed', err);
      return null;
    }
  };

  return {
    isLoading,
    error,
    setError,
    clearError,
    register,
    verifyRegistrationOTP,
    loginWithMobile,
    verifyLoginOTP,
    verifyToken,
  };
}