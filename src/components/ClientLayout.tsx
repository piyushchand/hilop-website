// components/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/auth/login", "/auth/register", "/auth/otp", "/not-found"];
  const isAuthRoute = noLayoutRoutes.includes(pathname);

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main>{children}</main>
      {!isAuthRoute && <Footer />}
    </>
  );
}
