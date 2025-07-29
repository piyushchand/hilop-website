import React, { useState } from "react";
import Image from "next/image";
import Modal from "../animationComponents/animated-model";
import Button from "../uiFramework/Button";

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
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md w-full max-h-[80vh] rounded-lg overflow-hidden shadow-lg bg-white flex flex-col justify-start"
    >
      <div className="sticky top-0 z-10 bg-white border-b p-4 md:p-5 border-gray-200">
        <h2 className="text-xl md:text-2xl font-semibold text-dark ">
          Payment
        </h2>
        <p className="text-black/50 text-sm mt-1">
          All transactions are secure and encrypted.
        </p>
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
            <label className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer bg-gray-100 border-gray-200 hover:border-black/50  w-full">
              <div className="flex flex-row items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={selectedPayment === "razorpay"}
                  onChange={() => {
                    setSelectedPayment("razorpay");
                  }}
                  className="size-4 mt-1 accent-dark"
                  disabled={loading}
                />
                <div className="flex flex-col md:flex-row flex-1  gap-2">
                  <span className="font-medium text-sm md:text-base w-full break-words leading-snug">
                    Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                  </span>
                  <div className="flex flex-wrap md:justify-end w-full items-center gap-2">
                    <Image
                      src="/images/payment-option-icon/upi.svg"
                      alt="UPI"
                      width={28}
                      height={28}
                      className="bg-white  rounded-xs border border-black/20 w-12 h-8 p-px"
                    />
                    <Image
                      src="/images/payment-option-icon/visa.svg"
                      alt="Visa"
                      width={28}
                      height={28}
                      className="bg-white  rounded-xs border border-black/20 w-12 h-8 p-px"
                    />
                    <Image
                      src="/images/payment-option-icon/mastercard.svg"
                      alt="Mastercard"
                      width={28}
                      height={28}
                      className="bg-white  rounded-xs border border-black/20 w-12 h-8 p-px"
                    />
                    <Image
                      src="/images/payment-option-icon/rupay.svg"
                      alt="Rupay"
                      width={28}
                      height={28}
                      className="bg-white  rounded-xs border border-black/20 w-12 h-8 p-px"
                    />

                    <span className="text-sm text-center flex border border-black/20  justify-center items-center bg-white  rounded-xs w-12 h-8 p-px ml-1">
                      +16
                    </span>
                  </div>
                </div>
              </div>
              {/* Razorpay redirect details */}
              {/* {selectedPayment === "razorpay" && ( */}
              <div className="flex flex-col gap-8 items-center justify-center border-t border-gray-200 mt-4 pt-4">
                <Image
                  src="/images/payment-option-icon/card.svg"
                  alt="Cash"
                  width={200}
                  height={64}
                  className="opacity-50"
                />

                <p className="text-center text-black/80 text-sm sm:text-base">
                  After clicking{" "}
                  <span className="font-semibold">“Pay now”</span>, you will be
                  redirected to
                  <br className="hidden sm:block" />
                  Razorpay Secure (UPI, Cards, Wallets, NetBanking) to
                  <br className="hidden sm:block" />
                  complete your purchase securely.
                </p>
              </div>
              {/*  )} */}
            </label>
          </div>
          <div>
            <label className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer bg-gray-100 border-gray-200 hover:border-black/50 w-full">
              <div className="flex flex-row items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPayment === "cod"}
                  onChange={() => {
                    setSelectedPayment("cod");
                  }}
                  className="size-4 accent-dark"
                  disabled={loading}
                />
                <span className="font-medium text-sm md:text-base flex-1 break-words leading-snug">
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
          {/* Pay now button */}
          {/* <button
            type="submit"
            className="w-full mt-4 py-2 px-4 cursor-pointer bg-gree-600 text-white font-semibold rounded-lg shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay now"}
          </button> */}
          <Button
            type="submit"
            disabled={loading}
            className="!w-full !min-w-full py-3"
            label="Pay now"
          ></Button>
        </form>
      </div>
    </Modal>
  );
};

export default PaymentOption;
