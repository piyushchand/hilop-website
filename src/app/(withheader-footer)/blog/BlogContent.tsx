"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/animationComponents/3DCard";

interface SliderItem {
  id: number;
  title: string;
}

interface BlogPost {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  readTime: number;
  date: string;
}

const sliderData: SliderItem[] = [
  { id: 0, title: "All" },
  { id: 1, title: "Weight loss" },
  { id: 2, title: "Better sex" },
  { id: 3, title: "Intake sex" },
  { id: 4, title: "Longer sex" },
  { id: 5, title: "Product update" },
  { id: 6, title: "Diet chart" },
  { id: 7, title: "Daily log" },
];

const generateDummyBlogData = (): BlogPost[] => {
  const categories = sliderData.slice(1).map((item) => item.title);
  const titles = [
    "The Truth About Natural Supplements – Do They Really Work?",
    "5 Ways to Boost Your Energy Naturally",
    "Understanding the Science Behind Weight Management",
    "How Natural Ingredients Can Improve Your Performance",
    "The Connection Between Diet and Sexual Health",
    "Breaking Down the Benefits of Herbal Extracts",
    "Natural Ways to Enhance Your Stamina and Endurance",
    "The Role of Antioxidants in Overall Wellness",
  ];
  const descriptions = [
    "Natural supplements are everywhere—but do they actually deliver results? We break down the science behind herbal remedies and plant-based treatments.",
    "Discover how simple lifestyle changes and natural ingredients can significantly boost your energy levels without relying on caffeine or artificial stimulants.",
    "Learn about the complex relationship between metabolism, nutrition, and exercise in managing weight effectively and sustainably.",
    "Explore how certain natural compounds can enhance physical and mental performance without harmful side effects.",
    "Understand how your dietary choices directly impact your sexual health and performance, with tips for improvement.",
    "A detailed analysis of popular herbal extracts and their evidence-based benefits for various aspects of health.",
    "Practical advice for building stamina naturally through a combination of nutrition, exercise, and supplementation.",
    "How antioxidant-rich foods and supplements can combat oxidative stress and support long-term health.",
  ];

  return Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    description: descriptions[i % descriptions.length],
    imageUrl: "/images/blogs/1.jpg",
    category: categories[i % categories.length],
    readTime: Math.floor(Math.random() * 13) + 3,
    date: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000)
      .toISOString()
      .split("T")[0],
  }));
};

const blogData = generateDummyBlogData();

export default function BlogContent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const filteredPosts =
    activeIndex === 0
      ? blogData
      : blogData.filter(
          (post) => post.category === sliderData[activeIndex].title
        );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIdx = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIdx, startIdx + postsPerPage);

  const paginate = (page: number) => setCurrentPage(page);

  const getPageNumbers = (): (number | string)[] => {
    const maxPagesToShow = 5;
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) endPage = 4;
      if (currentPage >= totalPages - 2) startPage = totalPages - 3;

      if (startPage > 2) pageNumbers.push("...");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleCategoryChange = (index: number) => {
    setActiveIndex(index);
    setCurrentPage(1);
  };

  return (
    <>
      <section className="w-full h-[320px] bg-cover bg-center bg-greenleaf lg:mb-20 mb-10">
        <div className="container text-center h-full flex flex-col justify-center">
          <h1 className="top-content-badge mx-auto">Hilop Health Blog</h1>
          <h2 className="text-5xl 2xl:text-6xl mb-4 font-semibold">
            Your Guide to <span className="text-primary">Natural Wellness</span>
          </h2>
          <p className="text-gray-600">
            Stay informed with expert insights, wellness tips, and myth-busting
            facts about{" "}
            <span className="font-medium text-dark">
              natural health, skincare, weight management, and performance
              enhancement.
            </span>
          </p>
        </div>
      </section>

      <section className="overflow-hidden">
        <div className="container overflow-visible">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView="auto"
            speed={600}
            className="!overflow-visible lg:mb-20 mb-10"
          >
            {sliderData.map((item, index) => (
              <SwiperSlide key={item.id} className="!w-auto">
                <Button
                  label={item.title}
                  variant={activeIndex === index ? "btn-dark" : "btn-Border"}
                  size="xl"
                  onClick={() => handleCategoryChange(index)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 lg:gap-8 mb-10">
            {currentPosts.map((post) => (
              <CardContainer
                key={post.id}
                containerClassName="h-full col-span-4 sm:col-span-2 md:col-span-1"
                className="bg-white rounded-2xl h-full group"
              >
                <CardBody>
                  <CardItem translateZ="100" className="w-full">
                    <Image
                      src={post.imageUrl}
                      width={491}
                      height={244}
                      alt={post.title}
                      className="aspect-[2/1] rounded-2xl w-full object-cover"
                    />
                  </CardItem>

                  <div className="flex justify-between items-center px-6 mt-6 mb-3">
                    <CardItem
                      as="span"
                      className="text-xs font-medium text-green-800 bg-primary/10 px-3 py-1 rounded-full"
                      translateZ={20}
                    >
                      {post.category}
                    </CardItem>
                    <CardItem
                      translateZ={20}
                      as="span"
                      className="text-xs text-gray-500"
                    >
                      {post.readTime} min read
                    </CardItem>
                  </div>

                  <CardItem
                    as="h3"
                    translateZ="50"
                    className="sm:text-xl text-lg font-medium mb-3 line-clamp-2 px-6 group-hover:text-green-800 transition-colors duration-300"
                  >
                    {post.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-gray-600 mb-6 line-clamp-3 px-6"
                  >
                    {post.description}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-20">
              <Button
                label="Prev"
                variant={currentPage === 1 ? "btn-Border" : "btn-dark"}
                size="lg"
                onClick={() => {
                  if (currentPage > 1) paginate(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />

              {getPageNumbers().map((num, i) =>
                typeof num === "number" ? (
                  <Button
                    key={i}
                    label={num.toString()}
                    variant={currentPage === num ? "btn-dark" : "btn-Border"}
                    size="lg"
                    className="aspect-square w-[42px] h-[42px]"
                    onClick={() => paginate(num)}
                  />
                ) : (
                  <span key={i} className="px-2 select-none">
                    {num}
                  </span>
                )
              )}

              <Button
                label="Next"
                variant={
                  currentPage === totalPages ? "btn-Border" : "btn-dark"
                }
                size="lg"
                onClick={() => {
                  if (currentPage < totalPages) paginate(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
