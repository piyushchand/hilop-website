'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileContent from './ProfileContent';

export default function ProfilePage() {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Wait for auth to be initialized
        if (!isInitialized) {
          return; // Still initializing, wait
        }

        if (!user) {
          // If no user after initialization, redirect to login
          router.push('/auth/login');
          return;
        }
        
        setTimeout(() => setLoading(false), 100);
      } catch (err) {
        console.error('Profile check failed:', err);
        router.push('/auth/login');
      }
    };

    checkUser();
  }, [user, isInitialized, router]);

  if (loading || !isInitialized) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading Profile...</h2>
            <p className="text-gray-600">Please wait while we load your profile data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ProfileContent user={user} />;
}
