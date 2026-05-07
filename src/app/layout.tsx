'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CompetitionProvider } from "@/lib/context/CompetitionContext";
import { AuthProvider } from "@/lib/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 flex flex-col">
        <AuthProvider>
          <CompetitionProvider>
            {children}
          </CompetitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


