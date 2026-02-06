"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "@/app/components/Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Header
          isMenuOpen={sidebarOpen}
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="pt-16 lg:pt-0 min-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
