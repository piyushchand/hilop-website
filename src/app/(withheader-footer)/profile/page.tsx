"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  const { user, isInitialized, isLoading } = useAuth();

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading Profile...</h2>
            <p className="text-gray-600">
              Please wait while we load your profile data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If no user, show error (middleware should have prevented this)
  if (!user) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your profile.
            </p>
            <a
              href="/auth/login"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, show profile
  return <ProfileContent user={user} />;
}
