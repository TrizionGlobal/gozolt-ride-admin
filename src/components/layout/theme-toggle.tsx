'use client';

import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  return (
    <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-full border border-[#2A2A2A]">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${
          theme === 'light' ? 'bg-[#FACC15] text-black' : 'text-[#9CA3AF] hover:text-white'
        }`}
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${
          theme === 'dark' ? 'bg-[#3A3A3A] text-white' : 'text-[#9CA3AF] hover:text-white'
        }`}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${
          theme === 'system' ? 'bg-[#3A3A3A] text-white' : 'text-[#9CA3AF] hover:text-white'
        }`}
        title="System Preference"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
