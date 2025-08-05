"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/utils/getText";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import AddresssModal from "@/components/model/Address";
import Button from "@/components/uiFramework/Button";
import PaymentOption from "@/components/model/PaymentOption";
import CheckoutLoginModal from "@/components/model/CheckoutLoginModal";
import { setCartCount } from "@/store/cartSlice";
import { useDispatch } from "react-redux";
import OrderSuccessful from "@/components/model/OrderSuccessful";

// Add Razorpay type declaration for TypeScript
declare global {
  interface Window {
    Razorpay: unknown;
  }
}

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
interface EligibleItem {
  product_id: string;
  name: {
    en: string;
    hi: string;
  };
  quantity_in_cart: number;
  quantity_needed: number;
  quantity_used: number;
  item_subtotal: number;
}
interface CartPlan {
  _id: string;
  name: string;
  months: number;
  discount: number;
  discount_type: "fixed" | "percentage";
  eligible_subtotal: number;
  discount_amount: number;
  eligible_items: EligibleItem[];
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
  available_plans: CartPlan[];
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

// Utility to load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Define Address type for address banner
interface Address {
  _id: string;
  name: string;
  address: string;
  phone_number: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  is_default?: boolean;
}

// Payment Success Modal (move outside Cart to avoid variable shadowing)
type OrderSummary = {
  _id?: string;
  order_id?: string;
  order_number?: string;
  total?: number;
  total_amount?: number;
  status?: string;
};

// interface PaymentSuccessModalProps {
//   src: string;
//   title: string;
//   description: string;
//   show: boolean;
//   orderSummary: OrderSummary | null;
//   onClose: () => void;
// }

// const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
//   src,
//   title,
//   description,
//   show,
//   orderSummary,
//   onClose,
// }) => {
//   if (!show) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center flex flex-col items-center justify-center">
//         <div className="mb-4">
//           <Image
//             src={src}
//             width={64}
//             height={64}
//             alt="Success"
//             className="mx-auto mb-2"
//           />
//           <h2 className="text-2xl font-bold text-green-700 mb-2">
//             {title}
//           </h2>
//           <p className="text-gray-700 mb-2">
//             {description}
//           </p>
//         </div>
//         {orderSummary && (
//           <div className="mb-4 text-left bg-gray-50 rounded-lg p-4">
//             <h3 className="font-semibold mb-2">Order Summary</h3>
//             <div className="text-sm text-gray-800">
//               <div>
//                 <b>Order ID:</b> {orderSummary._id || orderSummary.order_id}
//               </div>
//               <div>
//                 <b>Order Number:</b> {orderSummary.order_number}
//               </div>
//               <div>
//                 <b>Total:</b> ₹
//                 {orderSummary.total?.toFixed(2) || orderSummary.total_amount}
//               </div>
//               <div>
//                 <b>Status:</b> {orderSummary.status}
//               </div>
//             </div>
//           </div>
//         )}
//         <Button
//           label="Go to My Orders"
//           variant="btn-dark"
//           size="xl"
//           className="w-full mt-2"
//           onClick={onClose}
//         />
//       </div>
//     </div>
//   );
// };

// Utility function to scroll to top
const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

export default function Cart() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartData | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  // const [addError, setAddError] = useState<string | null>(null);
  const [planSuccess, setPlanSuccess] = useState<string | null>(null);
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
  const [addNowLoading, setAddNowLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [PaymentOptionModelOpen, setPaymentOptionModelOpen] = useState(false);
  const [checkoutLoginModalOpen, setCheckoutLoginModalOpen] = useState(false);
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  // Address state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  // Address modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  // Address error state
  const [addressError, setAddressError] = useState("");

  // State for payment confirmation modal
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [lastOrderSummary, setLastOrderSummary] = useState<OrderSummary | null>(
    null
  );
  const [orderSuccessTitle, setOrderSuccessTitle] = useState<string>(
    "Payment Successful!"
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const COUPON_API_URL = "/api/coupons";

  // // Debug: Log Razorpay Key to verify environment variable is set
  // console.log("Razorpay Key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  // Move fetchCart above handlePlanSelection so it can be used in its dependency array
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
        if (data.data.plan) {
          setSelectedPlanId(data.data.plan._id);
          return { ...data.data };
        } else if (prev && prev.selected_plan) {
          return { ...data.data, selected_plan: prev.selected_plan };
        } else {
          return { ...data.data };
        }
      });
      const totalQuantity = data?.data?.items?.reduce(
        (acc: number, item: CartProduct) => acc + (item.quantity || 0),
        0
      );
      dispatch(setCartCount(totalQuantity));
      setAppliedCoupon(data.data.coupon || null);
    } catch (err) {
      setCartError((err as Error).message);
    } finally {
      setCartLoading(false);
    }
  }, [dispatch]);

  // Move handlePlanSelection above the useEffect that uses it and wrap in useCallback
  const handlePlanSelection = useCallback(
    async (planId: string) => {
      if (planId === selectedPlanId || planLoading) return;

      setPlanLoading(true);
      setPlanError(null);
      setPlanSuccess(null);
      try {
        // 1. Update the plan in the backend (for logged-in users)
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
        // 2. Update all cart items' quantity to match plan months
        if (cart && cart.items.length > 0) {
          const _plan = cart.available_plans?.find((p) => p._id === planId);
          const eligibleProductMap: Record<string, number> = {};
          if (_plan) {
            _plan.eligible_items?.forEach((item: EligibleItem) => {
              eligibleProductMap[item.product_id] = item.quantity_needed;
            });
          }
        }
        // 3. Refresh cart
        await fetchCart();
        setPlanSuccess("Plan and quantities updated");
        setPlanError(null);
      } catch (err) {
        setPlanError(
          err instanceof Error ? err.message : "Failed to update plan"
        );
        setPlanSuccess(null);
      } finally {
        setPlanLoading(false);
      }
    },
    [selectedPlanId, planLoading, cart, fetchCart]
  );

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
  }, [API_URL, cart?.items?.length]);

  // On mount, if redirected from login, restore selected plan from localStorage
  useEffect(() => {
    // Restore selected plan after login
    if (user && typeof window !== "undefined") {
      // 1. Merge guest cart into user cart if present
      const guestCartRaw = document.cookie
        .split("; ")
        .find((row) => row.startsWith("guestCart="));
      if (guestCartRaw) {
        try {
          const guestCart = JSON.parse(
            decodeURIComponent(guestCartRaw.split("=")[1])
          );
          if (Array.isArray(guestCart) && guestCart.length > 0) {
            // For each item in guest cart, add to user cart
            Promise.all(
              guestCart.map(async (item) => {
                await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    months_quantity: item.months_quantity ?? 1,
                  }),
                  credentials: "include",
                });
              })
            ).then(() => {
              // Clear guest cart cookie
              document.cookie =
                "guestCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              fetchCart();
            });
          }
        } catch {
          // Ignore parse errors
        }
      }
      // Restore selected plan after login
      const planId = localStorage.getItem("pendingPlanId");
      if (planId && planId !== selectedPlanId) {
        handlePlanSelection(planId);
        localStorage.removeItem("pendingPlanId");
      }
    }
    // For guests, restore selected plan from localStorage for UI
    if (!user && typeof window !== "undefined") {
      const planId = localStorage.getItem("pendingPlanId");
      if (planId && planId !== selectedPlanId) {
        setSelectedPlanId(planId);
      }
    }
  }, [user, handlePlanSelection, selectedPlanId, fetchCart]);

  // Always fetch cart when user changes (after login, logout, etc.)
  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

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
      // After removing, if cart is empty or plan is not valid, remove selected plan
      setCart((prev) => {
        if (!prev) return prev;
        const hasItems = prev.items && prev.items.length > 0;
        // If no items, remove selected_plan
        if (!hasItems) {
          setSelectedPlanId("");
          return { ...prev, selected_plan: null };
        }
        // Optionally: If plan is not valid for remaining items, also remove it
        // (You can add more logic here if needed)
        return prev;
      });
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
  // Get the selected plan object (works for both guests and logged-in users)
  let selectedPlan: CartPlan | null = null;
  let subscriptionDiscount = 0;
  if (cart && cart.selected_plan?.discount && cart.selected_plan.discount > 0) {
    // Always use backend discount if present
    subscriptionDiscount = Math.round(
      (cart.subtotal * cart.selected_plan.discount) / 100
    );
    // Try to match the plan for display purposes
    selectedPlan =
      cart.available_plans?.find((p) => p._id === cart.selected_plan?._id) ||
      null;
  } else if (selectedPlanId) {
    selectedPlan =
      cart?.available_plans?.find((p) => p._id === selectedPlanId) || null;
    if (selectedPlan && selectedPlan.discount > 0) {
      subscriptionDiscount = Math.round(
        ((cart?.subtotal || 0) * selectedPlan.discount) / 100
      );
    }
  }

  // Final total calculation for both guests and logged-in users
  const finalTotal = cart
    ? cart.subtotal -
      (cart.coin_discount ?? 0) -
      subscriptionDiscount -
      (cart.coupon_discount ?? 0)
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

  const handlePlanClick = async (planId: string) => {
    if (planId === selectedPlanId || planLoading) return;
    setPlanError(null);
    setPlanSuccess(null);
    const plan = cart?.available_plans?.find((p) => p._id === planId);
    const months = plan ? plan.months : 1;
    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingPlanId", planId);
        setSelectedPlanId(planId);
        // For guests: update guest cart quantities in cookie/localStorage
        // Fetch guest cart from API, update, and set
        try {
          const res = await fetch("/api/cart");
          const data = await res.json();
          if (data.success && data.data && Array.isArray(data.data.items)) {
            await Promise.all(
              data.data.items.map(async (item: CartProduct) => {
                if (item.quantity !== months) {
                  await fetch(`/api/cart/${item.product_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      quantity: months,
                      months_quantity: months,
                    }),
                  });
                }
              })
            );
            await fetchCart();
            setPlanSuccess("Plan and quantities updated");
            setPlanError(null);
          }
        } catch {
          setPlanError("Failed to update guest cart quantities");
          setPlanSuccess(null);
        }
      }
      return;
    }
    // For logged-in users
    await handlePlanSelection(planId);
  };

  // Determine if only BoldRise is in the cart
  const isOnlyBoldRise =
    cart &&
    cart.items.length === 1 &&
    cart.items[0].name &&
    (cart.items[0].name.en?.toLowerCase() === "boldrise" ||
      cart.items[0].name.hi?.toLowerCase() === "boldrise");

  // Helper to extract pincode (zipcode) from address
  const getPincode = (address: Address | null) =>
    address && address.zipcode ? address.zipcode : "------";

  // Helper to format phone number
  const formatPhone = (phone: string) => {
    if (!phone) return "";
    if (phone.startsWith("+")) return phone;
    if (phone.startsWith("91") && phone.length === 12) return "+" + phone;
    if (phone.length === 10) return "+91 " + phone;
    return phone;
  };

  // After closing the modal, refetch addresses
  const handleAddressModalClose = () => {
    setAddressModalOpen(false);
    setAddressError(""); // Clear error when closing modal
    // Refetch addresses to update selected address
    if (user) {
      fetchAddresses();
    }
  };

  // Move fetchAddresses out of useEffect so it can be called from handleAddressModalClose
  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/v1/addresses", { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const def =
          data.data.find((a: Address) => a.is_default) || data.data[0];
        setSelectedAddress(def);
      } else {
        setSelectedAddress(null);
      }
    } finally {
      // setAddressLoading(false); // Removed as per edit hint
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [user, fetchAddresses]);

  // Payment modal handlers
  const handleOnlinePayment = async () => {
    setCheckoutLoading(true);
    try {
      if (!user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("redirectAfterLogin", "/cart");
        }
        scrollToTop();
        return;
      }
      if (!cart || cart.items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      if (!selectedAddress || !selectedAddress._id) {
        // setAddError("No address selected. Please select a delivery address.");
        toast.error("No address selected. Please select a delivery address.");
        setCheckoutLoading(false);
        scrollToTop();
        return;
      }
      const address = selectedAddress;
      const paymentRequestData = {
        shipping_address_id: address._id,
        total_amount: finalTotal,
      };
      const paymentResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paymentRequestData),
      });
      const paymentData = await paymentResponse.json();
      if (paymentResponse.ok && paymentData.success) {
        // toast.success("Payment order created successfully!");
        const paymentInfo = paymentData.data || paymentData;
        const razorpayOrderId =
          paymentInfo.razorpay_order_id || paymentInfo.order_id;
        const amountPaise =
          paymentInfo.amount ||
          (typeof paymentInfo.total_amount === "number"
            ? paymentInfo.total_amount * 100
            : undefined);
        const razorpayKey =
          paymentInfo.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const currency = paymentInfo.currency || "INR";
        if (!amountPaise || !razorpayOrderId || !razorpayKey) {
          toast.error(
            "Payment gateway error: Missing order details. Please try again or contact support."
          );
          setCheckoutLoading(false);
          return;
        }
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || typeof window.Razorpay !== "function") {
          toast.error(
            "Failed to load Razorpay payment gateway. Please try again."
          );
          setCheckoutLoading(false);
          return;
        }
        const options = {
          key: razorpayKey,
          amount: amountPaise,
          currency,
          name: "Hilop",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              setCheckoutLoading(true);
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                const orderId =
                  verifyData.order_id ||
                  (verifyData.data && verifyData.data.order_id);
                let orderSummary: OrderSummary | null = null;
                if (orderId) {
                  try {
                    const orderRes = await fetch(`/api/orders/${orderId}`);
                    if (orderRes.ok) {
                      const orderData = await orderRes.json();
                      orderSummary = orderData.data || null;
                    }
                  } catch {}
                }
                setLastOrderSummary(orderSummary);
                setOrderSuccessTitle("Payment Successful!");
                setShowPaymentSuccess(true);
                await fetch("/api/cart", { credentials: "include" });
                await fetch("/api/orders", { credentials: "include" });
                setCheckoutLoading(false);
                setPaymentOptionModelOpen(false);
                return;
              } else {
                setCheckoutLoading(false);
                toast.error(
                  verifyData.message ||
                    "Payment verification failed. Please contact support."
                );
              }
            } catch {
              setCheckoutLoading(false);
              toast.error(
                "Payment verification failed. Please contact support."
              );
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.mobile_number || "",
          },
          theme: {
            color: "#0f5132",
          },
        };
        interface RazorpayInstance {
          open(): void;
        }
        const rzp = new (window.Razorpay as unknown as {
          new (options: Record<string, unknown>): RazorpayInstance;
        })(options);
        rzp.open();
        setCheckoutLoading(false);
        setPaymentOptionModelOpen(false);
        return;
      } else {
        toast.error(
          paymentData.message ||
            `Failed to create payment order (${paymentResponse.status})`
        );
      }
    } catch (error) {
      console.log("COD response status:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", "/cart");
      }
      router.push("/auth/login");
      return;
    }

    if (!selectedAddress || !selectedAddress._id) {
      // setAddError("No address selected. Please select a delivery address.");

      toast.error("No address selected. Please select a delivery address.");
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          shipping_address_id: selectedAddress._id,
          payment_method: "cod",
          notes: "Please call before delivery",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Order placed successfully with Cash on Delivery!");
        setPaymentOptionModelOpen(false);

        setLastOrderSummary(data.order);
        setOrderSuccessTitle("Order Successful!");
        setShowPaymentSuccess(true);
      } else {
        toast.error(data.message || "Failed to place COD order.");
      }
    } catch {
      toast.error("Failed to place COD order. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Hide planSuccess after 4 seconds
  useEffect(() => {
    if (planSuccess) {
      const timer = setTimeout(() => {
        setPlanSuccess(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [planSuccess]);

  return (
    <>
      <Toaster position="bottom-right" />
      {/* Address Banner - Green Gradient, prominent, with location illustration */}
      <div
        className="w-full bg-gradient-to-r from-green-50 to-green-100 border-b border-green-100 py-4 px-0 mb-6 cursor-pointer select-none"
        onClick={() => {
          setAddressError(""); // Clear error when opening modal
          if (user) {
            setAddressModalOpen(true);
          } else {
            if (typeof window !== "undefined") {
              localStorage.setItem("redirectAfterLogin", "/cart");
            }
            router.push("/auth/login");
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Change address"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setAddressError(""); // Clear error when opening modal
            if (user) {
              setAddressModalOpen(true);
            } else {
              if (typeof window !== "undefined") {
                localStorage.setItem("redirectAfterLogin", "/cart");
              }
              router.push("/auth/login");
            }
          }
        }}
      >
        <div className="container flex items-center gap-4 relative min-h-[64px]">
          {/* Illustration */}
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 md:h-16 md:w-16">
            <Image
              src="/images/adresss.svg"
              alt="Address Banner"
              width={64}
              height={64}
              className="object-contain h-12 w-12 md:h-16 md:w-16"
            />
          </div>
          {/* Address Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-dark text-base md:text-lg">
                Deliver to : {getPincode(selectedAddress)}
              </span>
            </div>
            {selectedAddress && (
              <div className="text-dark font-semibold text-sm md:text-base mb-0.5">
                {selectedAddress.name}
              </div>
            )}
            <div className="text-gray-700 text-sm md:text-base truncate">
              {selectedAddress
                ? selectedAddress.address
                : "No address found. Please add a delivery address."}
              {selectedAddress &&
                selectedAddress.city &&
                ", " + selectedAddress.city}
              {selectedAddress &&
                selectedAddress.state &&
                ", " + selectedAddress.state}
            </div>
            {selectedAddress && (
              <div className="text-gray-500 text-xs md:text-sm mt-0.5">
                {formatPhone(selectedAddress.phone_number)}
              </div>
            )}
            {/* Address error message */}
            {addressError && (
              <div className="text-red-600 text-xs md:text-sm mt-1 font-semibold">
                Please add your street address, city, and ZIP code.
              </div>
            )}
          </div>
          {/* Dropdown/Caret for address selection */}
          <button
            className="ml-2 bg-green-200 hover:bg-green-300 cursor-pointer rounded-full p-1 flex items-center justify-center transition-colors"
            style={{ minWidth: 32, minHeight: 32 }}
            aria-label="Change address"
            tabIndex={0}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setAddressError(""); // Clear error when opening modal
              if (user) {
                setAddressModalOpen(true);
              } else {
                if (typeof window !== "undefined") {
                  localStorage.setItem("redirectAfterLogin", "/cart");
                }
                router.push("/auth/login");
              }
            }}
          >
            <ChevronDown className="text-green-700 w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Address Modal */}
      <AddresssModal
        isOpen={addressModalOpen}
        onClose={handleAddressModalClose}
      />
      <section className="w-full bg-gray-100 mb-16 lg:mb-40">
        <div className="container   relative">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Section */}
            <div
              className={`w-full ${
                cart && cart.items.length > 0 ? "lg:w-2/3" : ""
              }`}
            >
              {/* Choose Your Subscription Plan */}
              {!isOnlyBoldRise && cart && cart.items.length > 0 && (
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
                        {cart?.available_plans?.map((plan: CartPlan) => (
                          <SwiperSlide key={plan._id}>
                            <div
                              className={`p-4 rounded-lg w-full border bg-gray-100 border-gray-200 transition-colors cursor-pointer ${
                                planLoading
                                  ? "opacity-60 pointer-events-none"
                                  : ""
                              } hover:bg-primary/10 ${
                                selectedPlanId === plan._id
                                  ? "bg-green-50 border-green-500"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!planLoading) {
                                  handlePlanClick(plan._id);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  if (!planLoading) {
                                    handlePlanClick(plan._id);
                                  }
                                }
                              }}
                              tabIndex={0}
                              role="button"
                              aria-label={`Select ${getText(
                                plan.name,
                                language
                              )} plan`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                {/* Add radio button here */}
                                <input
                                  type="radio"
                                  name="plan"
                                  checked={selectedPlanId === plan._id}
                                  onChange={() => handlePlanClick(plan._id)}
                                  disabled={planLoading}
                                  className="accent-dark cursor-pointer h-4 w-4"
                                  aria-label={`Select ${getText(
                                    plan.name,
                                    language
                                  )} plan`}
                                />
                                <p className="text-dark font-medium">
                                  {getText(plan.name, language)}
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
                                  ₹
                                  {formatPrice(
                                    Math.round(
                                      plan.eligible_subtotal -
                                        plan.discount_amount
                                    )
                                  )}
                                </span>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </div>

                  {/* Plan Error Display */}
                  {planError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm">{planError}</p>
                    </div>
                  )}
                  {planSuccess && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-700 text-sm">{planSuccess}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                {cartLoading ? (
                  <div className="text-gray-500 py-4">Loading cart...</div>
                ) : cartError ? (
                  <div className="text-red-600 py-4">{cartError}</div>
                ) : !cart || cart.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full min-h-[300px]">
                    <span className="text-2xl md:text-3xl font-bold text-[#111] text-center w-full">
                      Your cart is empty.
                    </span>
                    {/* Buy Again section should be directly below, no gap */}
                    {purchasedLoading ? (
                      <div className="text-gray-500 py-4 text-center w-full">
                        Loading purchased products...
                      </div>
                    ) : buyAgainProducts.length > 0 ? (
                      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 p-3 sm:p-4 md:p-6 mt-6 w-full max-w-md mx-auto">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 pb-2 border-b border-gray-200 text-center">
                          Buy Again
                        </h3>
                        <div className="flex flex-col gap-3 sm:gap-4 w-full">
                          {buyAgainProducts.map((item, idx) => (
                            <div
                              key={item._id + "-" + idx}
                              className="flex flex-row items-center gap-3 sm:gap-4 md:gap-6 border-b last:border-0 border-gray-200 pb-3 sm:pb-4 last:pb-0 w-full"
                            >
                              <Image
                                src={item.image}
                                alt={getText(item.name, language)}
                                width={80}
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg bg-gray-200 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm sm:text-base md:text-lg font-semibold text-green-900 mb-1 truncate"
                                  title={getText(item.name, language)}
                                >
                                  {getText(item.name, language)}
                                </p>
                                {item.orderDate && (
                                  <p className="text-xs sm:text-sm text-gray-500 leading-tight truncate">
                                    Last ordered:{" "}
                                    {new Date(
                                      item.orderDate
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex-shrink-0 ml-2">
                                <Button
                                  label={
                                    addNowLoading[item._id]
                                      ? "Adding..."
                                      : "+ Add Now"
                                  }
                                  variant="btn-primary"
                                  size="sm"
                                  className="min-w-[90px] sm:min-w-[110px] text-xs sm:text-sm"
                                  onClick={() => {
                                    if (!user) {
                                      router.push("/auth/login");
                                      return;
                                    }
                                    handleAddPurchasedProductToCart(item._id);
                                  }}
                                  disabled={!!addNowLoading[item._id]}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  cart.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center gap-4 mb-4"
                    >
                      <Image
                        width={180}
                        height={180}
                        // Always show placeholder if no product image is available
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
                              className="px-3 py-1 text-gray-600 cursor-pointer"
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
                              className="px-3 py-1 text-gray-600 cursor-pointer"
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

              {/* Buy Again Section (only show if cart is NOT empty) */}
              {cart &&
                cart.items.length > 0 &&
                !cartLoading &&
                !cartError &&
                (purchasedLoading ? (
                  <div className="text-gray-500 py-4 text-center">
                    Loading purchased products...
                  </div>
                ) : buyAgainProducts.length > 0 ? (
                  <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 p-3 sm:p-4 md:p-6 mt-4 sm:mt-6 md:mt-8 max-w-xl mx-auto">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 pb-2 border-b border-gray-200 text-center">
                      Buy Again
                    </h3>
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {buyAgainProducts.map((item, idx) => (
                        <div
                          key={item._id + "-" + idx}
                          className="flex flex-row items-center gap-3 sm:gap-4 md:gap-6 border-b last:border-0 border-gray-200 pb-3 sm:pb-4 last:pb-0"
                        >
                          <Image
                            src={item.image}
                            alt={getText(item.name, language)}
                            width={80}
                            height={80}
                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg bg-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-2">
                            <p
                              className="text-sm sm:text-base md:text-lg font-semibold text-green-900 mb-1 truncate"
                              title={getText(item.name, language)}
                            >
                              {getText(item.name, language)}
                            </p>
                            {item.orderDate && (
                              <p className="text-xs sm:text-sm text-gray-500 leading-tight truncate">
                                Last ordered:{" "}
                                {new Date(item.orderDate).toLocaleDateString()}
                              </p>
                            )}

                            <div className="flex-shrink-0 ml-2">
                              <Button
                                label={
                                  addNowLoading[item._id]
                                    ? "Adding..."
                                    : "+ Add Now"
                                }
                                variant="btn-primary"
                                size="sm"
                                className="min-w-[90px] sm:min-w-[110px] text-xs sm:text-sm"
                                onClick={() => {
                                  if (!user) {
                                    router.push("/auth/login");
                                    return;
                                  }
                                  handleAddPurchasedProductToCart(item._id);
                                }}
                                disabled={!!addNowLoading[item._id]}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null)}
            </div>

            {/* Right Section: Only show if cart has items */}
            {cart && cart.items.length > 0 && (
              <div className="lg:w-1/3 w-full">
                {/* Offers & Benefits */}
                {cart && cart.items.length > 0 && (
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
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div>
                            <div className="font-medium text-primary">
                              {appliedCoupon.code}
                            </div>
                            <div className="text-sm text-gray-600">
                              Discount: ₹{formatPrice(couponDiscount)}
                            </div>
                          </div>
                          <button
                            onClick={removeCoupon}
                            disabled={couponLoading}
                            className="px-3 py-1 cursor-pointer  text-red-500 text-sm rounded  disabled:opacity-50 transition-colors"
                          >
                            {couponLoading ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Coupon Input */}
                    {!appliedCoupon && (
                      <div className="mb-4">
                        <div className="flex border border-gray-200 bg-white rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
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
                            className="ml-2 bg-transparant hover:bg-primary/20 text-primary font-medium py-2 px-4 rounded transition-all duration-300 disabled:opacity-50 cursor-pointer"
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

                    {/* Hilop Coins - Only show when user has coins */}
                    {cart && cart.available_coins > 0 && (
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
                    )}
                  </div>
                )}

                {/* Order Summary */}
                {cart && cart.items.length > 0 && (
                  <div className="">
                    <h2 className="text-lg md:text-2xl font-semibold mb-4">
                      Order Summary
                    </h2>
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
                        <span className="text-gray-600">
                          Discount from Coins
                        </span>
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
                      {selectedPlan && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                          <span className="font-medium text-primary">
                            Selected Plan:
                          </span>{" "}
                          ₹
                          {formatPrice(
                            Math.round(
                              selectedPlan.eligible_subtotal -
                                selectedPlan.discount_amount
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Fixed Bottom Bar */}
      <div className="fixed z-50 bottom-0 left-0 w-full bg-white gap-2 md:gap-4 border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-end items-center lg:px-20 px-4">
        <div className="flex items-center">
          {cart && finalTotal > 0 && (
            <>
              <span className="text-xl md:text-2xl font-bold text-green-600 mr-2">
                ₹{formatPrice(finalTotal)}
              </span>
              {cart.subtotal > finalTotal && (
                <span className="text-gray-500 line-through">
                  ₹{formatPrice(cart.subtotal)}
                </span>
              )}
            </>
          )}
        </div>

        <ArrowButton
          label={checkoutLoading ? "Processing..." : "PLACE ORDER"}
          theme="dark"
          className="w-fit"
          isIcon={true}
          size="lg"
          onClick={() => {
            // Check if user is not logged in
            if (!user) {
              setCheckoutLoginModalOpen(true);
              return;
            }
            if (!selectedAddress || !selectedAddress._id) {
              setAddressError("Add Address First");

              scrollToTop();
              return;
            }

            setPaymentOptionModelOpen(true);
          }}
          disabled={checkoutLoading || !cart || cart.items.length === 0}
        />
      </div>

      <OrderSuccessful
        src="/images/icon/verify.svg"
        title={orderSuccessTitle}
        description="Your order has been placed successfully."
        show={showPaymentSuccess}
        orderSummary={lastOrderSummary}
        onClose={() => {
          setShowPaymentSuccess(false);
          window.location.href = "/my-order";
        }}
      />
      <PaymentOption
        isOpen={PaymentOptionModelOpen}
        onClose={() => setPaymentOptionModelOpen(false)}
        onOnlinePayment={handleOnlinePayment}
        onCashOnDelivery={handleCashOnDelivery}
        loading={checkoutLoading}
      />
      <CheckoutLoginModal
        isOpen={checkoutLoginModalOpen}
        onClose={() => setCheckoutLoginModalOpen(false)}
        // onGuestCheckout={handleGuestCheckout}
      />
    </>
  );
}
