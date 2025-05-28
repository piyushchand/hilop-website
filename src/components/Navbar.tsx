"use client";
import { Globe, ShoppingCart, Menu, X, User } from "lucide-react";
import Link from "next/link";
import ArrowButton from "./uiFramework/ArrowButton";
import Image from "next/image";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  

  // Lock body scroll
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="container py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="Hilop logo" width={100} height={40} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/about-us" className="hover:text-black">About us</Link>
          <Link href="/how-it-works" className="hover:text-black">How it works</Link>
          <Link href="/blog" className="hover:text-black">Blog</Link>
        </nav>

        {/* Right Side Desktop */}
        <div className="flex gap-4">
         <div className="hidden md:flex gap-4 relative">
         <button className="relative gap-2 h-[52px] flex justify-center items-center">
            <Globe className="w-5 h-5 text-dark" />
            <span>English</span>
          </button>
          <button className="relative rounded-full w-[52px] h-[52px] hover:bg-gray-200 flex justify-center transition-all duration-300 border border-gray-200 items-center">
            <ShoppingCart className="w-5 h-5 text-dark" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </button>
         </div>
          <ArrowButton label="Login" theme="light" size="lg" />
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-green-800" />
        </button>
        </div>
      </div>

   

      {/* Offcanvas Menu */}
      <div
         className={`fixed top-0 right-0 h-full w-full bg-white z-50 shadow-lg transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 gap-4">
          <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-dark" />
            <span>English</span>
          </div>
          <button className="relative rounded-full w-10 h-10 flex justify-center border border-gray-200 items-center">
            <ShoppingCart className="w-5 h-5 text-dark" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </button>
          <button className="relative rounded-full w-10 h-10 flex justify-center border border-gray-200 items-center">
            <User className="w-5 h-5 text-dark" />
           
          </button>
          </div>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-green-800" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4 text-sm font-medium text-gray-700">
          <Link href="/about-us" onClick={() => setMobileMenuOpen(false)}>About us</Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>

          
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
