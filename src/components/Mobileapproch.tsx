"use client";

import Image from "next/image";
import Paragraph from "./animationComponents/TextVisble";
const mobileFeatures = [
  {
    title: "✅ Daily Dose Tracking",
    description:
      "Easily mark your doses and earn coins every day. The app also sends timely reminders so you never miss a dose.",
    colSpan: "sm:col-span-2",
  },
  {
    title: "🔔 Daily Dose Reminders",
    description:
      "Get automatic notifications at your preferred time so you never miss a dose.",
    colSpan: "sm:col-span-1",
  },
  {
    title: "🕒 Custom Notification Time",
    description: "Set and change your daily reminder time easily from the app.",
    colSpan: "sm:col-span-1",
  },
  {
    title: "📅 Track Your History:",
    description:
      "See your dose completion history and stay motivated with streaks.",
    colSpan: "sm:col-span-1",
  },
  {
    title: "🔁 Smart Reminders",
    description: "Forgot to take a dose? We’ll remind you again later!",
    colSpan: "sm:col-span-1",
  },
];

const MobileApproch = () => {
  return (
    <>
      <section className="mb-16 lg:mb-40">
        <div className="container">
          <div className="grid xl:grid-cols-[870px_auto] items-center gap-6 mb-10">
            <div>
              <Paragraph
                align="start"
                paragraph="Your Personal Wellness Companion"
                className="mb-2"
                textSize="xl:text-5xl font-semibold text-3xl"
                highlightedWord="Wellness Companion"
              />
              <p className="text-base md:text-lg lg:text-2xl font-medium">
                Boost Your Chances to Earn More Hilop Coins – Only on the App!
              </p>
            </div>
            <p className="text-gray-700 p-6 rounded-2xl bg-white">
              Unlock more ways to earn Hilop Coins and stay on top of your
              health journey with our mobile app. Enjoy exclusive features
              designed to personalize your treatment and help you reach your
              wellness goals.
            </p>
          </div>
          <div className="bg-dark rounded-3xl grid xl:grid-cols-2">
            <div className="md:p-20 p-6">
              <h3 className="md:text-2xl text-lg text-white mb-3">
                Exclusive Features Available in the App
              </h3>
              <p className="text-gray-600 mb-6">
                Stay on top of your health and earn rewards effortlessly!
              </p>
              <div className="grid items-center sm:grid-cols-2 grid-cols-1 gap-3 mb-3">
                {mobileFeatures.map((mobileFeatures, index) => (
                  <div
                    key={index}
                    className={`${mobileFeatures.colSpan} bg-gray-900 p-4 rounded-lg h-full`}
                  >
                    <h4 className="text-base font-medium text-white mb-2">
                      {mobileFeatures.title}
                    </h4>
                    <p className="text-gray-600">
                      {mobileFeatures.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 items-center">
              <Image
                src="/images/footer/qrcode-dark.svg"
                width={140}
                height={140}
                alt="App QR code"
                className="rounded-lg border border-gray-800"
              />
              <div>
              <Image
                src="/images/footer/apple-app.svg"
                width={210}
                height={58}
                alt="apple-app" 
                className="rounded-lg mb-3 border border-gray-800"
                />
                <Image
                src="/images/footer/android-app.svg"
                width={210}
                height={58}
                alt="android-app"
                className="rounded-lg border border-gray-800"
                />
              </div>
              </div>
            </div>
            <div className="sm:px-27 px-6 mt-auto mx-auto">
              <Image
                src="/images/mobile-approch.png"
                alt="why Choose herbal fat loss"
                width={637}
                height={709}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MobileApproch;
