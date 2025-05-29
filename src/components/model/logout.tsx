import React from "react";
import Modal from "../animationComponents/animated-model";
import Button from "../uiFramework/Button";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  return (
    <Modal
      className="max-w-sm rounded-lg shadow-lg"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h2 className="text-lg md:text-2xl font-semibold mb-4 p-6 border-b border-gray-200">Confirm Logout</h2>
      <p className="text-gray-600 my-12 text-center px-6">
        Are you sure you want to logout from your account?
      </p>
      <div className="flex justify-center gap-4 p-6 border-t border-gray-200">
        <Button
          label="Cancel"
          variant="btn-dark"
          size="xl"
          onClick={onClose}
          className="px-12"
        />
        <Button
          label="Logout"
          variant="btn-light"
          className="!bg-[#D32F2F] !hover:bg-red-900 text-white px-12"
          size="xl"
          onClick={() => {
            // Add your logout logic here
            onClose();
          }}
        />
      </div>
    </Modal>
  );
}
