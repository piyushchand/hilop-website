"use client";
import { useState } from "react";
import { ProductHero } from "@/components/productHero";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { A11y, Navigation, Scrollbar, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import Paragraph from "@/components/animationComponents/TextVisble";
import Button from "@/components/uiFramework/Button";
import Accordion from "@/components/uiFramework/Accordion";
import RoundButton from "@/components/uiFramework/RoundButton";
import FaqAccordion from "@/components/FaqAccordion";
import { Testimonials } from "@/components/testimonials";
const images = [
  "/images/product.png",
  "/images/about-us/our-commitment.jpg",
  "/images/about-us/our-mission.jpg",
  "/images/about-us/our-mission.jpg",
  "/images/about-us/our-mission.jpg",
  "/images/about-us/our-mission.jpg",
  "/images/about-us/our-mission.jpg",
];
const productWhyChoose = [
  {
    id: "faq1",
    question: "Boost Metabolism",
    answer:
      "Our carefully selected herbs work synergistically to increase your metabolic rate, helping your body burn calories faster, even at rest.",
  },
  {
    id: "faq2",
    question: "Natural Appetite Suppression",
    answer:
      "Say goodbye to constant cravings and overeating. The herbal ingredients help to naturally curb hunger, promoting a balanced and sustainable eating pattern.",
  },
  {
    id: "faq3",
    question: "Energy and Focus",
    answer:
      "Feel energized and focused throughout the day without the jitters. Our formula includes herbs that support sustained energy and mental clarity while you work toward your fat loss goals.",
  },
  {
    id: "faq4",
    question: "Support Healthy Digestion",
    answer:
      "A healthy digestive system is key to weight management. Our herbal blend promotes digestive health, ensuring that your body absorbs nutrients efficiently and eliminates waste naturally.",
  },
];

const keyIngredients = [
  {
    image: "/images/key-ingredients/green-tea-extract.jpg",
    title: "Green Tea Extract",
    description:
      "Known for its fat-burning properties, green tea extract helps boost metabolism and supports overall weight loss.",
  },
  {
    image: "/images/key-ingredients/garcinia-cambogia.jpg",
    title: "Garcinia Cambogia",
    description:
      "This popular herb aids in reducing fat storage, while also controlling appetite, making it easier to stay on track with your goals.",
  },
  {
    image: "/images/key-ingredients/ginger-root.jpg",
    title: "Ginger Root",
    description:
      "A natural thermogenic, ginger helps increase your body temperature, accelerating fat burning. It also supports digestion and reduces bloating.",
  },
  {
    image: "/images/key-ingredients/cayenne-pepper.jpg",
    title: "Cayenne Pepper",
    description:
      "The active compound, capsaicin, in cayenne pepper, stimulates the body’s metabolism and helps burn calories.",
  },
  {
    image: "/images/key-ingredients/turmeric.jpg",
    title: "Turmeric",
    description:
      "A powerful anti-inflammatory, turmeric supports a healthy metabolism and helps combat the fat-storage process.",
  },
];

const weightlossfaqdata = [
  {
    id: "faq1",
    question: "How do i order from your company? How do i order from your company?",
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

const howItWorks = [
  {
    title: "Take a Free Online Assessment",
    description:
      "Answer a few quick questions about your weight, lifestyle, and goals. Our expert-backed system will create a customized weight-loss plan tailored specifically for your body’s needs.",
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
      "Most customers see noticeable changes in just 30 days! If you're not satisfied, you’re protected by our 100% money-back guarantee—no risk, no worries.",
  },
];
const Benefit = [
  { text: "Individuals looking to support their weight loss goals naturally." },
  { text: "Those who want to increase their energy levels and improve overall health." },
  { text: "People who are tired of crash diets or artificial weight loss products and prefer a more holistic approach." },
]
export default function Productdata() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  return (
    <>
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="top-content-badge !flex gap-2 items-center">
              <BadgeCheck className="text-green-800" /> Premium Formula
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl mb-3 sm:mb-6 font-semibold">
              Herbal Fat Loss
            </h1>
            <h2 className="md:text-xl text-lg font-medium text-gray-800 mb-6">
              Naturally Accelerate Fat Loss
            </h2>
            <p className="mb-3 text-gray-700">
              Our Herbal Fat Loss Formula is crafted with a powerful blend of
              natural ingredients designed to help you achieve your fitness
              goals. Using ancient herbal wisdom combined with modern science,
              our formula helps speed up metabolism, curb cravings, and support
              your body’s natural fat-burning processes
            </p>
            <ProductHero />
            <div className="flex gap-4">
              <Button
                label="Get Started Now"
                variant="btn-dark"
                size="xl"
                link="/"
              />
              <Button label="Buy Now" variant="btn-light" size="xl" link="/" />
            </div>
          </div>
          <div className="order-1 lg:order-1 relative w-full flex flex-col items-center sm:rounded-4xl rounded-2xl overflow-hidden border border-gray-200 bg-green-100">
            <Swiper
              spaceBetween={10}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Thumbs]}
              className="w-full aspect-square"
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <Image
                    src={src}
                    alt={`Product ${idx + 1}`}
                    width={500}
                    height={500}
                    className="w-full object-cover h-full"
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
              className=" w-38 sm:w-64 !absolute sm:bottom-7 bottom-3"
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx} className="cursor-pointer">
                  <Image
                    src={src}
                    alt={`Thumb ${idx + 1}`}
                    width={60}
                    height={60}
                    className="rounded-md sm:rounded-xl border border-gray-300 w-full h-full object-cover aspect-square"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section className="container mb-16 lg:mb-40">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <Image
            src="/images/fat-loss.jpg"
            alt="why Choose herbal fat loss"
            width={740}
            height={766}
            className="rounded-2xl"
          />
          <div>
            <Paragraph
              paragraph="Why Choose Our Herbal Fat Loss Formula?"
              textColor="text-dark"
              textSize="md:text-3xl lg:text-5xl text-2xl font-semibold"
              className="mb-8"
              highlightedWord="Why Choose"
            />
            <Accordion items={productWhyChoose} className="mx-auto mb-8" />
            <Button
              label="Get Started today"
              variant="btn-dark"
              size="xl"
              link="/"
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
            slidesPerView={3}
            spaceBetween={24}
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
              320: {
                slidesPerView: 1.3,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {keyIngredients.map((keyIngredients, index) => (
              <SwiperSlide key={index} className="!h-full">
                <div className="relative p-6 md:p-10 rounded-2xl bg-white h-full">
                  <div className="relative text-center">
                    <Image
                      src={keyIngredients.image}
                      alt={keyIngredients.title}
                      width={200}
                      height={200}
                      className="mx-auto mb-4 rounded-full aspect-square"
                    />
                    <h3 className="font-medium text-lg sm:text-2xl mb-2 lg:mb-4">
                      {keyIngredients.title}
                    </h3>
                    <p className="text-gray-500">
                      {keyIngredients.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-8 flex items-center justify-between">
            <div className="process-scrollbar-custom h-2 w-1/2 rounded-full bg-gray-200">
              <div className="swiper-scrollbar-drag !bg-primary"></div>
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
        </div>
      </section>
      <section className="mb-16 lg:mb-40">
        <div className="container ">
          <div className="p-10 bg-white rounded-2xl overflow-hidden">
            <Paragraph
              paragraph="How It Works"
              textColor="text-dark"
              className="lg:mb-10 md:mb-6 mb-4"
              highlightedWord="Works"
            />
            <p className="text-gray-700 mb-6">
              Our herbal fat loss formula works by targeting multiple aspects of
              fat burning. It helps raise your metabolism, reduce hunger
              cravings, and boost energy levels, making it easier to maintain a
              healthy, active lifestyle. When combined with a balanced diet and
              regular exercise, you can see real, sustainable results in your
              fat loss journey.
            </p>
            <Button
              label="Get Started today"
              variant="btn-dark"
              size="xl"
              link="/"
            />
            <Swiper
              className="!pt-8 border-t border-gray-200 mt-8 !overflow-visible how-it-works-product-slider"
              slidesPerView={3}
              spaceBetween={24}
              autoHeight
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 24,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
            >
              {howItWorks.map((howItWorks, index) => (
                <SwiperSlide
                  key={index}
                  className="relative !h-full !flex !flex-col items-center"
                >
                  <div className="bg-green-100 rounded-full min-h-16 min-w-16 flex justify-center items-center ">
                    <span className="text-3xl font-semibold text-green-800">
                      {index + 1}
                    </span>
                  </div>
                  <Image
                    src="/images/icon/slider-drip.svg"
                    alt="Clutch Logo"
                    width={53}
                    height={42}
                    className="-mt-3.5"
                  />
                  <div className="p-6 xl:p-10 rounded-2xl bg-green-100 h-full">
                    <h3 className="font-medium text-lg sm:text-xl sm:mb-4 mb-3">
                      {howItWorks.title}
                    </h3>
                    <p className="text-gray-700 mt-auto">
                      {howItWorks.description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section className="container mb-16 lg:mb-40">
        <div className=" grid md:grid-cols-2 gap-10 items-center">
        <Image
              src="/images/product.png"
              alt="Clutch Logo"
              width={691}
              height={586}
              className="rounded-2xl aspect-square object-cover"
            />
        <div >
              <Paragraph
                paragraph="Who Can Benefit?"
                textColor="text-dark"
                className="lg:mb-10 mb-6"
                highlightedWord="Benefit?"
              />
              <div className="space-y-5 lg:mb-10 mb-6">
          {Benefit.map((item, index) => (
            <div key={index} className="flex items-start ">
              <Image
                src="/images/icon/list.svg"
                alt="About hero image"
                width={24}
                height={24}
              />
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
              <div className="flex gap-4">
              <Button
                label="Get Started Now"
                variant="btn-dark"
                size="xl"
                link="/"
              />
              <Button label="Buy Now" variant="btn-light" size="xl" link="/" />
            </div>
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
            Take 1 tablet morning and evening daily with a glass of water,
            preferably 30 minutes before meals. For optimal results, pair with a
            healthy diet and exercise routine.
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
                Take 1 tablet morning and evening daily with a glass of water,
                preferably 30 minutes before meals. For optimal results, pair
                with a healthy diet and exercise routine.
              </p>
            </div>
            <Image
              src="/images/why-choose.png"
              alt="Clutch Logo"
              width={691}
              height={586}
              className="lg:order-2 order-1"
            />
        </div>
      </section>
      <Testimonials />
      <FaqAccordion items={weightlossfaqdata} className="mx-auto" />
    </>
  );
}
