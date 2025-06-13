import Image from 'next/image';
import { Product } from '@/types';
import { CardBody, CardContainer, CardItem } from './animationComponents/3DCard';
import Button from './uiFramework/Button';
import ArrowButton from './uiFramework/ArrowButton';

interface ProductCardProps {
    product: Product;
    index?: number;
    totalItems?: number;
    for: string;
}

type ProductName = 'Hardveda' | 'BoldRise' | 'Slimvibe';

const staticImages: Record<ProductName, string> = {
    'Hardveda': '/images/improving-sexual/improving-sexual-clip.jpg',
    'BoldRise': '/images/instant-boost/instantboost-clip.jpg',
    'Slimvibe': '/images/weight-loss/fatloss-clip.jpg'
};

const ProductCard = ({ product, index = 0, totalItems = 0 }: ProductCardProps) => {
    const productName = product.name as ProductName | undefined;
    const imageSrc = (productName && productName in staticImages ? staticImages[productName] : product.images?.[0]) || '/placeholder.png';

    return (
        <CardContainer
            containerClassName={`h-full col-span-4 sm:col-span-2 md:col-span-1 ${
                index === totalItems - 1
                    ? "sm:col-start-2 md:col-start-auto"
                    : ""
            }`}
            className="btn-arrow-animation h-full rounded-3xl bg-white p-3 lg:p-4 xl:p-6"
        >
            <CardBody>
                <CardItem
                    translateZ={50}
                    className="relative mb-5 rounded-3xl overflow-hidden w-full"
                >
                    <Image
                        src={imageSrc}
                        width={435}
                        height={336}
                        className="rounded-3xl w-full"
                        alt={product.name}
                    />
                    <p className="bg-white text-xs lg:text-base font-medium px-2 lg:px-4 py-1 lg:py-1.5 rounded-full block w-fit absolute top-3 left-3">
                        {product.for}
                    </p>
                </CardItem>

                <CardItem translateZ={20} className="mb-4">
                    <h4 className="text-xl lg:text-2xl font-medium">{product.name}</h4>
                </CardItem>

                <CardItem translateZ={10} className="w-full">
                    <div className="grid xl:grid-cols-2 gap-2 lg:gap-4">
                        <Button
                            label="View Details"
                            variant="btn-light"
                            size="xl"
                            className="w-full"
                            onClick={() => window.location.href = `/product/${product._id}`}
                        />
                        <ArrowButton
                            label="Take the test"
                            theme="primary"
                            className="w-full"
                            size="lg"
                        />
                    </div>
                </CardItem>
            </CardBody>
        </CardContainer>
    );
};

export default ProductCard;