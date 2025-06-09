import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/api/services';
import { useApi } from './useApi';
import { LoginRequest, VerifyOtpRequest } from '@/lib/api/config';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginApi = useApi();
  const otpApi = useApi();

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  const login = async (mobile_number: string) => {
    const response = await loginApi.execute(() => 
      AuthService.login({ mobile_number })
    );
    return response;
  };

  const verifyOtp = async (mobile_number: string, otp: string) => {
    const response = await otpApi.execute(() =>
      AuthService.verifyOtp({ mobile_number, otp })
    );
    
    if (response.success) {
      setIsAuthenticated(true);
    }
    
    return response;
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    verifyOtp,
    logout,
    loginLoading: loginApi.loading,
    loginError: loginApi.error,
    otpLoading: otpApi.loading,
    otpError: otpApi.error,
  };
}