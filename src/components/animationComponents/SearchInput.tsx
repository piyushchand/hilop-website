"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const startPlaceholderAnimation = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startPlaceholderAnimation();
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    startPlaceholderAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
    setValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-white h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-200",
        value && "bg-gray-50"
      )}
      onSubmit={handleSubmit}
    >
      <div className="absolute inset-0 flex items-center px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              key={`placeholder-${currentPlaceholder}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-sm sm:text-base text-neutral-500 truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        ref={inputRef}
        className="w-full relative z-10 text-sm sm:text-base border-none bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-6 pr-10"
      />

      <button
        type="submit"
        aria-label="Submit Search"
        disabled={!value}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 h-8 w-8 rounded-full bg-black disabled:bg-gray-100 transition duration-200 flex items-center justify-center"
      >
        <Image
          src="/images/icon/arrow-primary.svg"
          alt="Search"
          width={24}
          height={24}
          className="h-4 w-4 text-gray-300"
        />
      </button>
    </form>
  );
}
