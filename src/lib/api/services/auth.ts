import { apiClient, ApiResponse, LoginRequest, VerifyOtpRequest, AuthResponse } from '../config';

export class AuthService {
  private static readonly endpoints = {
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp-registration',
  };

  static async login(data: LoginRequest): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(this.endpoints.login, data);
      return {
        success: true,
        data: response.data,
        message: 'Login request sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }

  static async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post(this.endpoints.verifyOtp, data);
      
      // Store token if verification successful
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
      }
      
      return {
        success: true,
        data: response.data,
        message: 'OTP verified successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'OTP verification failed',
      };
    }
  }

  static async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
