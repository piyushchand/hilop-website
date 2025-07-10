"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "../AuthLayout";
import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import Button from "@/components/uiFramework/Button";
import { useAuth } from "@/contexts/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import { Suspense } from "react";

function CompleteProfileForm() {
  const { register, isLoading, error, clearError } = useAuth();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: searchParams?.get("name") || "",
    email: searchParams?.get("email") || "",
    mobile_number: "",
    birthdate: "",
  });

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
      await register({
        ...formData,
        mobile_number: `91${formData.mobile_number}`,
      });
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
              onClick={handleSubmit}
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
