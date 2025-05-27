"use client";
import { useState } from "react";
import { ProductHero } from "@/components/productHero";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper';
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
    id: 'faq1',
    question: 'Boost Metabolism',
    answer:
      'Our carefully selected herbs work synergistically to increase your metabolic rate, helping your body burn calories faster, even at rest.',
  },
  {
    id: 'faq2',
    question: 'Natural Appetite Suppression',
    answer:
      'Say goodbye to constant cravings and overeating. The herbal ingredients help to naturally curb hunger, promoting a balanced and sustainable eating pattern.',
  },
  {
    id: 'faq3',
    question: 'Energy and Focus',
    answer:
      'Feel energized and focused throughout the day without the jitters. Our formula includes herbs that support sustained energy and mental clarity while you work toward your fat loss goals.',
  },
  {
    id: 'faq4',
    question: 'Support Healthy Digestion',
    answer:
      'A healthy digestive system is key to weight management. Our herbal blend promotes digestive health, ensuring that your body absorbs nutrients efficiently and eliminates waste naturally.',
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
    id: 'faq1',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq2',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq3',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq4',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq5',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  
];
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
            <h1 className="text-5xl 2xl:text-6xl mb-6 font-semibold">
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
          <div className="order-1 lg:order-1 relative w-full flex flex-col items-center sm:rounded-4xl rounded-2xl overflow-hidden">
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
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
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
             <Accordion
              items={productWhyChoose}
              className="mx-auto mb-8"
            />
             <Button
            label="Get Started today"
            variant="btn-dark"
            size="xl"
            link="/"
          />
          
          </div>
        </div>
      </section>
      <section className="mb-16 lg:mb-40">
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
                slidesPerView={3}
                spaceBetween={24}
                navigation={{
                  nextEl: '.process-next-button',
                  prevEl: '.process-prev-custom',
                }}
                scrollbar={{
                  el: '.process-scrollbar-custom',
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
                  <SwiperSlide key={index}>
                      <div className="pt-20 relative p-10 rounded-2xl bg-white h-full">
                        <div className="relative text-center">
                        <Image
                          src={keyIngredients.image}
                          alt={keyIngredients.title}
                          width={200}
                          height={200}
                          className="mx-auto mb-4 rounded-full aspect-square"
                        />
                       <h3 className="font-medium text-lg sm:text-2xl mb-4">
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
      <Testimonials />
      <FaqAccordion
              items={weightlossfaqdata}
              className="mx-auto"
            />
    </>
  );
}
