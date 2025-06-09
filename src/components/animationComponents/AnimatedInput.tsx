'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Clock } from 'lucide-react';

interface AnimatedInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';
  value?: string;
  required?: boolean;
}

const formatIndianNumber = (num: string) => {
  const part1 = num.slice(0, 5);
  const part2 = num.slice(5, 10);
  return part2 ? `${part1} ${part2}` : part1;
};

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  name,
  type = 'text',
  value: initialValue = '',
  required = false,
}) => {
  const initialTelValue = type === 'tel' ? '+91 ' : '';
  const [value, setValue] = useState<string>(type === 'tel' ? initialTelValue : initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showFloatingLabel = isFocused || value.length > 0;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.(); // for date picker on modern browsers
      inputRef.current.focus();
    }
  };

  // Handles changes for tel input with formatting +91 XXXXX XXXXX
  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove spaces
    inputValue = inputValue.replace(/\s/g, '');

    // Ensure it starts with +91
    if (!inputValue.startsWith('+91')) {
      inputValue = '+91' + inputValue.replace(/^\+?/, '').replace(/^91/, '');
    }

    // Extract digits after +91
    let digits = inputValue.slice(3).replace(/\D/g, '');

    // Limit digits to max 10
    if (digits.length > 10) digits = digits.slice(0, 10);

    // Format digits
    const formattedDigits = formatIndianNumber(digits);

    // Final value
    setValue(`+91 ${formattedDigits}`);
  };

  // Prevent backspace/delete in prefix +91
  const handleTelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const cursorPos = e.currentTarget.selectionStart || 0;
    if ((e.key === 'Backspace' && cursorPos <= 4) || (e.key === 'Delete' && cursorPos < 4)) {
      e.preventDefault();
    }
  };

  // Prevent cursor moving before +91 
  const handleTelClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const cursorPos = e.currentTarget.selectionStart || 0;
    if (cursorPos < 4) {
      window.requestAnimationFrame(() => {
        if (inputRef.current) inputRef.current.setSelectionRange(4, 4);
      });
    }
  };

  return (
    <div className="relative">
      <motion.label
        htmlFor={name}
        className={`
          absolute left-3 top-1/2 -translate-y-1/2 
          bg-white px-1 transition-all duration-200 pointer-events-none
          ${showFloatingLabel ? 'top-1 text-xs' : 'text-base'}
          ${isFocused ? 'text-green-800' : 'text-gray-600/80'}
        `}
        animate={{
          top: showFloatingLabel ? '0.10rem' : '50%',
          fontSize: showFloatingLabel ? '0.75rem' : '1rem',
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
          type={type}
          value={value}
          onChange={type === 'tel' ? handleTelChange : (e) => setValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={type === 'tel' ? handleTelKeyDown : undefined}
          onClick={type === 'tel' ? handleTelClick : undefined}
          required={required}
          placeholder={label}
          className={`
            w-full px-3 py-4 bg-none outline-none [&::-webkit-calendar-picker-indicator]:opacity-0
            text-gray-900 placeholder-transparent leading-[24px] appearance-none
          `}
        />
       {(type === 'date' || type === 'time') && (
  <button
    type="button"
    onClick={handleIconClick}
    className="text-gray-700 hover:text-green-900"
  >
    {type === 'date' ? <CalendarRange size={20} /> : <Clock size={20} />}
  </button>
)}
      </div>
    </div>
  );
};

export default AnimatedInput;
