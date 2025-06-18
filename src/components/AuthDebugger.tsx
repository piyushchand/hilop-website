"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function AuthDebugger() {
  const { user, isLoading, isInitialized, error, refreshUserData } = useAuth();

  useEffect(() => {
    console.log('🔧 AuthDebugger: State changed', {
      user: user ? { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        mobile_number: user.mobile_number 
      } : null,
      isLoading,
      isInitialized,
      error,
      timestamp: new Date().toISOString()
    });
  }, [user, isLoading, isInitialized, error]);

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await refreshUserData();
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">🔧 Auth Debug</div>
      <div>User: {user ? user.name : 'None'}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
      {error && <div className="text-red-400">Error: {error}</div>}
      <div className="flex gap-2 mt-2">
        <button 
          onClick={handleRefresh}
          className="bg-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      <div className="text-gray-400 mt-1">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
} 