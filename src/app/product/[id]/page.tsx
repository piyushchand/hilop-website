"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/uiFramework/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { A11y, Navigation, Scrollbar, Thumbs } from "swiper/modules";
import { useLanguage } from "@/contexts/LanguageContext";
import { getText } from "@/utils/getText";
import Image from "next/image";
import "swiper/css";
import "swiper/css/thumbs";
import { BadgeCheck } from "lucide-react";
import Accordion from "@/components/uiFramework/Accordion";
import RoundButton from "@/components/uiFramework/RoundButton";
import Paragraph from "@/components/animationComponents/TextVisble";
import { Testimonials } from "@/components/testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import { Checkmark } from "@/components/checkmark";

// Dynamic image mapping based on product name
const PRODUCT_CUSTOM_IMAGES: Record<string, string> = {
  Slimvibe: "/images/weight-loss/why-choose.jpg",
  BoldRise: "/images/instant-boost/why-choose.jpg",
  Hardveda: "/images/improving-sexual/why-choose.jpg",
};

// Dynamic custom content mapping based on product name
const PRODUCT_CUSTOM_CONTENT: Record<string, { title: string }> = {
  Slimvibe: {
    title: "Our Herbal Fat Loss Formula?",
  },
  BoldRise: {
    title: "Our Herbal Instant Sexual Enhancer?",
  },
  Hardveda: {
    title: "Our Herbal Sexual Wellness formula?",
  },
};

// Dynamic benefit tags mapping based on product name
const PRODUCT_BENEFIT_TAGS: Record<string, string[]> = {
  Slimvibe: [
    "Individuals looking to support their weight loss goals naturally.",
    "Those who want to increase their energy levels and improve overall health.",
    "People who are tired of crash diets or artificial weight loss products and prefer a more holistic approach.",
  ],
  BoldRise: [
    "Men looking to enhance their performance and energy levels naturally.",
    "Those who want to increase their libido and desire without relying on chemicals.",
    "Individuals who are looking to support their overall vitality and well-being.",
  ],
  Hardveda: [
    "Men looking to naturally boost their testosterone levels and support sexual wellness.",
    "Individuals experiencing low energy, reduced libido, or a decrease in overall vitality.",
    "Those who want to enhance performance, stamina, and confidence in intimate moments.",
    "Active individuals who want to support muscle mass, strength, and energy levels.",
  ],
};

// Dynamic "Who can Benefit" image mapping
const PRODUCT_BENEFIT_IMAGES: Record<string, string> = {
  Slimvibe: "/images/weight-loss/who-can-benefit.jpg",
  BoldRise: "/images/instant-boost/who-can-benefit.jpg",
  Hardveda: "/images/improving-sexual/who-can-benefit.jpg",
};

// Helper function to get product-specific content with fallbacks
const getProductContent = (productName: string) => {
  const normalizedName = productName?.trim();
  
  return {
    customImage: PRODUCT_CUSTOM_IMAGES[normalizedName] || "/images/why-choose.png",
    customTitle: PRODUCT_CUSTOM_CONTENT[normalizedName]?.title || "Our Herbal Wellness Formula?",
    benefitTags: PRODUCT_BENEFIT_TAGS[normalizedName] || [
      "Individuals looking to support their wellness goals naturally.",
      "Those who want to improve their overall health and vitality.",
      "People who prefer natural, holistic approaches to wellness.",
    ],
    benefitImage: PRODUCT_BENEFIT_IMAGES[normalizedName] || "/images/why-choose.png",
  };
};

interface ProductPrice {
  current_price?: number;
  final_price?: number;
  original_price?: number;
  base_price?: number;
  discount?: number;
  discount_type?: "fixed" | "percentage";
}

interface WhyChooseUsItem {
  title?: string;
  description?: string;
  question?: string;
  answer?: string;
}

interface FaqAccordionItem {
  title?: string;
  description?: string;
  question?: string;
  answer?: string;
}

