import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import { ThemeProvider } from "../../lib/theme-context";
import Header from "../components/Header";

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
              <Header isMenuOpen={false}  />
              <div className="max-w-7xl mx-auto">{children}</div>
          </ThemeProvider>
  );
}
