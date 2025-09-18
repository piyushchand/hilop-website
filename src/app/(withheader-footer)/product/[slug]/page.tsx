import ProductPage from "./ProductPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    return {
      title: "Configuration Error",
      description: "API configuration is incomplete. Please try again later.",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}?lang=en`,
      { cache: "no-store" }
    );

    if (!res.ok) notFound();

    const data = await res.json();
    if (!data.success || !data.data) notFound();

    const product = data.data;

    const productDescription =
      product?.seo?.description ||
      product?.description?.en ||
      "No description available";
    const productImage = product?.images?.[0] || "";

    return {
      title: product?.seo?.title || product?.name || "Product",
      description: productDescription,
      openGraph: {
        title: product?.seo?.title || product?.name || "Product",
        description: productDescription,
        images: productImage ? [productImage] : [],
        url: `https://hilop.com/products/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    notFound();
  }
}

// Build JSON-LD schema
function buildProductSchema(product: any, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.seo?.name || product?.name || "Unknown Product",
    description:
      product?.seo?.description ||
      product?.description?.en ||
      "No description available",
    image: product?.images?.[0] || "",
    offers: {
      "@type": "Offer",
      url: `https://hilop.com/products/${slug}`,
      priceCurrency: "INR",
      price: product?.price?.final_price?.toString() || "0",
      priceValidUntil: "2025-12-31",
      availability:
        product?.availability || "https://schema.org/LimitedAvailability",
      itemCondition: "https://schema.org/NewCondition",
    },
    brand: { "@type": "Brand", name: "Hilop" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product?.rating?.toString() || "4.8",
      ratingCount: product?.reviewsCount?.toString() || "3687",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  if (!process.env.NEXT_PUBLIC_API_URL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Configuration Error</h1>
        <p>API configuration is incomplete. Please try again later.</p>
      </div>
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}?lang=en`,
      { cache: "no-store" }
    );

    if (!res.ok) notFound();

    const data = await res.json();
    if (!data.success || !data.data) notFound();

    const product = data.data;
    const schemaString = JSON.stringify(buildProductSchema(product, slug));

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaString }}
        />
        <ProductPage />
      </>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}
