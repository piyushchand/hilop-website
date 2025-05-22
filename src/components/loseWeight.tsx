"use client";

import Image from "next/image";
import Paragraph from "./animationComponents/TextVisble";
import Button from "./uiFramework/Button";

const LoseWeight = () => {
  return (
    <>
      <section className=" bg-light-vanilla md:py-20 py-12 rounded-4xl mb-20 lg:mb-32">
        <div className="container">
          <Paragraph
            align="center"
            paragraph="Lose Weight Naturally With a Custom Plan Designed for You"
            textColor="text-white"
            className="mb-6 md:mb-10 max-w-5xl"
            highlightedWord="Naturally"
          />
          <div className="max-w-fit mx-auto -mt-20 relative mb-6">
            <Image
              src="/images/weight-loss/commponant-model.png"
              width={408}
              height={493}
              alt="weightloss model"
            />
            <div className="absolute bg-gradient-to-b from-transparent to-light-vanilla h-28 w-full bottom-0"></div>
            <div className="grid sm:grid-cols-2 gap-4 -mt-[52px]">
              <Button
                label="Get Started"
                variant="btn-dark"
                size="xl"
                className="w-full"
                link="/"
              />
              <Button
                label="Take the test"
                variant="btn-light"
                size="xl"
                className="w-full"
                link="/"
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
              <h3 className="text-3xl mb-2 text-white font-semibold">
                Moving in the Right Direction
              </h3>
              <h4 className="text-2xl mb-6 text-white">
                Personalized Natural Weight Loss Plan
              </h4>
              <p className="text-gray-200">
                Get a customized weight loss plan tailored to your body’s needs,
                designed to help you feel happy and confident naturally.
              </p>
            </div>
            <div className="bg-vanilla p-6 lg:p-10 rounded-3xl">
              <Image
                src="/images/weight-loss/eat-healthy.jpg"
                width={336}
                height={336}
                alt="weightloss product"
                className="mb-6 rounded-3xl md:h-[336px] h-56 w-full object-cover"
              />
              <h3 className="text-3xl mb-2 text-white font-semibold">
              Eat Healthy, Get Strong
              </h3>
              <h4 className="text-2xl mb-6 text-white">
              Nourish Your Body the Right Way
              </h4>
              <p className="text-gray-200">
              Find nutrition-packed, high-protein recipes in the Hilop app to support muscle mass and overall wellness naturally.
              </p>
            </div>
            <div className="bg-vanilla p-6 lg:p-10 rounded-3xl md:col-span-2 flex flex-col gap-6 sm:flex-row justify-between items-center">
                <div className="sm:order-1 order-2">
                <h3 className="text-3xl mb-2 text-white font-semibold">
                Know Your Starting Point
              </h3>
              <h4 className="text-2xl mb-6 text-white">
              Check Your BMI to Begin
              </h4>
              <Button
                label="Calculate BMI"
                variant="btn-dark"
                size="xl"
                className="w-fit"
                link="/"
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
    </>
  );
};

export default LoseWeight;
