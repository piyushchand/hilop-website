"use client";

import { getUserTreatmentPlans } from "@/services/apiServices";
import type { TreatmentPlan } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "../animationComponents/animated-model";
import CircularProgressBar from "../animationComponents/CircularProgressBar";
import ArrowButton from "../uiFramework/ArrowButton";
import { getText } from "@/utils/getText";
import { useLanguage } from "@/contexts/LanguageContext";

type MyPlansModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MyPlansModal({ isOpen, onClose }: MyPlansModalProps) {
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getUserTreatmentPlans()
      .then((plans) => {
        console.log("Received plans in component:", plans);
        setPlans(plans);
      })
      .catch((err) => {
        console.error("Error loading plans:", err);
        setError(err.message || "Failed to load plans");
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  return (
    <Modal
      className="max-w-6xl w-full h-full max-h-[85vh] rounded-lg overflow-hidden shadow-lg grid grid-cols-12"
      isOpen={isOpen}
      onClose={onClose}
    >
      {" "}
      <div className="relative md:col-span-5 col-span-12 w-full flex-col hidden md:flex min-h-fit ">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark opacity-70 z-10"></div>
        <Image
          src="/images/modal-2.jpg"
          alt="Doctor recommending plan"
          fill
          className="object-cover w-full h-full z-0 md:block hidden"
          priority
        />
        <div className="relative z-20 flex flex-col h-full p-6 text-white">
          <p className="text-xl md:text-2xl font-semibold mb-4">My plans</p>
          <div className="mt-auto">
            <p className="font-medium mb-3">
              Your doctor recommended Treatment plan
            </p>
            <ArrowButton
              href="/prescription"
              label="View Prescriptions"
              theme="light"
              size="lg"
            />
          </div>
        </div>
      </div>
      <div className="md:col-span-7 col-span-12 max-h-[85vh] flex flex-col ">
        <h2 className="text-xl md:text-2xl font-semibold p-6 border-b border-gray-200 text-gray-800 flex-shrink-0">
          My Plans & Kit Guide
        </h2>
        <div className="flex flex-col gap-6  p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading your plans...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No treatment plans found.
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-gray-100 p-4 rounded-lg last:mb-0 border border-gray-200"
              >
                <div className="mb-4 relative">
                  <div className="absolute bottom-0 right-4 z-10 ">
                    <CircularProgressBar
                      percentage={(() => {
                        const completed = plan.completed_doses || 0;
                        const total = plan.total_doses || 1;
                        const percentage = Math.round(
                          (completed / total) * 100
                        );
                        return Math.min(percentage, 100);
                      })()}
                      size={48}
                      strokeWidth={3}
                      progressColor="text-green-500"
                      trackColor="text-gray-300"
                      animationDuration={2000}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pr-12">
                    <Image
                      src={plan.image || "/images/product.png"}
                      width={128}
                      height={128}
                      alt={getText(plan.name, language)}
                      className="object-cover w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium ">
                        {getText(plan.name, language)}
                      </p>
                      <p className="font-medium text-gray-600 mb-1 text-sm">
                        Dosage:{" "}
                        <span className="text-gray-900 font-bold">
                          {plan.dosage}
                        </span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-gray-600">
                          <span className="text-gray-900 font-bold">
                            {plan.completed_doses || 0}
                          </span>
                          /{plan.total_doses || 0} doses completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-medium text-base mb-1">How to use</p>
                <p className="text-gray-700 text-sm">{plan.instructions}</p>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t mt-auto bg-dark md:hidden block">
          <p className="text-xl md:text-2xl font-semibold mb-4 text-white">
            My plans
          </p>
          <p className="font-medium mb-3 text-gray-400">
            Your doctor recommended Treatment plan
          </p>
          <ArrowButton
            href="/prescription"
            label="View prescriptions"
            theme="light"
            size="lg"
          />
        </div>
      </div>
    </Modal>
  );
}
