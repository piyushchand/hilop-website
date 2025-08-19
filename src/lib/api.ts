import {
  RegisterRequest,
  RegisterResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  LoginRequest,
  LoginResponse,
  VerifyLoginRequest,
  VerifyLoginResponse,
} from "@/types/auth";
import { logger } from "@/utils/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL)
  throw new Error("API URL is not set in environment variables");

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const url = `${this.baseURL}/${cleanEndpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${(messages as string[]).join(", ")}`
            )
            .join("\n");
          throw new Error(
            errorMessages ||
              data.message ||
              `HTTP error! status: ${response.status}`
          );
        }
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      logger.error(`API request failed: ${url}`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    if (!data.name || !data.email || !data.mobile_number || !data.birthdate) {
      throw new Error("All fields are required for registration");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    const mobileRegex = /^91[6-9]\d{9}$/;
    if (!mobileRegex.test(data.mobile_number)) {
      throw new Error(
        "Invalid mobile number format. Must be 12 digits starting with 91 followed by a valid Indian mobile number"
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.birthdate)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    return this.request<RegisterResponse>("auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyRegistrationOTP(
    data: VerifyOTPRequest
  ): Promise<VerifyOTPResponse> {
    return this.request<VerifyOTPResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyLoginOTP(data: VerifyLoginRequest): Promise<VerifyLoginResponse> {
    return this.request<VerifyLoginResponse>("/auth/verify-login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Add this public method for generic requests
  public async requestPublic<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, options);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions for common API operations
export const authApi = {
  register: (data: RegisterRequest) => apiClient.register(data),
  verifyRegistrationOTP: (data: VerifyOTPRequest) =>
    apiClient.verifyRegistrationOTP(data),
  login: (data: LoginRequest) => apiClient.login(data),
  verifyLoginOTP: (data: VerifyLoginRequest) => apiClient.verifyLoginOTP(data),
};

export default apiClient;
