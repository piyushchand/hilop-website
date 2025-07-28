import React, { useState } from "react";
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
  const [selectedPayment, setSelectedPayment] = useState<string>("razorpay");

  const handlePayNow = () => {
    if (selectedPayment === "razorpay") {
      onOnlinePayment();
    } else {
      onCashOnDelivery();
    }
  };

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
        <form
          className="px-4 py-4 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handlePayNow();
          }}
        >
          <div>
            <label className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer bg-gray-100 border-gray-200 hover:border-black hover:bg-green-50 w-full">
              <div className="flex flex-row items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  onClick={() => {
                    setSelectedPayment("razorpay");
                    onOnlinePayment();
                  }}
                  checked={selectedPayment === "razorpay"}
                  onChange={() => {
                    setSelectedPayment("razorpay");
                    onOnlinePayment();
                    onClose();
                  }}
                  className="size-4 mt-1"
                  disabled={loading}
                />
                <div className="flex flex-col md:flex-row flex-1  gap-2">
                  <span className="font-semibold text-sm md:text-base w-full break-words leading-snug">
                    Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                  </span>
                  <div className="flex flex-wrap md:justify-end w-full items-center gap-2">
                    <Image
                      src="/images/payment-option-icon/upi.svg"
                      alt="UPI"
                      width={28}
                      height={28}
                    />
                    <Image
                      src="/images/payment-option-icon/card.svg"
                      alt="Card"
                      width={28}
                      height={28}
                    />
                    <Image
                      src="/images/payment-option-icon/bank.svg"
                      alt="Bank"
                      width={28}
                      height={28}
                    />
                    <span className="text-xs bg-gray-200 rounded px-2 py-0.5 ml-1">
                      +16
                    </span>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div>
            <label className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer bg-gray-100 border-gray-200 hover:border-black hover:bg-green-50 w-full">
              <div className="flex flex-row items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPayment === "cod"}
                  onChange={() => {
                    setSelectedPayment("cod");
                    onCashOnDelivery();
                    onClose();
                  }}
                  className="size-4"
                  disabled={loading}
                />
                <span className="font-semibold text-sm md:text-base flex-1 break-words leading-snug">
                  Cash on Delivery
                </span>
                <Image
                  src="/images/payment-option-icon/cash.svg"
                  alt="Cash"
                  width={28}
                  height={28}
                />
              </div>
            </label>
          </div>
          {/* Remove the Pay now button */}
        </form>
      </div>
    </Modal>
  );
};

export default PaymentOption;
