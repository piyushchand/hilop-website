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
        console.log('Received plans in component:', plans);
        setPlans(plans);
      })
      .catch((err) => {
        console.error('Error loading plans:', err);
        setError(err.message || "Failed to load plans");
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  return (
    <Modal
      className="max-w-lg w-full h-full max-h-[80vh] rounded-lg overflow-hidden shadow-lg flex flex-col"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="md:col-span-7 col-span-12 max-h-[85vh] flex flex-col">
        <h2 className="text-xl md:text-2xl font-semibold p-6 border-b border-gray-200 text-gray-800 flex-shrink-0">
          My Plans & Kit Guide
        </h2>
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading your plans...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No treatment plans found.</div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-gray-100 p-4 rounded-lg mb-4 last:mb-0 border border-gray-200"
              >
                <div className="mb-4 relative">
                  <div className="absolute top-2 right-6 z-10">
                    <CircularProgressBar
                      percentage={(() => {
                        const completed = plan.completed_doses || 0;
                        const total = plan.total_doses || 1;
                        const percentage = Math.round((completed / total) * 100);
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
                      <p className="text-lg font-medium mb-2">{getText(plan.name, language)}</p>
                      <p className="font-medium text-gray-600 mb-1 text-sm">
                        Dosage: <span className="text-gray-900 font-bold">{plan.dosage}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-gray-600">
                          <span className="text-gray-900 font-bold">{plan.completed_doses || 0}</span>/{plan.total_doses || 0} doses completed 
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
          <p className="text-xl md:text-2xl font-semibold mb-4 text-white">My plans</p>
          <p className="font-medium mb-3 text-gray-400">
            Your doctor recommended Treatment plan
          </p>
          <ArrowButton href="/prescription" label="View prescriptions" theme="light" size="lg" />
        </div>
      </div>
    </Modal>
  );
}
