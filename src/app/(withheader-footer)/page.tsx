"use client";
import { useState, useEffect } from "react";
import { Blogs } from "@/components/blogs";
import FaqAccordion from "@/components/FaqAccordion";
import LongerWithBetter from "@/components/longerWithBetter";
import LoseWeight from "@/components/loseWeight";
// import { OurProcess } from "@/components/ourProcess";
import { Testimonials } from "@/components/testimonials";
import ParallaxText from "@/components/velocityScroll";
import { WhyChoose } from "@/components/whyChoose";
import Image from "next/image";
import ProductCard from "@/components/productCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import RotatingText from "@/components/animationComponents/RotatingText";

interface Test {
  _id: string;
  title_en: string;
  title_hi: string;
}

// Loading component
const Loading = () => (
  <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
    <div className="container h-full flex flex-col justify-center items-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        <p className="text-gray-600">Please wait while we load the page.</p>
      </div>
    </div>
  </div>
);

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { language } = useLanguage();
  const { isInitialized: useRequireAuthInitialized } = useRequireAuth({
    requireAuth: false,
  });

  // --- Dynamic testId for LoseWeight ---
  const DEFAULT_TEST_ID = "682474c65b9ab999150472e9";

  let product1 = products.find(
    (p) =>
      p.name.toLowerCase().includes("testosterone") ||
      p.name.toLowerCase().includes("stamina")
  );
  let product2 = products.find(
    (p) =>
      p.name.toLowerCase().includes("longer") ||
      p.name.toLowerCase().includes("enhancer")
  );

  // Fallback logic if not found
  if (!product1 && products.length > 0) product1 = products[0];
  if ((!product2 || product2._id === product1?._id) && products.length > 1)
    product2 = products[1];

  const [testId1, setTestId1] = useState<string | null>(null);
  const [testId2, setTestId2] = useState<string | null>(null);
  const DEFAULT_TEST_ID_1 = "682f074c076fa37f15f16b34";
  const DEFAULT_TEST_ID_2 = "682f0b48076fa37f15f16b83";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_URL)
          throw new Error("API URL is not set in environment variables");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?lang=${language}`,
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
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  // Fetch testId for LoseWeight dynamically
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tests`
        );
        if (!response.ok) throw new Error("Failed to fetch tests");
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const match1 = data.data.find(
            (test: Test) =>
              (test.title_en || "").toLowerCase().includes("testosterone") ||
              (test.title_en || "").toLowerCase().includes("stamina")
          );
          const match2 = data.data.find(
            (test: Test) =>
              (test.title_en || "").toLowerCase().includes("longer") ||
              (test.title_en || "").toLowerCase().includes("enhancer")
          );
          setTestId1(match1?._id || DEFAULT_TEST_ID_1);
          setTestId2(match2?._id || DEFAULT_TEST_ID_2);
        } else {
          setTestId1(DEFAULT_TEST_ID_1);
          setTestId2(DEFAULT_TEST_ID_2);
        }
      } catch {
        setTestId1(DEFAULT_TEST_ID_1);
        setTestId2(DEFAULT_TEST_ID_2);
      }
    };
    fetchTests();
  }, [products]);

  const weightLossProduct = products.find(
    (p) =>
      p.name.toLowerCase().includes("weight") ||
      p.name.toLowerCase().includes("slimvibe") ||
      (p.category && p.category.toLowerCase().includes("weight"))
  );

  if (!useRequireAuthInitialized) return <Loading />;

  return (
    <>
      <section className="container overflow-hidden mb-16 lg:mb-40">
        <div className="grid md:grid-cols-[auto_316px] items-center mt-8 mb-9">
          <div>
            <span className="top-content-badge">Natural Herbal Solutions</span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-medium mb-6">
              <RotatingText
                texts={["Better Sex", "Weight Loss", "Instant Sex"]}
                mainClassName="text-dark"
                staggerFrom={"last"}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 60, stiffness: 700 }}
                rotationInterval={2500}
              />
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
                  <h3 className="text-lg md:text-xl font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:px-0 grid-cols-4 md:grid-cols-3 gap-4 md:gap-6">
          {productsLoading ? (
            <div className="col-span-full text-center py-8">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              No products available
            </div>
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
      <LongerWithBetter
        productId1={product1?._id}
        testId1={testId1 || undefined}
        productId2={product2?._id}
        testId2={testId2 || undefined}
      />
      <ParallaxText baseVelocity={80}>
        ✅ 100% money back guarantee
      </ParallaxText>
      <LoseWeight testId={DEFAULT_TEST_ID} productId={weightLossProduct?._id} />
      <Testimonials />
      <WhyChoose />
      {/* <OurProcess /> */}
      <Blogs />
      <FaqAccordion items={homepagefaqdata} className="mx-auto" />
    </>
  );
}
