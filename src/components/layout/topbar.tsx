'use client';

import { ProfileDropdown } from './profile-dropdown';
import { AdminNotificationDropdown } from './admin-notification-dropdown';

export function Topbar() {
  return (
    <header className="flex h-[60px] items-center justify-end border-b border-[#2A2A2A] bg-[#0A0A0A] px-6">
      <div className="flex items-center gap-3">
        <AdminNotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
}
