import type { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  
  const pageTitle = "Hilop Login – Access Your Account";
  const pageDescription =
    "Login to your Hilop account to manage orders, track wellness journey, and explore exclusive features.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop Login",
      "Hilop Account",
      "User Login Hilop",
    ],
    alternates: {
      canonical: "https://hilop.com/auth/login", 
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: "https://hilop.com/support",
      siteName: "Hilop",
      images: [
        {
          url: "/image/about-us/mission.webp", 
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

import LoginPage from "./LoginContent";

export default function SupportPage() {
  return <LoginPage />;
}
