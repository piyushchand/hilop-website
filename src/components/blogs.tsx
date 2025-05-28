"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Paragraph from "./animationComponents/TextVisble";
import Button from "./uiFramework/Button";
import Image from "next/image";
import { Marquee } from "./animationComponents/Marquee";

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
          <div className="grid justify-between grid-cols-[auto_172px] items-center mb-6">
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
              <Button label="View All Blogs" variant="btn-dark" size="xl" link="/blog" />
            </div>
          </div>
        </div>
        <Marquee pauseOnHover className="[--duration:90s]">
          {Blogscontent.map((Blogscontent, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl md:rounded-4xl p-4 md:p-10 aspect-[380/189] xl:min-w-xl lg:min-w-lg md:min-w-md sm:min-w-sm"
            >
              <Image
                src={Blogscontent.image}
                alt={Blogscontent.title}
                width={1520}
                height={1080}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute top-0 left-0 h-1/2 w-full bg-gradient-to-t from-transparent to-black/50 z-10" />
              <h3 className="text-white lg:text-5xl font-semibold text-xl mb-4 relative z-20">
                {Blogscontent.title}
              </h3>
            </div>
          ))}
        </Marquee>
      </section>
    </>
  );
}
