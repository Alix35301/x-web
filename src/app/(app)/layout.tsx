import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import { ThemeProvider } from "../../lib/theme-context";
import AppLayout from "@/components/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Financial Tracker",
  description: "Manage your income and expenses efficiently",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}
