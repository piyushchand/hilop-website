import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';

interface ProfileResponse {
  success: boolean;
  message?: string;
  data: User;
}

export function useProfile() {
  const { token, dispatch } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await fetch('http://3.110.216.61/api/v1/user/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ProfileResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // Update user data in auth context
      dispatch({ type: 'SET_USER', payload: data.data });
      
      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(data.data));

      return data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }, [token, dispatch]);

  return { fetchProfile };
} 