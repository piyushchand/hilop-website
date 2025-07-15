"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { user } = useAuth();

  const hilopLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/blog", label: "Blog" },
    { href: "/book-call", label: "Contact Us", authOnly: true },
    { href: "/support", label: "Help & Support" },
  ];

  // Only show Contact Us if user is logged in
  const filteredLinks = hilopLinks.filter(link => {
    if (link.authOnly) {
      return !!user;
    }
    return true;
  });

  // Fetch products for dynamic footer links
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_URL) {
          console.warn("API URL is not set in environment variables");
          return;
        }
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?lang=en`,
          { cache: "no-store" }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Error fetching products for footer:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productLinks = products.map(product => ({
    href: `/product/${product._id}`,
    label: product.name
  }));
  return (
    <footer className="relative bg-zinc-950 text-white pt-12 pb-8 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid md:grid-cols-[362px_auto] md:gap-10 gap-6 mb-4">
          <div className="px-4 pt-4 border border-zinc-900 rounded-lg order-2 md:order-1 bg-white ">
            <div className="p-4 bg-zinc-200 rounded-lg flex items-center gap-4 mb-4 justify-between">
              <h2 className="text-lg md:text-xl">
                <span className="text-primary">Total care.</span>
                <br />
               <span className="text-zinc-900"> Totally different.</span>
              </h2>
              <Image
                src="/images/footer/qrcode.svg"
                width={120}
                height={120}
                alt="App QR code"
                className="rounded-lg border border-zinc-200"
              />
            </div>
            <div className="flex items-center gap-4 justify-between">
              <p className="text-zinc-900">Download the Application</p>
              <Image
                src="/images/footer/footer-mobile.png"
                width={164}
                height={191}
                alt="mobile app mockup"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 md:gap-x-6 gap-x-4 gap-y-6 order-1 md:order-2">
            <div>
              <p className="mb-4 text-base uppercase text-zinc-400 font-medium">
                Hilop
              </p> 
              {filteredLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`block text-zinc-400 hover:text-white transition-all duration-300 ${
                    index !== filteredLinks.length - 1 ? "mb-4" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>
              <p className="mb-4 text-base uppercase text-zinc-400 font-medium">
                Product
              </p>
              {productsLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-zinc-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-zinc-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-zinc-200 rounded animate-pulse"></div>
                </div>
              ) : productLinks.length > 0 ? (
                productLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={`block text-zinc-400 hover:text-white transition-all duration-300 ${
                      index !== productLinks.length - 1 ? "mb-4" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">No products available</p>
              )}
            </div>

            <div>

              <p className="mb-4 text-zinc-400">
                123 Herbal Lane, Nature City, Earth
              </p>
              <a
                href="tel:+12345678900"
                className="mb-4 block text-zinc-400 hover:text-white transition-all duration-300"
              >
                +1 (234) 567-8900
              </a>
              <a
                href="mailto:info@hilop.com"
                className="mb-4 block text-zinc-400 hover:text-white transition-all duration-300"
              >
                info@hilop.com
              </a>

              <div className="flex gap-3 mt-2">
                <Link
                  className="social-icon text-zinc-400 hover:text-white"
                  href="https://www.instagram.com/think.novus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram />
                </Link>
                <Link
                  className="social-icon text-zinc-400 hover:text-white"
                  href="https://www.facebook.com/thinknovus.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook />
                </Link>
                <Link
                  className="social-icon text-zinc-400 hover:text-white"
                  href="https://x.com/thinknovus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
      {/* Large background logo just above copyright/links */}
      <div className="w-full mt-12 mb-2 ">
        <Image
          src="foteer-logo.svg"
          alt="Hilop Logo"
          width={1200}
          height={300}
          className="opacity-10 w-[80vw] max-w-6xl mx-auto"
          style={{ filter: 'grayscale(1) brightness(0.7)' }}
          priority
        />
      </div>

        <div className="grid md:grid-cols-[298px_auto] items-center pt-4 border-t border-zinc-800 gap-3">
          <p className="text-center md:text-left text-zinc-500 text-sm">
            &copy; {currentYear} Hilop Health, Inc. All rights reserved.
          </p>
          <div className="flex items-center flex-wrap justify-center md:justify-end gap-2 text-sm text-zinc-400">
                       <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>

            <Link href="/terms" className="text-zinc-400 hover:text-white">
              Terms & Conditions
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
            <Link href="/privacy" className="text-zinc-400 hover:text-white">
              Privacy Policy
            </Link>
         
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
