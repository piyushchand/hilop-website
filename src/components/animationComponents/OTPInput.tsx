import React, { useRef, useState } from 'react';

const OTPInput: React.FC = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null)); // Initialized array with length 6
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) focusInput(index + 1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) focusInput(index - 1);
    if (e.key === 'ArrowRight' && index < 5) focusInput(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length !== 6) return;

    const newOtp = pasted.split('');
    setOtp(newOtp);
    newOtp.forEach((val, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = val;
      }
    });
    focusInput(5);
    e.preventDefault();
  };

  return (
    <div className="flex space-x-2 justify-center mt-10">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el; // No return statement here, so no TS error
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-14 h-14 text-center text-xl border-2 border-green-400 rounded-md focus:outline-none focus:border-green-800"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPInput;