interface KeyIngredient {
  image: string;
  title: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  images: string[];
  pricing: ProductPrice;
  price?: ProductPrice;
  for?: { en: string; hi: string };
  label?: { en: string; hi: string };
  how_it_works?: { en: string; hi: string };
  how_to_use?: { en: string; hi: string };
  description?: { en: string; hi: string };
  description_tags?: string[];
  why_choose_us?: (string | WhyChooseUsItem)[];
  faqs?: (string | FaqAccordionItem)[];
  key_ingredients?: KeyIngredient[];
  reviews: {
    total_count: number;
    average_rating: number;
    reviews: Array<{
      _id: string;
      user: {
        name: string;
      };
      product: string;
      rating: number;
      description: string;
    }>;
  };
  custom_image?: string;
}

const howItWorks = [
  {
    title: "Take a Free Online Assessment",
    description:
      "Answer a few quick questions about your weight, lifestyle, and goals. Our expert-backed system will create a customized weight-loss plan tailored specifically for your body's needs.",
  },
  {
    title: "Get a 100% Natural, Customized Treatment",
    description:
      "Your personalized plant-based treatment is scientifically designed to help you burn fat, boost metabolism, and reduce cravings—naturally and effectively.",
  },
  {
    title: "Fast, Discreet Shipping to Your Doorstep",
    description:
      "Enjoy hassle-free, discreet delivery, ensuring privacy and convenience so you can start your transformation right away.",
  },
  {
    title: "Unlock the Daily Progress Tracker",
    description:
      "Capture your transformation with daily photo tracking and see your body change over time. Stay motivated as you reach your goals!",
  },
  {
    title: "Track Progress & Earn Hilop Rewards",
    description:
      "Stay on top of your journey with goal tracking, reminders, and Hilop Coins, which you can redeem for exclusive discounts.",
  },
  {
    title: "See Real Results—Or Your Money Back!",
    description:
      "Most customers see noticeable changes in just 30 days! If you're not satisfied, you're protected by our 100% money-back guarantee—no risk, no worries.",
  },
];

