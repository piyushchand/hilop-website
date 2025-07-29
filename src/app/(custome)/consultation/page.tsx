"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Undo2, X } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/uiFramework/Button";
import Link from "next/link";
import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import AnimatedScrollBar from "@/components/animationComponents/AnimatedScrollBar";
import ConsultationResultModal from "@/components/model/ConsultationResultModal";

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

type AnswerPayload = {
  test_result_id: string | null;
  test_id: string | null;
  question_id: string;
  answer_id: string;
  height?: string;
  weight?: string;
  bmi_value?: number;
};
// Add state for result modal and completion data
interface CompletionProduct {
  _id: string;
  name: { en: string; hi: string };
  treatment_plan_id: string;
  total_count: number;
  purchased_count: number;
  dosage_schedule: string;
  recommendation_type: string;
}
interface CompletionTreatmentPlan {
  product_name: { en: string; hi: string };
  product_image: string;
  total_months: number;
}
interface CompletionData {
  test_result_id: string;
  is_completed: boolean;
  answers_count: number;
  bmi_value?: number;
  recommended_products?: CompletionProduct[];
  treatment_plans?: CompletionTreatmentPlan[];
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
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [feetError, setFeetError] = useState<string | null>(null);
  const [inchesError, setInchesError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);

  const [bmi, setBmi] = useState<number | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testResultId, setTestResultId] = useState<string | null>(null);

  const [showResultModal, setShowResultModal] = useState(false);
  const [completionData, setCompletionData] = useState<CompletionData | null>(
    null
  );

  const queryTestId = searchParams ? searchParams.get("testId") : null;

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

  const handleOptionClick = async (
    answerId: string,
    bmiPayload?: { height: string; weight: string; bmi_value: number }
  ) => {
    setSelectedOption(answerId);
    if (!testStarted) {
      // First answer: start the test
      const res = await fetch("/api/consultation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      const body: AnswerPayload = {
        test_result_id: testResultId,
        test_id: selectedTestId,
        question_id: currentQuestion._id,
        answer_id: answerId,
      };
      if (bmiPayload) {
        body.height = bmiPayload.height;
        body.weight = bmiPayload.weight;
        body.bmi_value = bmiPayload.bmi_value;
      }
      const res = await fetch("/api/consultation/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      await res.json();
      if (isLastQuestion && testResultId) {
        try {
          const completeRes = await fetch(
            `/api/consultation/complete/${testResultId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({}),
            }
          );
          const completeData = await completeRes.json();
          if (completeRes.ok && completeData.success) {
            // Try to add recommended product to cart if present
            const recommendedProductId =
              completeData.data?.recommended_product_id ||
              completeData.recommended_product_id;
            if (recommendedProductId) {
              const cartRes = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  product_id: recommendedProductId,
                  quantity: 1,
                }),
              });
              if (!cartRes.ok) {
                setError(
                  "Consultation complete, but failed to add product to cart."
                );
                return;
              }
            }
            // Show result modal with completion data only if treatment_plans exists and is not empty
            const resultData = completeData.data || completeData;
            if (
              resultData.treatment_plans &&
              resultData.treatment_plans.length > 0
            ) {
              setCompletionData(resultData);
              setShowResultModal(true);
            } else {
              router.push("/cart");
            }
            return;
          } else {
            setError(
              completeData.message ||
                "Failed to complete consultation. Please try again."
            );
          }
        } catch {
          setError("Failed to complete consultation. Please try again.");
        }
      } else {
        setTimeout(() => proceedToNextStep(), 200);
      }
    }
  };

  const handleBmiSubmit = () => {
    // Clear previous errors
    setFeetError(null);
    setInchesError(null);
    setWeightError(null);

    const feetNum = Number(feet);
    const inchesNum = Number(inches);
    const weightNum = Number(weight);

    let valid = true;

    // Validate feet
    if (!feet || isNaN(feetNum) || feetNum < 3 || feetNum > 9) {
      setFeetError("Feet must be between 3 and 9");
      valid = false;
    }

    // Validate inches
    if (!inches || isNaN(inchesNum) || inchesNum < 0 || inchesNum > 11) {
      setInchesError("Inches must be between 0 and 11");
      valid = false;
    }

    // Validate weight
    if (!weight || isNaN(weightNum) || weightNum < 35 || weightNum > 635) {
      setWeightError("Weight must be between 35 and 635 kg");
      valid = false;
    }

    if (!valid) return;

    // Calculate BMI
    const totalInches = feetNum * 12 + inchesNum;
    const heightMeters = totalInches * 0.0254;
    const finalBmi = +(weightNum / (heightMeters * heightMeters)).toFixed(1);

    // Convert feet and inches to total centimeters
    const heightInCm = Math.round(totalInches * 2.54);

    setBmi(finalBmi);
    handleOptionClick(currentQuestion.answers[0]._id, {
      height: heightInCm.toString(),
      weight: weightNum.toString(),
      bmi_value: finalBmi,
    });
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
          {(modalStep === 1 || (modalStep === 2 && currentStep > 0)) && (
            <button
              onClick={handleBack}
              className="bg-dark rounded-xl md:size-12 size-8 flex justify-center items-center text-white hover:text-gray-300 p-1 md:p-0"
            >
              <Undo2 size={24} />
            </button>
          )}

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
                {/* Height Input */}
                <div>
                  <label className="block font-semibold text-dark mb-2">
                    Height
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:gap-3 w-full">
                    <AnimatedInput
                      label="Feet"
                      name="feet"
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      required
                    />
                    <AnimatedInput
                      label="Inches"
                      name="inches"
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-1">
                    {feetError && (
                      <div className="text-red-600 text-xs">{feetError}</div>
                    )}
                    {inchesError && (
                      <div className="text-red-600 text-xs">{inchesError}</div>
                    )}
                  </div>
                </div>

                {/* Weight Input */}
                <div>
                  <label className="block font-semibold text-dark mb-2">
                    Weight (kg)
                  </label>
                  <AnimatedInput
                    label="Weight in Kg"
                    name="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                  {weightError && (
                    <div className="text-red-600 text-xs mt-1">
                      {weightError}
                    </div>
                  )}
                </div>

                {/* BMI Display */}
                {bmi && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-100 p-3 text-center rounded"
                  >
                    Your BMI is <strong>{bmi.toFixed(1)}</strong>
                  </motion.div>
                )}

                {/* Continue Button */}
                <Button
                  label="Continue"
                  variant="btn-dark"
                  size="xl"
                  onClick={handleBmiSubmit}
                  disabled={!feet || !inches || !weight}
                  className="!w-full !min-w-full"
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

      {/* Animated Progress bar */}
      {!isLoading && !error && modalStep === 2 && questions.length > 0 && (
        <div className="">
          <AnimatedScrollBar
            currentStep={currentStep}
            totalSteps={questions.length}
          />
          <div className="md:py-10 py-6">
            <p className="text-gray-600 text-center w-full">
              Step {currentStep + 1} of {questions.length} — Powered by Hilop
            </p>
          </div>
        </div>
      )}
      {/* Result Modal */}
      {showResultModal &&
        completionData?.treatment_plans &&
        completionData.treatment_plans.length > 0 && (
          <ConsultationResultModal
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            onContinue={() => {
              setShowResultModal(false);
              router.push("/cart");
            }}
            productImage={completionData.treatment_plans[0].product_image}
            productName={completionData.treatment_plans[0].product_name.en}
            totalMonths={completionData.treatment_plans[0].total_months}
          />
        )}
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AssessmentPageContent />
    </Suspense>
  );
}
