import React, { useRef, useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextareaProps {
  label: string;
  name: string;
  value?: string; // For initial value
  required?: boolean;
  rows?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const AnimatedTextarea: React.FC<AnimatedTextareaProps> = ({
  label,
  name,
  value: initialValue = '',
  required = false,
  rows = 4,
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showFloatingLabel = isFocused || currentValue.length > 0;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value);
    if (onChange) {
      onChange(e); 
    }
  };

  return (
    <div className="relative">
      <motion.label
        htmlFor={name}
        className={`
          absolute left-3 top-3 -translate-y-1/2 
          bg-white px-1 transition-all duration-200 pointer-events-none
          ${showFloatingLabel ? 'top-1 text-xs' : 'text-base'}
          ${isFocused ? 'text-green-800' : 'text-gray-600/80'}
        `}
        animate={{
          top: showFloatingLabel ? '0.50rem' : '38px', // Adjust based on your textarea padding
          fontSize: showFloatingLabel ? '0.75rem' : '1rem',
        }}
        transition={{ duration: 0.2 }}
        style={{
           transform: showFloatingLabel ? 'translateY(-50%)' : 'translateY(-50%)' ,
        }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.label>

      <div
        className={`
          flex items-center bg-white rounded-lg border-2 overflow-hidden 
          transition-all duration-200 focus-within:border-green-600 border-gray-200
        `}
      >
        <textarea
          id={name}
          name={name}
          ref={textareaRef}
          value={currentValue} 
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          rows={rows}
          className={`
            w-full px-3 py-4 bg-transparent outline-none
            text-gray-900 placeholder-transparent leading-[24px] appearance-none resize-y
            min-h-[${rows * 24 + 16 + 16}px] /* approx based on leading and py */
          `}
        />
      </div>
    </div>
  );
};

export default AnimatedTextarea;