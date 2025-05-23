"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Paragraph from "./animationComponents/TextVisble";
import Button from "./uiFramework/Button";
import Image from "next/image";

const Blogscontent = [
  {
    image: "/images/blogs/1.jpg",
    title: "How long does minoxidil take to work?",
  },
  {
    image: "/images/blogs/1.jpg",
    title: "How long does minoxidil take to work?",
  },
  {
    image: "/images/blogs/1.jpg",
    title: "How long does minoxidil take to work?",
  },
  {
    image: "/images/blogs/1.jpg",
    title: "How long does minoxidil take to work?",
  },
 
];
export function Blogs() {
  return (
    <>
      <section className="mb-16 lg:mb-40 overflow-hidden">
        <div className="container">
          <div className="flex justify-between  items-center mb-6">
            {" "}
           <div>
           <span className="top-content-badge">Blogs</span>
            <Paragraph
              paragraph="Insights for Hilop"
              textColor="text-dark"
              highlightedWord="Insights for"
            />
           </div>
            <div>
              <Button label="View All Blogs" variant="btn-dark" size="xl" />
            </div>
          </div>
          <Swiper
                modules={[Navigation]}
                className="!overflow-visible"
                loop={true}
                spaceBetween={12}
                slidesPerView={1}
                navigation={{
                  nextEl: '.process-next-button',
                  prevEl: '.process-prev-custom',
                }}
              >
                {Blogscontent.map((Blogscontent, index) => (
                  <SwiperSlide key={index}>
                      <div className=" relative overflow-hidden aspect-[380/189] rounded-4xl p-10">
                        <Image
                        src={Blogscontent.image}
                        alt={Blogscontent.title}
                        width={1520}
                        height={1080}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                className="absolute top-0 left-0 h-1/2 w-full bg-gradient-to-t from-transparent to-black/50 z-10"
              />
                        <h3 className="text-white lg:text-4xl font-semibold text-xl mb-4 relative z-20">
                          {Blogscontent.title}
                        </h3>
                      </div>
                  </SwiperSlide>
                ))}
              </Swiper>
        </div>
      </section>
    </>
  );
}
