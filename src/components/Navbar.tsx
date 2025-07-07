"use client";

import {
  Globe,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  MessageCircleQuestion,
  ShoppingBag,
  History,
} from "lucide-react";
import Link from "next/link";
import ArrowButton from "./uiFramework/ArrowButton";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCartCount } from "../store/cartSlice";
import type { User } from "@/types/auth";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { Dispatch, SetStateAction, RefObject } from "react";

const Navbar = () => {

  const [profileDropdownOpenDesktop, setProfileDropdownOpenDesktop] = useState(false);
  const [profileDropdownOpenMobile, setProfileDropdownOpenMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    isInitialized: languageInitialized,
  } = useLanguage();
  const cartCount = useAppSelector((state) => state.cart.count);
  const dispatch = useAppDispatch();
  const [cartLoading, setCartLoading] = useState<boolean>(false);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close profile dropdown when clicking outside (desktop only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 768 && profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpenDesktop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        dispatch(setCartCount(0));
        return;
      }

      setCartLoading(true);
      try {
        const res = await fetch("/api/cart/count", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch cart count");
        const data = await res.json();
        dispatch(setCartCount(data?.data?.count ?? 0));
      } catch {
        dispatch(setCartCount(0));
      } finally {
        setCartLoading(false);
      }
    };

    fetchCartCount();
  }, [user, dispatch]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  // Check if language toggle should be shown (only on product and prescription pages)
  const shouldShowLanguageToggle = () => {
    return pathname?.startsWith('/product/') || pathname === '/prescription';
  };

  // Subcomponent: LoginButton
  interface LoginButtonProps {
    className?: string;
    size?: "md" | "lg" | "sm" | "xl" | "2xl";
  }
  const LoginButton = ({ className = "", size = "lg" }: LoginButtonProps) => (
    <ArrowButton
      label="Login"
      theme="light"
      size={size}
      href="/auth/login"
      className={className}
    />
  );

  // Subcomponent: CartButton
  interface CartButtonProps {
    user: User | null;
    cartLoading: boolean;
    cartCount: number;
    size?: "md" | "lg" | "sm" | "xl" | "2xl";
    className?: string;
  }
  const CartButton = ({
    user,
    cartLoading,
    cartCount,
    size = "md",
    className = "",
  }: CartButtonProps) => {
    const badgeSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";
    return (
      <Link
        href="/cart"
        className={`relative rounded-full ${size === "lg" ? "size-[52px]" : "size-[40px]"} hover:bg-gray-200 flex justify-center transition-all duration-300 border border-gray-200 items-center ${className}`}
      >
        <ShoppingCart className={`text-dark ${size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
        {user && (cartLoading ? (
          <span className={`absolute -top-0.5 -right-0.5 bg-gray-300 text-white text-xs ${badgeSize} flex items-center justify-center rounded-full animate-pulse`}>
            ...
          </span>
        ) : cartCount > 0 ? (
          <span className={`absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs ${badgeSize} flex items-center justify-center rounded-full`}>
            {cartCount}
          </span>
        ) : null)}
      </Link>
    );
  };

  // Subcomponent: ProfileDropdown
  interface ProfileDropdownProps {
    user: User;
    open: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    logout: () => void;
    router: AppRouterInstance;
    isMobile?: boolean;
    profileRef?: RefObject<HTMLDivElement | null>;
  }
  const ProfileDropdown = ({
    user,
    open,
    onClose,
    logout,
    router,
    isMobile = false,
    profileRef,
  }: ProfileDropdownProps) => {
    const imageSize = isMobile ? 46 : 56;
    const buttonSize = isMobile ? "size-[46px]" : "size-[54px]";
    const nameClass = isMobile ? "text-lg" : "text-xl";
    return (
      <div className={`relative ${isMobile ? "md:hidden" : "hidden md:block"}`} ref={isMobile ? undefined : profileRef}>
        <button
          className={`${buttonSize} rounded-full bg-dark overflow-hidden focus:outline-none border border-gray-800 focus:border-green-800 cursor-pointer`}
          onClick={() => onClose((prev: boolean) => !prev)}
        >
          {user.profile_image ? (
            <Image
              src={user.profile_image}
              alt={`${user.name}'s profile`}
              width={imageSize}
              height={imageSize}
              className="rounded-full h-full w-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 ${nameClass}`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-300 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-dark">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Image
                    src="/images/icon/hilop-coin.svg"
                    alt="Hilop Coins"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <p className="text-sm text-green-800">
                    {(user.hilop_coins ?? 0).toLocaleString()} Hilop Coins
                  </p>
                </div>
              </div>
               {/* Profile Menu Items - now rendered via a loop for maintainability */}
              { [
                {
                  href: "/profile",
                  icon: <UserIcon className="mr-3 h-4 w-4" />,
                  label: "Profile",
                },
                {
                  href: "/my-order",
                  icon: <History className="mr-3 h-4 w-4" />,
                  label: "Orders",
                },
                {
                  href: "/cart",
                  icon: <ShoppingBag className="mr-3 h-4 w-4" />,
                  label: "Cart",
                },
                {
                  href: "/support",
                  icon: <MessageCircleQuestion className="mr-3 h-4 w-4" />,
                  label: "Support",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100"
                  onClick={() => onClose(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-300"></div>
              <button
                className="flex items-center w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={() => {
                  logout();
                  onClose(false);
                  setTimeout(() => {
                    router.push("/");
                  }, 2000);
                }}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Show loading skeleton until everything is initialized
  if (!mounted || !isInitialized || !languageInitialized) {
    return (
      <header className="sticky top-0 w-full border-b border-gray-200 bg-white z-50">
        <div className="container py-3 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Hilop logo"
              width={100}
              height={40}
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-[52px] w-[120px] bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="container py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Hilop logo"
            width={100}
            height={40}
            priority
          />
        </Link>

       

        {/* Right Side Desktop */}
        <div className="flex items-center gap-4">
          {/* Language Toggle and Cart */}
          <div className="md:flex gap-4 relative hidden">
            {shouldShowLanguageToggle() && (
              <button
                onClick={toggleLanguage}
                className="relative gap-2 h-[52px] flex justify-center items-center overflow-hidden hover:opacity-60"
              >
                <Globe className="w-5 h-5 text-dark" />
                <div className="relative w-[60px] h-[24px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={language}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-0 w-full text-center"
                    >
                      {language === "en" ? "English" : "हिंदी"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </button>
            )}

            <CartButton user={user} cartLoading={cartLoading} cartCount={cartCount} size="lg" />
          </div>

          {/* Mobile Cart and Language */}
          <div className="flex md:hidden gap-3">
            {shouldShowLanguageToggle() && (
              <button
                onClick={toggleLanguage}
                className="relative gap-2 h-[40px] flex justify-center items-center overflow-hidden hover:opacity-60"
              >
                <Globe className="w-4 h-4 text-dark" />
                <div className="relative w-[50px] h-[20px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={language}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-0 w-full text-center text-sm"
                    >
                      {language === "en" ? "EN" : "हिं"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </button>
            )}

            <CartButton user={user} cartLoading={cartLoading} cartCount={cartCount} size="sm" />
          </div>

          {/* Login/Profile */}
          {isLoading ? (
            <div className="hidden md:flex gap-4">
              <div className="h-[52px] w-[120px] bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <>
              {!user ? (
                <>
                  <div className="hidden md:flex gap-4">
                    <LoginButton />
                  </div>
                  <div className="md:hidden">
                    <LoginButton />
                  </div>
                </>
              ) : (
                <>
                  <ProfileDropdown
                    user={user}
                    open={profileDropdownOpenDesktop}
                    onClose={setProfileDropdownOpenDesktop}
                    logout={logout}
                    router={router}
                    isMobile={false}
                    profileRef={profileRef}
                  />
                  <ProfileDropdown
                    user={user}
                    open={profileDropdownOpenMobile}
                    onClose={setProfileDropdownOpenMobile}
                    logout={logout}
                    router={router}
                    isMobile={true}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>


    </header>
  );
};

export default Navbar;
