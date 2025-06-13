'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OTPInput from "@/components/animationComponents/OTPInput";
import Button from "@/components/uiFramework/Button";
import AuthLayout from "../AuthLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useAuthOperations } from '@/hooks/useAuth';

export default function OtpPage() {
  const { isLoading, error, clearError, user, logout } = useAuth();
  const { verifyRegistrationOTP, verifyLoginOTP, loginWithMobile } = useAuthOperations();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const otpType = searchParams.get('type'); // 'register' or 'login'
  const userId = searchParams.get('userId');
  const mobileNumber = searchParams.get('mobile');
  const fromPath = searchParams.get('from');

  useEffect(() => {
    if (!otpType || !userId || !mobileNumber) {
      router.replace(otpType === 'register' ? '/auth/register' : '/auth/login');
    }
  }, [otpType, userId, mobileNumber]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!otp || otp.length !== 6) return;
    if (!userId) return;
  
    try {
      if (otpType === 'register') {
        const response = await verifyRegistrationOTP(otp, userId);
        if (response.success && response.token && response.user) {
          // Redirect to the intended path or default to profile
          const redirectPath = fromPath || '/profile';
          router.push(redirectPath);
        }
      } else {
        const response = await verifyLoginOTP(otp, userId);
        if (response.success && response.token && response.user) {
          // Redirect to the intended path or default to profile
          const redirectPath = fromPath || '/profile';
          router.push(redirectPath);
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !mobileNumber) return;

    try {
      setIsResending(true);
      clearError();

      if (otpType === 'login') {
        await loginWithMobile({ mobile_number: mobileNumber });
      } else {
        alert('Resend OTP for registration is not supported. Please sign up again.');
        router.replace('/auth/register');
        return;
      }

      setTimer(120);
      setCanResend(false);
      setOtp('');
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/auth/login"); // Redirect to login page after logout
  };

  const getPageTitle = () => {
    return otpType === 'register' ? 'Complete Registration' : 'Login Verification';
  };

  const getPageDescription = () => {
    const formattedMobile = mobileNumber
      ? `+${mobileNumber.slice(0, 2)} ${mobileNumber.slice(2, 7)} ${mobileNumber.slice(7)}`
      : '';
    return otpType === 'register'
      ? `We have sent an OTP code to ${formattedMobile} to complete your registration.`
      : `We have sent an OTP code to ${formattedMobile} to verify your login.`;
  };

  return (
    <AuthLayout
      bottomContent={
        <p className="text-sm mt-4 text-center text-gray-600 font-medium">
          {otpType === 'register' ? (
            <>
              Already have an account?{' '}
              <a href="/auth/login" className="hover:underline text-green-800 font-semibold cursor-pointer">
                Log in
              </a>
            </>
          ) : (
            <>
              Don&apos;t have an account yet?{' '}
              <a href="/auth/register" className="hover:underline text-green-800 font-semibold cursor-pointer">
                Sign up for free
              </a>
            </>
          )}
        </p>
      }
    >
      <div className="xl:w-[495px] mx-auto lg:w-full md:w-[495px] min-w-auto">
        <h2 className="text-3xl font-semibold mb-2">{getPageTitle()}</h2>
        <p className="font-medium mb-6 text-gray-600">{getPageDescription()}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <OTPInput
            value={otp}
            onChange={handleOtpChange}
            length={6}
            disabled={isLoading}
          />

          <div className="mt-6">
            <Button
              label={isLoading ? 'Verifying...' : 'Verify OTP'}
              variant="btn-dark"
              size="xl"
              className="w-full"
              disabled={isLoading || otp.length !== 6}
              onClick={handleSubmit}
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-green-800 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          ) : (
            <p className="text-gray-600">
              Resend OTP in <span className="font-medium">{formatTime(timer)}</span>
            </p>
          )}
        </div>
      </div>
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="focus:outline-none"
            aria-label="Profile"
          >
            {/* Replace with your profile icon */}
            <img
              src="/profile-icon.svg"
              alt="Profile"
              className="w-8 h-8 rounded-full border"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
