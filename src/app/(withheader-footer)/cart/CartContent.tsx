"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import Button from "@/components/uiFramework/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/utils/getText";

interface SubscriptionPlan {
  _id: string;
  name: string;
  months: number;
  discount: number;
  discount_type: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
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

interface Coupon {
  code: string;
  discount_type: string;
  discount_value: number;
  discount_amount?: number; // Make it optional to be safe
}

interface PurchasedProduct {
  _id: string;
  name: { en: string; hi: string };
  image: string;
  orderId?: string;
  orderDate?: string;
  quantity?: number;
}

// Utility function to format numbers properly
const formatPrice = (price: number): string => {
  return Number(price.toFixed(2)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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
  const [planLoading, setPlanLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponErrorMessage, setCouponErrorMessage] = useState("");
  const [purchasedProducts, setPurchasedProducts] = useState<
    PurchasedProduct[]
  >([]);
  const [purchasedLoading, setPurchasedLoading] = useState(true);
  const [addNowLoading, setAddNowLoading] = useState<{ [key: string]: boolean }>({});
  const { language } = useLanguage();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const COUPON_API_URL = "/api/coupons";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_URL}/plans`);
        const data = await res.json();
        if (!data.success) throw new Error("Invalid response");
        const activePlans = data.data.filter(
          (p: SubscriptionPlan) => p.is_active
        );
        setPlans(activePlans);
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
      if (res.status === 401) {
        toast.error("Please log in first");
        setCartLoading(false);
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error("Invalid cart data");
      setCart((prev) => {
        if (data.data.selected_plan) {
          setSelectedPlanId(data.data.selected_plan.id);
          return { ...data.data };
        } else if (prev && prev.selected_plan) {
          return { ...data.data, selected_plan: prev.selected_plan };
        } else {
          return { ...data.data };
        }
      });
      setAppliedCoupon(data.data.coupon || null);
    } catch (err) {
      setCartError((err as Error).message);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handlePlanSelection = async (planId: string) => {
    if (planId === selectedPlanId || planLoading) return;

    setPlanLoading(true);
    try {
      const res = await fetch("/api/cart/plan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
      });
      if (res.status === 401) {
        toast.error("Please log in first");
        setPlanLoading(false);
        return;
      }
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update plan");
      }
      setSelectedPlanId(planId);
      setCart((prev) =>
        prev
          ? {
              ...prev,
              selected_plan: plans.find((p) => p._id === planId)
                ? {
                    id: planId,
                    name: plans.find((p) => p._id === planId)?.name || "",
                    months: plans.find((p) => p._id === planId)?.months || 0,
                    discount:
                      plans.find((p) => p._id === planId)?.discount || 0,
                    discount_type:
                      plans.find((p) => p._id === planId)?.discount_type || "",
                  }
                : null,
            }
          : prev
      );
      toast.success("Plan updated successfully");
      await fetchCart();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update plan");
      // Revert selection on error
      if (cart?.selected_plan) {
        setSelectedPlanId(cart.selected_plan.id);
      }
    } finally {
      setPlanLoading(false);
    }
  };

  const updateCartItem = async (item: CartProduct, newQty: number) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`/api/cart/${item.product_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: newQty,
          months_quantity: item.months_quantity,
        }),
      });
      if (res.status === 401) {
        toast.error("Please log in first");
        return;
      }
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
      if (res.status === 401) {
        toast.error("Please log in first");
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Item removed");
      await fetchCart();
    } catch {
      toast.error("An error occurred");
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
      if (res.status === 401) {
        toast.error("Please log in first");
        setCoinsLoading(false);
        return;
      }
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to update coins usage");
      toast.success(data.message || "Hilop coins updated");
      await fetchCart();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update coins usage"
      );
    } finally {
      setCoinsLoading(false);
    }
  };

  // Apply coupon
  const applyCoupon = async (codeToApply: string) => {
    if (!codeToApply.trim() || couponLoading) return;

    setCouponLoading(true);
    try {
      const res = await fetch(COUPON_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "apply", code: codeToApply.trim() }),
      });
      if (res.status === 401) {
        toast.error("Please log in first");
        setCouponLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.success) {
        setCouponErrorMessage(data.message || "");
        return;
      }
      setAppliedCoupon(data.data.coupon);
      setCouponCode(""); // Clear input on success
      toast.success(data.message);
      setCouponErrorMessage("");
      await fetchCart();
    } catch (err: unknown) {
      setCouponErrorMessage("");
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const removeCoupon = async () => {
    if (!appliedCoupon || couponLoading) return;
    setCouponLoading(true);
    try {
      const res = await fetch(COUPON_API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 401) {
        toast.error("Please log in first");
        setCouponLoading(false);
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAppliedCoupon(null);
      toast.success(data.message);
      setCouponErrorMessage("");
      await fetchCart();
    } catch (err: unknown) {
      setCouponErrorMessage("");
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  // Coupon discount from cart
  const couponDiscount =
    cart && cart.coupon_discount ? cart.coupon_discount : 0;
  // Subscription discount calculation
  const subscriptionDiscount =
    cart && cart.selected_plan && cart.selected_plan.discount > 0
      ? Math.round((cart.subtotal * cart.selected_plan.discount) / 100)
      : 0;
  // Final total calculation
  const finalTotal = cart
    ? cart.subtotal -
      (cart.coin_discount ?? 0) -
      subscriptionDiscount -
      couponDiscount
    : 0;

  // Fetch purchased products from new API
  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      setPurchasedLoading(true);
      try {
        const res = await fetch("/api/cart/purchased-products");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPurchasedProducts(data.data);
        } else {
          setPurchasedProducts([]);
        }
      } catch {
        setPurchasedProducts([]);
      } finally {
        setPurchasedLoading(false);
      }
    };
    fetchPurchasedProducts();
  }, []);

  // Add to cart handler for purchased products
  const handleAddPurchasedProductToCart = async (productId: string) => {
    setAddNowLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (response.status === 401) {
        toast.error("Please log in to add items to your cart.");
        return;
      }
      if (data.success) {
        toast.success(data.message || "Added to cart!");
        await fetchCart();
      } else {
        toast.error(data.message || "Failed to add to cart.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setAddNowLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Helper: Get product IDs currently in cart
  const cartProductIds = cart?.items.map((item) => item.product_id) || [];

  // Filter purchased products to only show those not in cart
  const buyAgainProducts = purchasedProducts.filter(
    (p) => !cartProductIds.includes(p._id)
  );

  return (
    <>
      <Toaster position="bottom-right" />
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
                    <div className="text-gray-500 py-4">
                      No plans available.
                    </div>
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
                          <label className="inline-flex items-center w-full group">
                            <input
                              type="radio"
                              name="subscription"
                              value={plan._id}
                              checked={selectedPlanId === plan._id}
                              onChange={() => handlePlanSelection(plan._id)}
                              className="peer sr-only"
                            />
                            <span
                              className={`p-4 rounded-lg cursor-pointer w-full border bg-gray-100 border-gray-200 transition-colors ${
                                planLoading
                                  ? "opacity-60 pointer-events-none"
                                  : ""
                              } hover:bg-primary/10 peer-checked:bg-green-50 peer-checked:border-green-500`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <p className="text-dark font-medium">
                                  {plan.name}
                                </p>
                                {planLoading && selectedPlanId === plan._id && (
                                  <div className="ml-auto">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-3 items-center">
                                {plan.discount > 0 && (
                                  <span className="text-dark font-medium">
                                    {plan.discount}% OFF
                                  </span>
                                )}
                                <span className="text-primary font-medium">
                                  {plan.months} Month
                                  {plan.months > 1 ? "s" : ""}
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
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0]
                            : "/images/placeholder.svg"
                        }
                        alt={item.name.en}
                        className="sm:size-[180px] size-24 object-cover rounded-lg bg-green-200"
                      />
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 sm:items-center w-full sm:justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold mb-1">
                            {item.name.en}
                          </h3>
                          <div className="flex items-center text-sm md:text-base">
                            {item.price.base_price !==
                              item.price.final_price && (
                              <span className="text-gray-500 line-through mr-2">
                                ₹{formatPrice(item.price.base_price)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-green-600">
                              ₹{formatPrice(item.price.final_price)}
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

              {/* Buy Again Section */}
              {purchasedLoading ? (
                <div className="text-gray-500 py-4">
                  Loading purchased products...
                </div>
              ) : buyAgainProducts.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 mt-8">
                  <h3 className="text-base font-semibold mb-4 pb-2 border-b border-gray-200">
                   Buy Again
                  </h3>
                  <div className="flex flex-col gap-4">
                    {buyAgainProducts.map((item, idx) => (
                      <div
                        key={item._id + "-" + idx}
                        className="flex items-center gap-6 border-b last:border-0 border-gray-200 pb-3 last:pb-0"
                      >
                        <Image
                          src={item.image}
                          alt={getText(item.name, language)}
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-lg bg-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-green-900 mb-1">
                            {getText(item.name, language)}
                          </p>
                        </div>
                        <Button
                          label={addNowLoading[item._id] ? "Adding..." : "+ Add Now"}
                          variant="btn-dark"
                          size="lg"
                          className="min-w-[120px]"
                          onClick={() => handleAddPurchasedProductToCart(item._id)}
                          disabled={!!addNowLoading[item._id]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Right Section */}
            <div className="lg:w-1/3 w-full">
              {/* Offers & Benefits */}
              <div className="mb-6">
                <h2 className="text-lg md:text-2xl font-semibold mb-4">
                  Offers & Benefits
                </h2>

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Applied Coupon
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <div className="font-medium text-blue-800">
                          {appliedCoupon.code}
                        </div>
                        <div className="text-sm text-blue-600">
                          Discount: ₹{formatPrice(couponDiscount)}
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        disabled={couponLoading}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {couponLoading ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon Input */}
                {!appliedCoupon && (
                  <div className="mb-4">
                    <div className="flex border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      <input
                        type="text"
                        id="couponCode"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponErrorMessage("");
                        }}
                        className="appearance-none focus:outline-none w-full"
                        placeholder="Enter Coupon Code"
                        disabled={couponLoading}
                      />
                      <button
                        className="ml-2 bg-transparant hover:bg-primary/20 text-primary font-medium py-2 px-4 rounded transition-all duration-300 disabled:opacity-50"
                        onClick={() => applyCoupon(couponCode)}
                        disabled={!couponCode.trim() || couponLoading}
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {couponErrorMessage && (
                      <div className="text-red-600 text-sm mt-2">
                        {couponErrorMessage}
                      </div>
                    )}
                  </div>
                )}

                {/* Hilop Coins */}
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
                        ? `You have ${cart.available_coins.toLocaleString()} coins available${
                            cart.coin_discount > 0
                              ? ", giving you a discount of ₹" +
                                formatPrice(cart.coin_discount)
                              : ""
                          }!`
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
                      <span className="text-gray-600">
                        Total MRP ({cart.item_count} item
                        {cart.item_count > 1 ? "s" : ""})
                      </span>
                      <span className="font-medium text-lg">
                        ₹{formatPrice(cart.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Discount from Coins</span>
                      <span className="text-green-500 text-lg">
                        -₹{formatPrice(cart.coin_discount ?? 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">
                        Subscription Discount
                      </span>
                      <span className="text-green-500 text-lg">
                        -₹{formatPrice(subscriptionDiscount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="text-green-500 text-lg">
                        -₹{formatPrice(couponDiscount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-500 text-lg">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-2 mt-2 items-center">
                      <span>Total</span>
                      <span>₹{formatPrice(finalTotal)}</span>
                    </div>
                    {cart.selected_plan && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <span className="font-medium text-primary">
                          Selected Plan:
                        </span>{" "}
                        {cart.selected_plan.name} ({cart.selected_plan.months}{" "}
                        month{cart.selected_plan.months > 1 ? "s" : ""})
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Fixed Bottom Bar */}
      <div className="fixed z-50 bottom-0 left-0 w-full bg-white gap-2 md:gap-4 border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-end items-center lg:px-20 px-4">
        <div className="flex items-center">
          {cart && (
            <>
              <span className="text-xl md:text-2xl font-bold text-green-600 mr-2">
                ₹{formatPrice(finalTotal)}
              </span>
              <span className="text-gray-500 line-through">
                {" "}
                ₹{formatPrice(cart.subtotal)}
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
    </>
  );
}
