"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingSpinnerProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingSpinner({ isVisible, message = "Loading..." }: LoadingSpinnerProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm"
    >
      <div className="text-center">
        {/* Logo */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <Image 
            src="/logo.svg" 
            alt="Hilop" 
            width={120} 
            height={48}
            className="mx-auto"
          />
        </motion.div>

        {/* Spinner */}
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        </div>

        {/* Loading Text */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-gray-600 font-medium text-lg"
        >
          {message}
        </motion.p>

        {/* Dots Animation */}
        <div className="flex justify-center mt-2 space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-green-600 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
} 