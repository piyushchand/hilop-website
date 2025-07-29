import React from "react";
import Modal from "../animationComponents/animated-model";
import Button from "../uiFramework/Button";
import Image from "next/image";

interface ConsultationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  productImage?: string;
  productName?: string;
  totalMonths?: number;
}

const ConsultationResultModal: React.FC<ConsultationResultModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  productImage,
  productName,
  totalMonths,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    className="max-w-sm w-full flex flex-col gap-5 max-h-[80dvh] h-fit overflow-auto rounded-2xl p-6 text-center shadow-lg bg-white"
  >
    <div className="flex flex-col gap-1">
      <h1 className="font-semibold text-lg sm:text-xl">🎉 Congratulations!</h1>
      <div className="text-gray-500 text-xs sm:text-sm ">
        Based on your results, you’re eligible for our
      </div>
    </div>
    <div className="flex justify-center  items-center mx-auto border border-black/20 rounded-lg p-1 size-[200px] aspect-square ">
      {productImage && (
        <Image
          width={200}
          height={200}
          src={productImage}
          alt={productName || ""}
          className=""
        />
      )}
    </div>
    <div className=" flex flex-col gap-1">
      <div className="bg-green-100 rounded-lg text-sm sm:text-base py-2 px-3 mb-2 font-medium text-green-800">
        🌿 {totalMonths}-Month Natural Wellness Plan
      </div>
      <p className="text-sm sm:text-base text-gray-500">
        Get long-term results with our 100% natural, chemical-free product -
        {productName}.
      </p>
    </div>
    <div className="flex flex-col gap-1">
      <h1 className="text-base sm:text-lg font-medium">🌿 {productName}</h1>
      <div className="text-sm sm:text-base text-gray-500">
        Harveda is designed to naturally restore your body&apos;s internal
        balance. It supports immunity, digestion, energy, and overall well-being
        without any side effects
      </div>
    </div>
    <Button
      className="!w-full !h-fit !flex-none !py-3"
      label="Continue"
      onClick={onContinue}
    />
  </Modal>
);

export default ConsultationResultModal;
