"use client";
import React from "react";
import Image from "next/image";
import Button from "@/components/uiFramework/Button";
interface OrderSummary {
  _id?: string;
  order_id?: string;
  order_number?: string;
  total?: number;
  total_amount?: number;
  status?: string;
}

interface PaymentSuccessModalProps {
  src: string;
  title: string;
  description: string;
  show: boolean;
  orderSummary: OrderSummary | null;
  onClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  src,
  title,
  description,
  show,
  orderSummary,
  onClose,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center flex flex-col items-center justify-center">
        <div className="mb-4">
          <Image
            src={src}
            width={64}
            height={64}
            alt="Success"
            className="mx-auto mb-2"
          />
          <h2 className="text-2xl font-bold text-green-700 mb-2">{title}</h2>
          <p className="text-gray-700 mb-2">{description}</p>
        </div>
        {orderSummary && (
          <div className="mb-4 text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="text-sm text-gray-800">
              <div>
                <b>Order ID:</b> {orderSummary._id || orderSummary.order_id}
              </div>
              <div>
                <b>Order Number:</b> {orderSummary.order_number}
              </div>
              <div>
                <b>Total:</b> ₹
                {orderSummary.total?.toFixed(2) || orderSummary.total_amount}
              </div>
              <div>
                <b>Status:</b> {orderSummary.status}
              </div>
            </div>
          </div>
        )}
        <Button
          label="Go to My Orders"
          variant="btn-dark"
          size="xl"
          className="w-full mt-2"
          onClick={onClose}
        />
      </div>
    </div>
  );
};
export default PaymentSuccessModal;
