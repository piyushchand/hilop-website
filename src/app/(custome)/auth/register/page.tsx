"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import Button from "@/components/uiFramework/Button";
// import Image from "next/image";
import AuthLayout from "../AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  mobile_number: string;
  birthdate: string;
}

export default function RegisterPage() {
  const { register, isLoading, error, clearError, success, setSuccess } =
    useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile_number: "",
    birthdate: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const countryBoxRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryBoxRef.current &&
        !countryBoxRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const processedValue =
        name === "mobile_number"
          ? value.replace(/\D/g, "").slice(0, 10)
          : value;

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));

      if (error) clearError();
    },
    [error, clearError]
  );

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    const mobileNumber = formData.mobile_number.trim();
    if (!mobileNumber) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (mobileNumber.length !== 10) {
      newErrors.mobile_number = "Please enter a valid 10-digit mobile number";
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(mobileNumber)) {
        newErrors.mobile_number =
          "Please enter a valid Indian mobile number starting with 6-9";
      }
    }
    // if (!formData.birthdate) {
    //   newErrors.birthdate = "Date of birth is required";
    // } else {
    //   const birthDate = new Date(formData.birthdate);
    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);
    //   if (birthDate > today) {
    //     newErrors.birthdate = "Date of birth cannot be in the future";
    //   }
    // }
    if (!agreedToTerms) {
      newErrors.terms = "Please agree to Terms & Conditions";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      throw new Error("Validation error");
    }
  }, [formData, agreedToTerms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    clearError();

    try {
      validateForm();

      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile_number: `91${formData.mobile_number.trim()}`,
        birthdate: formData.birthdate,
      };

      await register(registrationData);
    } catch (err) {
      if (err instanceof Error) {
        // Only show toast for API/server errors, not validation
        console.error(err?.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  // Hide success message after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  return (
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
        <h2 className="text-3xl font-semibold mb-2">Create Account</h2>
        <p className="font-medium mb-6 text-gray-600">
          Join us to get started with your health journey.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            {error.split("\n").map((err, index) => (
              <p key={index} className="text-red-600 text-sm">
                {err}
              </p>
            ))}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md transition-all duration-300 ease-in-out">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-5 mb-6">
            <div className="flex flex-col gap-1">
              <AnimatedInput
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              {errors.name && (
                <div className="text-red-500 text-sm ">{errors.name}</div>
              )}
            </div>

            <div className="flex flex-col gap-px">
              <AnimatedInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && (
                <div className="text-red-500 text-sm ">{errors.email}</div>
              )}
            </div>

            <div className="flex flex-col  items-stretch gap-1 relative">
              {/* Mobile input field */}
              <div className="flex-1 h-12">
                <div className="h-full relative hilop-mobile-input-wrapper">
                  <span className="absolute left-3 top-4 translate-y-[10%] text-gray-500 text-base select-none pointer-events-none z-10">
                    +91
                  </span>
                  <AnimatedInput
                    label="Mobile number"
                    name="mobile_number"
                    type="tel"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    required
                    placeholder="9876543210"
                  />
                </div>
              </div>
              {errors.mobile_number && (
                <div className="text-red-500 text-sm">
                  {errors.mobile_number}
                </div>
              )}
            </div>

            {/* <div className="flex flex-col gap-px">
              <AnimatedInput
                label="Date of Birth"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.birthdate && (
                <div className="text-red-500 text-sm ">{errors.birthdate}</div>
              )}
            </div> */}
          </div>

          <label className="mb-4 flex cursor-pointer items-start">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mr-2 accent-primary size-5 mt-0.5"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-600 font-medium">
              By registering, you agree to our{" "}
              <a
                href="/terms-and-conditions"
                className="underline text-dark hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                className="underline text-dark hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <div className="text-red-500 text-sm mb-4 ">{errors.terms}</div>
          )}

          <Button
            label={isLoading ? "Creating Account..." : "Create Account"}
            variant="btn-dark"
            size="xl"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          />
        </form>

        {/* <div className="text-center text-sm my-4">Or register with</div> */}

        {/* <div className="flex gap-4">
          <button
            type="button"
            className="text-lg py-3 px-6 w-full cursor-pointer bg-white border hover:text-dark hover:border-green-400 hover:bg-gray-100 transition-all duration-300 border-gray-200 text-gray-600 rounded-full flex items-center justify-center gap-2.5"
            disabled={isLoading}
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
          >
            <Image
              src="/images/icon/facebook.svg"
              width={22}
              height={22}
              alt="Facebook"
            />
            Facebook
          </button> 
        </div>*/}
      </div>
    </AuthLayout>
  );
}
