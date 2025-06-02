"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Paragraph from "./animationComponents/TextVisble";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
  onItemClick?: (item: FaqItem) => void;
  defaultActiveId?: string;
}
const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  className = "",
  onItemClick,
  defaultActiveId,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultActiveId) {
      setActiveId(defaultActiveId);
    } else if (items.length > 0) {
      setActiveId(items[0].id);
    }
  }, [defaultActiveId, items]);

  const toggleAccordion = (id: string, item: FaqItem) => {
    setActiveId((prevId) => (prevId === id ? null : id));
    onItemClick?.(item);
  };


  return (
    <section className="mb-16 lg:mb-40">
      <div className="container">
        <div className="grid w-full gap-6 items-start justify-between lg:grid-cols-[auto_569px] xl:grid-cols-[auto_680px] 2xl:grid-cols-[auto_745px]">
          <Paragraph
            align="start"
            paragraph="Frequently Asked Questions"
            textColor="text-dark"
            highlightedWord="Questions"
          />

          <div className={`space-y-4 w-full ${className}`}>
            {items.map((item) => {
              const isOpen = activeId === item.id;

              return (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-xl transition-colors duration-200 w-full ${
                    isOpen ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id, item)}
                    className="flex items-center justify-between  text-left gap-4 w-full p-3 sm:p-6 "
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${item.id}`}
                    id={`faq-header-${item.id}`}
                  >
                    <h3 className="text-h3 font-medium w-full">{item.question}</h3>
                    <div className={`flex text-white min-h-8 min-w-8 md:min-h-12 md:min-w-12 items-center justify-center rounded-full  transition-transform duration-300 ${
                      isOpen ? "bg-dark -rotate-180" : "bg-primary rotate-0"
                        }`}
                      >
                      <ChevronDown />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-content-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-header-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 px-3 sm:px-6 pb-3 sm:pb-6 pt-0">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
