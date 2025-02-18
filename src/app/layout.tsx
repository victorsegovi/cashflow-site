"use client";
import { Literata, Red_Hat_Text } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

const redHatText = Red_Hat_Text({
  variable: "--font-red-hat-text",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${literata.variable} ${redHatText.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}