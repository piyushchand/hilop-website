"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Paragraph from "./animationComponents/TextVisble";
import Button from "./uiFramework/Button";
import RoundButton from "./uiFramework/RoundButton";
import 'swiper/css/scrollbar';

const ourProcesscontent = [
  {
    title: "Take a Free Online Assessment",
    description:
      "Answer a few quick questions about your weight, lifestyle, and goals. Our expert-backed system will create a customized weight-loss plan tailored specifically for your body’s needs.",
  },
  {
    icon: "/images/icon/science-backed-formulas.svg",
    title: "Science-Backed Formulas",
    description:
      "Our herbal solutions combine ancient wisdom with modern scientific research for optimal results.",
  },
  {
    icon: "/images/icon/natural-ingredients.svg",
    title: "Natural Ingredients",
    description:
      "100% pure herbal ingredients, free from chemicals and artificial additives.",
  },
  {
    icon: "/images/icon/fast-acting-results.svg",
    title: "Fast-Acting Results",
    description:
      "Our formulas are designed to provide quick, noticeable benefits while promoting long-term wellness.",
  },
  {
    icon: "/images/icon/customer-focused.svg",
    title: "Customer Focused",
    description:
      "We prioritize your wellness journey with personalized support and guidance.",
  },
  {
    icon: "/images/icon/sustainable-practices.svg",
    title: "Sustainable Practices",
    description:
      "Eco-friendly sourcing and packaging that respects both your body and the planet.",
  },
];
export function OurProcess() {
  return (
    <>
      <section className="mb-16 lg:mb-40">
        <div className="container">
          <div className="grid lg:grid-cols-[auto_560px] items-center mb-6">
            {" "}
           <div>
           <span className="top-content-badge">Our Process</span>
            <Paragraph
              paragraph="How It Works"
              textColor="text-dark"
              className="mb-10"
              highlightedWord="It Works"
            />
           </div>
            <div>
              <p className="mb-6">
              We ve made it simple to find the right product for your needs through our personalized consultation process.
              </p>
              <Button label="About us" variant="btn-dark" size="xl" />
            </div>
          </div>
          <Swiper
                modules={[Navigation, Scrollbar, A11y]}
                slidesPerView={3}
                spaceBetween={80}
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
                    spaceBetween: 30,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 60,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 80,
                  },
                }}
              >
                {ourProcesscontent.map((ourProcesscontent, index) => (
                  <SwiperSlide key={index}>
                      <div className="pt-20 relative">
                        <span className="text-[146px] text-green-100 top-0 end-0 font-semibold absolute leading-[146px]">{index + 1}</span>
                       <div className="relative">
                       <h3 className="font-medium text-xl mb-4">
                          {ourProcesscontent.title}
                        </h3>
                        <p>
                          {ourProcesscontent.description}
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
    </>
  );
}
