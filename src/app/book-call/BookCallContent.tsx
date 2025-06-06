"use client";
import React, { useState } from 'react';
import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import AnimatedTextarea from "@/components/animationComponents/AnimatedTextarea";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
const stats = [
  { text: "Personalized health guidance" },
  { text: "Discuss your goals confidentially" },
  { text: "Get tailored product recommendations" },
  { text: "Support for fat loss, stamina, and sexual wellness" },
  { text: "100% natural and side-effect-free solutions" },
];
export default function BookCall() {
  const [services, setServices] = useState<string[]>([]);

  const handleServiceToggle = (service: string) => {
    setServices((prevServices) =>
      prevServices.includes(service)
        ? prevServices.filter((s) => s !== service)
        : [...prevServices, service]
    );
  };
  return (
    <>
      <section className="w-full py-20 bg-cover bg-center bg-greenleaf lg:mb-40 mb-20">
        <div className="container">
          <h1 className="text-5xl 2xl:text-6xl font-semibold mb-3">
            Book <span className="text-primary">Appointment</span>
          </h1>
          <h3 className="sm:text-2xl text-lg mb-3">
            Take the First Step Towards a Healthier, More Confident You
          </h3>
          <p className="max-w-lg text-gray-700">
            We specialize in 100% natural, herbal-based wellness products
            designed to support your body from the inside out. Book a
            confidential one-on-one consultation to discover which product or
            plan is right for you.
          </p>
        </div>
      </section>

      <section className="container lg:mb-40 mb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-medium md:mb-4 mb-3">
              Why Book an Appointment?
            </h2>
            <div className="flex-col flex gap-2 mb-8">
              {stats.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Image
                    src="/images/icon/list.svg"
                    alt="About hero image"
                    width={24}
                    height={24}
                  />
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-medium md:mb-4 mb-3">
            📞 What Happens After You Book?
            </h2>
            <p className="text-gray-700">
              Once you submit the appointment form, our expert admin will call
              you directly to understand your needs and guide you properly. Your
              conversation will be 100% private and confidential.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl">
            <h2 className="sm:text-2xl text-lg mb-6">Appointment Form</h2>
            <div className="flex flex-col gap-6">
              <AnimatedInput
                label="Full Name"
                name="fullName"
                type="text"
                value="john Doe"
                required
              />

              <AnimatedInput
                label="Mobile number"
                name="Mobile number"
                type="tel"
                required
              />
              <AnimatedInput
                label="Preferred Date to Call"
                name="Preferred Date to Call"
                type="date"
                required
              />
            
              <AnimatedInput
                label="Preferred Time to Call"
                name="Preferred Time to Call"
                type="time"
                required
              />
                <div className="col-span-2 lg:col-span-2">
                    <fieldset>
                      <legend className="mb-3 block text-sm text-gray-600">
                      Choose Your Concern
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Fat Loss',
                          'Instant Boost',
                          'Sexual Wellness',
                        ].map((service) => (
                          <Button
                            key={service}
                            label={service}
                            onClick={() => handleServiceToggle(service)}
                            variant={
                              services.includes(service)
                                ? 'btn-dark'
                                : 'btn-gray'
                            }
                            size="lg"
                          />
                        ))}
                      </div>
                    </fieldset>
                  </div>
                <AnimatedTextarea
                label="Additional Notes"
                name="Additional Notes"
                rows={3}
                required
              />
              <div className="ms-auto">
              <ArrowButton
                        label="Book Now"
                        theme="dark"
                        size="lg"
                      />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
