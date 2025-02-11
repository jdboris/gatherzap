import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ComingSoonOverlay from "@/components/coming-soon-overlay";
import { COMING_SOON_MODE } from "@/utils/feature-flags";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="flex flex-col h-full">
          {children}
          {COMING_SOON_MODE && <ComingSoonOverlay />}
        </body>
      </html>
    </ClerkProvider>
  );
}
