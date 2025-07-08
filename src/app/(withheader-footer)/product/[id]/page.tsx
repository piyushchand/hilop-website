"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/uiFramework/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { A11y, Navigation, Scrollbar, Thumbs } from "swiper/modules";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLoading } from "@/contexts/LoadingContext";
import { getText } from "@/utils/getText";
import Image from "next/image";
import "swiper/css";
import "swiper/css/thumbs";
import { BadgeCheck } from "lucide-react";
import Accordion from "@/components/uiFramework/Accordion";
import RoundButton from "@/components/uiFramework/RoundButton";
import Paragraph from "@/components/animationComponents/TextVisble";
import { Testimonials } from "@/components/testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import { Checkmark } from "@/components/checkmark";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import type { Product as ProductType } from '@/types/index';
import { useRouter } from "next/navigation";

// Define a type for the dynamic content to ensure consistency
interface ProductDynamicContent {
  customImage: string;
  whyChooseTitle: string;
  benefitTags: string[];
  benefitImage: string;
  howItWorksDescription: { en: string; hi: string };
  howToUseDescription: { en: string; hi: string };
  whyChooseUsSectionDescription: { en: string; hi: string };
}

// Consolidated Dynamic content mapping based on product name
const PRODUCT_DYNAMIC_CONTENT: Record<string, ProductDynamicContent> = {
  Slimvibe: {
    customImage: "/images/weight-loss/why-choose.jpg",
    whyChooseTitle: "Our Herbal Fat Loss Formula?",
    benefitTags: [
      "Individuals looking to support their weight loss goals naturally.",
      "Those who want to increase their energy levels and improve overall health.",
      "People who are tired of crash diets or artificial weight loss products and prefer a more holistic approach.",
    ],
    benefitImage: "/images/weight-loss/who-can-benefit.jpg",
    howItWorksDescription: {
      en: "Our Slimvibe formula works by boosting your metabolism, reducing cravings, and promoting natural fat burning. It helps you achieve sustainable weight loss without harsh chemicals.",
      hi: "हमारा स्लिमवाइब फॉर्मूला आपके मेटाबॉलिज्म को बढ़ाकर, क्रेविंग को कम करके और प्राकृतिक वसा जलने को बढ़ावा देकर काम करता है। यह आपको कठोर रसायनों के बिना स्थायी वजन घटाने में मदद करता है।",
    },
    howToUseDescription: {
      en: "Take two capsules daily with water, preferably before meals. For best results, combine with a balanced diet and regular exercise.",
      hi: "रोजाना दो कैप्सूल पानी के साथ लें, अधिमानतः भोजन से पहले। सर्वोत्तम परिणामों के लिए, संतुलित आहार और नियमित व्यायाम के साथ मिलाएं।",
    },
    whyChooseUsSectionDescription: {
      en: "Our Slimvibe formula is crafted using premium, organic herbal ingredients, ensuring a clean, chemical-free experience tailored for natural weight loss. Support your natural balance and feel confident as you move toward a healthier, more energized lifestyle.",
      hi: "हमारा स्लिमवाइब फॉर्मूला प्रीमियम, जैविक हर्बल सामग्री का उपयोग करके तैयार किया गया है, जो प्राकृतिक वजन घटाने के लिए एक स्वच्छ, रसायन-मुक्त अनुभव सुनिश्चित करता है। अपने प्राकृतिक संतुलन का समर्थन करें और एक स्वस्थ, अधिक ऊर्जावान जीवन शैली की ओर बढ़ते हुए आत्मविश्वास महसूस करें।",
    },
  },
  BoldRise: {
    customImage: "/images/instant-boost/why-choose.jpg",
    whyChooseTitle: "Our Herbal Instant Sexual Enhancer?",
    benefitTags: [
      "Men looking to enhance their performance and energy levels naturally.",
      "Those who want to increase their libido and desire without relying on chemicals.",
      "Individuals who are looking to support their overall vitality and well-being.",
    ],
    benefitImage: "/images/instant-boost/who-can-benefit.jpg",
    howItWorksDescription: {
      en: "BoldRise works by naturally increasing blood flow and enhancing your body's natural response to arousal, providing an instant boost in performance and stamina.",
      hi: "बोल्डराइज स्वाभाविक रूप से रक्त प्रवाह को बढ़ाकर और उत्तेजना के लिए आपके शरीर की प्राकृतिक प्रतिक्रिया को बढ़ाकर काम करता है, जो प्रदर्शन और सहनशक्ति में तत्काल वृद्धि प्रदान करता है।",
    },
    howToUseDescription: {
      en: "Take one capsule 30 minutes before activity. Do not exceed one capsule per day.",
      hi: "गतिविधि से 30 मिनट पहले एक कैप्सूल लें। प्रति दिन एक कैप्सूल से अधिक न लें।",
    },
    whyChooseUsSectionDescription: {
      en: "Our BoldRise formula uses a powerful blend of natural herbs to provide immediate and noticeable improvements in sexual performance and energy, without any artificial additives.",
      hi: "हमारा बोल्डराइज फॉर्मूला यौन प्रदर्शन और ऊर्जा में तत्काल और ध्यान देने योग्य सुधार प्रदान करने के लिए प्राकृतिक जड़ी-बूटियों के एक शक्तिशाली मिश्रण का उपयोग करता है, जिसमें कोई कृत्रिम योजक नहीं होता है।",
    },
  },
  Hardveda: {
    customImage: "/images/improving-sexual/why-choose.jpg",
    whyChooseTitle: "Our Herbal Sexual Wellness formula?",
    benefitTags: [
      "Men looking to naturally boost their testosterone levels and support sexual wellness.",
      "Individuals experiencing low energy, reduced libido, or a decrease in overall vitality.",
      "Those who want to enhance performance, stamina, and confidence in intimate moments.",
      "Active individuals who want to support muscle mass, strength, and energy levels.",
    ],
    benefitImage: "/images/improving-sexual/who-can-benefit.jpg",
    howItWorksDescription: {
      en: "Hardveda supports sexual wellness by optimizing hormonal balance and improving overall reproductive health, leading to increased vitality and improved performance over time.",
      hi: "हार्डवेदा हार्मोनल संतुलन को अनुकूलित करके और समग्र प्रजनन स्वास्थ्य में सुधार करके यौन कल्याण का समर्थन करता है, जिससे समय के साथ बढ़ी हुई जीवन शक्ति और बेहतर प्रदर्शन होता है।",
    },
    howToUseDescription: {
      en: "Take one capsule twice daily after meals. Consistent use is recommended for optimal results.",
      hi: "भोजन के बाद दिन में दो बार एक कैप्सूल लें। इष्टतम परिणामों के लिए लगातार उपयोग की सिफारिश की जाती है।",
    },
    whyChooseUsSectionDescription: {
      en: "Hardveda is formulated with traditional Ayurvedic herbs known for their powerful benefits in male sexual health, offering a natural and holistic approach to wellness.",
      hi: "हार्डवेदा पारंपरिक आयुर्वेदिक जड़ी-बूटियों के साथ तैयार किया गया है जो पुरुष यौन स्वास्थ्य में उनके शक्तिशाली लाभों के लिए जानी जाती हैं, जो कल्याण के लिए एक प्राकृतिक और समग्र दृष्टिकोण प्रदान करती हैं।",
    },
  },
};

// Helper function to get product-specific content with fallbacks
const getProductContent = (productName: string): ProductDynamicContent => {
  const normalizedName = productName?.trim();
  const defaultContent: ProductDynamicContent = {
    customImage: "/images/why-choose.png",
    whyChooseTitle: "Our Herbal Wellness Formula?",
    benefitTags: [
      "Individuals looking to support their wellness goals naturally.",
      "Those who want to improve their overall health and vitality.",
      "People who prefer natural, holistic approaches to wellness.",
    ],
    benefitImage: "/images/why-choose.png",
    howItWorksDescription: {
      en: "Our herbal wellness formula works by naturally supporting your body's systems, promoting balance and overall well-being. It is designed to gently enhance your health without harsh side effects.",
      hi: "हमारा हर्बल वेलनेस फॉर्मूला स्वाभाविक रूप से आपके शरीर की प्रणालियों का समर्थन करके, संतुलन और समग्र कल्याण को बढ़ावा देकर काम करता है। इसे बिना किसी कठोर दुष्प्रभाव के आपके स्वास्थ्य को धीरे-धीरे बढ़ाने के लिए डिज़ाइन किया गया है।",
    },
    howToUseDescription: {
      en: "Follow the instructions on the product label. Generally, take the recommended dosage daily with water.",
      hi: "उत्पाद लेबल पर दिए गए निर्देशों का पालन करें। आम तौर पर, पानी के साथ रोजाना अनुशंसित खुराक लें।",
    },
    whyChooseUsSectionDescription: {
      en: "Our wellness formula is crafted using premium, organic herbal ingredients, ensuring a clean, chemical-free experience. Support your natural balance and feel confident as you move toward a healthier, more energized lifestyle.",
      hi: "हमारा वेलनेस फॉर्मूला प्रीमियम, जैविक हर्बल सामग्री का उपयोग करके तैयार किया गया है, जो एक स्वच्छ, रसायन-मुक्त अनुभव सुनिश्चित करता है। अपने प्राकृतिक संतुलन का समर्थन करें और एक स्वस्थ, अधिक ऊर्जावान जीवन शैली की ओर बढ़ते हुए आत्मविश्वास महसूस करें।",
    },
  };

  return PRODUCT_DYNAMIC_CONTENT[normalizedName] || defaultContent;
};

interface WhyChooseUsItem {
  title?: string;
  description?: string;
  question?: string;
  answer?: string;
}

interface FaqAccordionItem {
  title?: string;
  description?: string;
  question?: string;
  answer?: string;
}

interface KeyIngredient {
  image: string;
  title: string;
  description: string;
}

// Extend ProductType locally to add missing optional properties if needed
interface ProductWithExtras extends ProductType {
  why_choose_us?: (string | WhyChooseUsItem)[];
  faqs?: (string | FaqAccordionItem)[];
  key_ingredients?: KeyIngredient[];
  description?: { en: string; hi: string };
  how_it_works?: { en: string; hi: string };
}

const howItWorks = [
  {
    title: "Take a Free Online Assessment",
    description:
      "Answer a few quick questions about your weight, lifestyle, and goals. Our expert-backed system will create a customized weight-loss plan tailored specifically for your body's needs.",
  },
  {
    title: "Get a 100% Natural, Customized Treatment",
    description:
      "Your personalized plant-based treatment is scientifically designed to help you burn fat, boost metabolism, and reduce cravings—naturally and effectively.",
  },
  {
    title: "Fast, Discreet Shipping to Your Doorstep",
    description:
      "Enjoy hassle-free, discreet delivery, ensuring privacy and convenience so you can start your transformation right away.",
  },
  {
    title: "Unlock the Daily Progress Tracker",
    description:
      "Capture your transformation with daily photo tracking and see your body change over time. Stay motivated as you reach your goals!",
  },
  {
    title: "Track Progress & Earn Hilop Rewards",
    description:
      "Stay on top of your journey with goal tracking, reminders, and Hilop Coins, which you can redeem for exclusive discounts.",
  },
  {
    title: "See Real Results—Or Your Money Back!",
    description:
      "Most customers see noticeable changes in just 30 days! If you're not satisfied, you're protected by our 100% money-back guarantee—no risk, no worries.",
  },
];

export default function ProductPage() {
  const params = useParams();
  const { language } = useLanguage();
  const { showLoading, hideLoading } = useLoading();
  const [product, setProduct] = useState<ProductWithExtras | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const router = useRouter();

  const handleThumbsSwiper = useCallback((swiper: SwiperType) => {
    // Add custom class to swiper-wrapper
    swiper.wrapperEl.classList.add("justify-center");
  }, []);

  useEffect(() => {
    const productId = params?.id as string;
    if (!productId) {
      setError("Product ID is missing");
      return;
    }

    const fetchProduct = async () => {
      try {
        showLoading();
        setError(null);
        if (!process.env.NEXT_PUBLIC_API_URL)
          throw new Error("API URL is not set in environment variables");
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}?lang=${language}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error("Invalid response format from server");
        }

        setProduct(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        hideLoading();
      }
    };

    fetchProduct();
  }, [params?.id, language]);

  // Buy Now handler
  const handleBuyNow = useCallback(async () => {
    const productId =
      product &&
      (typeof (product as ProductWithExtras & { _id?: string })._id === "string"
        ? (product as ProductWithExtras & { _id?: string })._id
        : product._id);
    if (!productId) {
      toast.error("Product not found.");
      return;
    }
    setAddToCartLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (data.success) {
        router.push("/cart");
      } else {
        toast.error(data.message || "Failed to add to cart.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setAddToCartLoading(false);
    }
  }, [product, router]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error}
          </h1>
          <Button
            link="/"
            label={language === "en" ? "Return to Home" : "होम पर वापस जाएं"}
            variant="btn-primary"
          />
        </div>
      </div>
    );
  }
  if (!product) {
    return null;
  }

  // Helper: is this a placeholder product?
  const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
  const MIN_IMAGE_SLOTS = 3;
  const getSafeImage = (img?: string) => img && img.trim() !== "" ? img : PLACEHOLDER_IMAGE;
  const isPlaceholderProduct = !product.images || product.images.length === 0 || product.images[0] === PLACEHOLDER_IMAGE;

  let imagesToShow: string[] = [];
  if (isPlaceholderProduct) {
    imagesToShow = Array(MIN_IMAGE_SLOTS).fill(PLACEHOLDER_IMAGE);
  } else {
    imagesToShow = [...product.images];
    while (imagesToShow.length < MIN_IMAGE_SLOTS) {
      imagesToShow.push(PLACEHOLDER_IMAGE);
    }
  }

  // For key ingredients, override image if placeholder
  const keyIngredientsToShow = (product?.key_ingredients || []).map(ki =>
    isPlaceholderProduct ? { ...ki, image: PLACEHOLDER_IMAGE } : { ...ki, image: getSafeImage(ki.image) }
  );

  const dynamicProductContent = getProductContent(product.name);
  const productId =
    product &&
    (typeof (product as ProductWithExtras & { _id?: string })._id === "string"
      ? (product as ProductWithExtras & { _id?: string })._id
      : product._id);

  const whyChooseUs = Array.isArray(product?.why_choose_us)
    ? product.why_choose_us
        .map((item: string | WhyChooseUsItem): { question: string; answer: string } => {
          if (typeof item === "string") {
            return { question: item, answer: item };
          }
          return {
            question: item.title || item.question || "",
            answer: item.description || item.answer || "",
          };
        })
        .filter((item) => item.question && item.answer)
    : [];

  const faqItems = Array.isArray(product?.faqs)
    ? product.faqs
        .map((item: string | FaqAccordionItem, index: number): { id: string; question: string; answer: string } => {
          if (typeof item === "string") {
            return {
              id: `faq-${index}`,
              question: item,
              answer: item,
            };
          }
          return {
            id: `faq-${index}`,
            question: item.title || item.question || "",
            answer: item.description || item.answer || "",
          };
        })
        .filter((item) => item.question && item.answer)
    : [];

  return (
    <>
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="top-content-badge !flex gap-2 items-center">
              <BadgeCheck className="text-green-800" />{" "}
              {getText(product.for || "", language)}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl mb-3 sm:mb-6 font-semibold">
              {product.name}
            </h1>
            <h2 className="md:text-xl text-lg font-medium text-gray-800 mb-6">
              {getText(product.label || "", language)}
            </h2>
            <p className="mb-3 text-gray-700">
              {getText(product.description || "", language)}
            </p>
            <div className="flex md:flex-row flex-col gap-4 p-6 bg-white rounded-2xl justify-between mb-6">
              {(product.description_tags || []).map(
                (item: string, index: number) => (
                  <Checkmark key={index} text={item} />
                )
              )}
            </div>
            <p className="md:text-xl text-lg font-medium text-dark mb-6">
              Start your transformation today with a personalized plan!
            </p>
            <div className="flex gap-4">
              <Button
                label="Get Started Now"
                variant="btn-primary"
                size="xl"
                link={product.test_id ? `/consultation?testId=${product.test_id}` : '/consultation'}
              />
              <Button
                label={addToCartLoading ? "Adding..." : "Buy Now"}
                variant="btn-dark"
                size="xl"
                onClick={handleBuyNow}
                disabled={addToCartLoading}
              />
            </div>
          </div>
          <div className="order-1 lg:order-1 relative w-full flex flex-col items-center sm:rounded-4xl rounded-2xl overflow-hidden border border-gray-200 bg-green-100">
            <Swiper
              spaceBetween={10}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[Thumbs]}
              className="w-full aspect-square"
            >
              {imagesToShow.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <Image
                    src={getSafeImage(image)}
                    alt={`${product.name} image ${index + 1}`}
                    width={500}
                    height={500}
                    className="w-full object-cover h-full"
                    priority={index === 0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={(swiper) => {
                handleThumbsSwiper(swiper);
                setThumbsSwiper(swiper);
              }}
              spaceBetween={16}
              slidesPerView={3}
              watchSlidesProgress
              modules={[Thumbs]}
              className="w-38 sm:w-64 !absolute sm:bottom-7 bottom-3"
            >
              {imagesToShow.map((image: string, index: number) => (
                <SwiperSlide
                  key={index}
                  className="cursor-pointer bg-white rounded-md sm:rounded-xl border border-gray-300"
                >
                  <Image
                    src={getSafeImage(image)}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                    className="w-full h-full object-cover aspect-square"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="container mb-16 lg:mb-40">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <Image
              src={getSafeImage(dynamicProductContent.customImage)}
              alt={product.name}
              width={740}
              height={766}
              className="rounded-2xl w-full h-auto"
            />
          </div>
          <div>
            <h2 className="md:text-3xl lg:text-5xl text-2xl font-semibold mb-8">
              <span className="text-green-800">Why Choose</span>{" "}
              {dynamicProductContent.whyChooseTitle}
            </h2>
            <Accordion items={whyChooseUs} className="mx-auto mb-8" />
            <Button
              label="Get Started Now"
              variant="btn-primary"
              size="xl"
              link={`/product/${productId}`}
            />
          </div>
        </div>
      </section>

      <section className="mb-16 lg:mb-40 overflow-hidden">
        <div className="container">
          <span className="top-content-badge">Key Ingredients</span>
          <Paragraph
            paragraph="What's Inside?"
            textColor="text-dark"
            className="mb-10"
            highlightedWord="Inside?"
          />
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            className="!overflow-visible"
            spaceBetween={24}
            slidesPerView={1}
            autoHeight
            navigation={{
              nextEl: ".process-next-button",
              prevEl: ".process-prev-custom",
            }}
            scrollbar={{
              el: ".process-scrollbar-custom",
              draggable: true,
              hide: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 24 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {keyIngredientsToShow.map((item: KeyIngredient, idx: number) => (
              <SwiperSlide key={idx} className="!h-full">
                <div className="relative p-6 md:p-10 rounded-2xl bg-white h-full">
                  <div className="relative text-center">
                    <Image
                      src={getSafeImage(item.image)}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="mx-auto mb-4 rounded-full aspect-square object-cover"
                    />
                    <h3 className="font-medium text-lg sm:text-2xl mb-2 lg:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {(product?.key_ingredients || []).length > 3 && (
            <div className="mt-8 flex items-center justify-between z-50">
              <div className="process-scrollbar-custom h-2 w-1/2 rounded-full bg-gray-200">
                <div className="swiper-scrollbar-drag rounded-full h-full !bg-primary"></div>
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
          )}
        </div>
      </section>

      <section className="mb-16 lg:mb-40">
        <div className="container">
          <div className="p-10 bg-white rounded-2xl overflow-hidden">
            <div className="relative">
              <Paragraph
                paragraph="How It Works"
                textColor="text-dark"
                className="mb-4"
                highlightedWord="Works"
              />
              <p className="text-gray-700 mb-6">
                {getText(product.how_it_works || "", language)}
              </p>
              <Button
                label="Get Started Now"
                variant="btn-primary"
                size="xl"
                link={`/product/${productId}`}
              />

              <Swiper
                className="mt-8 !overflow-visible how-it-works-product-slider"
                slidesPerView={1}
                spaceBetween={24}
                autoHeight
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 1.5, spaceBetween: 24 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
              >
                <div className="w-full border-t-2 border-dashed border-green-600 absolute top-8 left-0 z-0" />
                {howItWorks.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    className="relative !h-full !flex !flex-col items-center z-10"
                  >
                    <div className="bg-green-100 rounded-full min-h-16 min-w-16 flex justify-center items-center ">
                      <span className="text-3xl font-semibold text-green-800">
                        {index + 1}
                      </span>
                    </div>
                    <Image
                      src="/images/icon/slider-drip.svg"
                      alt="Slider visual element"
                      width={53}
                      height={42}
                      className="-mt-3.5"
                    />
                    <div className="p-6 xl:p-10 rounded-2xl bg-green-100 h-full">
                      <h3 className="font-medium text-lg sm:text-xl sm:mb-4 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 mt-auto">
                        {item.description}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
      <section className="container mb-16 lg:mb-40 grid md:grid-cols-2 gap-6 lg:gap-10 items-center">
        <Image
          src={getSafeImage(dynamicProductContent.benefitImage)}
          alt="Who can Benefit?"
          width={740}
          height={740}
          className="aspect-square object-cover rounded-3xl"
        />
        <div className="">
          <Paragraph
            paragraph="Who can Benefit?"
            textColor="text-dark"
            highlightedWord="Who can"
            className="mb-6 lg:mb-10"
          />
          <div className="space-y-3 mb-6 lg:mb-10">
            {dynamicProductContent.benefitTags.map((item, index) => (
              <Checkmark key={index} text={item} />
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              label="Get Started Now"
              variant="btn-primary"
              size="xl"
              link={`/product/${productId}`}
            />
            <Button label="Buy Now" variant="btn-light" size="xl" />
          </div>
        </div>
      </section>
      <section className="container mb-16 lg:mb-40">
        <div className="md:p-20 p-8 bg-white rounded-2xl grid lg:grid-cols-[380px_auto] sm:gap-8 gap-4 items-center">
          <Paragraph
            paragraph="How to Use"
            textColor="text-dark"
            highlightedWord="Use"
          />
          <p className="text-base md:text-lg lg:text-2xl">
            {getText(dynamicProductContent.howToUseDescription, language)}
          </p>
        </div>
      </section>

      <section className=" mb-16 lg:mb-40 lg:py-20 py-10 bg-gray-200">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div className="lg:order-1 order-2">
            <Paragraph
              paragraph="Why Choose Us?"
              textColor="text-dark"
              className="lg:mb-10 mb-6"
              highlightedWord="Choose Us?"
            />
            <p className="text-base md:text-lg lg:text-2xl text-gray-600">
              {getText(
                dynamicProductContent.whyChooseUsSectionDescription,
                language
              )}
            </p>
          </div>
          <Image
            src="/images/why-choose.png"
            alt="Why choose us"
            width={691}
            height={586}
            className="lg:order-2 order-1"
          />
        </div>
      </section>

      <Testimonials filteredByProductId={productId} />
      <FaqAccordion items={faqItems} className="mx-auto" />
      <Toaster position="bottom-right" />
    </>
  );
}
