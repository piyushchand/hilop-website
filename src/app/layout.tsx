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

export const metadata: Metadata = {
  title: {
    template: "%s | Hilop",
    default: "Hilop",
  },
  description: "Wellness product",
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
      default: "Hilop wellness product",
    },
    description: "Wellness product",
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
      default: "Hilop wellness product",
    },
    description: "Wellness product",
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

            fbq('init', '746573144945915');
            fbq('track', 'PageView');
          `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            src="https://www.facebook.com/tr?id=746573144945915&ev=PageView&noscript=1"
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
