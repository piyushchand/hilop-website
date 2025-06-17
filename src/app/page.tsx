"use client";
import { useState, useEffect } from "react";
import { MorphingText } from "@/components/animationComponents/MorphingText";
import { Blogs } from "@/components/blogs";
import FaqAccordion from "@/components/FaqAccordion";
import LongerWithBetter from "@/components/longerWithBetter";
import LoseWeight from "@/components/loseWeight";
import TestModal from "@/components/model/TestModal";
import { OurProcess } from "@/components/ourProcess";
import { Testimonials } from "@/components/testimonials";
import ParallaxText from "@/components/velocityScroll";
import { WhyChoose } from "@/components/whyChoose";
import Image from "next/image";
import ProductCard from "@/components/productCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types";


const features = [
  {
    icon: "/images/icon/pure-herbal.svg",
    title: "100% Natural",
    description: "Pure herbal ingredients",
  },
  {
    icon: "/images/icon/science-backed.svg",
    title: "Science-Backed",
    description: "Proven formulations",
  },
  {
    icon: "/images/icon/fast-acting.svg",
    title: "Fast-Acting",
    description: "Feel the difference",
  },
];

const homepagefaqdata = [
  {
    id: "faq1",
    question: "How do i order from your company?",
    answer:
      "We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications",
  },
  {
    id: "faq2",
    question: "How do i order from your company?",
    answer:
      "We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications",
  },
  {
    id: "faq3",
    question: "How do i order from your company?",
    answer:
      "We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications",
  },
  {
    id: "faq4",
    question: "How do i order from your company?",
    answer:
      "We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications",
  },
  {
    id: "faq5",
    question: "How do i order from your company?",
    answer:
      "We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications",
  },
];
const texts = [
  "Better Sex",
  "Weight Loss",
  "Instant Sex",
];

export default function Home() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://3.110.216.61/api/v1'}/products?lang=${language}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [language]); // Removed showLoading and hideLoading dependencies

  return (
    <>
      <section className="container overflow-hidden mb-16 lg:mb-40">
      
        <div className="grid md:grid-cols-[auto_316px] items-center mt-8 lg:mt-14 mb-9">
          <div>
            <span className="top-content-badge">Natural Herbal Solutions</span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl mb-6 font-medium">
            <MorphingText texts={texts} /> <br />
              <span className="text-primary">personalized to you</span>
            </h1>
            <h2 className="text-lg md:text-xl text-gray-700">
              Customized care starts here
            </h2>
          </div>
          <div className="grid md:grid-cols-1 sm:grid-cols-2 grid-cols-1">
            {features.map((item, index) => (
              <div
                key={index}
                className={`p-4 flex  items-center gap-4 ${
                  index !== features.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <div className="bg-green-100 rounded-full size-16 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    width={32}
                    height={32}
                    alt={item.title}
                  />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:px-0 grid-cols-4 md:grid-cols-3 gap-4 md:gap-6">
          {productsLoading ? (
            <div className="col-span-full text-center py-8">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">No products available</div>
          ) : (
            products.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                index={index}
                totalItems={products.length}
              />
            ))
          )}
        </div>
      </section>
      <TestModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} />
      <LoseWeight />
      {/* <VelocityScroll>100% Natural Product</VelocityScroll> */}
      <ParallaxText baseVelocity={80}>
        ✅ 100% money back guarantee
      </ParallaxText>
      <LongerWithBetter />
      <Testimonials />
      <WhyChoose />
      <OurProcess />
      <Blogs />
      <FaqAccordion items={homepagefaqdata} className="mx-auto" />
    </>
  );
}
