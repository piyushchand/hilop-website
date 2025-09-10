import AuthDebugger from "@/components/AuthDebugger";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../store/ReduxProvider";
import Script from "next/script";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hilop.com";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7EBF28",
};

// 🔹 Dynamic metadata function
export async function generateMetadata(): Promise<Metadata> {
  // Example: later you could fetch data here (API, DB, CMS, etc.)
  const dynamicTitle =
    "Hilop – 100% Natural & Science-Backed Weight Loss Formula";
  const dynamicDescription =
    "Discover Hilop, India’s 1st science-backed, 100% natural, safe & fast-acting weight loss solution with money-back guarantee.";

  return {
    title: {
      template: "%s | Hilop",
      default: dynamicTitle,
    },
    description: dynamicDescription,
    applicationName: "Hilop",
    keywords: ["Hilop", "Natural Weight Loss", "Science Baked Supplement", "Fat Burner India", "Safe Weight Loss", "Money Back Guarantee"],
    authors: [{ name: "Hilop Team" }],
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      url: baseUrl,
      siteName: "Hilop",
      images: [
        {
          url: `${baseUrl}/image/home-hero.webp`,
          width: 1200,
          height: 630,
          alt: "Hilop",
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDescription,
      images: [`${baseUrl}/image/home-hero.webp`],
      creator: "@hilop",
      site: "@hilop",
    },
    metadataBase: new URL(baseUrl),

    alternates: {
      canonical: baseUrl,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${poppins.className}`}>
      <head>
        {/* Favicons for light and dark themes */}
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

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Hilop",
              url: baseUrl,
              logo: `${baseUrl}/image/hilop-logo-light.svg`,
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

        {/* Facebook Pixel */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
           !function(f,b,e,v,n,t,s)
           {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
           n.callMethod.apply(n,arguments):n.queue.push(arguments)};
           if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
           n.queue=[];t=b.createElement(e);t.async=!0;
           t.src=v;s=b.getElementsByTagName(e)[0];
           s.parentNode.insertBefore(t,s)}(window, document,'script',
           'https://connect.facebook.net/en_US/fbevents.js');
           fbq('init', '1413400039740880');
           fbq('track', 'PageView');
          `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            src="https://www.facebook.com/tr?id=1413400039740880&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        <ReduxProvider>
          <LanguageProvider>
            <LoadingProvider>
              <AuthProvider>
                {children}
                <AuthDebugger />
              </AuthProvider>
            </LoadingProvider>
          </LanguageProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
