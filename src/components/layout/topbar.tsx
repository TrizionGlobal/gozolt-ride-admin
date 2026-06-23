'use client';

import { CircleHelp } from 'lucide-react';

import { ProfileDropdown } from './profile-dropdown';

export function Topbar() {
  return (
    <header className="flex h-[60px] items-center justify-end border-b border-[#2A2A2A] bg-[#0A0A0A] px-6">
      <div className="flex items-center gap-4">
        <button aria-label="Help center" className="flex items-center justify-center h-8 w-8 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] transition-colors">
          <CircleHelp className="h-5 w-5" />
        </button>
        <ProfileDropdown />
      </div>
    </header>
  );
}
