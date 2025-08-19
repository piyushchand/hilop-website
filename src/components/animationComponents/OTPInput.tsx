// components/animationComponents/OTPInput.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function OTPInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  autoFocus = true,
  className = "",
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when external value changes
  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length);
      const paddedArray = [
        ...otpArray,
        ...new Array(length - otpArray.length).fill(""),
      ];
      setOtp(paddedArray);
    } else {
      setOtp(new Array(length).fill(""));
    }
  }, [value, length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (disabled) return;

    const value = element.value;

    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Call parent onChange
    if (onChange) {
      onChange(newOtp.join(""));
    }

    // Move to next input if current field is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current field
        newOtp[index] = "";
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }

      setOtp(newOtp);
      if (onChange) {
        onChange(newOtp.join(""));
      }
    }

    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Handle delete key
    else if (e.key === "Delete") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (onChange) {
        onChange(newOtp.join(""));
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pasteData = e.clipboardData.getData("text");
    const numericData = pasteData.replace(/\D/g, "").slice(0, length);

    if (numericData) {
      const newOtp = numericData
        .split("")
        .concat(new Array(length).fill(""))
        .slice(0, length);
      setOtp(newOtp);

      if (onChange) {
        onChange(newOtp.join(""));
      }

      // Focus the last filled input or the first empty one
      if (inputRefs.current.length !== length) {
        inputRefs.current = Array(length)
          .fill(null)
          .map((_, i) => inputRefs.current[i] || null);
      }
      const nextEmptyIndex =
        numericData.length < length ? numericData.length : length - 1;
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d{1}"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={handleFocus}
          onPaste={handlePaste}
          disabled={disabled}
          className={`${className}
            w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
            transition-all duration-200 outline-none
            ${
              digit
                ? "border-green-500 bg-green-50 text-green-800"
                : "border-gray-300 bg-white hover:border-gray-400 focus:border-green-500"
            }
            ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "focus:ring-2 focus:ring-green-200"
            }
          `}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
