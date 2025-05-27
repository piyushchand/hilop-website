"use client";
import Paragraph from "@/components/animationComponents/TextVisble";
import Button from "@/components/uiFramework/Button";
import { WhyChoose } from "@/components/whyChoose";
import Image from "next/image";
import React from "react";

const stats = [
  { text: "No synthetic chemicals or harmful additives" },
  { text: "Doctor-recommended, pharmacy-grade treatments" },
  { text: "Full transparency in ingredients & processes" },
  { text: "Proven results or your money back!" },
];
export default function AboutUsContent() {
  return (
    <>
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="top-content-badge">About Hilop</span>
            <h1 className="text-5xl 2xl:text-6xl mb-6 font-semibold">
              Welcome to Hilop –{" "}
              <span className="text-primary">Your Wellness</span>, Your Way
            </h1>
            <p className="mb-3">
              At Hilop, we believe that wellness should be simple, effective,
              and completely natural. Our mission is to provide science-backed
              natural health solutions that help you look, feel, and perform at
              your best—without the risks of harmful chemicals or unnecessary
              medications.
            </p>
            <p>
              With over 2 million satisfied customers, we’re setting a new
              standard in personalized wellness, discreet care, and guaranteed
              results.
            </p>
          </div>
          <Image
            src="/images/about-us/about-main.jpg"
            alt="About hero image"
            width={620}
            height={632}
            className="rounded-2xl lg:ms-auto order-1 lg:order-2"
            priority
          />
        </div>
      </section>
      <WhyChoose />
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <Image
            src="/images/about-us/our-mission.jpg"
            alt="About hero image"
            width={740}
            height={740}
            className="rounded-2xl"
          />
          <div>
            <Paragraph
              paragraph="Our Mission: Science + Nature for Real Wellness"
              textColor="text-dark"
              textSize="md:text-3xl lg:text-5xl text-2xl font-semibold"
              className="mb-8"
              highlightedWord="Science + Nature"
            />
            <p>
              At Hilop, we don’t believe in quick fixes or gimmicks—we believe
              in science-backed, natural solutions that are designed to help you
              achieve long-term results. Whether you’re looking to enhance
              performance, improve skin, or manage weight, we’ve got a solution
              that works naturally and effectively.
            </p>
          </div>
        </div>
      </section>
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div className="order-2 lg:order-1">
            <Paragraph
              paragraph="Our Commitment to You"
              textColor="text-dark"
              textSize="md:text-3xl lg:text-5xl text-2xl font-semibold"
              className="mb-8"
              highlightedWord="Commitment"
            />
            <h3 className=" text-xl md:text-2xl text-gray-800 font-medium mb-6">
              Join Hilop today and start your journey to natural
              wellness—risk-free!
            </h3>
            <div className="flex-col flex gap-5 p-5 rounded-2xl bg-gray-200">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start "
                  >
                    <Image
                      src="/images/icon/list.svg"
                      alt="About hero image"
                      width={24}
                      height={24}
                    />
                    <p className="text-black">{item.text}</p>
                  </div>
                ))}
                 <Button
                        label="Get Started Now"
                        variant="btn-dark"
                        size="xl"
                        link='/'
                      />
              </div>
          </div>
          <Image
            src="/images/about-us/our-commitment.jpg"
            alt="About hero image"
            width={740}
            height={742}
            className="rounded-2xl order-1 lg:order-2"
          />
        </div>
      </section>
    </>
  );
}
