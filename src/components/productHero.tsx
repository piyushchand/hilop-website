"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = {
  en: [
    { text: "100% Natural" },
    { text: "Science-Backed" },
    { text: "Premium Quality" },
  ],
  hi: [
    { text: "100% प्राकृतिक" },
    { text: "वैज्ञानिक रूप से समर्थित" },
    { text: "प्रीमियम क्वालिटी" },
  ]
};

export function ProductHero() {
  const { language } = useLanguage();
  const currentStats = stats[language] || stats.en;

  return (
    <>
      <div className="flex md:flex-row flex-col gap-4 p-6 bg-white rounded-2xl justify-between mb-6">
        {currentStats.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
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
        {language === 'en' 
          ? "Start your transformation today with a personalized plan!"
          : "आज ही एक व्यक्तिगत योजना के साथ अपना परिवर्तन शुरू करें!"}
      </p>
    </>
  );
}
