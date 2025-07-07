"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarRange, Clock } from "lucide-react";

interface AnimatedInputProps {
  label: string;
  name: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "time";
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatIndianNumber = (num: string) => {
  return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  name,
  type = "text",
  value: initialValue = "",
  required = false,
  readOnly = false,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal state when prop changes
  React.useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const getDisplayValue = () => {
    if (type === "tel" && inputValue) {
      const cleanValue = inputValue.replace(/\D/g, "");
      if (cleanValue.length >= 10) {
        return formatIndianNumber(cleanValue);
      }
      return cleanValue;
    }
    return inputValue;
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      if (type === "date" && typeof (inputRef.current as HTMLInputElement).showPicker === 'function') {
        (inputRef.current as HTMLInputElement).showPicker();
      }
    }
  };

  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, "").slice(0, 10);

    setInputValue(cleanValue);

    // Create a synthetic event with the clean value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: cleanValue,
        name: e.target.name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  };

  const handleTelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if (
      [8, 9, 27, 13, 46, 37, 39].includes(e.keyCode) ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const handleTelClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Move cursor to end of input
    const target = e.target as HTMLInputElement;
    target.setSelectionRange(target.value.length, target.value.length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "tel") {
      handleTelChange(e);
    } else {
      setInputValue(e.target.value);
      onChange?.(e);
    }
  };

  return (
    <div className="relative">
      <motion.label
        htmlFor={name}
        className={`
          absolute left-3 top-1/2 -translate-y-1/2 
          bg-white px-1 transition-all duration-200 pointer-events-none
          ${isFocused || inputValue ? "top-1 text-xs" : "text-base"}
          ${isFocused ? "text-green-800" : "text-gray-600/80"}
        `}
        animate={{
          top: isFocused || inputValue ? "0.10rem" : "50%",
          fontSize: isFocused || inputValue ? "0.75rem" : "1rem",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.label>

      <div
        className="flex items-center bg-white rounded-lg border-2 overflow-hidden 
          transition-all duration-200 focus-within:border-green-600 border-gray-200 pr-3"
      >
        <input
          id={name}
          name={name}
          ref={inputRef}
          type={type === "tel" ? "text" : type}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={type === "tel" ? handleTelKeyDown : undefined}
          onClick={type === "tel" ? handleTelClick : undefined}
          required={required}
          readOnly={readOnly}
          placeholder={label}
          className={`
            w-full px-3 py-4 bg-none outline-none [&::-webkit-calendar-picker-indicator]:opacity-0
            text-gray-900 placeholder-transparent leading-[24px] appearance-none
          `}
        />
        {(type === "date" || type === "time") && (
          <button
            type="button"
            onClick={handleIconClick}
            className=" hover:text-red-800"
          >
            {type === "date" ? (
              <CalendarRange size={20} color="currentColor" />
            ) : (
              <Clock size={20} color="currentColor" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimatedInput;
