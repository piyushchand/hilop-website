import type { Metadata } from "next";

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  // Later you can fetch from API/DB here if needed
  const pageTitle = "Hilop Cart | Review Your Order & Proceed to Checkout";
  const pageDescription =
    "View items in your Hilop cart and finalize your order. Secure payment, fast shipping & herbal wellness products ready to boost energy, weight loss, performance & more.";

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: "https://hilop.com/cart",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://hilop.com/cart",
      siteName: "Hilop",
      images: [
        {
          url: "", 
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

import Cart from "./CartContent";

export default function AboutUsPage() {
  return <Cart />;
}
