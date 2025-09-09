import type { Metadata } from "next";

type Props = {
  params: { locale: string }; // example if you want multi-language
};

// ✅ Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // You could fetch from API/DB here
  const aboutTitle = "About Hilop – Trusted Wellness & Weight Loss Brand";
  const aboutDescription =
    "Learn about Hilop, our vision, science-backed wellness approach, and commitment to safe, natural weight management in India.";

  return {
    title: aboutTitle,
    description: aboutDescription,
    keywords: [
      "About Hilop",
      "Hilop Company",
      "Hilop Wellness",
      "Natural Health Brand India",
      "Weight Loss Company"
    ],
    alternates: {
      canonical: "https://hilop.com/about-us", 
    },
    openGraph: {
      title: aboutTitle,
      description: aboutDescription,
      url: "https://hilop.com/about-us",
      siteName: "Hilop",
      images: [
        {
          url: "/image/about-us/mission.webp",
          width: 1200,
          height: 630,
          alt: "About Hilop",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: aboutTitle,
      description: aboutDescription,
      images: ["/image/about-us/mission.webp"],
      creator: "@hilop",
      site: "@hilop",
    },
  };
}

import AboutUsContent from "./AboutUsContent";

export default function AboutUsPage() {
  return <AboutUsContent />;
}
