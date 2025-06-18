'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import ProfileContent from './ProfileContent';

export default function ProfilePage() {
  const { user, isInitialized, isLoading } = useRequireAuth();

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
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

  // If we reach here, user is authenticated (useRequireAuth handles redirects)
  // TypeScript knows user is not null at this point due to useRequireAuth logic
  return <ProfileContent user={user!} />;
}
