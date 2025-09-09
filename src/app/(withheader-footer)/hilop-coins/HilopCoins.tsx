"use client";
import { useState } from "react";
// import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import FaqAccordion from "@/components/FaqAccordion";
import MobileApproch from "@/components/Mobileapproch";
import { BadgeCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const homepagefaqdata = [
  {
    id: "faq1",
    question: "What is Hilop?",
    answer:
      "Fit Body Better Intimacy Hilop Everyday. Holistic solutions for your weight, energy, and sexual wellness—because true health starts from within.",
  },
  {
    id: "faq2",
    question: "How does Hilop work?",
    answer:
      "By addressing the root causes of your wellness challenges. You see, poor diet, stress, and lifestyle habits may worsen weight, energy, or intimacy issues—but they aren’t the root cause. (It’s like trying to run a marathon with worn-out shoes; the pain is real, but the shoes aren’t the reason you trained!). Hilop works by providing personalized, holistic solutions for weight, energy, and sexual wellness, tailored to your body’s unique needs.",
  },
  {
    id: "faq3",
    question: "Does it really work?",
    answer:
      "We let the results speak for themselves! Explore our customer success stories and see the difference firsthand. Our promise: once you choose Hilop, we’ll support you every step of the way—like a true partner in your wellness journey.",
  },
  {
    id: "faq4",
    question: "What is Hilop made of?",
    answer:
      "A complete, personalized solution for your wellness—crafted by experts and tailored just for you! It contains everything you need to improve your weight, energy, and sexual wellness naturally and effectively. Learn more about our products and kits here.",
  },

  {
    id: "faq5",
    question: "How do i order from your company?",
    answer:
      "We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications",
  },
];

const hilopRules = [
  {
    title: "Maximum wallet capacity:",
    description: "2000 Hilop Coins",
  },
  {
    title: "Usage requirement:",
    description:
      "You can only use Hilop Coins when your wallet is full (2000 coins)",
  },
  {
    title: "Discount unlocked:",
    description:
      "Once your wallet reaches 2000 coins, a 20% discount will be automatically unlocked on your next order",
  },
  {
    title: "Partial redemption:",
    description: "If the wallet is not full, coins cannot be used",
  },
];

export default function HilopCoins() {
  const [copied] = useState<boolean>(false);
  const { user, isLoading, isInitialized } = useAuth();
  // const referralLink = "https://hilop.com/refer/user123";

  // const handleCopy = async () => {
  //   await navigator.clipboard.writeText(referralLink);
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  // };

  // Show loading or fallback if user data is not ready
  if (!isInitialized || isLoading) {
    return (
      <section className="w-full lg:mb-40 mb-20">
        <div className="container py-20 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <p className="text-gray-600">
            Please wait while we load your Hilop Coins.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full  bg-white">
        <div className="lg:py-20 py-10 bg-cover bg-center bg-greenleaf">
          <div className="container">
            <h1 className="text-5xl 2xl:text-6xl font-semibold mb-3">
              Hilop Coins
            </h1>
            <h2 className="sm:text-2xl text-lg">
              Earn coins, get discounts, and enjoy exclusive benefits with our
              loyalty program.
            </h2>
          </div>
        </div>
        <div className="container">
          <div className="bg-dark rounded-b-4xl lg:p-10 p-6 relative overflow-hidden">
            <Image
              src="/images/icon/primary-blur.svg"
              alt="About hero image"
              width={632}
              height={290}
              className="absolute top-0 mt-16 left-10 animate-float blur-lg lg:block hidden"
            />
            <Image
              src="/images/icon/orange-blur.svg"
              alt="About hero image"
              width={478}
              height={220}
              className="absolute bottom-0 right-0 lg:right-10 mb-5 lg:mb-16 animate-pulse-slow blur-lg"
            />
            <div className="flex gap-8 items-center relative">
              <Image
                src="/images/icon/hilop-coin.svg"
                alt="Hilop Coins"
                width={90}
                height={90}
                className="size-12 lg:size-[90px]"
              />
              <h2 className=" text-xl lg:text-5xl 2xl:text-6xl font-medium text-white">
                <span>{user?.hilop_coins ?? 0}</span> Coins
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:mb-40 mb-20 bg-white py-10 lg:py-20">
        <div className="container">
          <h2 className="text-5xl 2xl:text-6xl font-semibold mb-5 text-center">
            How to Earn Hilop Coins?
          </h2>
          <h3 className="sm:text-2xl text-lg text-center lg:mb-10 mb-6">
            Simple ways to earn coins and build up to your 20% discount!
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 gap-6">
            <div className="lg:col-span-8 p-6 bg-gray-100 rounded-3xl border-t-6 border-primary">
              <h2 className="text-2xl font-medium md:mb-6 mb-4">
                Track Your Doses
              </h2>
              <p className="text-gray-600 mb-5">
                Stay on top of your health and earn rewards effortlessly!
              </p>
              <p className="text-gray-700 mb-3">
                <span className="text-dark font-semibold">
                  ✅ Mark your daily doses:
                </span>{" "}
                with a simple checkbox and earn{" "}
                <span className="text-dark font-semibold">1 Hilop</span> Coin
                every time you check in.
              </p>
              <p className="text-gray-700 mb-3">
                <span className="text-dark font-semibold">
                  🔔 Daily Dose Reminders:
                </span>{" "}
                Get automatic notifications at your preferred time so you never
                miss a dose.
              </p>
              <p className="text-gray-700 mb-3">
                <span className="text-dark font-semibold">
                  🕒 Custom Notification Time:
                </span>{" "}
                Set and change your daily reminder time easily from the app.
              </p>
              <p className="text-gray-700 mb-3">
                <span className="text-dark font-semibold">
                  📅 Track Your History:
                </span>{" "}
                See your dose completion history and stay motivated with
                streaks.
              </p>
              <p className="text-gray-700 mb-7">
                <span className="text-dark font-semibold">
                  🔁 Smart Reminders:
                </span>{" "}
                Forgot to take a dose? We&apos;ll remind you again later!
              </p>
            </div>
            <div className="lg:col-span-4 p-6 bg-gray-100 rounded-3xl border-t-6 border-amber-400">
              <Image
                src="/images/coin-3d.png"
                alt="Hilop Coins"
                width={57}
                height={48}
                className="mb-7"
              />
              <h2 className="text-2xl font-medium mb-3">Refer a Friend</h2>
              <p className="text-gray-700 mb-11">
                When your friend places their first order, you&apos;ll get a
                <span className="font-semibold text-dark"> 20% discount</span>{" "}
                on your next purchase!
              </p>
              <div className="relative">
                {copied && (
                  <p className="text-sm text-green-500 end-0 mt-1 absolute">
                    Copied to clipboard!
                  </p>
                )}
              </div>
              {/* <Button label="Share" variant="btn-primary" size="xl" className="mt-7" /> */}
            </div>
            <div className="lg:col-span-12 p-6 bg-gray-100 rounded-3xl">
              <h2 className="text-2xl font-medium md:mb-6 mb-4">
                Hilop Coins Wallet Rules
              </h2>
              {hilopRules.map((rule, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    index < hilopRules.length - 1 ? "mb-3" : ""
                  }`}
                >
                  <BadgeCheck className="text-primary" size={24} />
                  <p className="text-gray-700">
                    <span className="text-dark font-semibold">
                      {rule.title}
                    </span>{" "}
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <MobileApproch />
      <FaqAccordion items={homepagefaqdata} className="mx-auto" />
    </>
  );
}
