"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "../animationComponents/animated-model";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../uiFramework/Button";
import AnimatedInput from "../animationComponents/AnimatedInput";
import OTPInput from "../animationComponents/OTPInput";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

type CheckoutLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGuestCheckout?: (userData: GuestUserData) => void;
  onLogin?: () => void;
  onRegister?: () => void;
};

interface GuestUserData {
  name: string;
  phone: string;
  email: string;
}

type FormState = {
  name: string;
  phone: string;
  email: string;
};

type ValidationErrors = {
  name?: string;
  phone?: string;
  email?: string;
};

const OTP_TIMEOUT = 120;

const initialFormState: FormState = {
  name: "",
  phone: "",
  email: "",
};

const initialValidationErrors: ValidationErrors = {};

export default function CheckoutLoginModal({
  isOpen,
  onClose,
  onGuestCheckout,
}: CheckoutLoginModalProps) {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    initialValidationErrors
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [timer, setTimer] = useState(OTP_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { refreshUserData } = useAuth();

  // Refs for error elements
  const errorRefs = useRef<{ [key: string]: HTMLParagraphElement | null }>({});
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setValidationErrors(initialValidationErrors);
      setShowOTP(false);
      setOtp("");
      setUserId(null);
      setError("");
      setSuccess("");
      setTimer(OTP_TIMEOUT);
      setCanResend(false);
      setIsResending(false);
    }
  }, [isOpen]);

  // Timer effect for OTP resend
  useEffect(() => {
    if (showOTP && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    if (showOTP && timer === 0) {
      setCanResend(true);
    }
  }, [showOTP, timer]);

  // Scroll to first error when validation errors change
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError();
    }
  }, [validationErrors]);

  // Handle Enter key for OTP submission
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && otp.length === 6 && showOTP) {
        e.preventDefault();
        handleOTPSubmit();
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [otp, showOTP]);

  // Hide success message after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setSuccess("");
    setError("");
  };

  // Function to scroll to the first error message
  const scrollToFirstError = () => {
    setTimeout(() => {
      const firstErrorKey = Object.keys(validationErrors).find(
        (key) => validationErrors[key as keyof ValidationErrors]
      );

      if (firstErrorKey && errorRefs.current[firstErrorKey]) {
        if (modalScrollRef.current) {
          const errorElement = errorRefs.current[firstErrorKey];
          if (errorElement) {
            const containerRect =
              modalScrollRef.current.getBoundingClientRect();
            const elementRect = errorElement.getBoundingClientRect();
            const scrollTop = modalScrollRef.current.scrollTop;
            const elementTop = elementRect.top - containerRect.top + scrollTop;

            modalScrollRef.current.scrollTo({
              top: elementTop - containerRect.height / 2,
              behavior: "smooth",
            });
          }
        } else {
          errorRefs.current[firstErrorKey]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }, 300);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    // Validate phone number
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGuestCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/checkout-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: `91${formData.phone.trim()}`,
            email: formData.email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success toast
        toast.success(
          data.message ||
            "OTP sent successfully! Please verify your mobile number with the OTP sent."
        );

        // Store user ID for OTP verification
        if (data.data?.user_id) {
          setUserId(data.data.user_id);
        }

        // Switch to OTP view
        setShowOTP(true);
        setTimer(OTP_TIMEOUT);
        setCanResend(false);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Checkout login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!userId) {
      setError("Invalid verification session");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          otp: otp,
          phone: formData.phone.trim(),
          type: "register",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("OTP verified successfully!");
        setSuccess(data.message || "OTP verified successfully!");
        setError("");
        await refreshUserData();

        // Call the parent callback if provided
        if (onGuestCheckout) {
          onGuestCheckout(formData);
        }

        // Close modal after successful verification
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError("Invalid OTP. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Network error. Please try again.");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setIsResending(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/checkout-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: `91${formData.phone.trim()}`,
            email: formData.email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("OTP resent successfully!");
        setTimer(OTP_TIMEOUT);
        setCanResend(false);
        setOtp("");
        setError("");
      } else {
        throw new Error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP";

      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const viewVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <Modal
      className="max-w-md w-full max-h-[80vh] rounded-lg overflow-hidden shadow-lg flex flex-col"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200 text-center">
        {showOTP ? "Verify OTP" : "Complete Your Order"}
      </h2>

      <div
        ref={modalScrollRef}
        className="flex-1 flex flex-col gap-6 overflow-y-auto p-6"
      >
        <AnimatePresence mode="wait">
          {!showOTP ? (
            <motion.div
              key="checkoutForm"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={viewVariants}
              transition={viewVariants.transition}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGuestCheckout();
                }}
              >
                <div className="space-y-5">
                  <div>
                    <AnimatedInput
                      label="Full Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                    {validationErrors.name && (
                      <p
                        ref={(el) => {
                          errorRefs.current.name = el;
                        }}
                        className="text-red-500 text-xs mt-1 ml-1"
                      >
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative hilop-mobile-input-wrapper">
                    <span className="absolute left-3 top-4 translate-y-[10%] text-gray-500 text-base select-none pointer-events-none z-10">
                      +91
                    </span>
                    <AnimatedInput
                      label="Mobile Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                    {validationErrors.phone && (
                      <p
                        ref={(el) => {
                          errorRefs.current.phone = el;
                        }}
                        className="text-red-500 text-xs mt-1 ml-1"
                      >
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <AnimatedInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p
                        ref={(el) => {
                          errorRefs.current.email = el;
                        }}
                        className="text-red-500 text-xs mt-1 ml-1"
                      >
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="otpForm"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={viewVariants}
              transition={viewVariants.transition}
              className="text-center space-y-6"
            >
              <div>
                <p className="text-gray-600 mb-4">
                  Enter the 6-digit OTP sent to
                </p>
                <p className="font-semibold text-lg">+91 {formData.phone}</p>
              </div>

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <OTPInput
                  value={otp}
                  className="!size-10 md:!size-12 !text-base md:!size-lg"
                  onChange={handleOtpChange}
                  length={6}
                  disabled={isLoading}
                />

                <div className="flex justify-center">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isResending}
                      className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                    >
                      {isResending ? "Sending..." : "Resend OTP"}
                    </button>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Resend OTP in{" "}
                      <span className="font-medium">{formatTime(timer)}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col w-full gap-3  p-6 border-t border-gray-200">
        {!showOTP ? (
          <Button
            label={isLoading ? "Sending OTP..." : "Continue"}
            variant="btn-dark"
            className="ml-auto"
            size="xl"
            onClick={handleGuestCheckout}
            disabled={isLoading}
          />
        ) : (
          <Button
            label={isLoading ? "Verifying..." : "Verify OTP"}
            variant="btn-dark"
            className="ml-auto"
            size="xl"
            onClick={handleOTPSubmit}
            disabled={isLoading || otp.length !== 6}
          />
        )}
      </div>
    </Modal>
  );
}
