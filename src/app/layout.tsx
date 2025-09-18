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
    keywords: [
      "Hilop",
      "Natural Weight Loss",
      "Science Baked Supplement",
      "Fat Burner India",
      "Safe Weight Loss",
      "Money Back Guarantee",
    ],
    authors: [{ name: "Hilop Team" }],
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      url: baseUrl,
      siteName: "Hilop",
      images: [
        {
          url: `${baseUrl}/logo.svg`,
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
      images: [`${baseUrl}/logo.svg`],
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
              "@graph": [
                {
                  "@type": "Corporation",
                  name: "Hilop",
                  alternateName: "Hilopwellness",
                  url: baseUrl,
                  logo: `${baseUrl}/logo.svg`,
                  sameAs: [
                    "https://www.facebook.com/hilopwellness",
                    "https://www.instagram.com/hilopwellness/",
                    "https://www.youtube.com/@hilopwellness",
                    "https://x.com/hilopwellness",
                    "https://www.pinterest.com/hilopwellness/",
                    "https://www.linkedin.com/company/hilop-pvt-ltd",
                    baseUrl,
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "info@hilop.com",
                    telephone: "+91-9998852888",
                    contactType: "Customer Service",
                    openingHours: "Mo,Tu,We,Th,Fr,Sa 10:00-19:00",
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.8",
                    ratingCount: "3687",
                  },
                },
              ],
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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZXJCJF0CZS"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ZXJCJF0CZS', {
        page_path: window.location.pathname,
      });
    `,
          }}
        />

        {/* GTM Head Script */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T39433BL');`}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "t3v04wca79");
          `}
        </Script>
      </head>
      <body>
        <ReduxProvider>
          <LanguageProvider>
            <LoadingProvider>
              <AuthProvider>
                {/* GTM NoScript Fallback */}
                <noscript>
                  <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-T39433BL"
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                  ></iframe>
                </noscript>
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
