'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden max-h-screen">
      {/* Side Menu */}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen ">
        {/* Header */}
        <Header isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
        
        {/* Page Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
