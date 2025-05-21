import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

interface AccordionLink {
  link: string;
  linkText: string;
}

interface AccordionItem {
  title: string;
  links: AccordionLink[];
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-gray-800 shadow-sm"
        >
          {/* Accordion Header */}
          <button
            className="flex w-full items-center justify-between bg-gray-800 p-3 text-left hover:bg-gray-900 hover:transition-all"
            onClick={() => toggleAccordion(index)}
          >
            <span className="font-medium text-gray-500">{item.title}</span>
            <svg
              className={`h-5 w-5 transform text-gray-600 transition-transform ${
                activeIndex === index ? 'rotate-180' : 'rotate-0'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Accordion Body */}
          <div
            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
              activeIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="grid gap-4 p-4 text-gray-700">
              {item.links.map((link, linkIndex) => (
                <div key={linkIndex}>
                  <Link
                    href={link.link}
                    rel="noopener noreferrer"
                    className="custome-text-hover text-white"
                  >
                    {link.linkText}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
