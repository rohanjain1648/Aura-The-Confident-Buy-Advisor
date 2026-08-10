import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura — The Confident-Buy Advisor | YouCam AI Storefront Engine",
  description:
    "One selfie. Two verdicts. Zero guesswork. Aura unifies skin tone, concern metrics, and apparel try-on into a single Skin Passport.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#05050a] text-slate-100 selection:bg-rose-500 selection:text-white overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
