import type { Metadata } from "next";

// ✅ Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  // Later, you could fetch support-related data from API/DB if needed
  const pageTitle = "Hilop Register – Create Your Account";
  const pageDescription =
    "Sign up with Hilop to start your wellness and weight loss journey with science-backed, natural products.";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      "Hilop Register",
      "Create Hilop Account",
      "Join Hilop",
      "Hilop Signup",
    ],
    alternates: {
      canonical: "https://hilop.com/auth/register", 
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

import RegisterPage from "./RegisterContent";

export default function SupportPage() {
  return <RegisterPage />;
}
