import Image from 'next/image';
import { Product, MultilingualText } from '@/types';
import { CardBody, CardContainer, CardItem } from './animationComponents/3DCard';
import Button from './uiFramework/Button';
import ArrowButton from './uiFramework/ArrowButton';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
    product: Product;
    index: number;
    totalItems: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { language } = useLanguage();

    const getText = (field: MultilingualText | string | undefined): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[language] || field.en || '';
    };

    return (
        <CardContainer
            containerClassName="h-full col-span-4 sm:col-span-2 md:col-span-1"
            className="btn-arrow-animation h-full rounded-3xl bg-white p-3 lg:p-4 xl:p-6"
        >
            <CardBody>
                <CardItem
                    translateZ={50}
                    className="relative mb-5 rounded-3xl overflow-hidden w-full bg-gray-200"
                >
                    <Image
                        src={product.images[0] || '/images/placeholder.png'}
                        alt={getText(product.name)}
                        width={435}
                        height={336}
                        className="rounded-3xl w-full"
                    />
                    <p className="bg-white text-xs lg:text-base font-medium px-2 lg:px-4 py-1 lg:py-1.5 rounded-full block w-fit absolute top-3 left-3">
                        {getText(product.for)}
                    </p>
                </CardItem>

                <CardItem translateZ={20} className="mb-4">
                    <h4 className="text-xl lg:text-2xl font-medium">{getText(product.name)}</h4>
                </CardItem>

                <CardItem translateZ={10} className="w-full">
                    <div className="grid xl:grid-cols-2 gap-2 lg:gap-4">
                        <Button
                            label="View Details"
                            variant="btn-light"
                            size="xl"
                            className="w-full"
                            link={`/product/${product._id}`}
                        />
                        <ArrowButton
                            label="Take the test"
                            theme="primary"
                            className="w-full"
                            size="lg"
                            href={`/product/${product._id}`}
                        />
                    </div>
                </CardItem>
            </CardBody>
        </CardContainer>
    );
};

export default ProductCard;