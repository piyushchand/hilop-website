import "./globals.css";
import { Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hilop.com";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7EBF28",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Hilop",
    default: "Hilop",
  },
  description: "welness product",
  applicationName: "Hilop",
  referrer: "origin-when-cross-origin",
  keywords: ["HerbaTrim", "VitalVigor", "EverYoung Boost"],
  authors: [{ name: "Hilop Team" }],
  creator: "Hilop",
  publisher: "Hilop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: {
      template: "%s | Hilop",
      default: "Hilop welness product",
    },
    description: "welness product",
    images: [
      {
        url: "/image/home-hero.webp",
        width: 1200,
        height: 630,
        alt: "Hilop",
      },
    ],
    siteName: "Hilop",
    type: "website",
    url: baseUrl,
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Hilop",
      default: "Hilop welness product",
    },
    description: "wellness product",
    images: [
      {
        url: "/image/home-hero.webp",
        width: 1200,
        height: 630,
        alt: "Hilop",
      },
    ],
    creator: "@hilop",
    site: "@hilop",
  },

  metadataBase: new URL(baseUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${poppins.variable}`}>
      <head>
      
        <link
  rel="icon"
  href="/favicon.svg"
  type="image/svg+xml"
  media="(prefers-color-scheme: light)"
/>
        <link
  rel="icon"
  href="/favicon-dark.svg"
  type="image/svg+xml"
   media="(prefers-color-scheme: dark)"
/>
<link
        rel="icon"
        href="/favicon.svg"
        type="image/svg+xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Hilop",
              url: "https://Hilop.vercel.app",
              logo: "https://Hilop.vercel.app/image/hilop-logo-light.svg",
              sameAs: [
                "https://www.instagram.com/hilop/",
                "https://www.linkedin.com/company/hilop/",
                "https://www.facebook.com/hilop/",
                "https://x.com/hilop",
                "https://github.com/hilop",
                "https://www.behance.net/hilop",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-1234567890",
                contactType: "customer service",
                email: "hello@hilop.com",
              },
            }),
          }}
        />
      </head>
      <body>
        {/* <Header /> */}
        <Navbar />
        {/* <ScrollProvider>{children}</ScrollProvider> */}
        {children}
        <Footer />
        {/* <SmoothCursor /> */}
      </body>
    </html>
  );
}
