// utils/auth.ts
export const formatPhoneNumber = (phone: string): string => {
  if (phone.startsWith('91') && phone.length === 12) {
    return `+${phone.slice(0, 2)} ${phone.slice(2, 7)} ${phone.slice(7)}`;
  }
  return phone;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanPhone) && cleanPhone.length === 10;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDisplayPhoneNumber = (phone: string): string => {
  if (phone.startsWith('91') && phone.length === 12) {
    return `+${phone.slice(0, 2)} ${phone.slice(2, 7)} ${phone.slice(7)}`;
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
  TOKEN_KEY: 'accessToken',
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

// Utility function to refresh user data with retry logic
export const refreshUserDataWithRetry = async (
  refreshFunction: () => Promise<boolean>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempting to refresh user data (attempt ${attempt}/${maxRetries})`);
      const success = await refreshFunction();
      
      if (success) {
        console.log('✅ User data refreshed successfully');
        return true;
      }
      
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`❌ Refresh attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`❌ Failed to refresh user data after ${maxRetries} attempts`);
  return false;
};

// Utility function to check if user data needs refresh
export const shouldRefreshUserData = (lastRefreshTime: number, maxAge: number = 5 * 60 * 1000): boolean => {
  const now = Date.now();
  return (now - lastRefreshTime) > maxAge;
};

  