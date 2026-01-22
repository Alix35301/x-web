'use client';

import { Menu, X } from 'lucide-react';
import UserProfile from './UserProfile';

interface HeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function Header({ isMenuOpen, onToggleMenu = () => {}}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto bg-background  shadow-sm border-b border-border px-4 py-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile menu button */}
        <button
          onClick={onToggleMenu}
          className="lg:hidden p-2 rounded-md text-gray-600  hover:bg-gray-100  transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Page title - hidden on mobile since it's in the side menu */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-foreground ">
            Dashboard
          </h1>
        </div>

        {/* User profile */}
        <div className="flex items-center">
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
