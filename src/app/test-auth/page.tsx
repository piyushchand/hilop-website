"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function TestAuthPage() {
  const { user, isLoading, isInitialized, error, refreshUserData } = useAuth();
  const [cookieStatus, setCookieStatus] = useState<{isAuthenticated: boolean, hasAccessToken: boolean}>({
    isAuthenticated: false,
    hasAccessToken: false
  });

  useEffect(() => {
    // Check cookie status
    const isAuthenticated = document.cookie.includes('is_authenticated=true');
    const hasAccessToken = document.cookie.includes('accessToken');
    setCookieStatus({ isAuthenticated, hasAccessToken });
  }, [user]);

  const handleRefresh = async () => {
    await refreshUserData();
  };

  const checkCookies = () => {
    const isAuthenticated = document.cookie.includes('is_authenticated=true');
    const hasAccessToken = document.cookie.includes('accessToken');
    setCookieStatus({ isAuthenticated, hasAccessToken });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2">
            <div><strong>User:</strong> {user ? user.name : 'None'}</div>
            <div><strong>Email:</strong> {user ? user.email : 'None'}</div>
            <div><strong>Mobile:</strong> {user ? user.mobile_number : 'None'}</div>
            <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
            <div><strong>Initialized:</strong> {isInitialized ? 'Yes' : 'No'}</div>
            {error && <div className="text-red-600"><strong>Error:</strong> {error}</div>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={handleRefresh}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Refresh User Data
            </button>
            <button 
              onClick={checkCookies}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Check Cookies
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Cookie Status</h2>
        <div className="space-y-2">
          <div><strong>is_authenticated:</strong> {cookieStatus.isAuthenticated ? '✅ Present' : '❌ Not found'}</div>
          <div><strong>accessToken:</strong> {cookieStatus.hasAccessToken ? '✅ Present' : '❌ Not found'}</div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Note:</strong> This page shows the secure authentication flow using httpOnly cookies.</p>
          <p>User data is fetched from /api/auth/me on each page load.</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Security Features</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Access token stored in httpOnly cookie (secure)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>No sensitive data in localStorage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>User data fetched from /api/auth/me on initialization</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Automatic logout on token expiration</span>
          </div>
        </div>
      </div>
    </div>
  );
} 