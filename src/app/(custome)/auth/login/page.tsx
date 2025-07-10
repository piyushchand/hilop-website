"use client";

import { useState, useEffect } from "react";
import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import AuthLayout from "../AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, signInWithGoogle, signInWithFacebook, user } = useAuth();
  const [mobileNumber, setMobileNumber] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    if (error) clearError();
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };
  const handleFacebookLogin = async () => {
    await signInWithFacebook();
  };

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return /^[6-9]\d{9}$/.test(cleanPhone) && cleanPhone.length === 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileNumber.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    if (!validatePhoneNumber(mobileNumber)) {
      toast.error(
        "Please enter a valid 10-digit Indian mobile number starting with 6-9"
      );
      return;
    }

    try {
      await login(`91${mobileNumber}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Login failed");
      }
    }
  };

  // After successful login, check for redirectAfterLogin in localStorage
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        router.replace(redirectPath);
      }
    }
  }, [user, router]);

  return (
    <>
      <Toaster position="bottom-right" />
      <AuthLayout
        bottomContent={
          <p className="text-sm mt-4 text-center text-gray-600 font-medium">
            Don&apos;t have an account yet?{" "}
            <a
              href="/auth/register"
              className="hover:underline text-green-800 font-semibold cursor-pointer"
            >
              Sign up for free
            </a>
          </p>
        }
      >
        <div className="xl:w-[495px] mx-auto lg:w-full md:w-[495px] min-w-auto">
          <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
          <p className="font-medium mb-6 text-gray-600">
            Let&apos;s get you logged in.
          </p>

          <form onSubmit={handleSubmit}>
            <AnimatedInput
              label="Mobile number"
              name="mobile_number"
              type="tel"
              value={mobileNumber}
              onChange={handleInputChange}
              required
            />

            <Button
              label={isLoading ? "Sending OTP..." : "Get OTP"}
              variant="btn-dark"
              size="xl"
              className="w-full mt-6"
              disabled={
                isLoading || !mobileNumber.trim() || mobileNumber.length !== 10
              }
              onClick={handleSubmit}
            />
          </form>

          <div className="text-center text-sm my-4">Or login with</div>

          <div className="flex gap-4">
            <button
              type="button"
              className="text-lg py-3 px-6 w-full cursor-pointer bg-white border hover:text-dark hover:border-green-400 hover:bg-gray-100 transition-all duration-300 border-gray-200 text-gray-600 rounded-full flex items-center justify-center gap-2.5"
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              <Image
                src="/images/icon/google.svg"
                width={22}
                height={22}
                alt="Google"
              />
              Google
            </button>

            <button
              type="button"
              className="text-lg py-3 px-6 w-full cursor-pointer bg-white border hover:text-dark hover:border-green-400 hover:bg-gray-100 transition-all duration-300 border-gray-200 text-gray-600 rounded-full flex items-center justify-center gap-2.5"
              disabled={isLoading}
              onClick={handleFacebookLogin}
            >
              <Image
                src="/images/icon/facebook.svg"
                width={22}
                height={22}
                alt="Facebook"
              />
              Facebook
            </button>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
