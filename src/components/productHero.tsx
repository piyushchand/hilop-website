"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkmark } from "./checkmark";

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
          <Checkmark key={index} text={item.text} className="mb-2" />
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
