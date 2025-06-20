"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";

import { PlaceholdersAndVanishInput } from "@/components/animationComponents/SearchInput";
import Accordion from "@/components/uiFramework/Accordion";
import {
  getSupportCategories,
  getSupportCategoryById,
  searchSupport,
} from "@/services/supportService";
import {
  SupportCategory,
  SupportCategoryDetails,
  SupportSearchResult,
} from "@/types/support";
import InlineSpinner from "@/components/uiFramework/InlineSpinner";
import { debounce } from "lodash";
import { useLanguage } from "@/contexts/LanguageContext";

const placeholdersvanish = [
  "Search for questions like 'how to track my order?'",
  "How can I reset my password?",
  "What are the payment options?",
  "How to earn reward coins?",
];

export default function Support() {
  const [categories, setCategories] = useState<SupportCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedCategoryDetails, setSelectedCategoryDetails] =
    useState<SupportCategoryDetails | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SupportSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getSupportCategories();
        if (response.success && response.data.length > 0) {
          setCategories(response.data);
          // Select the first category by default
          setSelectedCategoryId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch support categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        setLoadingFaqs(false); // Stop loading regular FAQs
        setSelectedCategoryId(null); // Deselect category
        try {
          const response = await searchSupport(query);
          if (response.success) {
            setSearchResults(response.data);
          }
        } catch (error) {
          console.error("Failed to perform search:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        if (categories.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(categories[0]._id);
        }
      }
    }, 500),
    [categories, selectedCategoryId]
  );

  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, performSearch]);

  useEffect(() => {
    if (!selectedCategoryId && !isSearching && searchTerm.trim() === "") return;
    if (!selectedCategoryId) return;

    const fetchCategoryDetails = async () => {
      try {
        setLoadingFaqs(true);
        setSelectedCategoryDetails(null); // Clear previous details
        const response = await getSupportCategoryById(selectedCategoryId);
        if (response.success) {
          setSelectedCategoryDetails(response.data);
        }
      } catch (error) {
        console.error(
          `Failed to fetch support category details for id ${selectedCategoryId}:`,
          error
        );
      } finally {
        setLoadingFaqs(false);
      }
    };

    fetchCategoryDetails();
  }, [selectedCategoryId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch.flush();
  };

  const getText = (obj: { en: string; hi: string }) => obj[language] || obj.en;

  const accordionItems = selectedCategoryDetails?.faqs.map((faq) => ({
    id: faq._id,
    question: getText(faq.question),
    answer: getText(faq.answer),
  }));

  return (
    <>
      <section className="w-full py-60 bg-cover bg-center bg-greenleaf lg:mb-20 mb-10">
        <div className="container text-center">
          <h1 className="text-5xl 2xl:text-6xl mb-8 font-semibold">
            Hello, How can we help?
          </h1>
          <div className="max-w-sm mx-auto mb-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholdersvanish}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
            />
          </div>
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition mb-2"
            aria-label="Toggle language"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
            {language === "en" ? "English" : "हिंदी"}
          </button>
        </div>
      </section>

      <section className="overflow-hidden lg:mb-40 mb-20">
        <div className="container">
          {loadingCategories ? (
            <div className="flex justify-center items-center h-48">
              <InlineSpinner />
            </div>
          ) : !isSearching && searchTerm.trim() === "" ? (
            <Swiper
              spaceBetween={16}
              slidesPerView={1.6} // mobile default
              slidesPerGroup={1}
              loop={false}
              autoHeight
              className="mb-16 !overflow-visible"
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 2.4,
                },
                1024: {
                  slidesPerView: 3.5,
                },
                1280: {
                  slidesPerView: 4.5,
                },
              }}
            >
              {categories.map((item) => (
                <SwiperSlide
                  key={item._id}
                  onClick={() => setSelectedCategoryId(item._id)}
                >
                  <div
                    className={`text-center !h-full bg-white group p-4 rounded-lg border ${
                      selectedCategoryId === item._id
                        ? "border-green-600"
                        : "border-transparent"
                    } hover:border-green-300 transition-colors duration-200 cursor-pointer`}
                  >
                    <span
                      className={`md:text-xl text-md font-medium ${
                        selectedCategoryId === item._id
                          ? "text-green-800"
                          : "text-gray-700 group-hover:text-green-800"
                      } `}
                    >
                      {getText(item.title)}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}

          <div>
            {isSearching ? (
              <div className="flex justify-center items-center py-10">
                <InlineSpinner />
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                {searchResults.map((result) => (
                  <div key={result._id} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                      {getText(result.title)}
                    </h2>
                    {result.matching_faqs.length > 0 ? (
                      <Accordion
                        items={result.matching_faqs.map((faq) => ({
                          id: faq._id,
                          question: getText(faq.question),
                          answer: getText(faq.answer),
                        }))}
                        className="mx-auto"
                      />
                    ) : (
                      <p className="text-gray-500">
                        No matching FAQs in this category.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : loadingFaqs ? (
              <div className="flex justify-center items-center py-10">
                <InlineSpinner />
              </div>
            ) : accordionItems && accordionItems.length > 0 ? (
              <Accordion items={accordionItems} className="mx-auto mb-8" />
            ) : (
              !isSearching && (
                <div className="text-center text-gray-600 py-10">
                  No frequently asked questions available for this category yet.
                  Please check back later!
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}