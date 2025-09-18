import type { Metadata } from "next";
import TermsAndConditions from "./TermsConditionsContent"; 

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  // Later, you could fetch support-related data from API/DB if needed
  const pageTitle = "Hilop Terms & Conditions";
  const pageDescription =
    "Read Hilop’s terms & conditions to understand user agreements, policies, and service details.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop Terms",
      "Hilop Conditions",
      "Hilop Policies",
    ],
    alternates: {
      canonical: "https://hilop.com/terms-and-conditions", 
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://hilop.com/support",
      siteName: "Hilop",
      images: [
        {
          url: "", // replace with support-specific image if you have one
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
      images: [""],
      creator: "@hilop",
      site: "@hilop",
    },
  };
}


export default function SupportPage() {
  return <TermsAndConditions />;
}
