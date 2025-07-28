"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OTPInput from "@/components/animationComponents/OTPInput";
import Button from "@/components/uiFramework/Button";
import AuthLayout from "../AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const OTP_TIMEOUT = 120;

function OtpPageContent() {
  const { isLoading, clearError, refreshUserData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(OTP_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Always get params directly from searchParams
  const otpType = searchParams?.get("type") || "";
  const userId = searchParams?.get("userId") || "";
  const mobileNumber = searchParams?.get("mobile") || "";

  useEffect(() => {
    if (!otpType || !userId || !mobileNumber) {
      setError("Invalid OTP verification link");
      setTimeout(() => {
        router.replace(
          otpType === "register" ? "/auth/register" : "/auth/login"
        );
      }, 2000);
    }
  }, [otpType, userId, mobileNumber, router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    setCanResend(true);
  }, [timer]);

  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && otp.length === 6) {
        e.preventDefault();
        const form = document.getElementById("otp-form") as HTMLFormElement;
        form?.requestSubmit();
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [otp]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!userId || !otpType) {
      setError("Invalid verification session");
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, user_id: userId, type: otpType }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(data.message || "");
        setError("");
        await refreshUserData();
        setTimeout(() => {
          if (typeof window !== "undefined") {
            const redirectPath = localStorage.getItem("redirectAfterLogin");
            if (redirectPath) {
              localStorage.removeItem("redirectAfterLogin");
              router.replace(redirectPath);
              return;
            }
          }
          router.push("/");
        }, 1200);
      } else {
        setSuccess("");
        setError(data.message || "Verification failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSuccess("");
      setError("Failed to connect to the server. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !mobileNumber) return;

    try {
      setIsResending(true);
      clearError();
      setError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("OTP resent successfully!");
      setTimer(OTP_TIMEOUT);
      setCanResend(false);
      setOtp("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  // Memoized page title/description to avoid SSR/CSR mismatch
  const pageTitle =
    otpType === "register" ? "Complete Registration" : "Login Verification";
  const pageDescription = (() => {
    const formattedMobile = mobileNumber
      ? `+91 ${mobileNumber.slice(0, 2)} ${mobileNumber.slice(
          2,
          7
        )} ${mobileNumber.slice(7)}`
      : "";
    return otpType === "register"
      ? `We have sent an OTP code to ${formattedMobile} to complete your registration.`
      : `We have sent an OTP code to ${formattedMobile} to verify your login.`;
  })();

  return (
    <AuthLayout
      bottomContent={
        <p className="text-sm mt-4 text-center text-gray-600 font-medium">
          {otpType === "register" ? (
            <>
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="hover:underline text-green-800 font-semibold cursor-pointer"
              >
                Log inotp
              </a>
            </>
          ) : (
            <>
              Don&apos;t have an account yet?{" "}
              <a
                href="/auth/register"
                className="hover:underline text-green-800 font-semibold cursor-pointer"
              >
                Sign up for free
              </a>
            </>
          )}
        </p>
      }
    >
      <div className="xl:w-[495px] mx-auto lg:w-full md:w-[495px] min-w-auto">
        <h2 className="text-3xl font-semibold mb-2">{pageTitle}</h2>
        <p className="font-medium mb-6 text-gray-600">{pageDescription}</p>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} id="otp-form">
          <OTPInput
            value={otp}
            onChange={handleOtpChange}
            length={6}
            disabled={isLoading}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button
            label={isLoading ? "Verifying..." : "Verify OTP"}
            variant="btn-dark"
            size="xl"
            className="w-full mt-6"
            disabled={isLoading || otp.length !== 6}
            onClick={handleSubmit}
          />
        </form>

        <div className="mt-6 text-center">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-green-800 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-gray-600">
              Resend OTP in{" "}
              <span className="font-medium">{formatTime(timer)}</span>
            </p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <Toaster position="bottom-right" />
      <OtpPageContent />
    </Suspense>
  );
}
