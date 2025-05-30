import Image from "next/image";
import Paragraph from "./animationComponents/TextVisble";
import Button from "./uiFramework/Button";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "./animationComponents/3DCard";

const whyChoosecontent = [
  {
    icon: "/images/icon/personalized-approach.svg",
    title: "Personalized Approach",
    description:
      "Our test helps match you with the perfect product for your specific needs and goals.",
  },
  {
    icon: "/images/icon/science-backed-formulas.svg",
    title: "Science-Backed Formulas",
    description:
      "Our herbal solutions combine ancient wisdom with modern scientific research for optimal results.",
  },
  {
    icon: "/images/icon/natural-ingredients.svg",
    title: "Natural Ingredients",
    description:
      "100% pure herbal ingredients, free from chemicals and artificial additives.",
  },
  {
    icon: "/images/icon/fast-acting-results.svg",
    title: "Fast-Acting Results",
    description:
      "Our formulas are designed to provide quick, noticeable benefits while promoting long-term wellness.",
  },
  {
    icon: "/images/icon/customer-focused.svg",
    title: "Customer Focused",
    description:
      "We prioritize your wellness journey with personalized support and guidance.",
  },
  {
    icon: "/images/icon/sustainable-practices.svg",
    title: "Sustainable Practices",
    description:
      "Eco-friendly sourcing and packaging that respects both your body and the planet.",
  },
];
export function WhyChoose() {
  return (
    <>
      <section className="mb-16 lg:mb-40 bg-green-100 lg:py-20 py-10">
        <div className="container">
          <div className="grid lg:grid-cols-[auto_560px] items-center bg-white p-6 lg:p-10 rounded-2xl mb-6">
            {" "}
            <Paragraph
              paragraph="Why Choose Hilop"
              textColor="text-dark"
              className="mb-10"
              highlightedWord="Hilop"
            />
            <div>
              <p className="mb-6 text-gray-700">
                Our commitment to quality, personalization, and effectiveness
                sets us apart. Discover the HerbaFit difference.
              </p>
              <Button label="About us" variant="btn-dark" size="xl" link='/about-us' />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
            {whyChoosecontent.map((whyChoosecontent, index) => (
              <CardContainer
                key={index}
                containerClassName="h-full"
                className="h-full bg-white p-6 rounded-2xl"
              >
                <CardBody>
                  <CardItem translateZ={50} className="mb-8">
                  <Image
                        src={whyChoosecontent.icon}
                        width={80}
                        height={80}
                        alt={whyChoosecontent.title}
                      />
                  </CardItem>
                  <CardItem translateZ={20} className="mb-4">
                    <h3 className="mb-4 text-2xl font-medium">
                      {whyChoosecontent.title}
                    </h3>
                  </CardItem>
                  <CardItem translateZ={10}>
                    <p className="text-gray-600">{whyChoosecontent.description}</p>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
