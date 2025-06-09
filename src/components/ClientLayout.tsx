// components/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/auth/login", "/auth/signup", "/auth/otp"];
  const isAuthRoute = noLayoutRoutes.includes(pathname);

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main>{children}</main>
      {!isAuthRoute && <Footer />}
    </>
  );
}
