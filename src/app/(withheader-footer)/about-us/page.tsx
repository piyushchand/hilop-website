import type { Metadata } from "next";
import AboutUsContent from "./AboutUsContent";

// ✅ Dynamic metadata (static route, so no params)
export async function generateMetadata(): Promise<Metadata> {
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
          url: "",
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
      images: [""],
      creator: "@hilop",
      site: "@hilop",
    },
  };
}

export default function AboutUsPage() {
  return <AboutUsContent />;
}
