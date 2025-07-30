"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { User } from "@/types/auth";
import { useLoading } from "./LoadingContext";
import { getFirebaseInstances } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Track if initial auth check is complete
  success: string | null; // <-- Add success state
}

interface AuthContextType extends AuthState {
  login: (mobileNumber: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  verifyOTP: (
    otp: string,
    userId: string,
    type: "login" | "register"
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUserData: () => Promise<boolean>; // Function to refresh user data from /api/auth/me
  setSuccess: (success: string | null) => void; // <-- Add setSuccess
}

interface RegisterData {
  name: string;
  email: string;
  mobile_number: string;
  birthdate: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  // Initialize auth state - no localStorage dependency
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isInitialized: false,
    success: null, // <-- Add success state
  });

  // Initialize auth state on mount - call /api/auth/me to check authentication
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUserData();
      setState((prev) => ({ ...prev, isInitialized: true }));
    };

    initializeAuth();
  }, []);

  const clearError = () => setState((prev) => ({ ...prev, error: null }));

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error }));
    // toast.error(error);
  };

  const setSuccess = (success: string | null) => {
    setState((prev) => ({ ...prev, success }));
  };

  // Function to refresh user data from /api/auth/me
  const refreshUserData = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setState((prev) => ({
            ...prev,
            user: null,
            error: null,
            isLoading: false,
          }));
          return false;
        }
        throw new Error(data.message || "Failed to fetch user data");
      }

      if (!data.success || !data.data) {
        setState((prev) => ({
          ...prev,
          user: null,
          error: null,
          isLoading: false,
        }));
        return false;
      }

      setState((prev) => ({
        ...prev,
        user: data.data,
        error: null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setState((prev) => ({
        ...prev,
        user: null,
        error:
          error instanceof Error ? error.message : "Failed to fetch user data",
        isLoading: false,
      }));
      return false;
    }
  };

  const register = async (userData: RegisterData) => {
    showLoading("Creating your account...");
    clearError();
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (!data.success || !data.data?.user_id) {
        throw new Error(data.message || "Invalid registration response");
      }

      setSuccess("Registration successful! Please verify your OTP.");
      router.push(
        `/auth/otp?type=register&userId=${data.data.user_id}&mobile=${userData.mobile_number}`
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      hideLoading();
    }
  };

  const login = async (mobileNumber: string) => {
    showLoading("Sending OTP...");
    clearError();
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.success || !data.data?.user_id) {
        throw new Error(data.message || "Invalid login response");
      }

      setSuccess("OTP sent successfully!");
      router.push(
        `/auth/otp?type=login&userId=${data.data.user_id}&mobile=${mobileNumber}`
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      hideLoading();
    }
  };

  const verifyOTP = async (
    otp: string,
    userId: string,
    type: "login" | "register"
  ) => {
    showLoading("Verifying OTP...");
    clearError();
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, user_id: userId, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      if (!data.success || !data.data?.token || !data.data?.user) {
        throw new Error(data.message || "Invalid OTP verification response");
      }

      // Cookies are automatically set by the API response

      // Fetch fresh user data from /api/auth/me
      const userFetched = await refreshUserData();

      if (userFetched) {
        // Show success message
        setSuccess(
          type === "login" ? "Login successful!" : "Registration completed!"
        );

        // Redirect to home page
        router.push("/");
      } else {
        throw new Error("Failed to fetch user data after authentication");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "OTP verification failed"
      );
    } finally {
      hideLoading();
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session and cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state
      setState((prev) => ({
        ...prev,
        user: null,
        error: null,
        isLoading: false,
        success: null,
      }));
      toast.success("Logged out successfully", { position: "top-right" });
      router.push("/"); // Redirect to home page after logout
    }
  };

  const setUser = (user: User) => {
    setState((prev) => ({ ...prev, user }));
  };

  const updateUser = (updates: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates } as User;
      return { ...prev, user: updatedUser };
    });
  };

  const signInWithGoogle = async () => {
    const { auth } = getFirebaseInstances();
    showLoading("Signing in with Google...");
    clearError();
    setSuccess(null);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message &&
          data.message.toLowerCase().includes("mobile number")
        ) {
          const { displayName, email } = result.user;
          router.replace(
            `/auth/complete-profile?name=${encodeURIComponent(
              displayName || ""
            )}&email=${encodeURIComponent(email || "")}`
          );
        } else {
          throw new Error(data.message || "Google Sign-In failed");
        }
        return;
      }

      // If backend returns success but user is missing mobile_number or birthdate, force complete-profile
      const userObj = data.data?.user;
      if (!userObj || !userObj.mobile_number || !userObj.birthdate) {
        const { displayName, email } = result.user;
        router.replace(
          `/auth/complete-profile?name=${encodeURIComponent(
            displayName || ""
          )}&email=${encodeURIComponent(email || "")}`
        );
        return;
      }

      // If user is authenticated and profile is complete, fetch user data and redirect to home
      const userFetched = await refreshUserData();
      if (userFetched) {
        setSuccess("Signed in with Google successfully!");
        router.replace("/");
      } else {
        throw new Error("Failed to fetch user data after Google Sign-In");
      }
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "auth/popup-closed-by-user"
      ) {
        setError("Google Sign-In was cancelled.");
      } else {
        setError(
          error instanceof Error ? error.message : "Google Sign-In failed"
        );
      }
    } finally {
      hideLoading();
    }
  };

  const signInWithFacebook = async () => {
    const { auth } = getFirebaseInstances();
    showLoading("Signing in with Facebook...");
    clearError();
    setSuccess(null);
    try {
      const facebookProvider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, facebookProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message &&
          data.message.includes("Please provide a mobile number")
        ) {
          const { displayName, email } = result.user;
          router.push(
            `/auth/complete-profile?name=${encodeURIComponent(
              displayName || ""
            )}&email=${encodeURIComponent(email || "")}`
          );
        } else {
          throw new Error(data.message || "Facebook Sign-In failed");
        }
        return;
      }

      const userFetched = await refreshUserData();
      if (userFetched) {
        setSuccess("Signed in with Facebook successfully!");
        router.push("/");
      } else {
        throw new Error("Failed to fetch user data after Facebook Sign-In");
      }
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "auth/popup-closed-by-user"
      ) {
        setError("Facebook Sign-In was cancelled.");
      } else {
        setError(
          error instanceof Error ? error.message : "Facebook Sign-In failed"
        );
      }
    } finally {
      hideLoading();
    }
  };

  const value = {
    ...state,
    success: state.success, // Explicitly include success
    login,
    register,
    verifyOTP,
    logout,
    clearError,
    setUser,
    updateUser,
    refreshUserData,
    signInWithGoogle,
    signInWithFacebook,
    setSuccess, // <-- Add setSuccess to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {" "}
      <Toaster position="bottom-right" />
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
