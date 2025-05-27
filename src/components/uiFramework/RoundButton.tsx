import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

interface ButtonProps {
  link?: string;
  onClick?: React.MouseEventHandler; 
  variant?: 'btn-dark' | 'btn-light' | 'btn-primary' | 'btn-secondary'; 
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export default function RoundButton({
  link,
  onClick,
  variant = 'btn-dark',
  size = 'md',
  className = '',
}: ButtonProps) {
  const iconSrc =
    variant === 'btn-light'
      ? '/images/icon/arrow-white.svg'
      : variant === 'btn-secondary'
        ? '/images/icon/arrow-primary.svg'
        : '/images/icon/arrow-white.svg';

  const sizeClasses: Record<string, string> = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
    '2xl': 'h-16 w-16',
  };

  const variantClasses: Record<string, string> = {
    'btn-dark': 'bg-black',
    'btn-light': 'bg-white',
    'btn-primary': 'bg-[#0090f6]',
    'btn-secondary': 'bg-[#6B7280]',
  };

  const baseClasses = clsx(
    'roundbutton-hilop relative inline-flex items-center justify-center overflow-hidden rounded-full',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const content = (
    <>
      <Image
        className="roundbutton-arrow-1"
        src={iconSrc}
        alt="button arrow"
        width={26}
        height={26}
      />
      <Image
        className="roundbutton-arrow-2 absolute"
        src={iconSrc}
        alt="button arrow"
        width={26}
        height={26}
      />
    </>
  );

  if (link) {
    return (
      <Link
        href={link}
        aria-label="Navigate"
        className={baseClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Navigate"
      className={baseClasses}
    >
      {content}
    </button>
  );
}
