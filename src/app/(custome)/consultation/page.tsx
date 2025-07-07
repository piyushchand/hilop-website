"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Undo2, X } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/uiFramework/Button";
import Link from "next/link";

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

function AssessmentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();

  const [modalStep, setModalStep] = useState(1);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  
  const [bmi, setBmi] = useState<number | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testResultId, setTestResultId] = useState<string | null>(null);

  const queryTestId = searchParams?.get("testId");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  useEffect(() => {
    if (queryTestId) {
      setSelectedTestId(queryTestId);
      setModalStep(2);
    } else {
      fetchTests();
    }
  }, [queryTestId, language]);

  useEffect(() => {
    if (!selectedTestId || modalStep !== 2) return;

    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tests/${selectedTestId}`
        );
        const data = await res.json();
        if (data.success && data.data.questions) {
          setQuestions(data.data.questions);
        } else throw new Error("No questions found");
      } catch {
        setError("Error loading questions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
    
  }, [selectedTestId, modalStep]);
  

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
      router.push("/"); // Finish and go home or result page
    }
    setSelectedOption(null);
  };

  const handleOptionClick = async (answerId: string) => {
    setSelectedOption(answerId);
    if (!testStarted) {
      // First answer: start the test
      const res = await fetch('/api/consultation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          test_id: selectedTestId,
          question_id: currentQuestion._id,
          answer_id: answerId,
        }),
      });
      const data = await res.json();
      if (data.success && data.data && data.data._id) {
        setTestResultId(data.data._id);
        setTestStarted(true);
      }
      setTimeout(() => proceedToNextStep(), 200);
    } else {
      // Subsequent answers: submit answer
      const isLastQuestion = currentStep === questions.length - 1;
      const res = await fetch('/api/consultation/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          test_result_id: testResultId,
          test_id: selectedTestId,
          question_id: currentQuestion._id,
          answer_id: answerId,
        }),
      });
      await res.json();
      if (isLastQuestion && testResultId) {
        await fetch(`/api/consultation/complete/${testResultId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({}),
        });
        window.location.href = '/cart';
      } else {
        setTimeout(() => proceedToNextStep(), 200);
      }
      setTimeout(() => proceedToNextStep(), 200);
    }
  };

  const calculateBmi = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters = heightUnit === "cm" ? h / 100 : (h * 30.48) / 100;
      const finalBmi = w / (heightInMeters * heightInMeters);
      setBmi(finalBmi);
    }
  };

  const handleBmiSubmit = () => {
    calculateBmi();
    proceedToNextStep();
  };

  const currentQuestion = questions[currentStep];

  const handleBack = () => {
    if (modalStep === 2 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setModalStep(1);
      setSelectedTestId(null);
      setQuestions([]);
    }
  };

  return (
    <div className="w-full mx-auto overflow-y-auto relative flex flex-col h-screen">
      {/* Header */}
      <div className="py-4 border-b border-gray-200 bg-white">
        <div className="container flex justify-between items-center">
          <button
            onClick={handleBack}
            className="bg-dark rounded-xl md:size-12 size-8 flex justify-center items-center text-white hover:text-gray-300 p-1 md:p-0"
          >
            <Undo2 size={24} />
          </button>

          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={100} height={40} />
          </Link>
          <div className="flex gap-3 md:gap-6 items-center">
            <div className="flex gap-4 items-center">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-dark"
              >
                <Globe size={20} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={language}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {language === "en" ? "English" : "हिंदी"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
            <motion.button
              onClick={() => router.back()}
              className="bg-dark rounded-xl"
            >
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
        {isLoading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {!isLoading && !error && modalStep === 1 && (
          <>
            <h1 className="text-2xl md:text-4xl font-semibold text-dark mt-6 md:mt-28 mb-6 md:mb-10">
              Choose an Assessment
            </h1>
            <div className="space-y-4">
              {tests.map((test) => (
                <button
                  key={test._id}
                  onClick={() => handleTestClick(test._id)}
                  className="w-full text-left text-lg p-5 rounded-lg border transition-colors duration-200 border-white bg-white hover:border-green-500"
                >
                  {language === "hi" ? test.title_hi : test.title_en}
                </button>
              ))}
            </div>
          </>
        )}

        {!isLoading && !error && modalStep === 2 && currentQuestion && (
          <>
            <h2 className="text-2xl md:text-4xl font-semibold text-dark mt-6 md:mt-28 mb-6 md:mb-10">
              {language === "hi"
                ? currentQuestion.text_hi
                : currentQuestion.text_en}
            </h2>

            {currentQuestion.is_bmi_question ? (
             <div className="space-y-6">
             {/* Weight Input */}
             <div className="flex gap-4">
               <div className="w-1/2">
                 <label className="text-sm text-gray-700 mb-2 block">Weight</label>
                 <div className="flex relative border border-gray-300 rounded-xl hover:border-green-300 transition-color duration-300">
                   <input
                     type="number"
                     value={weight}
                     onChange={(e) => setWeight(e.target.value)}
                     placeholder="70"
                     className="w-full p-3 text-sm  focus:outline-none transition-all duration-200 border-r border-gray-300"
                   />
                   {/* Animated Weight Unit Dropdown */}
                   <div className="relative">
                     <motion.select
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.2 }}
                       value={weightUnit}
                       onChange={(e) => setWeightUnit(e.target.value)}
                       className="p-3 text-sm focus:outline-none"
                     >
                       <option value="kg">kg</option>
                       <option value="lbs">lbs</option>
                     </motion.select>
                   </div>
                 </div>
               </div>
           
               {/* Height Input */}
               <div className="w-1/2">
                 <label className="text-sm text-gray-700 mb-2 block">Height</label>
                 <div className="flex relative border border-gray-300 rounded-xl hover:border-green-300 transition-color duration-300">
                   <input
                     type="number"
                     value={height}
                     onChange={(e) => setHeight(e.target.value)}
                     placeholder="175"
                     className="w-full p-3 text-sm  focus:outline-none transition-all duration-200 border-r border-gray-300"
                   />
                   {/* Animated Height Unit Dropdown */}
                   <div className="relative">
                     <motion.select
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.2 }}
                       value={heightUnit}
                       onChange={(e) => setHeightUnit(e.target.value)}
                       className="p-3 text-sm focus:outline-none"
                     >
                       <option value="cm">cm</option>
                       <option value="ft">ft</option>
                     </motion.select>
                   </div>
                 </div>
               </div>
             </div>
           
             {/* BMI Display */}
             {bmi && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.3 }}
                 className="bg-green-100 p-3 text-center rounded"
               >
                 Your BMI is <strong>{bmi.toFixed(2)}</strong>
               </motion.div>
             )}
           
             {/* Continue Button */}
             <Button
               label="Continue"
               variant="btn-dark"
               size="xl"
               onClick={handleBmiSubmit}
               disabled={!height || !weight}
               className="w-full"
             />
           </div>
            ) : (
              <div className="space-y-4">
                {currentQuestion.answers.map((answer) => (
                  <button
                    key={answer._id}
                    onClick={() => handleOptionClick(answer._id)}
                    className={`w-full text-left text-lg p-5 rounded-lg border transition-colors duration-200 border-white bg-white hover:border-green-500 ${
                      selectedOption === answer._id
                        ? "border-green-600 bg-green-100"
                        : "bg-white"
                    } transition`}
                  >
                    {language === "hi" ? answer.text_hi : answer.text_en}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress bar */}
      {!isLoading && !error && modalStep === 2 && questions.length > 0 && (
        <>
          <div className="w-full bg-gray-200 h-1 relative">
            <div
              className="bg-green-600 h-full"
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <div className="md:py-10 py-6">
            <p className="text-gray-600 text-center w-full">
            Step {currentStep + 1} of {questions.length} — Powered by Hilop
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AssessmentPageContent />
    </Suspense>
  );
}
