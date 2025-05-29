  // app/page.tsx (or any other page/component)
  'use client'; // Required if this is a client component

  import React from "react";
  import Modal from "../animationComponents/animated-model";
  import Button from "../uiFramework/Button";
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
        className="max-w-xl grid grid-cols-12 rounded-lg overflow-hidden shadow-lg"
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="sm:col-span-5 col-span-12 h-full relative overflow-hidden sm:flex flex-col sm:order-1 order-2 bg-dark sm:bg-white">
          <p className="text-lg md:text-2xl font-semibold ps-6 pt-6 relative z-10 text-white sm:text-black mb-4">
            My plans
          </p>
          <div className="mt-auto ps-5 pb-5 z-10 relative">
            <p className="font-medium mb-3 text-white">
              Your doctor recommended Treatment plan
            </p>
            <ArrowButton label="View Prescriptions" theme="light" size="lg" />
          </div>
          <Image
            src="/images/modal-2.jpg"
            width={428}
            height={682}
            alt="model image"
            className="object-cover absolute w-full h-full z-0"
          />
          <div className="h-52 hidden sm:block absolute bg-gradient-to-b from-transparent to-black w-full bottom-0 "></div>
        </div>
        <div className="sm:col-span-7 col-span-12 h-full flex flex-col sm:order-2 order-1">
        <h2 className="text-lg md:text-2xl font-semibold mb-4 p-6 border-b border-gray-200">
        My Plans & Kit Guide
          </h2>
          <div className="p-6">
          <div className="flex flex-col gap-4">
            <div className="bg-gray-200 p-2 rounded-lg product card">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/product.png"
                  width={128}
                  height={128}
                  alt="plan image"
                  className="object-cover w-32 h-32 aspect-square rounded-lg "
                  />
                  <div className="">
                    <p className="text-xl font-medium mb-3">Anti-Aging Cream for men</p>
                    <p className="font-medium text-gray-600  mb-3">Dosage: <span className="text-dark">1-0-1</span></p>
                    <p className="text-gray-600"><span className="text-dark">4</span>/5 doses completed</p>
                  </div>
                  <CircularProgressBar
              percentage={80}
              size={150} // Example size
              strokeWidth={15} // Example stroke width
              progressColor="text-green-500" // Example color
              trackColor="text-gray-200" // Example color
              animationDuration={5000} // 5 seconds animation as requested
            />
              </div>
            </div>
        </div>
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
