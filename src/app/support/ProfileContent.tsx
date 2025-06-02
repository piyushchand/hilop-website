"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import {
  Package,
  MessageCircleQuestion,
  Tablets,
  BookOpenText,
  TicketSlash,
  HandCoins,
  BanknoteArrowDown,
  CircleHelp,
} from "lucide-react";

import { PlaceholdersAndVanishInput } from "@/components/animationComponents/SearchInput";
import Accordion from "@/components/uiFramework/Accordion";

const placeholdersvanish = [
  "What's the meaning of life?",
  "How to build a custom PC?",
  "Ideas for a weekend getaway?",
  "Best ramen recipe?",
  "Learn a new language",
];

const navItems = [
  { name: "How to Use", icon: <MessageCircleQuestion strokeWidth="1" size={56} /> },
  { name: "Prescription", icon: <Tablets strokeWidth="1" size={56} /> },
  { name: "Order Concerns", icon: <Package strokeWidth="1" size={56} /> },
  { name: "My Treatment", icon: <BookOpenText strokeWidth="1" size={56} /> },
  { name: "Payment & Refund", icon: <TicketSlash strokeWidth="1" size={56} /> },
  { name: "Reward Coins", icon: <BanknoteArrowDown strokeWidth="1" size={56} /> },
  { name: "Money back Guarantee", icon: <HandCoins strokeWidth="1" size={56} /> },
  { name: "General Queries", icon: <CircleHelp strokeWidth="1" size={56} /> },
];

const accordionData = [
  [
    { id: "1", question: "How to use the app?", answer: "Login and follow the tutorial." },
    { id: "2", question: "Is there a guide?", answer: "Yes, in the Help section." },
  ],
  [
    { id: "3", question: "How to upload a prescription?", answer: "Dashboard → Upload." },
    { id: "4", question: "Is a prescription mandatory?", answer: "Yes, for controlled meds." },
  ],
  [
    { id: "5", question: "Order delay issue?", answer: "Check order status in My Orders." },
    { id: "6", question: "Modify my order?", answer: "Contact support ASAP." },
  ],
  [
    { id: "7", question: "Where are my treatment results?", answer: "Check Reports section." },
    { id: "8", question: "Can I talk to a doctor?", answer: "Yes, via in-app consultation." },
  ],
  [
    { id: "9", question: "How to request a refund?", answer: "Visit Payments → Refund Request." },
    { id: "10", question: "Accepted payment methods?", answer: "UPI, Cards, Wallets." },
  ],
];

export default function Support() {
  const [selectedIndex, setSelectedIndex] = useState(0); // Default to first

  const currentAccordionItems = accordionData[selectedIndex];

  return (
    <>
      <section className="w-full py-60 bg-cover bg-center bg-greenleaf lg:mb-20 mb-10">
        <div className="container text-center">
          <h1 className="text-5xl 2xl:text-6xl mb-8 font-semibold">
            Hello, How can we help?
          </h1>
          <div className="max-w-sm mx-auto">
            <PlaceholdersAndVanishInput 
              placeholders={placeholdersvanish}
              onChange={(e) => {
                // Handle input change
                console.log(e.target.value);
              }}
              onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission
                console.log('Form submitted');
              }}
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden lg:mb-40 mb-20">
       <div className="container">
       <Swiper
          spaceBetween={16}
          slidesPerView={1.6} // mobile default
          slidesPerGroup={1}
          loop={false}
          autoHeight
          className="mb-16 !overflow-visible"
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2.4,
            },
            1024: {
              slidesPerView: 3.5,
            },
            1280: {
              slidesPerView: 4.5,
            },
          }}
        >
          {navItems.map((item, index) => (
            <SwiperSlide
              key={index}
              onClick={() => setSelectedIndex(index)}
            
            >
              <div   className={`flex flex-col text-center !h-full bg-white items-center justify-center group p-4 rounded-lg border ${
                selectedIndex === index
                  ? "border-green-600"
                  : "border-transparent"
              } hover:border-green-300 transition-colors duration-200`}>
              <div
                className={`mb-4 text-center flex justify-center text-gray-700 ${
                  selectedIndex === index
                    ? "text-green-800"
                    : "group-hover:text-green-800"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`md:text-xl text-md font-medium ${
                  selectedIndex === index
                    ? "text-green-800"
                    : "text-gray-700 group-hover:text-green-800"
                } `}
              >
                {item.name}
              </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div>
          {currentAccordionItems && currentAccordionItems.length > 0 ? (
            <Accordion items={currentAccordionItems} className="mx-auto mb-8" />
          ) : (
            <div className="text-center text-gray-600 py-10">
              No frequently asked questions available for this category yet. Please check back later!
            </div>
          )}
        </div>
       </div>
      </section>
    </>
  );
}