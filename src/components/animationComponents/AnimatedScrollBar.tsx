import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedScrollBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const AnimatedScrollBar: React.FC<AnimatedScrollBarProps> = ({
  currentStep,
  totalSteps,
  className = "",
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage =
      totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
    setProgress(percentage);
  }, [currentStep, totalSteps]);

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar Container */}
      <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden relative">
        {/* Animated Progress Bar */}
        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: [0, "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedScrollBar;
