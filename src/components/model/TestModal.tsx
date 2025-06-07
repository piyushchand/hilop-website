"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Undo2, X } from "lucide-react";

type TestModalProps = {
    isOpen: boolean;
    onClose: () => void;
  };

const questions = [
    {
      id: 1,
      question: "Which is more important to you?",
      options: [
        "Getting hard when I want",
        "Staying hard long enough for great sex",
        "Both",
      ],
      image: "/images/modal-1.jpg",
    },
    {
      id: 2,
      question: "How often do you experience difficulty?",
      options: ["Rarely", "Sometimes", "Often"],
      image: "/images/modal-2.jpg",
    },
    {
      id: 3,
      question: "Are you currently taking any medication?",
      options: ["Yes", "No", "Prefer not to say"],
      image: "/images/modal-3.jpg",
    },
    {
      id: 4,
      question: "Do you smoke or consume alcohol regularly?",
      options: ["Yes", "No", "Occasionally"],
      image: "/images/modal-4.jpg",
    },
    {
      id: 5,
      question: "How would you rate your overall health?",
      options: ["Excellent", "Good", "Average", "Poor"],
      image: "/images/modal-5.jpg",
    },
  ];

  export default function TestModal({ isOpen, onClose }: TestModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
    const currentQuestion = questions[currentStep];
  
    const handleOptionClick = (option: string) => {
      setSelectedOption(option);
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          onClose();
        }
        setSelectedOption(null);
      }, 300); // short delay for feedback
    };
  
    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
        setSelectedOption(null);
      }
    };
    useEffect(() => {
        if (isOpen) {
          setCurrentStep(0);
          setSelectedOption(null);
        }
      }, [isOpen]);
      
    useEffect(() => {
        
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };
  
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };
  
      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-100 w-full mx-auto overflow-y-auto relative flex flex-col h-screen"
      >
        <div className="py-4 border-b border-gray-200 bg-white">
          <div className="container flex justify-between items-center">
            <motion.button onClick={handleBack} className="bg-dark rounded-xl">
              <motion.div
                className="w-12 h-12 flex justify-center items-center text-white hover:text-gray-300"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Undo2 size={32} />
              </motion.div>
            </motion.button>

            <Image src="/logo.svg" alt="Hilop logo" width={100} height={40} />

            <motion.button onClick={onClose} className="bg-dark rounded-xl">
              <motion.div
                className="w-12 h-12 flex justify-center items-center text-white hover:text-gray-300"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ rotate: 90 }}
              >
                <X size={32} />
              </motion.div>
            </motion.button>
          </div>
        </div>

        <div className="max-w-md mx-auto px-5">
          <h3 className="text-2xl md:text-4xl font-semibold text-dark mt-6 md:mt-28 mb-6 md:mb-10">
            {currentQuestion.question}
          </h3>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left text-lg p-5 rounded-lg border transition-all duration-200 ${
                  selectedOption === option
                    ? "border-primary bg-primary/10 text-green-900"
                    : "border-white bg-white"
                } hover:border-green-500`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between absolute bottom-0 w-full md:pb-10 pb-4 bg-white">
          <div
            className="bg-green-600 h-1"
            style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              }}
          ></div>
          <p className="text-gray-600 text-center w-full md:pt-10 pt-4">
          Step {currentStep + 1} of {questions.length} — Powered by Hilop
          </p>
        </div>
      </div>
    </div>
  );
}
