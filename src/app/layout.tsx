// app/layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Provider from "@/components/Provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Zoland Store",
  description: "Top-up your favorite games by using Zoland store",
};

const popins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
  hasNavBar = true,
  hasFooter = true, // Default to true if not passed
}: Readonly<{
  children: React.ReactNode;
  hasNavBar?: boolean;
  hasFooter?: boolean;
}>) {
  return (
    <html lang="en">
      <body className={`${popins.variable} antialiased`}>
        <Provider>
          <Toaster />
          {hasNavBar && <Navbar />} {/* Conditionally render Navbar */}
          {children}
          {hasFooter && <Footer />}
        </Provider>
      </body>
    </html>
  );
}
