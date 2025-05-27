"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import Image from "next/image";

const stats = [
  { text: "100% Natural" },
  { text: "Science-Backed" },
  { text: "Premium Quality" },
];
export function ProductHero() {
  return (
    <>
       <div className="flex md:flex-row flex-col gap-4 p-6 bg-white rounded-2xl justify-between mb-6">
          {stats.map((item, index) => (
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
        <p className="md:text-xl text-lg font-medium text-dark mb-6">
          Start your transformation today with a personalized plan!
        </p>
    </>
  );
}
