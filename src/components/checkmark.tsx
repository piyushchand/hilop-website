import Image from "next/image";
import clsx from "clsx";

interface CheckmarkProps {
  text: string;
  className?: string;
}

export function Checkmark({ text, className }: CheckmarkProps) {
  return (
    <div className={clsx("flex items-start gap-2", className)}>
      <Image
        src="/images/icon/list.svg"
        alt="Checkmark icon"
        width={24}
        height={24}
      />
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
