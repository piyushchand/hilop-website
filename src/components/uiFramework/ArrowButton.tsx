"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ArrowButtonProps {
  label: string;
  theme: 'light' | 'dark' | 'primary';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const SIZE_CLASSES = {
  sm: 'text-xs py-2 ps-4 pe-2 gap-2 grid-cols-[auto_24px]',
  md: 'text-sm py-2 ps-4 pe-2 gap-2 grid-cols-[auto_28px]',
  lg: 'text-base py-[6px] ps-6 pe-[6px] gap-3 font-medium grid-cols-[auto_32px] md:grid-cols-[auto_40px]',
  xl: 'text-xl py-[6px] ps-6 pe-[6px] gap-3 grid-cols-[auto_32px] md:grid-cols-[auto_44px]',
  '2xl': 'text-base md:text-xl py-2 ps-6 pe-2 gap-4 grid-cols-[auto_32px] md:grid-cols-[auto_48px]',
};

const INNER_CIRCLE_SIZE = {
  sm: 'size-6',
  md: 'size-7',
  lg: 'size-8 md:size-10',
  xl: 'size-8 md:size-11',
  '2xl': 'size-8 md:size-12',
};


const DEFAULT_ARROW_SIZE = {
  sm: 14,
  md: 16,
  lg: 26,
  xl: 22,
  '2xl': 28,
};

const ArrowButton: React.FC<ArrowButtonProps> = ({
  label,
  theme,
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
}) => {
  const [arrowSize, setArrowSize] = useState(DEFAULT_ARROW_SIZE[size]);

 useEffect(() => {
    const updateArrowSize = () => {
      if (window.innerWidth >= 1024) {
        setArrowSize(DEFAULT_ARROW_SIZE[size]);
      } else {
        setArrowSize(20);
      }
    };

    updateArrowSize();
    window.addEventListener('resize', updateArrowSize);
    return () => window.removeEventListener('resize', updateArrowSize);
  }, [size]);

  // Theme-based classes
  const outerClass =
    theme === 'dark'
      ? 'bg-black text-white'
      : theme === 'primary'
      ? 'bg-green-800 text-white'
      : 'bg-white border-gray-200 text-black border';

  const innerClass =
    theme === 'dark'
      ? 'bg-white'
      : theme === 'primary'
      ? 'bg-white'
      : 'bg-primary';

  const arrowSrc =
    theme === 'dark'
      ? '/images/icon/arrow-primary.svg'
      : theme === 'primary'
      ? '/images/icon/arrow-primary.svg'
      : '/images/icon/arrow-white.svg';

  const buttonContent = (
    <div
      className={`btn-tn-arrow grid items-center rounded-full ${outerClass} ${SIZE_CLASSES[size]}`}
    >
      <span className='flex-none w-full text-center'>{label}</span>
      <div
        className={`btn-tn-arrow-round relative flex items-center justify-center overflow-hidden rounded-full ${innerClass} ${INNER_CIRCLE_SIZE[size]}`}
      >
        <Image
          className="btn-tn-arrow-1"
          src={arrowSrc}
          alt="arrow"
          width={arrowSize}
          height={arrowSize}
        />
        <Image
          className="btn-tn-arrow-2"
          src={arrowSrc}
          alt="arrow"
          width={arrowSize}
          height={arrowSize}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={`inline-block w-fit ${className}`}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={`w-fit h-fit ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
};

export default ArrowButton;