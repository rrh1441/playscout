// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Use alias for sonner
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"; // Use alias for shadcn toaster
import Header from "@/components/Header"; // Import the new Header
import Footer from "@/components/Footer"; // Import the new Footer
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlayScout - Find Kids Activities",
  description:
    "Discover and register for local kids' activities, classes, and camps.",
  // Keeping the generator tag as it was present before
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for next-themes */}
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased", // Apply flex layout here
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          // disableTransitionOnChange // Consider adding this if theme changes cause flashes
        >
          <Header />
          <main className="flex-1">{children}</main> {/* Ensure main content takes available space */}
          <Footer />
          <ShadcnToaster /> {/* Render Shadcn's hook-based toaster */}
          <SonnerToaster /> {/* Render Sonner toaster */}
        </ThemeProvider>
      </body>
    </html>
  );
}