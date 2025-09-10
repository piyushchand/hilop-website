import ProductPage from "./ProductPage";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params; // ✅ await params

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();
  if (!data.success) return {};

  const product = data.data;

  // Construct JSON-LD Product schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.seo?.name || "Unknown Product",
    description: product?.seo?.description || product?.description?.en || "",
    image: product?.images?.length ? product.images[0] : "",
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
      priceCurrency: "INR",
      price: product?.price?.final_price?.toString() || "0",
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/LimitedAvailability",
      itemCondition: "https://schema.org/NewCondition",
    },
    brand: {
      "@type": "Brand",
      name: "Hilop", 
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "3687",
    },
  };

  return {
    title: product?.seo?.title || product?.name,
    description: product?.seo?.description || product?.description?.en,
    openGraph: {
      title: product?.seo?.title || product?.name,
      description: product?.seo?.description || product?.description?.en,
      images: product?.images?.length ? [product.images[0]] : [],
    },
    other: {
      // Inject JSON-LD schema into <head>
      "script:ld+json": JSON.stringify(productSchema),
    },
  };
}

export default function Page() {
  return <ProductPage />;
}

// import ProductPage from "./ProductPage";
// import { Metadata } from "next";

// export async function generateMetadata(props: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await props.params; // ✅ await params

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
//     cache: "no-store",
//   });

//   const data = await res.json();
//   if (!data.success) return {};

//   const product = data.data;

//   return {
//     title: product?.seo?.title || product?.name,
//     description: product?.seo?.description || product?.description?.en,
//     openGraph: {
//       title: product?.seo?.title || product?.name,
//       description: product?.seo?.description || product?.description?.en,
//       images: product?.images?.length ? [product.images[0]] : [],
//     },
//   };
// }

// export default function Page() {
//   return <ProductPage />;
// }
