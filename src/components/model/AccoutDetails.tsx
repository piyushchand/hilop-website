import React from "react";
import Modal from "../animationComponents/animated-model";
import Button from "../uiFramework/Button";
import Image from "next/image";
import AnimatedInput from "../animationComponents/AnimatedInput";

type AccountDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AccountDetailsModal({
  isOpen,
  onClose,
}: AccountDetailsModalProps) {
  return (
    <Modal
      className="max-w-[930px] grid grid-cols-12 rounded-lg overflow-hidden shadow-lg"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Image
        src="/images/modal-1.jpg"
        width={428}
        height={682}
        alt="model image"
        className="col-span-5 h-full object-cover hidden sm:block"
      />
      <div className="sm:col-span-7 col-span-12 h-full flex flex-col">
        <h2 className="text-lg md:text-2xl font-semibold mb-4 p-6 border-b border-gray-200">
          Edit Account Details
        </h2>
        <div className="p-6">
          <div className="flex flex-col gap-5 mb-6">
            <AnimatedInput
              label="Full Name"
              name="fullName"
              type="text"
              // value="Rogie"
              required
            />

            <AnimatedInput label="Email" name="email" type="email" required />
            <AnimatedInput
              label="Mobile number"
              name="Mobile number"
              type="tel"
              required
            />
            <AnimatedInput
              label="Date of Birth"
              name="Date of Birth"
              type="date"
              required
            />
          </div>
        </div>
        <div className="flex justify-center gap-4 p-6 border-t border-gray-200 mt-auto">
          <Button
            label="Save Changes"
            variant="btn-dark"
            size="xl"
            onClick={() => {
              // Add your save logic here
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
