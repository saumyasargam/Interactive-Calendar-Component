import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Interactive Wall Calendar",
  description: "A highly functional, responsive wall calendar mockup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} min-h-full h-full w-full bg-neutral-100 font-sans antialiased text-neutral-900`}>
      <body className="flex flex-col min-h-full h-full w-full">{children}</body>
    </html>
  );
}
