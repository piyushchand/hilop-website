import type { Metadata } from "next";

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  // Later, you could fetch support-related data from API/DB if needed
  const pageTitle = "Hilop Support – Customer Help & Assistance";
  const pageDescription =
    "Need help with Hilop orders, product, or usage? Get quick support and assistance from our team.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop Support",
      "Hilop Help",
      "Customer Care Hilop",
      "Product Assistance",
    ],
    alternates: {
      canonical: "https://hilop.com/support", 
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://hilop.com/support",
      siteName: "Hilop",
      images: [
        {
          url: "/image/about-us/mission.webp", // replace with support-specific image if you have one
          width: 1200,
          height: 630,
          alt: "Hilop Support",
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["/image/about-us/mission.webp"],
      creator: "@hilop",
      site: "@hilop",
    },
  };
}

import Support from "./ProfileContent";

export default function SupportPage() {
  return <Support />;
}
