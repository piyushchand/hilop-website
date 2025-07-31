"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Paragraph from "./animationComponents/TextVisble";
import Button from "./uiFramework/Button";
import React, { useState } from "react";
import BmiCalculatorModal from "./model/BmiCalculatorModal";

type LoseWeightProps = {
  testId?: string;
  productId?: string;
};

const LoseWeight = ({ testId, productId }: LoseWeightProps) => {
  const [bmiModalOpen, setBmiModalOpen] = useState(false);
  return (
    <>
      <section className=" bg-light-vanilla md:py-20 py-12 rounded-4xl mb-16 lg:mb-40">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <Paragraph
              align="center"
              paragraph="Lose Weight Naturally With a Custom Plan Designed for You"
              textColor="text-white"
              textSize="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-semibold"
              className="mb-6 md:mb-10 max-w-5xl"
              highlightedWord="Naturally"
            />
          </div>
          <div className="max-w-fit mx-auto sm:-mt-20 -mt-12 relative mb-6">
            <motion.img
              src="/images/weight-loss/commponant-model.png"
              width={408}
              height={493}
              alt="weightloss model"
              initial={{ y: 100, opacity: 0 }} // Start 100px below and invisible
              whileInView={{ y: 0, opacity: 1 }} // Animate to original position and visible
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }} // Animate once when 50% visible
              style={{ display: "block" }}
            />
            <div className="absolute bg-gradient-to-b from-transparent to-light-vanilla h-28 w-full bottom-0"></div>
            <div className="grid sm:grid-cols-2 gap-4 -mt-[52px]">
              <Button
                label="GET STARTED "
                variant="btn-dark"
                size="xl"
                className="w-full"
                link={productId ? `/product/${productId}` : "#"}
              />
              <Button
                label="TAKE THE TEST ™"
                variant="btn-light"
                size="xl"
                className="w-full"
                link={`/consultation?testId=${testId}`}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 lg:gap-10">
            <div className="bg-vanilla p-6 lg:p-10 rounded-3xl">
              <Image
                src="/images/weight-loss/product-main.png"
                width={336}
                height={336}
                alt="weightloss product"
                className="mb-6 md:h-[336px] h-56 w-full object-contain"
              />
              <h3 className="md:text-4xl sm:text-2xl text-xl mb-2 text-white font-medium">
                Moving in the Right Direction
              </h3>
              <h4 className="md:text-2xl text-lg mb-6 text-white">
                Personalized Natural Weight Loss Plan
              </h4>
              <p className="text-gray-200">
                Get a customized weight loss plan tailored to your body&apos;s
                needs, designed to help you feel happy and confident naturally.
              </p>
            </div>
            <div className="bg-vanilla p-6 lg:p-10 rounded-3xl">
              <Image
                src="/images/weight-loss/eat-healthy.jpg"
                width={644}
                height={336}
                alt="weightloss product"
                className="mb-6 rounded-3xl md:h-[336px] h-56 w-full object-cover"
              />
              <h3 className="md:text-4xl sm:text-2xl text-xl mb-2 text-white font-medium">
                Eat Healthy, Get Strong
              </h3>
              <h4 className="md:text-2xl text-lg mb-6 text-white">
                Nourish Your Body the Right Way
              </h4>
              <p className="text-gray-200">
                Find nutrition-packed, high-protein recipes in the Hilop app to
                support muscle mass and overall wellness naturally.
              </p>
            </div>
            <div className="bg-vanilla p-6 lg:p-10 rounded-3xl md:col-span-2 flex flex-col gap-6 sm:flex-row justify-between items-center">
              <div className="sm:order-1 order-2">
                <h3 className="md:text-4xl sm:text-2xl text-xl mb-2 text-white font-medium">
                  Know Your Starting Point
                </h3>
                <h4 className="md:text-2xl text-lg mb-6 text-white">
                  Check Your BMI to Begin
                </h4>
                <Button
                  label="Calculate BMI"
                  variant="btn-dark"
                  size="xl"
                  className="w-fit"
                  onClick={() => setBmiModalOpen(true)}
                />
              </div>
              <Image
                src="/images/weight-loss/bmi-icon.svg"
                width={358}
                height={217}
                alt="bmi icon"
                className="md:h-[217px] h-32 sm:order-2 order-1"
              />
            </div>
          </div>
        </div>
      </section>
      <BmiCalculatorModal
        isOpen={bmiModalOpen}
        onClose={() => setBmiModalOpen(false)}
      />
    </>
  );
};

export default LoseWeight;
