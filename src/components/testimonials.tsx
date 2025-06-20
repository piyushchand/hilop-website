import { cn } from '@/lib/utils';
import Paragraph from './animationComponents/TextVisble';
import { Marquee } from './animationComponents/Marquee';
import { BadgeCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Review {
  _id: string;
  user?: {
    name: string;
  } | null;
  product: string;
  rating: number;
  description: string;
}


interface TestimonialsProps {
  filteredByProductId?: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  // Add null checks and fallbacks
  const userName = review?.user?.name || 'Anonymous Customer';
  const description = review?.description || 'No review content available';
  
  return (
    <div
      className={cn(
        'relative !flex sm:w-[490px] w-64 flex-col rounded-2xl border border-gray-200 bg-gray-100 p-6 hover:border-primary lg:p-10 text-center'
      )}
    >
      <span className=" inline-block mb-10 text-gray-700">{userName}</span>
      <p className="mb-10 sm:text-2xl line-clamp-6">{description}</p>
      <div className="flex items-center gap-2 text-green-800 justify-center mt-auto">
        <BadgeCheck className="text-green-800" />
        <p>Real Hilop</p>
      </div>
    </div>
  );
};

export function Testimonials({ filteredByProductId }: TestimonialsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // If we have a product ID, fetch reviews for that specific product
        const url = filteredByProductId 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://3.110.216.61/api/v1'}/products/${filteredByProductId}/reviews`
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://3.110.216.61/api/v1'}/reviews`;

        console.log('Fetching reviews from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const result = await response.json();
        console.log('Reviews API Response:', result);

        if (result.success) {
          // If we're fetching product-specific reviews, the data structure might be different
          const reviewsData = filteredByProductId 
            ? (result.data?.reviews || [])
            : result.data;

          console.log('Processed Reviews:', reviewsData);
          
          // Filter out invalid reviews and ensure they have required properties
          const validReviews = reviewsData.filter((review: Review) => 
            review && 
            review._id && 
            review.description && 
            typeof review.description === 'string' &&
            review.description.trim().length > 0
          );
          
          setReviews(validReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filteredByProductId]);

  if (loading) {
    return (
      <section className="mb-16 lg:mb-40">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="mb-16 lg:mb-40">
      <div className="container">
        <span className="top-content-badge">Customer Reviews</span>
        <Paragraph
          paragraph="Real People, Real Results"
          textColor="text-dark"
          className="lg:mb-10 mb-6"
          highlightedWord="Results"
        />
      </div>

      <div className="relative mb-16 flex w-full flex-col items-center justify-center overflow-hidden lg:mb-40">
        <Marquee pauseOnHover className="[--duration:30s]">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}