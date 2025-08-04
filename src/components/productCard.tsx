"use client";
import Image from "next/image";
import { Product, MultilingualText } from "@/types";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "./animationComponents/3DCard";
import Button from "./uiFramework/Button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: Product;
  index: number;
  totalItems: number;
}
const demoImages = [
  "/images/improving-sexual/improving-sexual-clip.jpg",
  "/images/instant-boost/instantboost-clip.jpg",
  "/images/weight-loss/fatloss-clip.jpg",
];

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  totalItems,
}) => {
  let fallbackImage: string;
  // Last 3 cards: use demoImages
  if (totalItems >= 3 && index >= totalItems - 3) {
    const imageIdx = index - (totalItems - 3);
    fallbackImage = demoImages[imageIdx];
  } else {
    // For new cards: use product image if available, else placeholder
    fallbackImage =
      product.images && product.images.length > 0
        ? product.images[0]
        : "/images/placeholder.svg";
  }
  const { language } = useLanguage();

  const getText = (field: MultilingualText | string | undefined): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field.en || "";
  };

  return (
    <>
      <CardContainer
        containerClassName="h-full col-span-4 sm:col-span-2 md:col-span-1"
        className="btn-arrow-animation h-full rounded-3xl bg-white p-3 lg:p-4 xl:p-6"
      >
        <CardBody>
          <CardItem
            translateZ={50}
            className="relative mb-5 rounded-3xl overflow-hidden w-full bg-gray-200 cursor-pointer"
          >
            <a
              href={`/product/${product._id}`}
              tabIndex={-1}
              aria-label={`View details for ${getText(product.name)}`}
              className="block"
            >
              <Image
                src={fallbackImage}
                alt={getText(product.name)}
                width={435}
                height={336}
                className="rounded-3xl w-full aspect-[4/3] object-cover"
              />
            </a>
            <p className="bg-white text-xs lg:text-base font-medium px-2 lg:px-4 py-1 lg:py-1.5 rounded-full block w-fit absolute top-3 left-3">
              {getText(product.for)}
            </p>
          </CardItem>

          <CardItem translateZ={20} className="mb-4">
            <h4 className="text-lg lg:text-xl font-medium">
              {getText(product.name)}
            </h4>
          </CardItem>

          <CardItem translateZ={10} className="w-full">
            <div className="grid xl:grid-cols-2 gap-2 lg:gap-4">
              <Button
                label="VIEW DETAILS"
                variant="btn-light"
                size="md"
                className="w-full "
                link={`/product/${product._id}`}
              />

              <Button
                label="TAKE THE TEST ™"
                variant="btn-primary"
                size="md"
                className="w-full "
                link={
                  product.test_id
                    ? `/consultation?testId=${product.test_id}`
                    : "/consultation"
                }
              />
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </>
  );
};

export default ProductCard;
