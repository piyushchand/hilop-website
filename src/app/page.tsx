import { CardBody, CardContainer, CardItem } from "@/components/animationComponents/3DCard";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import Button from "@/components/uiFramework/Button";
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
export default function Home() {
  return (
    <>
      <div className="container ">
        <div className="grid grid-cols-[auto_316px] items-center mt-14 mb-9">
          <div>
            <span className="top-content-badge">Natural Herbal Solutions</span>
            <h1 className="text-2xl xl:text-7xl mb-6 font-medium">
              100% Natural <br />
              <span className="text-primary">personalized to you</span>
            </h1>
            <h2 className="text-xl text-gray-700">
              Customized care starts here
            </h2>
          </div>
          <div>
            {features.map((item, index) => (
              <div
                key={index}
                className={`p-4 flex items-center gap-4 ${
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
                  <p className="text-base text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
       
        <div className="grid grid-cols-3 gap-6">
      {productCard.map(({ id, imageSrc, tag, title, viewWorkLink, takeTestHref }) => (
         <CardContainer
         key={id}
         containerClassName="h-full"
         className="btn-arrow-animation h-full rounded-3xl bg-white p-6"
       >
         <CardBody>
           {/* Image layer with highest translateZ for pop-out effect */}
           <CardItem translateZ={50} className="relative mb-5 rounded-3xl overflow-hidden">
             <Image
               src={imageSrc}
               width={443}
               height={332}
               className="rounded-3xl"
               alt={title}
             />
             <p className="bg-white text-green-800 text-base font-medium px-4 py-1.5 rounded-full block w-fit absolute top-3 left-3">
               {tag}
             </p>
           </CardItem>
     
           {/* Title layer */}
           <CardItem translateZ={20} className="mb-4">
             <h4 className="text-2xl font-medium">{title}</h4>
           </CardItem>
     
           {/* Buttons layer */}
           <CardItem translateZ={10} className=" w-full">
            <div className="grid grid-cols-2 gap-4">
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
      ))}
    </div>
      </div>
    </>
  );
}
