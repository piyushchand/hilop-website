import React, { useState } from "react";
import Modal from "../animationComponents/animated-model";
import AnimatedInput from "../animationComponents/AnimatedInput";
import Button from "../uiFramework/Button";
import ArrowButton from "../uiFramework/ArrowButton";
import { CheckCircle } from "lucide-react";
import CircularProgressBar from "../animationComponents/CircularProgressBar";

interface BmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function calculateBMI(feet: number, inches: number, pounds: number): number {
  const totalInches = feet * 12 + inches;
  if (totalInches === 0) return 0;
  return +(703 * (pounds / (totalInches * totalInches))).toFixed(1);
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#FFCB7C", index: 0 };
  if (bmi < 25) return { label: "Healthy Weight", color: "#A3FFB8", index: 1 };
  if (bmi < 30) return { label: "Overweight", color: "#FFD36E", index: 2 };
  return { label: "Obesity", color: "#FF6B6B", index: 3 };
}

const bmiRanges = [
  { label: "Underweight", range: "< 18.5", color: "#FFCB7C" },
  { label: "Healthy Weight", range: "18.5 – 24.9", color: "#A3FFB8" },
  { label: "Overweight", range: "25 – 29.9", color: "#FFD36E" },
  { label: "Obesity", range: "> 30", color: "#FF6B6B" },
];

