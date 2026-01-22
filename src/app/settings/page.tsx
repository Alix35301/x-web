'use client';

import AppLayout from '../components/AppLayout';
import { useAuth } from '../../lib/auth-context';
import { LogOut, User, Shield, Bell, Palette } from 'lucide-react';

interface SettingsItem {
  label: string;
  value: string;
  action?: string;
}

interface SettingsSection {
  title: string;
  icon: typeof User;
  items: SettingsItem[];
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Email', value: user?.email || 'Not available' },
        { label: 'User ID', value: user?.id || 'Not available' },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Password', value: '••••••••', action: 'Change' },
        { label: 'Two-factor auth', value: 'Disabled', action: 'Enable' }
      ]
    },
    {
      title: 'Preferences',
      icon: Bell,
      items: [
        { label: 'Email notifications', value: 'Enabled', action: 'Configure' },
        { label: 'Push notifications', value: 'Disabled', action: 'Enable' }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', value: 'Auto', action: 'Change' },
        { label: 'Language', value: 'English', action: 'Change' }
      ]
    }
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account preferences and settings
            </p>
          </div>


          {/* Settings sections */}
          <div className="space-y-6">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              
              return (
                <div key={section.title} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-900 dark:text-white">{item.value}</span>
                          {item.action && (
                            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                              {item.action}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sign out button */}
          <div className="mt-8">
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
