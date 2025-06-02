import Link from 'next/link';

interface ButtonProps {
  label: string;
  link?: string;
  newTab?: boolean;
  variant?:
    | 'btn-primary'
    | 'btn-secondary'
    | 'btn-dark'
    | 'btn-light'
    | 'btn-gray'
    | 'btn-Border';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  label,
  link,
  newTab = false,
  variant = 'btn-dark',
  size = 'md',
  onClick,
  className = '',
}: ButtonProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-2';
      case 'md':
        return 'text-sm py-2 px-4';
      case 'lg':
        return 'text-base py-2 px-5';
      case 'xl':
        return 'text-lg py-3 px-6';
      case '2xl':
        return 'md:text-xl text-base md:py-4 md:px-8 py-3 px-4';
      default:
        return 'text-sm py-2 px-4';
    }
  };

  const variantClasses: Record<string, string> = {
    'btn-light': 'bg-white/10 backdrop-blur-lg border border-gray-200 hover:primary',
    'btn-secondary': 'border bg-white border-gray-200 hover:bg-gray-200',
    'btn-gray': 'border bg-gray-200 border-gray-200 hover:bg-gray-300',
    'btn-Border': 'border border-gray-200 hover:bg-gray-200',
    'btn-dark':
      'bg-dark border border-gray-900 !text-white',
    'btn-primary':
      'bg-primary border border-primary text-white hover:bg-green-800 hover:border-green-800',
  };

  const commonClasses = `btn-tn relative flex w-fit justify-center items-center overflow-hidden rounded-full transition-colors duration-500 ease-in-out ${variantClasses[variant] || ''} ${getSizeClasses()} ${className}`;

  if (link && newTab) {
    return (
      <Link
        href={link}
        target="_blank"
        className={commonClasses}
      >
        <span className="btn-tn-lable-1">{label}</span>
        <span className="btn-tn-lable-2 absolute">{label}</span>
      </Link>
    );
  }
  // 📌 If `link` and `newTab` is false → use Next.js <Link>
  if (link) {
    return (
      <Link
        href={link}
        className={commonClasses}
      >
        <span className="btn-tn-lable-1">{label}</span>
        <span className="btn-tn-lable-2 absolute">{label}</span>
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className={commonClasses}
    >
      <span className="btn-tn-lable-1">{label}</span>
      <span className="btn-tn-lable-2 absolute">{label}</span>
    </button>
  );
};

export default Button;
