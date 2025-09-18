import type { Metadata } from "next";

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  // Later you can fetch from API/DB here if needed
  const pageTitle = "How Hilop Works – Science-Backed Weight Loss Process";
  const pageDescription =
    "Understand how Hilop’s 100% natural & safe formula helps you lose weight effectively with zero side effects.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "How Hilop Works",
      "Hilop Weight Loss Process",
      "Fat Burning Supplement India",
      "Science Baked Formula",
    ],
    alternates: {
      canonical: "https://hilop.com/how-it-works", 
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://hilop.com/how-it-works",
      siteName: "Hilop",
      images: [
        {
          url: "", // you can change this if you have specific image
          width: 1200,
          height: 630,
          alt: "How Hilop Works",
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [""],
      creator: "@hilop",
      site: "@hilop",
    },
  };
}

import HowItWorkContent from "./HowItWorkContent";

export default function AboutUsPage() {
  return <HowItWorkContent />;
}
