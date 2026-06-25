'use client';

import { CircleHelp } from 'lucide-react';

import { ProfileDropdown } from './profile-dropdown';

export function Topbar() {
  return (
    <header className="flex h-[60px] items-center justify-end border-b border-[#2A2A2A] bg-[#0A0A0A] px-6">
      <div className="flex items-center gap-4">
        <ProfileDropdown />
      </div>
    </header>
  );
}
