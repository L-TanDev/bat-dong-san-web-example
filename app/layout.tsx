import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ZaloFloat from "@/components/layout/ZaloFloat";
import LoginModal from "@/components/auth/LoginModal";
import { Suspense } from "react";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "BĐSViệt | Nền tảng Bất động sản Hiện đại",
  description: "Tìm kiếm và đăng tin bất động sản chính chủ, uy tín hàng đầu Việt Nam. Kết nối trực tiếp, giao dịch nhanh chóng.",
  keywords: "bất động sản, căn hộ, nhà phố, đất nền, biệt thự, thuê văn phòng, bdsviet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={outfit.variable} suppressHydrationWarning>
      <body className={`${outfit.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
        
        <ZaloFloat />
        
        <Suspense fallback={null}>
          <LoginModal />
        </Suspense>
      </body>
    </html>
  );
}
