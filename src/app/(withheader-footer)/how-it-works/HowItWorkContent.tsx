"use client";
import MobileApproch from "@/components/Mobileapproch";
import Accordion from "@/components/uiFramework/Accordion";
import Image from "next/image";
import React from "react";

const howItworkcontent = [
  {
    id: "faq1",
    question: "Free Online Consultation",
    answer:
      "Our carefully selected herbs work synergistically to increase your metabolic rate, helping your body burn calories faster, even at rest.",
  },
  {
    id: "faq2",
    question: "Get a 100% Natural, Customized Treatment Plan",
    answer:
      "Stay on top of your journey with our daily tracking tools and Hilop Coins rewards program.",
  },
  {
    id: "faq3",
    question: "Prescription & State-of-the-Art Compounded Treatments",
    answer:
      "Feel energized and focused throughout the day without the jitters. Our formula includes herbs that support sustained energy and mental clarity while you work toward your fat loss goals.",
  },
  {
    id: "faq4",
    question: "Fast, Discreet Shipping to Your Door",
    answer:
      "A healthy digestive system is key to weight management. Our herbal blend promotes digestive health, ensuring that your body absorbs nutrients efficiently and eliminates waste naturally.",
  },
  {
    id: "faq5",
    question: "Track Progress & Earn Rewards",
    answer:
      "A healthy digestive system is key to weight management. Our herbal blend promotes digestive health, ensuring that your body absorbs nutrients efficiently and eliminates waste naturally.",
  },
  {
    id: "faq6",
    question: "Guaranteed Results—Or Your Money Back!",
    answer:
      "A healthy digestive system is key to weight management. Our herbal blend promotes digestive health, ensuring that your body absorbs nutrients efficiently and eliminates waste naturally.",
  },
];
export default function HowItWorkContent() {
  return (
    <>
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
      <div className="text-center mb-10 md:mb-16 lg:mb-20">
      <span className="top-content-badge mx-auto">How It Works</span>
            <h1 className="text-5xl 2xl:text-6xl mb-4 font-semibold">
            100% Natural, Simple & {''}
              <span className="text-primary">Risk-Free</span>
            </h1>
            <p className="text-gray-600">
            At Hilop, we make personalized wellness easy. Our 100% natural treatments are designed to fit seamlessly into your life, with expert-backed guidance and a risk-free experience.
            </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <Image
            src="/images/fat-loss.jpg"
            alt="why Choose herbal fat loss"
            width={740}
            height={766}
            className="rounded-2xl"
          />
          <div>
            <Accordion items={howItworkcontent} className="mx-auto mb-8" />
           
          </div>
        </div>
      </section>
      <MobileApproch />
    </>
  );
}