const BmiCalculatorModal: React.FC<BmiCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(6);
  const [pounds, setPounds] = useState(140);
  const [bmi, setBmi] = useState<number | null>(null);
  const [feetError, setFeetError] = useState<string | null>(null);
  const [inchesError, setInchesError] = useState<string | null>(null);
  const [poundsError, setPoundsError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setFeetError(null);
    setInchesError(null);
    setPoundsError(null);
    if (feet < 3 || feet > 9) {
      setFeetError('Feet must be between 3 and 9');
      valid = false;
    }
    if (inches < 0 || inches > 11) {
      setInchesError('Inches must be between 0 and 11');
      valid = false;
    }
    if (pounds < 35 || pounds > 635) {
      setPoundsError('Weight must be between 35 and 635 kg');
      valid = false;
    }
    if (!valid) return;
    setBmi(calculateBMI(feet, inches, pounds));
  };

  const handleConsultation = () => {
    window.location.href = "/consultation";
  };

  const category = getBmiCategory(bmi ?? 0);
  const percentage = bmi ? Math.min((bmi / 40) * 100, 100) : 0;

  return (                      
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-6xl w-full h-full max-h-[85vh] rounded-lg overflow-hidden shadow-lg flex flex-col bg-gray-100"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-semibold text-dark p-4 md:p-6 ">
          BMI Calculator
        </h2>
        <div className="w-full h-0.5 border-b border-gray-200" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 px-3 py-4 md:p-6 min-h-full justify-center items-center">
          {/* Form */}
          <div className="w-full md:w-1/2 flex flex-col justify-center min-w-[220px] max-w-md mx-auto gap-6">
            <p className="mb-2 text-base md:text-lg text-gray-700 font-medium max-w-md font-sans text-center md:text-left">
              BMI stands for Body Mass Index. It’s a measurement that uses your height and weight to estimate if your weight is in a healthy range for your height.
            </p>
            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block font-semibold text-dark mb-2">Height</label>
                <div className="flex gap-4 flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <AnimatedInput
                      label="Feet"
                      name="feet"
type="number"
                      value={feet.toString()}
                      onChange={e => setFeet(Number(e.target.value))}
                      required
                    />
                    {feetError && <div className="text-red-600 text-xs mt-1">{feetError}</div>}
                  </div>
                  <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                    <AnimatedInput
                      label="Inches"
                      name="inches"
                      type="number"
                      value={inches.toString()}
                      onChange={e => setInches(Number(e.target.value))}
                      required
                    />
                    {inchesError && <div className="text-red-600 text-xs mt-1">{inchesError}</div>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-dark mb-2">Weight</label>
                <AnimatedInput
                  label="Weight in Kg"
                  name="pounds"
                  type="number"
                  value={pounds.toString()}
                  onChange={e => setPounds(Number(e.target.value))}
                  required
                />
                {poundsError && <div className="text-red-600 text-xs mt-1">{poundsError}</div>}
              </div>
              <div className="rounded-2xl p-6 max-w-lg w-full mx-auto flex flex-col md:flex-row gap-2 md:gap-3">
                {/* Left side content - increase width and reduce gap */}
                <div className="w-fit h-fit w-full h-[48px] ">
                  <Button
                    label="Calculate"
                    variant="btn-primary"
                    size="lg"
                    onClick={handleCalculate}
                    className="w-full h-12 md:h-[48px] text-base md:text-lg"
                  />
                </div>
                {/* Right side content (arrow button) - flex row, single line */}
                <div className="flex flex-row gap-3 items-center justify-end mt-4 md:mt-0">
                  <ArrowButton
                    label="Start Consultation"
                    theme="dark"
                    size="lg"
                    className="w-full h-[48px]"
                    onClick={handleConsultation}
                  />
                </div>
              </div>
            </form>
          </div>
          {/* Result */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center min-w-[180px] max-w-md mx-auto mt-6 md:mt-0">
            <div className="flex flex-col items-center w-full rounded-2xl bg-gray-100 p-4 md:p-8 min-h-[260px] md:min-h-[340px]">
              {/* Arc and BMI value inside */}
              <div className="relative flex justify-center items-center w-full max-w-[160px] md:max-w-[220px] mx-auto mb-4 md:mb-6 mt-2">
                <CircularProgressBar
                  percentage={percentage}
                  size={typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 180}
                  strokeWidth={typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 20}
                  progressColor="text-primary"
                  trackColor="text-gray-200"
                  animationDuration={800}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
                  <span className="text-3xl md:text-5xl font-extrabold text-primary leading-none font-sans drop-shadow-lg">
                    {bmi !== null ? bmi : '--'}
                  </span>
                  <span className="text-sm md:text-base text-gray-500 font-medium mt-2">Your BMI</span>
                  <span className="text-xs md:text-sm text-gray-400 font-medium mt-1">{bmi !== null ? `${Math.round(percentage)}%` : '--'}</span>
                </div>
              </div>
              {/* Category highlight */}
              {bmi !== null && (
                <div className="flex items-center gap-3 bg-primary/10 rounded-full px-3 md:px-5 py-2 mb-3 md:mb-4 shadow transition-all duration-300 whitespace-nowrap">
                  <CheckCircle className="text-primary" size={20} />
                  <span className="text-sm md:text-base font-bold text-dark font-sans whitespace-nowrap">{category.label}</span>
                  <span className="ml-auto text-dark/70 font-semibold whitespace-nowrap">{bmiRanges[category.index].range}</span>
                </div>
              )}
              {/* Category list */}
              <div className="space-y-2 w-full mt-2">
                {bmiRanges.map((r, idx) => {
                  const isActive = category.index === idx;
                  return (
                    <div
                      key={r.label}
                      className={`flex items-center gap-3 px-2 md:px-3 py-2 rounded-lg transition-all ${isActive ? 'bg-black text-white font-bold' : ''} whitespace-nowrap`}
                    >
                      <span className={`inline-block w-2.5 h-2.5 md:w-3 md:h-3 rounded-full`} style={{ background: r.color }}></span>
                      <span className={`${isActive ? 'text-white' : 'text-dark'} text-xs md:text-sm font-medium font-sans whitespace-nowrap`}>{r.label}</span>
                      <span className={`ml-auto ${isActive ? 'text-white' : 'text-dark/70'} text-xs font-semibold font-sans whitespace-nowrap`}>{r.range}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BmiCalculatorModal; 