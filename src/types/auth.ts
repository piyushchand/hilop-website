export interface RegisterRequest {
  name: string;
  email: string;
  mobile_number: string;
  birthdate: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user_id: string;
  data?: {
    user_id: string;
    name: string;
    email: string;
    mobile_number: string;
  };
}

export interface VerifyOTPRequest {
  user_id: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    mobile_number: string;
  };
}

export interface LoginRequest {
  mobile_number: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user_id: string;
}

export interface VerifyLoginRequest {
  otp: string;
  user_id: string;
}

export interface VerifyLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    mobile_number: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  birthdate?: string;
  profile_image?: string;
  is_verified?: boolean;
  hilop_coins?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
