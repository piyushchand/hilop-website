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

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
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

  const [language, setLanguage] = useState<"en" | "hi">("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="container py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="Hilop logo" width={100} height={40} />
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

            <Link
              href="/cart"
              className="relative rounded-full w-[52px] h-[52px] hover:bg-gray-200 flex justify-center transition-all duration-300 border border-gray-200 items-center"
            >
              <ShoppingCart className="w-5 h-5 text-dark" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                2
              </span>
            </Link>
          </div>

          {/* Login/Profile */}
          {!user ? (
            <ArrowButton label="Login" theme="light" size="lg" href="/auth/login" />
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                className="md:size-[54px] size-[46px] rounded-full bg-dark overflow-hidden focus:outline-none border border-gray-800 focus:border-green-800"
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
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
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
                    <Link href="/profile" className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    <Link href="/my-order" className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>
                      <History className="mr-3 h-4 w-4" />
                      Orders
                    </Link>
                    <Link href="/cart" className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>
                      <ShoppingBag className="mr-3 h-4 w-4" />
                      Buy Again
                    </Link>
                    <Link href="/support" className="flex items-center px-5 py-2 text-sm text-dark hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>
                      <MessageCircleQuestion className="mr-3 h-4 w-4" />
                      Support
                    </Link>
                    <div className="border-t border-gray-300"></div>
                    <button
                      className="flex items-center w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        router.push("/auth/login");
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

          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center" onClick={() => setMobileMenuOpen(true)}>
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
        <div className="p-4 flex justify-between items-center border-b border-gray-200 gap-4">
          <div className="flex items-center gap-4">
          <button
              onClick={toggleLanguage}
              className="relative gap-2 h-10 flex justify-center items-center overflow-hidden hover:opacity-60"
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
            <button className="relative rounded-full w-10 h-10 flex justify-center border border-gray-200 items-center">
              <ShoppingCart className="w-5 h-5 text-dark" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                2
              </span>
            </button>
          </div>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-green-800" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4 text-sm font-medium text-gray-700">
          <Link href="/about-us" onClick={() => setMobileMenuOpen(false)}>
            About us
          </Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
            How it works
          </Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
            Blog
          </Link>
        </nav>

        {/* Mobile profile links */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2">
              <User className="h-5 w-5" /> Profile
            </Link>
            <Link href="/my-order" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2">
              <History className="h-5 w-5" /> Orders
            </Link>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                router.push("/auth/login");
              }}
              className="flex items-center gap-2 py-2 text-red-600"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
