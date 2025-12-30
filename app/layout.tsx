
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Web3 Archive 2025",
  description: "A premium, dark-mode SaaS dashboard.",
  icons: {
    icon: "/icon.png",
  },
};

import { ArchiveProvider } from "@/context/archive-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ArchiveProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex flex-1 flex-col pl-64 transition-all duration-300 ease-in-out">
                <Suspense fallback={<div className="h-20" />}>
                  <Header />
                </Suspense>
                <main className="flex-1 p-6 md:p-8 pt-6">
                  {children}
                </main>
              </div>
            </div>
          </ArchiveProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
