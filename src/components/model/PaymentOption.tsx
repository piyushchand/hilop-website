import React from "react";
import Image from "next/image";
import Modal from "../animationComponents/animated-model";

interface PaymentOptionProps {
  isOpen: boolean;
  onClose: () => void;
  onOnlinePayment: () => void;
  onCashOnDelivery: () => void;
  loading?: boolean;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  isOpen,
  onClose,
  onOnlinePayment,
  onCashOnDelivery,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-sm w-full max-h-[80vh] rounded-lg overflow-hidden shadow-lg bg-white flex flex-col justify-start"
    >
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-semibold text-dark p-4 md:p-5">
          Payment Option
        </h2>
      </div>
      <div className="overflow-y-auto flex-1 w-full">
        <div className="px-4 py-4 space-y-6">
          <div>
            <button
              onClick={onOnlinePayment}
              className="flex flex-col cursor-pointer gap-1 md:gap-0 md:flex-row items-center justify-between p-8 bg-gray-100 border hover:border-black border-gray-200 hover:bg-green-50 rounded-lg w-full"
              disabled={loading}
            >
              <h3 className="text-base font-semibold">Online Payment</h3>
              <div className="ml-2 text-sm text-gray-500 animate-spin"></div>

              <div className="flex items-center gap-2">
                <Image
                  src="/images/payment-option-icon/upi.svg"
                  alt="UPI"
                  width={30}
                  height={30}
                />
                <Image
                  src="/images/payment-option-icon/card.svg"
                  alt="UPI"
                  width={30}
                  height={30}
                />

                <Image
                  src="/images/payment-option-icon/bank.svg"
                  alt="UPI"
                  width={30}
                  height={30}
                />
              </div>
            </button>
          </div>
          <div>
            <button
              onClick={onCashOnDelivery}
              className="flex flex-col cursor-pointer gap-1 md:gap-0 md:flex-row items-center justify-between p-8 bg-gray-100 border border-gray-200 hover:border-black hover:bg-green-50 rounded-lg w-full"
              disabled={loading}
            >
              <h3 className="text-base font-semibold">Cash on Delivery</h3>
              <Image
                src="/images/payment-option-icon/cash.svg"
                alt="UPI"
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentOption;