export default function ProductPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    const productId = params?.id as string;
    if (!productId) {
      setError("Product ID is missing");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = `${
          process.env.NEXT_PUBLIC_API_URL || "http://3.110.216.61/api/v1"
        }/products/${productId}?lang=${language}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error("Invalid response format from server");
        }

        setProduct(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Product not found"}
          </h1>
          <Button
            link="/"
            label={language === "en" ? "Return to Home" : "होम पर वापस जाएं"}
            variant="btn-primary"
          />
        </div>
      </div>
    );
  }

  const whyChooseUs = Array.isArray(product.why_choose_us)
    ? product.why_choose_us
        .map((item: string | WhyChooseUsItem) => {
          if (typeof item === "string") {
            return { question: item, answer: item };
          }
          return {
            question: item.title || item.question || "",
            answer: item.description || item.answer || "",
          };
        })
        .filter((item) => item.question && item.answer)
    : [];

  const faqItems = Array.isArray(product.faqs)
    ? product.faqs
        .map((item: string | FaqAccordionItem, index: number) => {
          if (typeof item === "string") {
            return {
              id: `faq-${index}`,
              question: item,
              answer: item,
            };
          }
          return {
            id: `faq-${index}`,
            question: item.title || item.question || "",
            answer: item.description || item.answer || "",
          };
        })
        .filter((item) => item.question && item.answer)
    : [];

  return (
    <>
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="top-content-badge !flex gap-2 items-center">
              <BadgeCheck className="text-green-800" />{" "}
              {getText(product.for || "", language)}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl mb-3 sm:mb-6 font-semibold">
              {product.name}
            </h1>
            <h2 className="md:text-xl text-lg font-medium text-gray-800 mb-6">
              {getText(product.label || "", language)}
            </h2>
            <p className="mb-3 text-gray-700">
              {getText(product.description || "", language)}
            </p>
            <div className="flex md:flex-row flex-col gap-4 p-6 bg-white rounded-2xl justify-between mb-6">
              {(product.description_tags || []).map(
                (item: string, index: number) => (
                  <Checkmark key={index} text={item} />
                )
              )}
            </div>
            <p className="md:text-xl text-lg font-medium text-dark mb-6">
              Start your transformation today with a personalized plan!
            </p>
            <div className="flex gap-4">
              <Button
                label="Get Started Now"
                variant="btn-dark"
                size="xl"
                link={`/checkout?product=${product.id}`}
              />
              <Button
                label="Buy Now"
                variant="btn-light"
                size="xl"
                link={`/checkout?product=${product.id}`}
              />
            </div>
          </div>
          <div className="order-1 lg:order-1 relative w-full flex flex-col items-center sm:rounded-4xl rounded-2xl overflow-hidden border border-gray-200 bg-green-100">
            <Swiper
              spaceBetween={10}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[Thumbs]}
              className="w-full aspect-square"
            >
              {product.images.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image}
                    alt={`${product.name} image ${index + 1}`}
                    width={500}
                    height={500}
                    className="w-full object-cover h-full"
                    priority={index === 0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={16}
              slidesPerView={3}
              watchSlidesProgress
              modules={[Thumbs]}
              className="w-38 sm:w-64 !absolute sm:bottom-7 bottom-3"
            >
              {product.images.map((image: string, index: number) => (
                <SwiperSlide
                  key={index}
                  className="cursor-pointer bg-white rounded-md sm:rounded-xl border border-gray-300"
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                    className="w-full h-full object-cover aspect-square"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="container mb-16 lg:mb-40">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <Image
              src={getProductContent(product.name).customImage}
              alt={product.name}
              width={740}
              height={766}
              className="rounded-2xl w-full h-auto"
            />
          </div>
          <div>
            <h2 className="md:text-3xl lg:text-5xl text-2xl font-semibold mb-8">
              <span className="text-green-800">Why Choose</span>{" "}
              {getProductContent(product.name).customTitle}
            </h2>
            <Accordion items={whyChooseUs} className="mx-auto mb-8" />
            <Button
              label="Get Started today"
              variant="btn-dark"
              size="xl"
              link={`/checkout?product=${product.id}`}
            />
          </div>
        </div>
      </section>

      <section className="mb-16 lg:mb-40 overflow-hidden">
        <div className="container">
          <span className="top-content-badge">Key Ingredients</span>
          <Paragraph
            paragraph="What's Inside?"
            textColor="text-dark"
            className="mb-10"
            highlightedWord="Inside?"
          />
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            className="!overflow-visible"
            spaceBetween={24}
            slidesPerView={1}
            autoHeight
            navigation={{
              nextEl: ".process-next-button",
              prevEl: ".process-prev-custom",
            }}
            scrollbar={{
              el: ".process-scrollbar-custom",
              draggable: true,
              hide: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 24 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {(product.key_ingredients || []).map((item, idx) => (
              <SwiperSlide key={idx} className="!h-full">
                <div className="relative p-6 md:p-10 rounded-2xl bg-white h-full">
                  <div className="relative text-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="mx-auto mb-4 rounded-full aspect-square object-cover"
                    />
                    <h3 className="font-medium text-lg sm:text-2xl mb-2 lg:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {(product.key_ingredients || []).length > 3 && (
            <div className="mt-8 flex items-center justify-between z-50">
              <div className="process-scrollbar-custom h-2 w-1/2 rounded-full bg-gray-200">
                <div className="swiper-scrollbar-drag rounded-full h-full !bg-primary"></div>
              </div>
              <div className="ml-6 flex space-x-3">
                <RoundButton
                  className="process-prev-custom swiper-custome-button rotate-180"
                  variant="btn-dark"
                  size="lg"
                />
                <RoundButton
                  className="process-next-button swiper-custome-button"
                  variant="btn-dark"
                  size="lg"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mb-16 lg:mb-40">
        <div className="container">
          <div className="p-10 bg-white rounded-2xl overflow-hidden">
            <div className="relative">
              <Paragraph
                paragraph="How It Works"
                textColor="text-dark"
                className="mb-4"
                highlightedWord="Works"
              />
              <p className="text-gray-700 mb-6">
                {getText(product.how_it_works || "", language)}
              </p>
              <Button
                label="Get Started today"
                variant="btn-dark"
                size="xl"
                link={`/checkout?product=${product.id}`}
              />

              <Swiper
                className="mt-8 !overflow-visible how-it-works-product-slider"
                slidesPerView={1}
                spaceBetween={24}
                autoHeight
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 1.5, spaceBetween: 24 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
              >
                <div className="w-full border-t-2 border-dashed border-green-600 absolute top-8 left-0 z-0" />
                {howItWorks.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    className="relative !h-full !flex !flex-col items-center z-10"
                  >
                    <div className="bg-green-100 rounded-full min-h-16 min-w-16 flex justify-center items-center ">
                      <span className="text-3xl font-semibold text-green-800">
                        {index + 1}
                      </span>
                    </div>
                    <Image
                      src="/images/icon/slider-drip.svg"
                      alt="Slider visual element"
                      width={53}
                      height={42}
                      className="-mt-3.5"
                    />
                    <div className="p-6 xl:p-10 rounded-2xl bg-green-100 h-full">
                      <h3 className="font-medium text-lg sm:text-xl sm:mb-4 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 mt-auto">
                        {item.description}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
      <section className="container mb-16 lg:mb-40 grid md:grid-cols-2 gap-6 lg:gap-10 items-center">
        <Image
          src={getProductContent(product.name).benefitImage}
          alt="Who can Benefit?"
          width={740}
          height={740}
          className="aspect-square object-cover rounded-3xl"
        />
        <div className="">
          <Paragraph
            paragraph="Who can Benefit?"
            textColor="text-dark"
            highlightedWord="Who can"
            className="mb-6 lg:mb-10"
          />
          <div className="space-y-3 mb-6 lg:mb-10">
            {getProductContent(product.name).benefitTags.map((item, index) => (
              <Checkmark key={index} text={item} />
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              label="Get Started Now"
              variant="btn-dark"
              size="xl"
              link={`/checkout?product=${product.id}`}
            />
            <Button
              label="Buy Now"
              variant="btn-light"
              size="xl"
              link={`/checkout?product=${product.id}`}
            />
          </div>
        </div>
      </section>
      <section className="container mb-16 lg:mb-40">
        <div className="md:p-20 p-8 bg-white rounded-2xl grid lg:grid-cols-[380px_auto] sm:gap-8 gap-4 items-center">
          <Paragraph
            paragraph="How to Use"
            textColor="text-dark"
            highlightedWord="Use"
          />
          <p className="text-base md:text-lg lg:text-2xl">
            {getText(product.how_to_use || "", language)}
          </p>
        </div>
      </section>

      <section className=" mb-16 lg:mb-40 lg:py-20 py-10 bg-gray-200">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div className="lg:order-1 order-2">
            <Paragraph
              paragraph="Why Choose Us?"
              textColor="text-dark"
              className="lg:mb-10 mb-6"
              highlightedWord="Choose Us?"
            />
            <p className="text-base md:text-lg lg:text-2xl">
              Our wellness formula is crafted using premium, organic herbal
              ingredients, ensuring a clean, chemical-free experience. Support
              your natural balance and feel confident as you move toward a
              healthier, more energized lifestyle.
            </p>
          </div>
          <Image
            src="/images/why-choose.png"
            alt="Why choose us"
            width={691}
            height={586}
            className="lg:order-2 order-1"
          />
        </div>
      </section>

      <Testimonials filteredByProductId={product.id} />
      <FaqAccordion items={faqItems} className="mx-auto" />
    </>
  );
}
