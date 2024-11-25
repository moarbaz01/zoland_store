import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${popins.variable} antialiased `}>
        <NextTopLoader color="#ab20fd" />
        <Provider>
          <Toaster />
          <Navbar /> {/* Conditionally render Navbar */}
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
