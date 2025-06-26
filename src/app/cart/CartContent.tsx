// Complete and cleaned-up production-ready Cart page with all logic integrated

"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ArrowButton from "@/components/uiFramework/ArrowButton";

interface SubscriptionPlan {
  _id: string;
  name: string;
  months: number;
  discount: number;
  discount_type: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartProduct {
  product_id: string;
  name: { en: string; hi: string };
  price: {
    base_price: number;
    final_price: number;
    discount: number;
    discount_type: string;
  };
  discounted_unit_price: number;
  images: string[];
  category: string;
  quantity: number;
  months_quantity: number;
  item_total: number;
}

interface CartPlan {
  id: string;
  name: string;
  months: number;
  discount: number;
  discount_type: string;  
}

interface CartData {
  items: CartProduct[];
  subtotal: number;
  available_coins: number;
  use_coins: boolean;
  coins_used: number;
  coin_discount: number;
  discount_percentage: number;
  coupon: string | null;
  coupon_discount: number;
  selected_plan: CartPlan | null;
  total_price: number;
  item_count: number;
  auto_added_products: unknown;
}

export default function Cart() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartData | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const [coinsLoading, setCoinsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_URL}/plans`);
        const data = await res.json();
        if (!data.success) throw new Error("Invalid response");
        const activePlans = data.data.filter((p: SubscriptionPlan) => p.is_active);
        setPlans(activePlans);
        if (activePlans.length) setSelectedPlanId(activePlans[0]._id);
      } catch (err) {
        setPlansError((err as Error).message);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, [API_URL]);

  const fetchCart = useCallback(async () => {
    setCartLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (!data.success) throw new Error("Invalid cart data");
      setCart(data.data);
    } catch (err) {
      setCartError((err as Error).message);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCartItem = async (item: CartProduct, newQty: number) => {
    if (newQty < 1) return;
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: newQty,
          months_quantity: item.months_quantity,
        }),
      });
      await fetchCart();
    } catch {
      toast.error("Failed to update cart");
    }
  };

  const removeCartItem = async (item: CartProduct) => {
    try {
      const res = await fetch(`/api/cart/${item.product_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Item removed");
      await fetchCart();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const handleToggleCoins = async () => {
    if (!cart) return;
    setCoinsLoading(true);
    try {
      const res = await fetch("/api/cart/coins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_coins: !cart.use_coins }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update coins usage");
      toast.success(data.message || "Hilop coins updated");
      await fetchCart();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update coins usage");
    } finally {
      setCoinsLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupon: couponCode.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Coupon applied");
      setCouponCode("");
      await fetchCart();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <section className="w-full bg-gray-100 mb-16 lg:mb-40">
      <div className="container lg:pt-20 pt-10 relative">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Section */}
          <div className="lg:w-2/3 w-full">
            {/* Choose Your Subscription Plan */}
            <div className="bg-white p-6 rounded-3xl mb-6 overflow-hidden">
              <h2 className="text-lg md:text-2xl font-semibold mb-2">
                Choose Your Subscription Plan
              </h2>
              <p className="text-gray-600 mb-7">
                Special discount for ordering 45 days
              </p>
              <div className="w-full">
                {plansLoading ? (
                  <div className="text-gray-500 py-4">Loading plans...</div>
                ) : plansError ? (
                  <div className="text-red-600 py-4">{plansError}</div>
                ) : plans.length === 0 ? (
                  <div className="text-gray-500 py-4">No plans available.</div>
                ) : (
                  <Swiper
                    spaceBetween={16}
                    slidesPerView={1.2}
                    breakpoints={{
                      640: { slidesPerView: 2.2 },
                      768: { slidesPerView: 3.2 },
                    }}
                    className="!overflow-visible"
                  >
                    {plans.map((plan: SubscriptionPlan) => (
                      <SwiperSlide key={plan._id}>
                        <label className="inline-flex items-center w-full">
                          <input
                            type="radio"
                            name="subscription"
                            value={plan._id}
                            checked={selectedPlanId === plan._id}
                            onChange={() => setSelectedPlanId(plan._id)}
                            className="peer hidden"
                          />
                          <span className="p-4 rounded-lg cursor-pointer w-full border bg-gray-100 border-gray-200 peer-checked:bg-primary/30 peer-checked:text-white transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                              <p className="text-dark font-medium">
                                {plan.name}
                              </p>
                            </div>
                            <div className="flex gap-3 items-center">
                              {plan.discount > 0 && (
                                <span className="text-dark font-medium">
                                  {plan.discount}% OFF
                                </span>
                              )}
                              <span className="text-primary font-medium">
                                {plan.months} Month{plan.months > 1 ? "s" : ""}
                              </span>
                            </div>
                          </span>
                        </label>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>

            {/* Product List */}
            <div>
              {cartLoading ? (
                <div className="text-gray-500 py-4">Loading cart...</div>
              ) : cartError ? (
                <div className="text-red-600 py-4">{cartError}</div>
              ) : !cart || cart.items.length === 0 ? (
                <div className="text-gray-500 py-4">Your cart is empty.</div>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-4 mb-4"
                  >
                    <Image
                      width={180}
                      height={180}
                      src={item.images && item.images.length > 0 ? item.images[0] : "/images/placeholder.svg"}
                      alt={item.name.en}
                      className="sm:size-[180px] size-24 object-cover rounded-lg bg-green-200"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-4 sm:items-center w-full sm:justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-1">
                          {item.name.en}
                        </h3>
                        <div className="flex items-center text-sm md:text-base">
                          {item.price.base_price !== item.price.final_price && (
                            <span className="text-gray-500 line-through mr-2">
                              ₹{item.price.base_price}
                            </span>
                          )}
                          <span className="text-lg font-bold text-green-600">
                            ₹{item.price.final_price}
                          </span>
                        </div>
                      </div>
                      <motion.div className="flex gap-4" layout>
                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="border border-red-600/40 size-[32px] text-red-600 hover:bg-red-50 rounded-md flex items-center justify-center cursor-pointer"
                          onClick={() => removeCartItem(item)}
                          disabled={cartLoading}
                          title="Remove"
                        >
                          <Trash2 size={20} />
                        </motion.button>

                        {/* Quantity Selector */}
                        <motion.div
                          className="flex items-center border border-gray-300 rounded-md w-fit overflow-hidden"
                          layout
                        >
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            className="px-3 py-1 text-gray-600 "
                            onClick={() =>
                              updateCartItem(item, item.quantity - 1)
                            }
                            disabled={cartLoading || item.quantity <= 1}
                          >
                            -
                          </motion.button>
                          <span className="px-3 py-1 border-l border-r border-gray-300 select-none">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            className="px-3 py-1 text-gray-600 "
                            onClick={() =>
                              updateCartItem(item, item.quantity + 1)
                            }
                            disabled={cartLoading}
                          >
                            +
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/3 w-full">
            {/* Offers & Benefits */}
            <div className="mb-6">
              <h2 className="text-lg md:text-2xl font-semibold mb-4">
                Offers & Benefits
              </h2>
              <div className="mb-4">
                <div className="flex border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <input
                    type="text"
                    id="couponCode"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="appearance-none focus:outline-none w-full"
                    placeholder="Enter Coupon Code"
                  />
                  <button
                    className="ml-2 bg-transparant hover:bg-primary/20 text-primary font-medium py-2 px-4 rounded transition-all duration-300"
                    onClick={applyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div
                onClick={coinsLoading ? undefined : handleToggleCoins}
                className={`flex items-center cursor-pointer p-4 rounded-lg gap-4 transition-all duration-200 
        ${
          cart?.use_coins
            ? "bg-green-50 border-green-500"
            : "bg-white border-gray-200"
        } border ${coinsLoading ? "opacity-60 pointer-events-none" : ""}`}
              >
                <Image
                  width={32}
                  height={32}
                  src="/images/icon/hilop-coin.svg"
                  alt="Hilop Coins"
                />
                <div>
                  <h3 className="text-gray-900">Apply Hilop Coins</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {cart
                      ? `You have ${cart.available_coins.toLocaleString()} coins available${cart.coin_discount > 0 ? ", giving you a discount of ₹" + cart.coin_discount : ""}!`
                      : "Loading coins..."}
                  </p>
                </div>
                <div className="ml-auto pointer-events-none">
                  <input
                     type="checkbox"
                     checked={cart?.use_coins ?? false}
                     readOnly
                    className="accent-primary peer focus:shadow-outline relative inline-block h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="">
              <h2 className="text-lg md:text-2xl font-semibold mb-4">
                Order Summary
              </h2>
              {cart && (
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total MRP ({cart.item_count} item{cart.item_count > 1 ? "s" : ""})</span>
                    <span className="font-medium text-lg">
                      ₹{cart.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Discount from Coins</span>
                    <span className="text-green-500 text-lg">
                      -₹{cart.coin_discount ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">
                      Subscription Discount
                    </span>
                    <span className="text-green-500 text-lg">
                      {cart.selected_plan && cart.selected_plan.discount > 0
                        ? `-₹${Math.round((cart.subtotal * cart.selected_plan.discount) / 100)}`
                        : "-₹0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-500 text-lg">
                      -₹{cart.coupon_discount ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-500 text-lg">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-2 mt-2 items-center">
                    <span>Total</span>
                    <span>₹{cart.total_price}</span>
                  </div>
                  {cart.selected_plan && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                      <span className="font-medium text-primary">Selected Plan:</span> {cart.selected_plan.name} ({cart.selected_plan.months} month{cart.selected_plan.months > 1 ? "s" : ""})
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Fixed Bottom Bar */}
      <div className="fixed z-50 bottom-0 left-0 w-full bg-white gap-2 md:gap-4 border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-end items-center lg:px-20 px-4">
        <div className="flex items-center">
          {cart && (
            <>
              <span className="text-xl md:text-2xl font-bold text-green-600 mr-2">
                ₹{cart.total_price}
              </span>
              <span className="text-gray-500 line-through">
                {" "}
                ₹{cart.subtotal}
              </span>
            </>
          )}
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
