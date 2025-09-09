"use client";
import { useState } from "react";
import Image from "next/image";
import Paragraph from "./animationComponents/TextVisble";
import { motion } from "framer-motion";
import Button from "./uiFramework/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TestModal from "./model/TestModal";

const testimonials = [
  {
    name: "Rajwinder Raja, Delhi ",
    product: "Awesome",
    image: "/images/weight-loss/Transparent Capsule.png", // replace with actual image
    quotePart1:
      "The product really helped me in boosting mine energy levels, i consumed these product and I can changes in mine body. Very effective, go for it.",
    // quotePart2:
    //   "The combo in my treatment makes me get hard and last for hours. It gave me the confidence in the bedroom and my lady enjoys it as well.",
  },
  {
    name: "Daisy, Kochi",
    product: "Great product",
    image: "/images/weight-loss/Transparent Capsule.png",
    quotePart1:
      "After use I have noticed it boost my stamina and energy levels. It improves blood flow too. It has all natural ingridients. Also it improves your immune system and helps in workout too.",
    //   quotePart2:
    //     "But after a week of usage, I saw incredible results. My energy and confidence are back!",
  },
  {
    name: "Deewan, Mumbai ",
    product: "Terrific",
    image: "/images/weight-loss/Transparent Capsule.png",
    quotePart1:
      "Amazing product! Boosted my energy and stamina noticeably. The natural ingredients make it a healthy choice",
    // quotePart2:
    //   "I prefer herbal options, and this one actually works. No side effects, only results.",
  },
  {
    name: "Subham Choudhury, Ahmedabad ",
    product: "Perfect product!",
    image: "/images/weight-loss/Transparent Capsule.png", // replace with actual image
    quotePart1:
      " Excellent product. Improves strength and stamina. You can feel energetic throughout the day. A good choice for health benefits. ",
    // quotePart2:
    //   "The combo in my treatment makes me get hard and last for hours. It gave me the confidence in the bedroom and my lady enjoys it as well.",
  },
  {
    name: "Shobhit Kumar, Chennai",
    product: "wow!",
    image: "/images/weight-loss/Transparent Capsule.png",
    quotePart1:
      " Nice product really works I feel the difference good product by Hilop and Very impressed with the quality of this product. L-Arginine has a number of excellent health benefits.",
    //   quotePart2:
    //     "But after a week of usage, I saw incredible results. My energy and confidence are back!",
  },
  {
    name: "Neha Singh, Lucknow ",
    product: "Glorious!",
    image: "/images/weight-loss/Transparent Capsule.png",
    quotePart1:
      "It’s not just about weight loss; it’s about feeling alive again. Hilop’s booster gave my body the push it needed. I’ve already recommended it to 3 friends.",
    // quotePart2:
    //   "I prefer herbal options, and this one actually works. No side effects, only results.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Add props to the component
interface LongerWithBetterProps {
  productId1?: string;
  testId1?: string;
  productId2?: string;
  testId2?: string;
}

const LongerWithBetter = ({
  productId1,
  testId1,
  productId2,
  testId2,
}: LongerWithBetterProps) => {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  return (
    <>
      <section className=" bg-rackley md:py-20 py-12 rounded-4xl mb-16 lg:mb-20">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <Paragraph
              align="center"
              paragraph="Give your best performance in the bedroom"
              textColor="text-white"
              textSize="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-semibold"
              className="mb-6 md:mb-10 max-w-5xl"
            />
          </div>
          <div className="max-w-fit mx-auto sm:-mt-20 -mt-13 relative mb-16">
            <motion.img
              src="/images/improving-sexual/commponant-model.png"
              width={408}
              height={493}
              alt="weightloss model"
              initial={{ y: 100, opacity: 0 }} // Start 100px below and invisible
              whileInView={{ y: 0, opacity: 1 }} // Animate to original position and visible
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }} // Animate once when 50% visible
              style={{ display: "block" }}
            />
            <div className="absolute bg-gradient-to-b from-transparent to-rackley h-28 w-full bottom-0"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center -mt-[30px]">
              {productId1 && (
                <Button
                  label="GET STARTED "
                  variant="btn-dark"
                  size="xl"
                  className="w-full sm:w-55"
                  link={`/product/${productId1}`}
                />
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <div className="bg-dark-rackley p-6 lg:p-8 rounded-3xl">
              <Image
                src="/images/weight-loss/Harveda.png"
                width={340}
                height={340}
                alt="weightloss product"
                className="mb-[3.5rem] md:h-[290px] h-50 w-full object-contain mt-6"
              />
              <h3 className="md:text-4xl sm:text-2xl text-xl mb-6 text-white font-medium">
                Natural For Improve Testosterone, Stamina & Energy
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {testId1 && (
                  <Button
                    label="GET STARTED "
                    variant="btn-dark"
                    size="xl"
                    className="w-full sm:w-auto"
                    link={`/consultation?testId=${testId1}`}
                  />
                )}
                {productId1 && (
                  <Button
                    label="ADD TO CART"
                    variant="btn-light"
                    size="xl"
                    className="w-full sm:w-auto"
                    link={`/product/${productId1}`}
                  />
                )}
              </div>
            </div>
            <div className="bg-dark-rackley p-6 lg:p-10 rounded-3xl">
              <Image
                src="/images/weight-loss/Boldrise.png"
                width={340}
                height={340}
                alt="weightloss product"
                className="mb-6 md:h-[340px] h-56 w-full object-contain"
              />
              <h3 className="md:text-4xl sm:text-2xl text-xl mb-6 text-white font-medium">
                Last Longer Herbal Sexual Enhancer Powder
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {testId2 && (
                  <Button
                    label="GET STARTED "
                    variant="btn-dark"
                    size="xl"
                    className="w-full sm:w-auto"
                    link={`/consultation?testId=${testId2}`}
                  />
                )}
                {productId2 && (
                  <Button
                    label="ADD TO CART"
                    variant="btn-light"
                    size="xl"
                    className="w-full sm:w-auto"
                    link={`/product/${productId2}`}
                  />
                )}
              </div>
            </div>
            <motion.div
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="bg-dark-rackley p-6 lg:p-10 rounded-3xl relative overflow-hidden"
            >
              <Image
                src="/images/improving-sexual/personalized-solution.png"
                width={732}
                height={570}
                alt="personalized solution"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Animated Gradient Overlay */}
              <motion.div
                className="absolute top-0 left-0 h-1/2 w-full bg-gradient-to-t from-transparent to-black/50 z-10"
                variants={{
                  rest: { opacity: 0 },
                  hover: { opacity: 1 },
                }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative h-full flex-col flex z-20">
                <h3 className="text-2xl font-medium mb-2 text-white">
                  Personalized Solution
                </h3>
                <p className="text-gray-200">
                  How Do You Want to Improve Your Sex Life?
                </p>
                <motion.div
                  className="mt-auto flex-col flex gap-3 lg:gap-5 items-end"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }} // 'once' runs it one time only, 'amount' defines visibility threshold
                >
                  {[
                    "Get hard",
                    "Last longer",
                    "Staying hard",
                    "All of the above",
                  ].map((text, index) => (
                    <motion.span
                      key={index}
                      className="bg-black/20 backdrop-blur-lg text-xs lg:text-base rounded-full px-2 py-1 lg:px-4 lg:py-2 text-white"
                      variants={itemVariants}
                    >
                      {text}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            <div className="bg-dark-rackley p-10 lg:p-20 rounded-3xl relative">
              <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex flex-col items-center text-center space-y-2 sm:items-start sm:text-left max-w-md mx-auto">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={100}
                        height={100}
                        className=""
                      />
                      <div>
                        <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl leading-tight break-words mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-white text-sm sm:text-base mb-3 break-words">
                          {testimonial.product}
                        </p>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                        <span className="text-gray-400">
                          “{testimonial.quotePart1} “
                        </span>{" "}
                        {/* <span className="text-white font-medium">
                        {testimonial.quotePart2}”
                      </span> */}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute left-1 lg:left-4 top-1/2 -translate-y-1/2 z-10">
                <button className="bg-white/20 p-2 rounded-full swiper-button-prev-custom">
                  <ArrowLeft className="text-white" size={20} />
                </button>
              </div>
              <div className="absolute right-1 lg:right-4 top-1/2 -translate-y-1/2 z-10">
                <button className="bg-white/20 p-2 rounded-full swiper-button-next-custom">
                  <ArrowRight className="text-white" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </>
  );
};

export default LongerWithBetter;
