// components/CircularProgressBar.tsx
import React, { useState, useEffect } from 'react';

interface CircularProgressBarProps {
  percentage: number; // The percentage of product consumed (0-100)
  size?: number; // Diameter of the progress bar in pixels
  strokeWidth?: number; // Thickness of the progress bar line
  progressColor?: string; // Color of the progress arc
  trackColor?: string; // Color of the background track
  animationDuration?: number; // Duration of the animation in milliseconds
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 100, // Default size
  strokeWidth = 10, // Default stroke width
  progressColor = 'text-blue-500', // Tailwind class for progress color
  trackColor = 'text-gray-300', // Tailwind class for track color
  animationDuration = 5000, // 5 seconds default
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // State to hold the current animated progress (0 to percentage)
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // Reset animated percentage when component mounts or percentage changes
    setAnimatedPercentage(0);

    // Animate the progress
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1); // Clamp between 0 and 1
      const currentAnimatedValue = percentage * progress;
      setAnimatedPercentage(currentAnimatedValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId); // Cleanup animation frame
  }, [percentage, animationDuration]); // Re-run effect if percentage or duration changes

  // Calculate the dash offset based on the animated percentage
  const dashOffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className={`relative w-[${size}px] h-[${size}px] flex items-center justify-center top-2`}>
      <svg
        className="transform -rotate-90 absolute" // Rotate to start progress from the top
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          className={`${trackColor}`}
          strokeWidth={strokeWidth}
          stroke="currentColor" // Use currentColor for Tailwind class
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress bar */}
        <circle
          className={`${progressColor} transition-all duration-500 ease-out`} // Tailwind transition
          strokeWidth={strokeWidth}
          stroke="currentColor" // Use currentColor for Tailwind class
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      
      {/* Percentage text in center */}
      <div className=" inset-0 flex items-center justify-center h-[133px]">
        <span className={`text-xs font-semibold ${progressColor}`}>
          {Math.round(animatedPercentage)}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgressBar;