import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/animationComponents/3DCard";
import { Blogs } from "@/components/blogs";
import FaqAccordion from "@/components/FaqAccordion";
import LongerWithBetter from "@/components/longerWithBetter";
import LoseWeight from "@/components/loseWeight";
import { OurProcess } from "@/components/ourProcess";
import { Testimonials } from "@/components/testimonials";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import Button from "@/components/uiFramework/Button";
import { VelocityScroll } from "@/components/velocityScroll";
import { WhyChoose } from "@/components/whyChoose";
import Image from "next/image";

const features = [
  {
    icon: "/images/icon/pure-herbal.svg",
    title: "100% Natural",
    description: "Pure herbal ingredients",
  },
  {
    icon: "/images/icon/science-backed.svg",
    title: "Science-Backed",
    description: "Proven formulations",
  },
  {
    icon: "/images/icon/fast-acting.svg",
    title: "Fast-Acting",
    description: "Feel the difference",
  },
];


const productCard = [
  {
    id: 1,
    imageSrc: "/images/weight-loss/fatloss-clip.jpg",
    tag: "Fat Loss",
    title: "HerbaTrim",
    viewWorkLink: "/herbatrim-work",
    takeTestHref: "/herbatrim-test",
  },
  {
    id: 2,
    imageSrc: "/images/instant-boost/instantboost-clip.jpg",
    tag: "Instant Boost",
    title: "VitalVigor",
    viewWorkLink: "/herbatrim-work",
    takeTestHref: "/herbatrim-test",
  },
  {
    id: 3,
    imageSrc: "/images/improving-sexual/improving-sexual-clip.jpg",
    tag: "Improving sexual",
    title: "EverYoung Boost",
    viewWorkLink: "/herbatrim-work",
    takeTestHref: "/herbatrim-test",
  },
];
const homepagefaqdata = [
  {
    id: 'faq1',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq2',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq3',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq4',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  {
    id: 'faq5',
    question: 'How do i order from your company?',
    answer:
      'We currently dispendce FDa approded commericiall availanle medication and non-streii compounded medications',
  },
  
];
export default function Home() {
  return (
    <>
      <section className="container overflow-hidden mb-16 lg:mb-40">
        <div className="grid md:grid-cols-[auto_316px] items-center mt-8 lg:mt-14 mb-9">
          <div>
            <span className="top-content-badge">Natural Herbal Solutions</span>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl mb-6 font-medium">
              100% Natural <br />
              <span className="text-primary">personalized to you</span>
            </h1>
            <h2 className="text-lg md:text-xl text-gray-700">
              Customized care starts here
            </h2>
          </div>
          <div className="grid md:grid-cols-1 sm:grid-cols-2 grid-cols-1">
            {features.map((item, index) => (
              <div
                key={index}
                className={`p-4 flex  items-center gap-4 ${
                  index !== features.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <div className="bg-green-100 rounded-full size-16 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    width={32}
                    height={32}
                    alt={item.title}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:px-0 grid-cols-4 md:grid-cols-3 gap-4 md:gap-6">
          {productCard.map(
            (
              { id, imageSrc, tag, title, viewWorkLink, takeTestHref },
              index
            ) => (
              <CardContainer
                key={id}
                containerClassName={`h-full col-span-4 sm:col-span-2 md:col-span-1  ${
                  index === productCard.length - 1
                    ? "sm:col-start-2 md:col-start-auto"
                    : ""
                }`}
                className="btn-arrow-animation h-full rounded-3xl bg-white p-3 lg:p-4 xl:p-6"
              >
                <CardBody>
                  {/* Image layer with highest translateZ for pop-out effect */}
                  <CardItem
                    translateZ={50}
                    className="relative mb-5 rounded-3xl overflow-hidden w-full"
                  >
                    <Image
                      src={imageSrc}
                      width={443}
                      height={332}
                      className="rounded-3xl w-full"
                      alt={title}
                    />
                    <p className="bg-white text-xs lg:text-base font-medium px-2 lg:px-4 py-1 lg:py-1.5 rounded-full block w-fit absolute top-3 left-3">
                      {tag}
                    </p>
                  </CardItem>

                  {/* Title layer */}
                  <CardItem translateZ={20} className="mb-4">
                    <h4 className="text-xl lg:text-2xl font-medium">{title}</h4>
                  </CardItem>

                  {/* Buttons layer */}
                  <CardItem translateZ={10} className=" w-full">
                    <div className="grid xl:grid-cols-2 gap-2 lg:gap-4">
                      <Button
                        label="View Our Work"
                        variant="btn-light"
                        size="xl"
                        className="w-full"
                        link={viewWorkLink}
                      />
                      <ArrowButton
                        label="Take the test"
                        theme="primary"
                        className="w-full"
                        size="lg"
                        href={takeTestHref}
                      />
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            )
          )}
        </div>
      </section>
      <LoseWeight />
      <VelocityScroll>100% Natural Product</VelocityScroll>
      <LongerWithBetter />
      <Testimonials/>
      <WhyChoose />
      <OurProcess />
      <Blogs />
      <FaqAccordion
              items={homepagefaqdata}
              className="mx-auto"
            />
    </>
  );
}
