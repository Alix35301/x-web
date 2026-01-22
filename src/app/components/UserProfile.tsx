"use client";

import { User, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserProfile() {
  const { user, logout, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Show loading skeleton during initial load
  if (loading) {
    return (
      <div className="w-8 h-8 bg-foreground/10 rounded-full animate-pulse" />
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  const displayName = user.name || user.email;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center">
          <div className=" w-8 h-8 bg-foreground/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-foreground" />
          </div>
          <span className=" ms-4 hidden md:block text-sm font-medium text-foreground hover:text-primary">
            {displayName}
          </span>
          <ChevronDown className="ms-2 w-4 h-4 text-foreground/10 dark:text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div className="px-4 py-2 ">
              <p className="text-sm font-medium text-foreground">
                {user.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}
