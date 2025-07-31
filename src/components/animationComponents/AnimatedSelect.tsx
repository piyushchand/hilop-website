"use client";
import React, { useState, useRef, SelectHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface AnimatedSelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "value" | "name" | "label"
  > {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  label,
  name,
  value: initialValue = "",
  required = false,
  onChange,
  disabled = false,
  options,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState(initialValue);
  const selectRef = useRef<HTMLDivElement>(null);

  // Update internal state when prop changes
  React.useEffect(() => {
    setSelectValue(initialValue);
  }, [initialValue]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleSelectClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectClick();
    }
  };

  // Handle touch events for mobile - removed to fix mobile selection issues

  const handleOptionClick = (optionValue: string) => {
    setSelectValue(optionValue);
    setIsOpen(false);
    setIsFocused(false);

    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: {
        name,
        value: optionValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange?.(syntheticEvent);
  };

  const selectedOption = options.find((option) => option.value === selectValue);

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <motion.label
          htmlFor={name}
          className={`
            absolute left-3 top-1/2 -translate-y-1/2 
            bg-white px-1 transition-all duration-200 pointer-events-none z-10
            ${isFocused || selectValue ? "top-1 text-xs" : "text-base"}
            ${isFocused ? "text-green-800" : "text-gray-600/80"}
          `}
          animate={{
            top: isFocused || selectValue ? "0.10rem" : "50%",
            fontSize: isFocused || selectValue ? "0.75rem" : "1rem",
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      <div
        className={`
           flex items-center bg-white rounded-lg border-2 overflow-hidden 
           transition-all duration-200 cursor-pointer select-none touch-manipulation
           ${isFocused ? "border-green-600" : "border-gray-200"}
           ${
             disabled
               ? "opacity-50 cursor-not-allowed"
               : "hover:border-green-500 active:border-green-700"
           }
         `}
        onClick={handleSelectClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex-1 px-3 py-4">
          <span
            className={`
            block leading-[24px] text-gray-900
            ${!selectedOption ? "text-gray-500" : ""}
          `}
          >
            {selectedOption
              ? selectedOption.label
              : placeholder || "Select an option"}
          </span>
        </div>
        <div className="flex items-center pr-3">
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Custom Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden"
            style={{
              top: "100%",
              left: 0,
              maxHeight: "240px",
              WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS
            }}
          >
            <div
              className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{
                WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS
              }}
              onTouchMove={(e) => {
                // Allow scrolling within the dropdown
                e.stopPropagation();
              }}
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  onTouchMove={(e) => {
                    // Allow scrolling within the dropdown
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleOptionClick(option.value);
                    }
                  }}
                  className={`
                     flex items-center justify-between px-3 py-4 cursor-pointer transition-colors duration-150 touch-manipulation
                     hover:bg-green-50 hover:text-green-800 active:bg-green-100
                     ${
                       option.value === selectValue
                         ? "bg-green-100 text-green-800"
                         : "text-gray-700"
                     }
                   `}
                  role="option"
                  aria-selected={option.value === selectValue}
                  tabIndex={0}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.value === selectValue && (
                    <Check size={16} className="text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedSelect;
