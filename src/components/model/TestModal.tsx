"use client";
import { useState, useEffect, useRef } from "react";
import {  AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Globe, Undo2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "../uiFramework/Button";

export type TestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  testId?: string | null;
};

interface Test {
  _id: string;
  title_en: string;
  title_hi: string;
}

interface Answer {
  _id: string;
  text_en: string;
  text_hi: string;
}

interface Question {
  _id: string;
  text_en: string;
  text_hi: string;
  answers: Answer[];
  is_bmi_question: boolean;
  image?: string;
}

export default function TestModal({ isOpen, onClose, testId }: TestModalProps) {
  const { language, setLanguage } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const langToggleRef = useRef<HTMLButtonElement>(null);

  const [modalStep, setModalStep] = useState(1);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [bmi, setBmi] = useState<number | null>(null);
  useScrollLock(isOpen);
  function useScrollLock(isLocked: boolean) {
    useEffect(() => {
      if (isLocked) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
  
      return () => {
        document.body.style.overflow = "";
      };
    }, [isLocked]);
  }
  // Reset modal states on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentStep(0);
      setSelectedOption(null);
      setBmi(null);
      setHeight("");
      setWeight("");
      setHeightUnit("cm");
      setWeightUnit("kg");

      if (testId) {
        setSelectedTestId(testId);
        setModalStep(2);
      } else {
        setModalStep(1);
        setSelectedTestId(null);
        fetchTests();
      }
    } else {
      setModalStep(1);
      setSelectedTestId(null);
      setQuestions([]);
      setTests([]);
    }
  }, [isOpen, testId, language]);

  const fetchTests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tests`);
      const data = await res.json();
      if (data.success && data.data) setTests(data.data);
      else throw new Error("Failed to load tests");
    } catch {
      setError("Error loading assessments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedTestId || modalStep !== 2) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tests/${selectedTestId}`
        );
        const data = await res.json();
        if (data.success && data.data.questions) {
          setQuestions(data.data.questions);
        } else {
          throw new Error("No questions found");
        }
      } catch {
        setError("Error loading questions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedTestId, modalStep]);

  const currentQuestion = questions[currentStep];

  const handleTestClick = (id: string) => {
    setSelectedTestId(id);
    setModalStep(2);
    setCurrentStep(0);
    setSelectedOption(null);
    setQuestions([]);
  };

  const proceedToNextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
    setSelectedOption(null);
  };

  const handleOptionClick = (answerId: string) => {
    setSelectedOption(answerId);
    setTimeout(() => {
      proceedToNextStep();
    }, 0);
  };

  const calculateBmi = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters =
        heightUnit === "cm" ? h / 100 : (h * 30.48) / 100;
      const finalBmi = w / (heightInMeters * heightInMeters);
      setBmi(finalBmi);
    }
  };

  const handleBmiSubmit = () => {
    calculateBmi();
    proceedToNextStep();
  };

  const handleBack = () => {
    if (modalStep === 2 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (modalStep === 2 && !testId) {
      setModalStep(1);
      setSelectedTestId(null);
      setQuestions([]);
    }
  };

  const handleClose = () => {
    setModalStep(1);
    setSelectedTestId(null);
    setQuestions([]);
    onClose();
  };

  // ESC & outside click detection
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
  
    const clickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !(langToggleRef.current && langToggleRef.current.contains(target))
      ) {
        handleClose();
      }
    };
  
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
  
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-100 w-full mx-auto overflow-y-auto relative flex flex-col h-screen"
      >
        {/* Header */}
        <div className="py-4 border-b border-gray-200 bg-white">
          <div className="container flex justify-between items-center">
            <motion.button
              onClick={handleBack}
              className="bg-dark rounded-xl"
              disabled={
                (modalStep === 1 && !testId) ||
                (modalStep === 2 && currentStep === 0 && !!testId)
              }
            >
              <motion.div
                className="md:size-12 size-8 flex justify-center items-center text-white hover:text-gray-300 p-1 md:p-0"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Undo2 size={32} />
              </motion.div>
            </motion.button>

            <Image
              src="/logo.svg"
              alt="Hilop logo"
              width={100}
              height={40}
              className="hidden md:block"
            />

            <div className="flex gap-3 md:gap-6 items-center">
            <button
              ref={langToggleRef}
              onClick={toggleLanguage}
              className="relative gap-2 h-[52px] flex justify-center items-center overflow-hidden hover:opacity-60"
            >
              <Globe className="w-5 h-5 text-dark" />
              <div className="relative w-[60px] h-[24px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={language}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-0 w-full text-center"
                  >
                    {language === "en" ? "English" : "हिंदी"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </button>

              <motion.button onClick={handleClose} className="bg-dark rounded-xl">
                <motion.div
                  className="md:size-12 size-8 flex justify-center items-center text-white hover:text-gray-300 p-1 md:p-0"
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
        </div>

        {/* Body */}
        <div className="max-w-md mx-auto px-5 flex-grow">
          {isLoading && <p className="text-center mt-20">Loading...</p>}
          {error && <p className="text-red-500 text-center mt-20">{error}</p>}

          {!isLoading && !error && modalStep === 1 && (
            <>
              <h3 className="text-2xl md:text-4xl font-semibold text-dark mt-6 md:mt-28 mb-6 md:mb-10">
                Choose an Assessment
              </h3>
              <div className="space-y-4">
                {tests.map((test) => (
                  <button
                    key={test._id}
                    className="w-full text-left text-base md:text-lg p-5 rounded-lg border transition-all duration-200 border-white bg-white hover:border-green-500 cursor-pointer"
                    onClick={() => handleTestClick(test._id)}
                  >
                    {language === "hi" ? test.title_hi : test.title_en}
                  </button>
                ))}
              </div>
            </>
          )}

          {!isLoading && !error && modalStep === 2 && currentQuestion && (
            <>
              <h3 className="text-2xl md:text-4xl font-semibold text-dark mt-6 md:mt-28 mb-6 md:mb-10">
                {language === "hi"
                  ? currentQuestion.text_hi
                  : currentQuestion.text_en}
              </h3>

              {currentQuestion.is_bmi_question ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    {/* Weight Input */}
                    <div className="w-1/2">
                      <label className="text-gray-600 block mb-2">Weight</label>
                      <div className="flex">
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="p-3 w-full rounded-l-lg border border-gray-300"
                          placeholder="e.g., 70"
                        />
                        <select
                          value={weightUnit}
                          onChange={(e) => setWeightUnit(e.target.value)}
                          className="p-3 rounded-r-lg border border-gray-300 bg-gray-50"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </select>
                      </div>
                    </div>

                    {/* Height Input */}
                    <div className="w-1/2">
                      <label className="text-gray-600 block mb-2">Height</label>
                      <div className="flex">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="p-3 w-full rounded-l-lg border border-gray-300"
                          placeholder="e.g., 175"
                        />
                        <select
                          value={heightUnit}
                          onChange={(e) => setHeightUnit(e.target.value)}
                          className="p-3 rounded-r-lg border border-gray-300 bg-gray-50"
                        >
                          <option value="cm">cm</option>
                          <option value="ft">ft</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {bmi && (
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <p className="text-primary font-medium">
                        Your BMI is {bmi.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <Button
                    label="Continue"
                    variant="btn-dark"
                    size="xl"
                    onClick={handleBmiSubmit}
                    className="w-full"
                    disabled={!height || !weight}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {(currentQuestion.answers || []).map((answer) => (
                    <button
                      key={answer._id}
                      className={`w-full text-left text-lg p-5 rounded-lg border transition-all duration-200 ${
                        selectedOption === answer._id
                          ? "border-primary bg-primary/10 text-green-900"
                          : "border-white bg-white"
                      } hover:border-green-500`}
                      onClick={() => handleOptionClick(answer._id)}
                    >
                      {language === "hi" ? answer.text_hi : answer.text_en}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Progress */}
        {!isLoading && !error && modalStep === 2 && questions.length > 0 && (
          <div className="flex flex-col justify-between w-full md:pb-10 pb-4 bg-white mt-auto">
            <div
              className="bg-green-600 h-1"
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              }}
            />
            <p className="text-gray-600 text-center w-full md:pt-10 pt-4">
              Step {currentStep + 1} of {questions.length} — Powered by Hilop
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
