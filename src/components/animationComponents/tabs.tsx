"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  onTabChange,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  onTabChange: (tab: Tab) => void;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);

  const handleClick = (tab: Tab) => {
    setActive(tab);
    onTabChange(tab);
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start relative overflow-hidden w-fit bg-gray-100 p-1 rounded-full",
        containerClassName
      )}
    >
      {propTabs.map((tab) => (
        <button
          key={tab.title}
          onClick={() => handleClick(tab)}
          // Removed onMouseEnter: No hover animation
          className={cn("relative px-4 py-2 rounded-full", tabClassName)}
        >
          {/* Only show motion.div when tab is active */}
          {active.value === tab.value && (
            <motion.div
              layoutId="clickedbutton"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={cn(
                "absolute inset-0 bg-black rounded-full z-0",
                activeTabClassName
              )}
            />
          )}

          <span
            className={cn(
              "relative block text-base z-10",
              active.value === tab.value ? "text-white" : "text-gray-600"
            )}
          >
            {tab.title}
          </span>
        </button>
      ))}
    </div>
  );
};