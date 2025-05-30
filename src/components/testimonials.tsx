import { cn } from '@/lib/utils';
import Paragraph from './animationComponents/TextVisble';
import { Marquee } from './animationComponents/Marquee';
import { BadgeCheck } from 'lucide-react';

const reviews = [
  {
    id: 1,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
  {
    id: 2,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
  {
    id: 3,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
  {
    id: 4,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
  {
    id: 5,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
  {
    id: 6,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
  {
    id: 7,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
  {
    id: 8,
    UserName: 'John Doe',
    content:
      "“I am down 18 pounds. Weight Loss by Hilop curbs my appetite, the doctors are amazing, and i have no doubt i will be my goal weight in no time.”",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);

interface ReviewCardProps {
  content: string;
  UserName: string;
}

const ReviewCard = ({
  content,
  UserName,
}: ReviewCardProps) => {
  return (
    <div
      className={cn(
        'relative !flex sm:w-[490px] w-64 flex-col rounded-2xl border border-gray-200 bg-gray-100 p-6 hover:border-primary lg:p-10 text-center'
      )}
    >
      <span className=" inline-block mb-10 text-gray-700">{UserName}</span>
      <p className="mb-10 sm:text-2xl">{content}</p>
      <div className='flex items-center gap-2 text-green-800 justify-center'> <BadgeCheck className='text-green-800' /> <p>Real Hilop Customers</p></div>
    </div>
  );
};

export function Testimonials() {
  return (
    <>
      <section className="mb-16 lg:mb-40">
        <div className="container">
          <span className="top-content-badge">Featured reviews</span>
          <Paragraph
            paragraph="Real People, Real Results"
            textColor="text-dark"
            className="lg:mb-10 mb-6"
            highlightedWord="Results"
          />
        </div>

        <div className="relative mb-16 flex w-full flex-col items-center justify-center overflow-hidden lg:mb-40">
          <Marquee
            pauseOnHover
            className="[--duration:30s]"
          >
            {firstRow.map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
        </div>
      </section>
    </>
  );
}
