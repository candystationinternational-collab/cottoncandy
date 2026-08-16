import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Candy Station — Premium Cotton Candy",
  description:
    "Candy Station: premium, handcrafted cotton candy in Nepal. Browse fruity, fresh, classic and indulgent flavors, order online, and get it delivered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
