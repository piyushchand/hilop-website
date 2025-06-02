"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  
  const hilopLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/blogs", label: "Blogs" },
    { href: "/support", label: "Help & Support" },
  ];

  const learnLinks = [
    { href: "/learn/sexual-health", label: "Sexual Health" },
    { href: "/learn/longer-sex", label: "Have Longer Sex" },
    { href: "/learn/better-sex", label: "Have Better Sex" },
  ];

  const productLinks = [
    { href: "/product/fat-loss", label: "Herbal Fat Loss Formula" },
    { href: "/product/enhancer", label: "Sexual Enhancer" },
    { href: "/product/wellness", label: "Sexual Wellness Formula" },
  ];
  return (
    <footer className="pb-4 pt-20 bg-white relative">
       <Image
                src="/images/footer/leaf-1.png"
                width={167}
                height={211}
                alt="mobile app mockup"
                className="absolute bottom-9 left-0 max-w-[167px] w-1/6"
              />
               <Image
                src="/images/footer/leaf-2.png"
                width={126}
                height={148}
                alt="mobile app mockup"
                className="absolute top-1 end-0 max-w-[126px] w-1/6"
              />
      <div className="container relative">
        <div className="grid md:grid-cols-[362px_auto] md:gap-10 gap-6 mb-4">
          <div className="px-4 pt-4 border border-gray-200 rounded-lg order-2 md:order-1 bg-white">
            <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-4 mb-4 justify-between">
              <h2 className="text-lg md:text-xl">
                <span className="text-primary">Total care.</span>
                <br />
                Totally different.
              </h2>
              <Image
                src="/images/footer/qrcode.svg"
                width={120}
                height={120}
                alt="App QR code"
                className="rounded-lg border border-gray-200"
              />
            </div>
            <div className="flex items-center gap-4 justify-between">
              <p className="text-gray-800">Download the
              Application</p>
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
              <p className="mb-4 text-base uppercase text-dark font-medium">Hilop</p>
              {hilopLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`block text-gray-600 hover:text-dark transition-all duration-300 ${index !== hilopLinks.length - 1 ? "mb-4" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>
              <p className="mb-4 text-base uppercase text-dark font-medium">Learn</p>
              {learnLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`block text-gray-600 hover:text-dark transition-all duration-300 ${index !== learnLinks.length - 1 ? "mb-4" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>
              <p className="mb-4 text-base uppercase text-dark font-medium">Our Products</p>
              {productLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`block text-gray-600 hover:text-dark transition-all duration-300 ${index !== productLinks.length - 1 ? "mb-4" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>
              <p className="mb-4 text-base uppercase text-dark font-medium">Contact Us</p>
              <p className="mb-4 text-gray-600">123 Herbal Lane, Nature City, Earth</p>
              <a href="tel:+12345678900" className="mb-4 block text-gray-600 hover:text-dark transition-all duration-300">
                +1 (234) 567-8900
              </a>
              <a href="mailto:info@hilop.com" className="mb-4 block text-gray-600 hover:text-dark transition-all duration-300">
                info@hilop.com
              </a>

              <div className="flex gap-3 mt-2">
                <Link className="social-icon" href="https://www.instagram.com/think.novus/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram />
                </Link>
                <Link className="social-icon" href="https://www.facebook.com/thinknovus.official/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook />
                </Link>
                <Link className="social-icon" href="https://x.com/thinknovus" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[298px_auto] items-center pt-4 border-t border-gray-200 gap-3">
          <p className="text-center md:text-left text-gray-600 text-sm">
            &copy; {currentYear} Hilop Health, Inc. All rights reserved.
          </p>
          <div className="flex items-center flex-wrap justify-center md:justify-end gap-2 text-sm text-white">
            <Link href="/terms" className="text-gray-600 hover:underline">Terms & Conditions</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <Link href="/privacy" className="text-gray-600 hover:underline">Privacy Policy</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <Link href="/sitemap" className="text-gray-600 hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
