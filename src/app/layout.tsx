// app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Provider from "@/components/Provider";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zoland Store",
  description: "Top-up your favorite games by using Zoland store",
};

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
