import type { Metadata } from "next";

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  // Later, you could fetch support-related data from API/DB if needed
  const pageTitle = "Hilop Privacy Policy – Your Data, Our Responsibility";
  const pageDescription =
    "Learn how Hilop protects your personal data and ensures complete privacy and security.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop Privacy",
      "Hilop Data Security",
      "Hilop Policy",
    ],
    alternates: {
      canonical: "https://hilop.com/privacy-policy", 
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

import PrivacyPolicyPage from "./PrivacyPolicyContent";

export default function SupportPage() {
  return <PrivacyPolicyPage />;
}
