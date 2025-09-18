import type { Metadata } from "next";

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = "Contact Hilop – Get in Touch with Our Support Team";
  const pageDescription =
    "Have questions about Hilop? Contact our customer support for queries, feedback, or product details.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop Contact",
      "Customer Support Hilop",
      "Hilop Helpline",
      "Weight Loss Product Help",
    ],
    alternates: {
      canonical: "https://hilop.com/contact-us", 
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://hilop.com/contact",
      siteName: "Hilop",
      images: [
        {
          url: "", // replace with a "Contact" banner image if available
          width: 1200,
          height: 630,
          alt: "Contact Hilop",
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

import BookCall from "./BookCallContent";

export default function BookCallPage() {
  return <BookCall />;
}
