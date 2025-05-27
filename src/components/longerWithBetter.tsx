"use client";
import Image from "next/image";
import Paragraph from "./animationComponents/TextVisble";
import { motion } from "framer-motion";
import Button from "./uiFramework/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
const testimonials = [
  {
    name: "Purav Jha",
    product: "Sildenafil chews",
    image: "/images/weight-loss/product-main.png", // replace with actual image
    quotePart1: "My manhood wouldn’t work like it used to.",
    quotePart2:
      "The combo in my treatment makes me get hard and last for hours. It gave me the confidence in the bedroom and my lady enjoys it as well.",
  },
  {
    name: "Ravi Sharma",
    product: "Tadalafil capsules",
    image: "/images/weight-loss/product-main.png",
    quotePart1: "I was skeptical at first.",
    quotePart2:
      "But after a week of usage, I saw incredible results. My energy and confidence are back!",
  },
  {
    name: "Amit Verma",
    product: "Herbal vitality booster",
    image: "/images/weight-loss/product-main.png",
    quotePart1: "Natural and effective!",
    quotePart2:
      "I prefer herbal options, and this one actually works. No side effects, only results.",
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

const LongerWithBetter = () => {

  return (
    <>
      <section className=" bg-rackley md:py-20 py-12 rounded-4xl mb-20 lg:mb-32">
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
            <Image
              src="/images/improving-sexual/commponant-model.png"
              width={408}
              height={493}
              alt="weightloss model"
            />
            <div className="absolute bg-gradient-to-b from-transparent to-rackley h-28 w-full bottom-0"></div>
            <div className="grid sm:grid-cols-2 gap-4 -mt-[52px]">
              <Button
                label="Get Started"
                variant="btn-dark"
                size="xl"
                className="w-full"
                link="/"
              />
              <Button
                label="Take the test"
                variant="btn-light"
                size="xl"
                className="w-full"
                link="/"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <div className="bg-dark-rackley p-6 lg:p-10 rounded-3xl">
              <Image
                src="/images/weight-loss/product-main.png"
                width={336}
                height={336}
                alt="weightloss product"
                className="mb-6 md:h-[336px] h-56 w-full object-contain"
              />
              <h3 className="md:text-4xl sm:text-2xl text-xl mb-6 text-white font-medium">
                Have Longer, Better Sex with Rx + Climax Control
              </h3>
              <div className="flex gap-4">
                <Button
                  label="Get Started"
                  variant="btn-dark"
                  size="xl"
                  link="/"
                />
                <Button
                  label="Buy Now"
                  variant="btn-light"
                  size="xl"
                  link="/"
                />
              </div>
            </div>
            <div className="bg-dark-rackley p-6 lg:p-10 rounded-3xl">
              <Image
                src="/images/weight-loss/product-main.png"
                width={336}
                height={336}
                alt="weightloss product"
                className="mb-6 md:h-[336px] h-56 w-full object-contain"
              />
              <h3 className="md:text-4xl sm:text-2xl text-xl mb-6 text-white font-medium">
                Have Longer, Better Sex with Rx + Climax Control
              </h3>
              <div className="flex gap-4">
                <Button
                  label="Get Started"
                  variant="btn-dark"
                  size="xl"
                  link="/"
                />
                <Button
                  label="Buy Now"
                  variant="btn-light"
                  size="xl"
                  link="/"
                />
              </div>
            </div>
            <motion.div
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="bg-dark-rackley p-6 lg:p-10 rounded-3xl relative overflow-hidden"
            >
              <Image
                src="/images/improving-sexual/personalized-solution.jpg"
                width={336}
                height={336}
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
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index}>
                     <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={200}
                        height={200}
                        className="rotate-[20deg]"
                      />
                      <div>
                        <h3 className="text-white font-medium text-xl mb-2">
                          {testimonial.name}
                        </h3>
                        <p className="text-white mb-6 lg:mb-10">
                          {testimonial.product}
                        </p>
                      </div>
                      <p className="text-2xl">
                        <span className="text-gray-400">
                          “{testimonial.quotePart1}
                        </span>{" "}
                        <span className="text-white font-medium">
                          {testimonial.quotePart2}”
                        </span>
                      </p>
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
    </>
  );
};

export default LongerWithBetter;
