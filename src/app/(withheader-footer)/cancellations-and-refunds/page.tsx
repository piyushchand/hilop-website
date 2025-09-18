import type { Metadata } from "next";
import RefundsPage from "./RefundsContent"

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = "Hilop Refund & Cancellation Policy";
  const pageDescription =
    "Learn about Hilop’s easy cancellations and 100% money-back refund policy for your weight loss journey.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop Refund",
      "Hilop Cancellations",
      "Hilop wellness products",
      "Money Back Guarantee Hilop",
      "Order Returns"
    ],
    alternates: {
      canonical: "https://hilop.com/cancellations-and-refunds", 
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: "",
          width: 1200,
          height: 630,
          alt: "Hilop Shipping Policy",
        },
      ],
    },
    twitter: {
      title: pageTitle,
      description: pageDescription,
      images: [""],
    },
  };
}


export default function Page() {
  return <RefundsPage /> ;
}
