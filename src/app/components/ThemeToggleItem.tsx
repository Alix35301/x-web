'use client';

import { useTheme } from '../../lib/theme-context';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleItemProps {
  onClose?: () => void;
}

export default function ThemeToggleItem({ onClose }: ThemeToggleItemProps) {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
    onClose?.();
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Theme
        </p>
        <div className="space-y-1">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isActive = theme === themeOption.value;
            
            return (
              <button
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
                className={`
                  w-full flex items-center space-x-3 px-2 py-2 text-left text-sm rounded-md transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{themeOption.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


