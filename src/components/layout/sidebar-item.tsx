'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isCollapsed: boolean;
}

export function SidebarItem({ label, href, icon: Icon, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-[#FACC15] text-black'
          : 'text-[#9CA3AF] hover:bg-[#1A1A1A] hover:text-white',
        isCollapsed && 'justify-center px-2',
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
