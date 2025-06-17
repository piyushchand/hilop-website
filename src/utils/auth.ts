// utils/auth.ts
export const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add 91 prefix if not present and it's an Indian number
    if (cleaned.length === 10 && !cleaned.startsWith('91')) {
      return `91${cleaned}`;
    }
    
    return cleaned;
  };
  
  export const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    
    return phoneRegex.test(cleanPhone) && cleanPhone.length === 10;
  };
  
  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const formatDisplayPhoneNumber = (phone: string): string => {
    // Remove country code and format for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      const number = cleaned.slice(2);
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
    return phone;
  };
  
  // utils/storage.ts
  export const storage = {
    setItem: (key: string, value: string): void => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    
    getItem: (key: string): string | null => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    
    removeItem: (key: string): void => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
    
    clear: (): void => {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    }
  };
  
  // utils/constants.ts
  export const AUTH_CONSTANTS = {
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data',
    OTP_LENGTH: 6,
    OTP_TIMER: 120, // 2 minutes in seconds
    PHONE_REGEX: /^[6-9]\d{9}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  } as const;
  
  export const API_ENDPOINTS = {
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    LOGIN: '/auth/login',
    VERIFY_LOGIN: '/auth/verify-login',
  } as const;
  
  export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    OTP: '/auth/otp',
  } as const;

  