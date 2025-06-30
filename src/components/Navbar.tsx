"use client";

import {
  Globe,
  ShoppingCart,
  Menu,
  X,
  User,
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
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCartCount } from "../store/cartSlice";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLoading, isInitialized } = useAuth();
  const router = useRouter();
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.toggle("overflow-hidden", mobileMenuOpen);
      return () => {
        if (typeof window !== "undefined") {
          document.body.classList.remove("overflow-hidden");
        }
      };
    }
  }, [mobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/about-us" className="hover:text-black">
            About us
          </Link>
          <Link href="/how-it-works" className="hover:text-black">
            How it works
          </Link>
          <Link href="/blog" className="hover:text-black">
            Blog
          </Link>
        </nav>

        {/* Right Side Desktop */}
        <div className="flex items-center gap-4">
          {/* Language Toggle and Cart */}
          <div className="md:flex gap-4 relative hidden">
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

            {user && (
              <Link
                href="/cart"
                className="relative rounded-full size-[52px] hover:bg-gray-200 flex justify-center transition-all duration-300 border border-gray-200 items-center "
              >
                <ShoppingCart className="w-5 h-5 text-dark" />
                {cartLoading ? (
                  <span className="absolute -top-0.5 -right-0.5 bg-gray-300 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    ...
                  </span>
                ) : cartCount > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            )}
          </div>

          {/* Login/Profile */}
          {isLoading ? (
            // Show loading skeleton instead of hiding content
            <div className="hidden md:flex gap-4">
              <div className="h-[52px] w-[120px] bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <>
              {!user ? (
                <div className="hidden md:flex gap-4">
                  <ArrowButton
                    label="Login"
                    theme="light"
                    size="lg"
                    href="/auth/login"
                  />
                </div>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    className="md:size-[54px] size-[46px] rounded-full bg-dark overflow-hidden focus:outline-none border border-gray-800 focus:border-green-800 cursor-pointer"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    {user.profile_image ? (
                      <Image
                        src={user.profile_image}
                        alt={`${user.name}'s profile`}
                        width={56}
                        height={56}
                        className="rounded-full h-full w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full text-xl flex items-center justify-center bg-gray-200 text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
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
                          {user.hilop_coins && (
                            <p className="text-sm text-green-800 mt-1">
                              {user.hilop_coins.toLocaleString()} Hilop Coins
                            </p>
                          )}
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/my-order"
                          className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <History className="mr-3 h-4 w-4" />
                          Orders
                        </Link>
                        <Link
                          href="/cart"
                          className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <ShoppingBag className="mr-3 h-4 w-4" />
                          Buy Again
                        </Link>
                        <Link
                          href="/support"
                          className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <MessageCircleQuestion className="mr-3 h-4 w-4" />
                          Support
                        </Link>
                        <div className="border-t border-gray-300"></div>
                        <button
                          className="flex items-center w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
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
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-green-800" />
          </button>
        </div>
      </div>

      {/* Mobile Offcanvas Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white z-50 shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/logo.svg" alt="Hilop logo" width={100} height={40} />
          </Link>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <nav className="flex flex-col gap-4 text-lg font-medium text-gray-700 mb-8">
            <Link
              href="/about-us"
              className="hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              About us
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="/blog"
              className="hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
          </nav>

          <div className="flex flex-col gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-black"
            >
              <Globe className="w-5 h-5" />
              {language === "en" ? "Hindi" : "English"}
            </button>

            {/* Cart */}
            {user && (
              <Link
                href="/cart"
                className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                Cart
              </Link>
            )}

            {/* Login/Profile */}
            {!user ? (
              <ArrowButton
                label="Login"
                theme="light"
                size="lg"
                href="/auth/login"
              />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="size-[46px] rounded-full bg-dark overflow-hidden">
                    {user.profile_image ? (
                      <Image
                        src={user.profile_image}
                        alt={`${user.name}'s profile`}
                        width={46}
                        height={46}
                        className="rounded-full h-full w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full text-xl flex items-center justify-center bg-gray-200 text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 text-lg font-medium text-gray-700 hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <Link
                  href="/my-order"
                  className="flex items-center gap-3 p-3 text-lg font-medium text-gray-700 hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <History className="w-5 h-5" />
                  Orders
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-3 p-3 text-lg font-medium text-gray-700 hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Buy Again
                </Link>
                <Link
                  href="/support"
                  className="flex items-center gap-3 p-3 text-lg font-medium text-gray-700 hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageCircleQuestion className="w-5 h-5" />
                  Support
                </Link>
                <button
                  className="flex items-center gap-3 p-3 text-lg font-medium text-red-600 hover:text-red-700 w-full text-left"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      router.push("/");
                    }, 2000);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
