"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";


const MotionLink = motion(Link);

const imageGrid = [
  {
    src: "/images/auth/1.jpg",
    alt: "Woman with closed eyes",
    className: "col-span-6",
  },
  {
    src: "/images/auth/2.jpg",
    alt: "Person holding liver graphic",
    className: "col-span-6",
  },
  {
    src: "/images/auth/3.jpg",
    alt: "Elderly couple smiling",
    className: "col-span-4",
  },
  {
    src: "/images/auth/4.jpg",
    alt: "Woman showing loose jeans",
    className: "col-span-8",
  },
  { src: "/images/auth/5.jpg", alt: "Couple in bed", className: "col-span-8" },
  {
    src: "/images/auth/6.jpg",
    alt: "Couple kissing in bed",
    className: "col-span-4",
  },
];
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
};
export default function AuthLayout({
  children,
  bottomContent,
}: {
  children: ReactNode;
  bottomContent?: ReactNode;
}) {
  return (
    <div className="relative grid w-full h-screen grid-cols-1 overflow-hidden bg-white lg:grid-cols-2">
      {/* Close Button */}
      <MotionLink
          href="/"
          className="absolute top-6 right-6 sm:top-10 sm:right-10 z-30 w-10 h-10 text-white bg-dark rounded-full flex items-center justify-center hover:text-gray-300"
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ rotate: 90 }}
      >
        <X size={28} />
      </MotionLink>

      {/* Left Content */}
      <div className="flex flex-col justify-between w-full h-full px-6 py-8 overflow-y-auto sm:px-10 lg:px-16">
        <Link href="/">
          <Image src="/logo.svg" alt="Hilop logo" width={100} height={40} />
        </Link>

        <div>{children}</div>
        {bottomContent && (
          <div className="mt-8 text-sm text-gray-500">{bottomContent}</div>
        )}
      </div>

      {/* Right Image Grid */}
      <div className="relative hidden w-full h-full lg:flex items-center justify-center bg-green-100">
        <motion.div
          className="grid grid-cols-12 gap-4 w-full h-full p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {imageGrid.map((image, index) => (
            <motion.div
              key={index}
              className={`relative rounded-lg overflow-hidden ${image.className}`}
              variants={itemVariants}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
