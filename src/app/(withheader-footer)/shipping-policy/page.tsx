import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = "Hilop Shipping Policy – Fast & Reliable Delivery";
  const pageDescription =
    "Read Hilop’s shipping policy for fast, safe, and reliable delivery of your wellness products across India.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop shipping",
      "Delivery Policy",
      "Weight Loss Product Shipping India",
    ],
    alternates: {
      canonical: "https://hilop.com/shipping-policy", 
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: "/image/shipping/shipping-banner.webp",
          width: 1200,
          height: 630,
          alt: "Hilop Shipping Policy",
        },
      ],
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      images: ["/image/shipping/shipping-banner.webp"],
    },
  };
}

import ShippingPolicyPage from "./ShippingPolicyContent";
export default function Page() {
  return <ShippingPolicyPage />;
}
