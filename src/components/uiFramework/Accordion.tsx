"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: FaqItem[];
  className?: string;
  onItemClick?: (item: FaqItem) => void;
  defaultActiveIndex?: number; // Use index instead of id
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  className = "",
  onItemClick,
  defaultActiveIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      setActiveIndex(defaultActiveIndex);
    }
  }, [defaultActiveIndex, items]);

  const toggleAccordion = (index: number, item: FaqItem) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    onItemClick?.(item);
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        const dynamicId = `faq-${index}`;

        return (
          <div
            key={dynamicId}
            className={`overflow-hidden rounded-xl transition-colors duration-200 w-full ${
              isOpen ? "bg-gray-200" : "bg-white"
            }`}
          >
            <button
              onClick={() => toggleAccordion(index, item)}
              className="flex w-full items-center justify-between p-3 sm:p-6 text-left"
              aria-expanded={isOpen}
              aria-controls={`faq-content-${dynamicId}`}
              id={`faq-header-${dynamicId}`}
            >
              <h3 className="text-h3 font-medium">{item.question}</h3>
              <div
                className={`ml-4 flex h-8 w-8 md:h-11 md:w-11 items-center justify-center rounded-full transition-transform duration-300 ${
                  isOpen ? "bg-black" : "bg-primary"
                }`}
              >
                <ChevronDown
                  className={`text-white transition-transform duration-300 ${
                    isOpen ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-content-${dynamicId}`}
                  role="region"
                  aria-labelledby={`faq-header-${dynamicId}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-3 sm:px-6 pb-3 sm:pb-6 pt-0">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
