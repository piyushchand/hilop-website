import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';

interface ProfileResponse {
  success: boolean;
  message?: string;
  data: User;
}

export function useProfile() {
  const { token, user, setUser } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data: ProfileResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // Update user data in auth context
      setUser(data.data);

      return data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }, [token, setUser]);

  return { fetchProfile, user };
} 