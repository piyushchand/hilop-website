"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import Modal from "@/components/animationComponents/animated-model";
import Link from "next/link";

// Dummy Orders (example only)
const dummyOrders = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  status: i % 2 === 0 ? "Delivered" : "Ongoing",
  date: "2024-07-15",
  total: 59.99,
  address: "Shop Number 3, Sabira Manzil, Near Union Bank, Rani Sati Marg, Malad (E), Kedarmal Rd, Malad East",
  items: [
    {
      name: "The Ordinary Multi-Peptide + Copper Peptides 1% Serum - 30ml",
      quantity: 1,
      price: 70.0,
    },
    {
      name: "The Ordinary Niacinamide 10% + Zinc 1% - 30ml",
      quantity: 1,
      price: 50.0,
    },
  ],
  summary: {
    mrp: 120.0,
    discount: 10.0,
    coupon: 0.0,
    shipping: 10.0,
    finalAmount: 110.0,
  },
}));

// Types
type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  status: "Ongoing" | "Delivered" | "Cancelled" | "Others";
  date: string;
  total: number;
  address: string; 
  items: OrderItem[];
  summary: {
    mrp: number;
    discount: number;
    coupon: number;
    shipping: number;
    finalAmount: number;
  };
};

const filterOptions: Array<
  "All" | "Ongoing" | "Delivered" | "Cancelled" | "Others"
> = ["All", "Ongoing", "Delivered", "Cancelled", "Others"];

export default function MyOrder() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filterOptions)[number]>("All");
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredOrders =
    activeFilter === "All"
      ? dummyOrders
      : dummyOrders.filter((order) => order.status === activeFilter);

  const visibleOrders = filteredOrders.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <section className="w-full bg-gray-100 mb-16 lg:mb-40">
      <div className="container lg:mt-20 mt-10">
        <h1 className="text-5xl 2xl:text-6xl font-semibold mb-6 lg:mb-10">
          My Orders
        </h1>

        {/* Swiper Filter */}
        <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          className="mb-8"
          centeredSlides={false}
        >
          {filterOptions.map((status) => (
            <SwiperSlide key={status} className="!w-fit">
              <Button
                onClick={() => {
                  setActiveFilter(status);
                  setVisibleCount(4);
                }}
                className="w-full"
                label={status}
                variant={activeFilter === status ? "btn-primary" : "btn-light"}
                size="xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Orders Grid */}
        {visibleOrders.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {visibleOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setModalOrder(order as Order)}
                  className="bg-white rounded-lg border border-gray-200 transition-shadow cursor-pointer hover:shadow-lg"
                >
                  <div className="flex px-5 py-3 justify-between items-center border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-medium text-dark mb-1">
                        Kit #{order.id}
                      </h3>
                      <p className="text-gray-700">
                        Order id #{order.id.padStart(7, "0")}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg text-gray-800 font-medium">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-gray-700 text-end">6:08 pm</p>
                    </div>
                  </div>
                  <div className="p-5 border-b border-gray-200 flex flex-col gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center">
                        <Image
                          src="/images/product.png"
                          alt="Product image"
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-lg text-gray-700 mb-1 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-base font-medium text-dark">
        Qty: {item.quantity} × ${item.price.toFixed(2)}
      </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 flex justify-between">
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Ongoing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <Link
                      href={`/invoices/${order.id}.pdf`}
                      download
                      className="text-green-800 hover:underline text-center font-semibold block"
                    >
                      Download invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {visibleOrders.length < filteredOrders.length && (
              <div className="mt-8 flex justify-center">
                <Button
                  label="Show More"
                  onClick={handleShowMore}
                  variant="btn-dark"
                  size="xl"
                  className="text-center"
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-20">
            No orders found for &ldquo;{activeFilter}&rdquo;.
          </p>
        )}

        {/* Order Detail Modal */}
        {modalOrder && (
          <Modal
            className="max-w-sm w-full h-fit rounded-lg overflow-hidden shadow-lg"
            isOpen={!!modalOrder}
            onClose={() => setModalOrder(null)}
          >
            <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200">
              Kit #{modalOrder.id}
            </h2>
            <div className="max-h-[65vh] md:max-h-auto overflow-y-auto">
              <div className="p-6 flex items-center justify-between">
                <p className="text-gray-700 text-sm">
                  Order id #{modalOrder.id.padStart(7, "0")}
                </p>
                <p className="text-gray-700 text-sm">{modalOrder.date}</p>
              </div>
              <div className="px-6 flex flex-col gap-3">
                {modalOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center border-b last:border-0 pb-3 border-gray-200"
                  >
                    <Image
                      src="/images/product.png"
                      alt="Product image"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-lg text-gray-700 mb-1 line-clamp-2">{item.name}</p>
                      <p className="text-base font-medium text-dark">
        Qty: {item.quantity} × ${item.price.toFixed(2)}
      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <p className="font-medium text-dark text-lg">Address</p>
                <p className="text-gray-600">
                {modalOrder.address}
                </p>
              </div>
              <div className="p-6 bg-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <p className="text-dark">
                    Bag MRP ({modalOrder.items.length} items)
                  </p>
                  <p className="text-gray-600 font-medium">
                    ${modalOrder.summary.mrp.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <p className="text-dark">Discount From Coins</p>
                  <p className="text-green-800 font-medium">
                    -${modalOrder.summary.discount.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <p className="text-dark">Subscription Discount</p>
                  <p className="text-green-800 font-medium">
                    -${modalOrder.summary.coupon.toFixed(2)}
                  </p>
                </div>{" "}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <p className="text-dark">Coupon Discount</p>
                  <p className="text-green-800 font-medium">
                    -${modalOrder.summary.coupon.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <p className="text-dark">Shipping</p>
                  <p className="text-gray-600 font-medium">
                    ${modalOrder.summary.shipping.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p className="text-dark font-semibold">Amount to be paid</p>
                  <Button
                    label={`$${modalOrder.summary.finalAmount.toFixed(2)}`}
                    variant="btn-dark"
                    size="xl"
                  />
                </div>
              </div>
            </div>
            <Link
              href={`/invoices/${modalOrder.id}.pdf`}
              download
              className="text-green-800 hover:underline p-6 text-center font-semibold block"
            >
              Download invoice
            </Link>
          </Modal>
        )}
      </div>
    </section>
  );
}
