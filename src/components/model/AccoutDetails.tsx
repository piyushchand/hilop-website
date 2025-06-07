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
      className="max-w-6xl w-full h-full max-h-[85vh] rounded-lg overflow-hidden shadow-lg grid grid-cols-12"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="sm:col-span-5 hidden sm:block relative min-h-fit">

      <Image
        src="/images/modal-1.jpg"
        fill
        alt="model image 1"
        className="object-cover w-full h-full"
      />
      </div>
      <div className="sm:col-span-7 col-span-12 max-h-[85vh] flex flex-col">
        <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200">
          Edit Account Details
        </h2>
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
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
        <div className="flex justify-center gap-4 p-6 border-t border-gray-200 mt-auto">
          <Button
            label="Save Changes"
            variant="btn-dark"
            size="xl"
            onClick={() => {
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
