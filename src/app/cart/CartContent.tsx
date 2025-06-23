"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
  const [checked, setChecked] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartData | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      setPlansError(null);
      try {
        const res = await fetch("http://3.110.216.61/api/v1/plans", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`);
        const data = await res.json();
        if (!data.success || !Array.isArray(data.data))
          throw new Error("Invalid plans response");
        setPlans(data.data.filter((plan: SubscriptionPlan) => plan.is_active));
        if (data.data.length > 0) setSelectedPlanId(data.data[0]._id);
      } catch (err) {
        setPlansError(
          err instanceof Error ? err.message : "Failed to load plans"
        );
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    setCartLoading(true);

    setCartError(null);
    try {
      const res = await fetch("/api/cart", { method: "GET" });
      if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.data || !Array.isArray(data.data.items))
        throw new Error("Invalid cart response");
      setCart(data.data);
    } catch (err) {
      setCartError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Cart item update handlers
  const updateCartItem = async (item: CartProduct, newQty: number) => {
    if (newQty < 1) return;
    // Optimistically update local cart state (including subtotal and total_price)
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.map((cartItem) =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: newQty, item_total: cartItem.price.final_price * newQty }
          : cartItem
      );
      // Calculate new subtotal
      const newSubtotal = updatedItems.reduce((sum, cartItem) => sum + (cartItem.price.final_price * cartItem.quantity), 0);
      // Recalculate discounts and total_price
      const couponDiscount = prevCart.coupon_discount || 0;
      const coinDiscount = prevCart.coin_discount || 0;
      const totalPrice = Math.max(newSubtotal - couponDiscount - coinDiscount, 0);
      return {
        ...prevCart,
        items: updatedItems,
        subtotal: newSubtotal,
        total_price: totalPrice,
      };
    });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: newQty,
          months_quantity: item.months_quantity,
        }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      // Optionally, you can re-fetch the cart here to ensure consistency
      // await fetchCart();
    } catch (err) {
      // Rollback local state if API fails
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.items.map((cartItem) =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: item.quantity, item_total: cartItem.price.final_price * item.quantity }
            : cartItem
        );
        // Recalculate subtotal and total_price
        const newSubtotal = updatedItems.reduce((sum, cartItem) => sum + (cartItem.price.final_price * cartItem.quantity), 0);
        const couponDiscount = prevCart.coupon_discount || 0;
        const coinDiscount = prevCart.coin_discount || 0;
        const totalPrice = Math.max(newSubtotal - couponDiscount - coinDiscount, 0);
        return {
          ...prevCart,
          items: updatedItems,
          subtotal: newSubtotal,
          total_price: totalPrice,
        };
      });
      setCartError(
        err instanceof Error ? err.message : "Failed to update cart"
      );
    }
  };

  const removeCartItem = async (item: CartProduct) => {
    try {
      // setCartLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: 0,
          months_quantity: item.months_quantity,
        }),
      });
      if (!res.ok) throw new Error("Failed to remove item");
      await fetchCart();
    } catch (err) {
      setCartError(
        err instanceof Error ? err.message : "Failed to remove item"
      );
    } finally {
      setCartLoading(false);
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
                          <span className="p-4 rounded-lg cursor-pointer w-full border bg-gray-100 border-gray-200 peer-checked:bg-primary/20 peer-checked:text-white transition-colors">
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
                      src={item.images[0] || "/images/placeholder.svg"}
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
                  <p className="text-xs md:text-sm text-gray-600">
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
              {cart && (
                <div className="mt-8 bg-white rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-lg">
                      ₹{cart.subtotal}
                    </span>
                  </div>
                  {cart.coupon_discount > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="text-green-500 text-lg">
                        -₹{cart.coupon_discount}
                      </span>
                    </div>
                  )}
                  {cart.coin_discount > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Coin Discount</span>
                      <span className="text-green-500 text-lg">
                        -₹{cart.coin_discount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-2 mt-2 items-center">
                    <span>Total</span>
                    <span>₹{cart.total_price}</span>
                  </div>
                </div>
              )}
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
