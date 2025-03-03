import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/providers/next-auth-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventSea - Web3 Event Platform",
  description:
    "Create and manage next-generation events powered by Web3 technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <NextAuthProvider>
            <Navbar />
            <div className="pt-12">{children}</div>
          </NextAuthProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
