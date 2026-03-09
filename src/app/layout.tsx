import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DigitalSewa — Nepal's Local Freelancing Platform",
  description: "Connect with verified Nepali freelancers in your district. Post projects, hire talent, and pay in NPR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${plusJakarta.variable} ${outfit.variable} antialiased`} style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
