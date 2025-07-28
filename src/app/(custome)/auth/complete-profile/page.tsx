"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "../AuthLayout";
import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import Button from "@/components/uiFramework/Button";
import { useAuth } from "@/contexts/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

function CompleteProfileForm() {
  const { isLoading, error, clearError, success, setSuccess } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize with empty strings for hydration match
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    birthdate: "",
  });

  // Set name/email from searchParams on client only
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: searchParams?.get("name") || "",
      email: searchParams?.get("email") || "",
    }));
  }, [searchParams]);

  // Hide success message after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "mobile_number") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (error) clearError();
  };

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return /^[6-9]\d{9}$/.test(cleanPhone) && cleanPhone.length === 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mobile_number.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    if (!validatePhoneNumber(formData.mobile_number)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    if (!formData.birthdate) {
      toast.error("Please enter your birthdate");
      return;
    }

    try {
      const registerResult = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mobile_number: `91${formData.mobile_number}`,
        }),
      });
      const registerData = await registerResult.json();
      if (!registerResult.ok) {
        if (
          registerData.message &&
          registerData.message
            .toLowerCase()
            .includes("user with this email or mobile number already exists")
        ) {
          // User already exists: send OTP for login and redirect to OTP page (type=login)
          const loginResponse = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mobile_number: `91${formData.mobile_number}`,
            }),
          });
          const loginData = await loginResponse.json();
          if (!loginResponse.ok || !loginData.data?.user_id) {
            toast.error("Failed to send OTP. Please try logging in.");
            router.replace("/auth/login");
            return;
          }
          router.replace(
            `/auth/otp?type=login&userId=${loginData.data.user_id}&mobile=91${formData.mobile_number}`
          );
          return;
        } else {
          toast.error(registerData.message || "Registration failed");
          return;
        }
      }

      // New user: use user_id from register API and type=register for OTP
      if (registerData.data?.user_id) {
        router.replace(
          `/auth/otp?type=register&userId=${registerData.data.user_id}&mobile=91${formData.mobile_number}`
        );
        return;
      }
      // Fallback: if no user_id, show error
      toast.error(
        "Registration succeeded but user ID missing. Please try logging in."
      );
      router.replace("/auth/login");
    } catch {
      // Errors are handled by the useAuth hook and displayed via toast
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <AuthLayout
        bottomContent={
          <p className="text-sm mt-4 text-center text-gray-600 font-medium">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="hover:underline text-green-800 font-semibold cursor-pointer"
            >
              Log in
            </a>
          </p>
        }
      >
        <div className="xl:w-[495px] mx-auto lg:w-full md:w-[495px] min-w-auto">
          <h2 className="text-3xl font-semibold mb-2">Complete Your Profile</h2>
          <p className="font-medium mb-6 text-gray-600">
            Just a few more details to get you started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}
            <AnimatedInput
              label="Mobile Number"
              name="mobile_number"
              type="tel"
              value={formData.mobile_number}
              onChange={handleInputChange}
              required
            />
            <AnimatedInput
              label="Date of Birth"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleInputChange}
              required
            />

            <Button
              label={isLoading ? "Saving..." : "Save and Continue"}
              variant="btn-dark"
              size="xl"
              className="w-full mt-6"
              disabled={
                isLoading ||
                !formData.mobile_number.trim() ||
                !formData.birthdate
              }
              type="submit"
            />
          </form>
        </div>
      </AuthLayout>
    </>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteProfileForm />
    </Suspense>
  );
}
