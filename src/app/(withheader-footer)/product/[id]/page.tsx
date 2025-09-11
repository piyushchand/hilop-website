import ProductPage from "./ProductPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    console.error("Product ID is missing");
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error("Environment variable NEXT_PUBLIC_API_URL is not set");
    return {
      title: "Configuration Error",
      description: "API configuration is incomplete. Please try again later.",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?lang=en`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
      notFound();
    }

    const data = await res.json();
    if (!data.success || !data.data) {
      console.error("Invalid API response:", data);
      notFound();
    }

    const product = data.data;

    const productName = product?.seo?.name || product?.name || "Unknown Product";
    const productDescription =
      product?.seo?.description || product?.description?.en || "No description available";
    const productImage = product?.images?.[0] || "";
    const productPrice = product?.price?.final_price?.toString() || "0";

    return {
      title: product?.seo?.title || product?.name || "Product",
      description: productDescription,
      openGraph: {
        title: product?.seo?.title || product?.name || "Product",
        description: productDescription,
        images: productImage ? [productImage] : [],
        url: `https://hilop.com/products/${id}`, // Hardcoded base URL
      },
      // Removed 'other' to avoid invalid <meta> tag
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    notFound();
  }
}

// Helper function to build schema (shared logic)
function buildProductSchema(product: any, id: string) {
  const productName = product?.seo?.name || product?.name || "Unknown Product";
  const productDescription =
    product?.seo?.description || product?.description?.en || "No description available";
  const productImage = product?.images?.[0] || "";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    image: productImage,
    offers: {
      "@type": "Offer",
      url: `https://hilop.com/products/${id}`, // Hardcoded base URL
      priceCurrency: "INR",
      price: product?.price?.final_price?.toString() || "0",
      priceValidUntil: "2025-12-31",
      availability: product?.availability || "https://schema.org/LimitedAvailability",
      itemCondition: "https://schema.org/NewCondition",
    },
    brand: {
      "@type": "Brand",
      name: "Hilop",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product?.rating?.toString() || "4.8",
      ratingCount: product?.reviewsCount?.toString() || "3687",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    // Fallback UI for env error
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Configuration Error</h1>
        <p>API configuration is incomplete. Please try again later.</p>
      </div>
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?lang=en`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      notFound();
    }

    const data = await res.json();
    if (!data.success || !data.data) {
      notFound();
    }

    const product = data.data;
    const productSchema = buildProductSchema(product, id);
    const schemaString = JSON.stringify(productSchema);

    return (
      <>
        {/* Render JSON-LD as a proper <script> tag */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaString }}
        />
        <ProductPage />
      </>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}

// // app/products/[id]/page.tsx
// import ProductPage from "./ProductPage";
// import { Metadata } from "next";
// import { notFound } from "next/navigation";


// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//   const { id } = await params;
//   if (!id) {
//     console.error("Product ID is missing");
//     return {
//       title: "Product Not Found",
//       description: "The requested product could not be found.",
//     };
//   }

//   if (!process.env.NEXT_PUBLIC_BASE_URL || !process.env.NEXT_PUBLIC_API_URL) {
//     console.error("Environment variables NEXT_PUBLIC_BASE_URL or NEXT_PUBLIC_API_URL are not set");
//     return {
//       title: "Configuration Error",
//       description: "Site configuration is incomplete. Please try again later.",
//     };
//   }

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?lang=en`,
//       {
//         cache: "no-store",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!res.ok) {
//       console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
//       notFound();
//     }

//     const data = await res.json();
//     if (!data.success || !data.data) {
//       console.error("Invalid API response:", data);
//       notFound();
//     }

//     const product = data.data;

//     const productName = product?.seo?.name || product?.name || "Unknown Product";
//     const productDescription =
//       product?.seo?.description || product?.description?.en || "No description available";
//     const productImage = product?.images?.[0] || "";
//     const productPrice = product?.price?.final_price?.toString() || "0";

//     return {
//       title: product?.seo?.title || product?.name || "Product",
//       description: productDescription,
//       openGraph: {
//         title: product?.seo?.title || product?.name || "Product",
//         description: productDescription,
//         images: productImage ? [productImage] : [],
//         url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
//       },
//       // Removed 'other' to avoid invalid <meta> tag
//     };
//   } catch (error) {
//     console.error("Error generating metadata:", error);
//     notFound();
//   }
// }

// // Continue in app/products/[id]/page.tsx

// // Helper function to build schema (shared logic)
// function buildProductSchema(product: any, baseUrl: string, id: string) {
//   const productName = product?.seo?.name || product?.name || "Unknown Product";
//   const productDescription =
//     product?.seo?.description || product?.description?.en || "No description available";
//   const productImage = product?.images?.[0] || "";

//   return {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: productName,
//     description: productDescription,
//     image: productImage,
//     offers: {
//       "@type": "Offer",
//       url: `${baseUrl}/products/${id}`,
//       priceCurrency: "INR",
//       price: product?.price?.final_price?.toString() || "0",
//       priceValidUntil: "2025-12-31",
//       availability: product?.availability || "https://schema.org/LimitedAvailability",
//       itemCondition: "https://schema.org/NewCondition",
//     },
//     brand: {
//       "@type": "Brand",
//       name: "Hilop",
//     },
//     aggregateRating: {
//       "@type": "AggregateRating",
//       ratingValue: product?.rating?.toString() || "4.8",
//       ratingCount: product?.reviewsCount?.toString() || "3687",
//     },
//   };
// }

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   if (!id) {
//     notFound();
//   }

//   if (!process.env.NEXT_PUBLIC_BASE_URL || !process.env.NEXT_PUBLIC_API_URL) {
//     // Fallback UI for env error
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold">Configuration Error</h1>
//         <p>Site configuration is incomplete. Please try again later.</p>
//       </div>
//     );
//   }

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products/${id}?lang=en`,
//       {
//         cache: "no-store",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!res.ok) {
//       notFound();
//     }

//     const data = await res.json();
//     if (!data.success || !data.data) {
//       notFound();
//     }

//     const product = data.data;
//     const productSchema = buildProductSchema(product, process.env.NEXT_PUBLIC_BASE_URL, id);
//     const schemaString = JSON.stringify(productSchema);

//     return (
//       <>
//         {/* Render JSON-LD as a proper <script> tag */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: schemaString }}
//         />
//         <ProductPage />
//       </>
//     );
//   } catch (error) {
//     console.error("Error loading page:", error);
//     notFound();
//   }
// }