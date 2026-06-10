'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/hooks/use-auth';
import { SIDEBAR_ITEMS } from '@/lib/constants';
import { SidebarItem } from './sidebar-item';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();

  const initials = user && user.firstName && user.lastName
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : 'SA';

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#2A2A2A] bg-[#0A0A0A] transition-all duration-300',
        isCollapsed ? 'w-[68px]' : 'w-[260px]',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center px-4 py-4', isCollapsed && 'justify-center px-2')}>
        {isCollapsed ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FACC15]">
            <span className="text-sm font-bold text-[#FACC15]">G</span>
          </div>
        ) : (
          <Image src="/gozolt-logo.png" alt="Gozolt" width={130} height={40} className="w-auto h-auto" priority />
        )}
      </div>

      {/* User Profile */}
      <div className={cn('px-4 pb-3', isCollapsed && 'px-2')}>
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg bg-[#141414] p-3',
            isCollapsed && 'justify-center p-2',
          )}
        >
          <Avatar className="h-9 w-9 shrink-0 border border-[#FACC15]">
            <AvatarFallback className="bg-[#FACC15] text-black text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user ? `${user.firstName} ${user.lastName}` : 'Super Admin'}
              </p>
              <p className="truncate text-xs text-[#6B7280]">
                {user?.email || 'admin@gozolt.in'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <div className={cn('px-4 pb-2', isCollapsed && 'px-2')}>
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center rounded-md py-1.5 text-[#6B7280] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <Separator className="bg-[#2A2A2A]" />

      {/* Navigation */}
      <nav role="navigation" aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <Separator className="bg-[#2A2A2A]" />

      {/* Sign Out */}
      <div className="px-3 py-3">
        <button
          onClick={logout}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#9CA3AF] hover:bg-[#1A1A1A] hover:text-red-400 transition-colors',
            isCollapsed && 'justify-center px-2',
          )}
          title={isCollapsed ? 'Sign Out' : undefined}
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
