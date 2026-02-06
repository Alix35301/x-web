'use client';

import { Menu } from 'lucide-react';
import UserProfile from './UserProfile';

interface HeaderProps {
  isMenuOpen: boolean;
  onToggleMenu?: () => void;
}

export default function Header({ isMenuOpen, onToggleMenu = () => {}}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm border-b border-border px-4 py-4 lg:hidden">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onToggleMenu}
          className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* App title */}
        <h1 className="text-lg font-semibold text-foreground">
          Financial Tracker
        </h1>

        {/* User profile */}
        <div className="flex items-center">
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
