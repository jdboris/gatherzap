"use client";
import ComingSoonOverlay from "@/components/coming-soon-overlay";
import { AuthProvider } from "@/contexts/auth-context";
import { COMING_SOON_MODE } from "@/utils/feature-flags";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountProvider } from "@/contexts/account-context";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AccountProvider>
            <html lang="en" className="h-full">
              <body className="flex flex-col h-full">
                {children}
                {COMING_SOON_MODE && <ComingSoonOverlay />}
              </body>
            </html>
          </AccountProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
