"use client";

import React from "react";
import Modal from "../animationComponents/animated-model";
import Image from "next/image";
import ArrowButton from "../uiFramework/ArrowButton";
import CircularProgressBar from "../animationComponents/CircularProgressBar";

type MyPlansModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MyPlansModal({ isOpen, onClose }: MyPlansModalProps) {
  return (
    <Modal
      className="max-w-6xl w-full h-full max-h-[85vh] rounded-lg overflow-hidden shadow-lg grid grid-cols-12"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="relative md:col-span-5 col-span-12 w-full flex-col hidden md:flex min-h-fit "
      >
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
              {" "}
              Your doctor recommended Treatment plan{" "}
            </p>
            <ArrowButton label="View Prescriptions" theme="light" size="lg" />
          </div>
        </div>
      </div>
      <div className="md:col-span-7 col-span-12 max-h-[85vh] flex flex-col">
        <h2 className="text-xl md:text-2xl font-semibold p-6 border-b border-gray-200 text-gray-800 flex-shrink-0">
          {" "}
          My Plans & Kit Guide{" "}
        </h2>
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          {" "}
          {[1, 2, 3, 4,5,6,7].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg mb-4 last:mb-0 border border-gray-200"
            >
              <div className="mb-4 flex flex-col lg:flex-row lg:items-center gap-4">
                <Image
                  src="/images/product.png"
                  width={128}
                  height={128}
                  alt="plan image"
                  className="object-cover w-24 h-24 sm:w-32 sm:h-32 rounded-lg flex-shrink-0"
                />
                <div className="flex justify-between w-full items-start gap-4 flex-col sm:flex-row">
                  <div className="order-2 sm:order-1">
                    <p className="text-lg md:text-xl font-medium mb-2">
                      {" "}
                      Anti-Aging Cream for men{" "}
                    </p>
                    <p className="font-medium text-gray-600 mb-1">
                      {" "}
                      Dosage:{" "}
                      <span className="text-gray-900 font-bold">1-0-1</span>
                    </p>
                    <p className="text-gray-600">
                      <span className="text-gray-900 font-bold">4</span>/5 doses
                      completed
                    </p>
                  </div>
                  <div className="flex-shrink-0 order-1 sm:order-2">
                    <CircularProgressBar
                      percentage={80}
                      size={48}
                      strokeWidth={2}
                      progressColor="text-green-500"
                      trackColor="text-gray-300"
                      animationDuration={3000}
                    />
                  </div>
                </div>
              </div>
              <p className="font-medium text-base mb-1">How to use</p>
              <p className="text-gray-700 text-sm">
                {" "}
                Take 1 morning and evening capsules daily with a glass of water,
                preferably with a meal. For best results, use consistently over
                time and combine with regular exercise and a balanced diet.{" "}
              </p>
            </div>
          ))}{" "}
        </div>
       <div className="p-6 border-t mt-auto bg-dark md:hidden block">
       <p className="text-xl md:text-2xl font-semibold mb-4 text-white">My plans</p>
            <p className="font-medium mb-3 text-gray-400">
              {" "}
              Your doctor recommended Treatment plan{" "}
            </p>
            <ArrowButton label="View Prescriptions" theme="light" size="lg" />
       </div>
      </div>
    </Modal>
  );
}
