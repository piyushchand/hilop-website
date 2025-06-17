"use client";
import { useState } from "react";
import Image from "next/image";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import ArrowButton from "@/components/uiFramework/ArrowButton";

export default function Cart() {
  const [checked, setChecked] = useState(false);
  return (
    <section className="w-full bg-gray-100 mb-16 lg:mb-40">
      <div className="container lg:pt-20 pt-10 relative">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Section */}
          <div className="lg:w-2/3 w-full">
            {/* Choose Your Subscription Plan */}
            <div className="bg-white p-6 rounded-3xl mb-6">
              <h2 className="text-lg md:text-2xl font-semibold mb-2">
                Choose Your Subscription Plan
              </h2>
              <p className="text-gray-600 mb-7">
                Special discount for ordering 45 days
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="inline-flex items-center w-full">
                  <input
                    type="radio"
                    name="subscription"
                    value="1"
                    className="peer hidden"
                  />
                  <span className="p-4 rounded-lg cursor-pointer w-full border bg-gray-100 border-gray-200 peer-checked:bg-primary/20 peer-checked:text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-dark font-medium">1 Month</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-primary font-medium">₹1200</span>{" "}
                    </div>
                  </span>
                </label>
                <label className="inline-flex items-center w-full">
                  <input
                    type="radio"
                    name="subscription"
                    value="1"
                    className="peer hidden"
                  />
                  <span className="p-4 rounded-lg cursor-pointer w-full border bg-gray-100 border-gray-200 peer-checked:bg-primary/20 peer-checked:text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-dark font-medium">1 Month</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-dark font-medium">20% OFF</span>
                      <span className="text-primary font-medium">
                        ₹1200
                      </span>{" "}
                    </div>
                  </span>
                </label>
                <label className="inline-flex items-center w-full">
                  <input
                    type="radio"
                    name="subscription"
                    value="1"
                    className="peer hidden"
                  />
                  <span className="p-4 rounded-lg cursor-pointer w-full border bg-gray-100 border-gray-200 peer-checked:bg-primary/20 peer-checked:text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-dark font-medium">1 Month</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-dark font-medium">20% OFF</span>
                      <span className="text-primary font-medium">
                        ₹1200
                      </span>{" "}
                    </div>
                  </span>
                </label>
              </div>
            </div>

            {/* Product List */}
            <div>
              <div className="flex items-center gap-4">
                <Image
                  width={180}
                  height={180}
                  src="/images/product.png"
                  alt="Copper Peptides 1% Serum"
                  className="md:size-[180px] size-16 sm:size-24 object-cover rounded-lg"
                />
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4 sm:items-center w-full sm:justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">
                      Copper Peptides 1% Serum
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-1">
                      (1 Month Pack)
                    </p>
                    <div className="flex items-center text-sm md:text-base">
                      <span className="text-gray-500 line-through mr-2">
                        ₹800
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹600
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-md w-fit">
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">
                      -
                    </button>
                    <span className="px-3 py-1 border-l border-r border-gray-300">
                      1
                    </span>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/3 w-full">
            {/* Offers & Benefits */}
            <div className="mb-6">
              <h2 className="text-lg md:text-2xl font-medium mb-4">
                Offers & Benefits
              </h2>
              <div className="mb-4">
                <div className="flex border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <input
                    type="text"
                    id="couponCode"
                    className="appearance-none focus:outline-none w-full"
                    placeholder="Enter Coupon Code"
                  />
                  <button className="ml-2 bg-transparant hover:bg-primary/20 text-primary font-medium py-2 px-4 rounded transition-all duration-300">
                    Apply
                  </button>
                </div>
              </div>
              <div
                onClick={() => setChecked(!checked)}
                className={`flex items-center cursor-pointer p-4 rounded-lg gap-4 transition-all duration-200 
        ${
          checked ? "bg-green-50 border-green-500" : "bg-white border-gray-200"
        } border`}
              >
                <Image
                  width={32}
                  height={32}
                  src="/images/icon/hilop-coin.svg"
                  alt="Hilop Coins"
                />
                <div>
                  <h3 className="text-gray-900">Apply Hilop Coins</h3>
                  <p className="text-sm text-gray-600">
                    You have 2,000 coins available, giving you 20% off on your
                    purchase!
                  </p>
                </div>
                <div className="ml-auto pointer-events-none">
                  <input
                    type="checkbox"
                    name="subscription"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    value="1"
                    className="accent-primary peer focus:shadow-outline relative inline-block h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="">
              <h2 className="text-xl md:text-2xl font-medium mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 bg-white rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bag MRP (2 items)</span>
                  <span className="font-medium text-lg">₹999</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount From Coins</span>
                  <span className="text-green-500 text-lg">-₹100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subscription Discount</span>
                  <span className="text-green-500 text-lg">-₹0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Coupon Discount</span>
                  <span className="text-green-500 text-lg">-₹0</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600 text-lg">Free</span>
                </div>
                <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-2 mt-2 items-center">
                  <span>Order total</span>
                  <span>₹863.05</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fixed Bottom Bar */}
      <div className="fixed z-50 bottom-0 left-0 w-full bg-white gap-2 md:gap-4 border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-end items-center lg:px-20 px-4">
        <div className="flex items-center">
          <span className="text-xl md:text-2xl font-bold text-green-600 mr-2">
            ₹863.05
          </span>
          <span className="text-gray-500 line-through">₹144.94</span>
        </div>
        <ArrowButton
          label="Place Order"
          theme="dark"
          className="w-fit"
          size="lg"
        />
      </div>
    </section>
  );
}
