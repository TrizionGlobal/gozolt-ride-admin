'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PanelLeft, PanelLeftClose, LogOut, ArrowLeftRight } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/hooks/use-auth';
import { CAB_SIDEBAR_ITEMS, RENTAL_SIDEBAR_ITEMS, BIKE_RENTAL_SIDEBAR_ITEMS } from '@/lib/constants';
import { SidebarItem } from './sidebar-item';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { isCollapsed, toggle, activeModule, setActiveModule } = useSidebarStore();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();

  const items = activeModule === 'RENTAL' ? RENTAL_SIDEBAR_ITEMS : activeModule === 'BIKE_RENTAL' ? BIKE_RENTAL_SIDEBAR_ITEMS : CAB_SIDEBAR_ITEMS;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#2A2A2A] bg-[#0A0A0A] transition-all duration-300',
        isCollapsed ? 'w-[68px]' : 'w-[260px]',
      )}
    >
      {/* Logo + Collapse toggle */}
      <div className={cn('flex items-center justify-between px-4 py-4', isCollapsed && 'justify-center px-2')}>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/gozolt-logo.png"
            alt="Gozolt"
            width={44}
            height={44}
            className="shrink-0 object-contain"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wide leading-none">
                <span className="text-white">GO</span>
                <span className="text-[#FACC15]">ZOLT</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#FACC15] uppercase mt-0.5">Admin Portal</span>
            </div>
          )}
        </Link>
        {!isCollapsed && (
          <button onClick={toggle} className="text-[#71717A] hover:text-white transition-colors">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
        {isCollapsed && (
          <button onClick={toggle} className="mt-2 text-[#71717A] hover:text-white transition-colors">
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <Separator className="bg-[#2A2A2A]" />

      {/* Navigation */}
      <nav role="navigation" aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Switch Module Button */}
      <div className={cn("px-3 pb-3", isCollapsed && "flex justify-center")}>
        <Link 
          href="/module-selection" 
          onClick={() => setActiveModule(null)}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#71717A] transition-colors hover:bg-[#1A1A1A] hover:text-[#FACC15]",
            isCollapsed && "px-2 justify-center"
          )}
          title={isCollapsed ? "Switch Module" : undefined}
        >
          <ArrowLeftRight className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Switch Module</span>}
        </Link>
      </div>

      {/* Footer Version */}
      <div className={cn("border-t border-[#2A2A2A] px-4 py-3", isCollapsed && "px-2")}>
        {!isCollapsed ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-[#FACC15]/10 px-2 py-0.5 text-[10px] font-medium text-[#FACC15] ring-1 ring-inset ring-[#FACC15]/20">
                v1.0.0
              </span>
            </div>
            <span className="text-[10px] text-[#52525B]">Born in Malta, Loved by Europe</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-md bg-[#FACC15]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#FACC15] ring-1 ring-inset ring-[#FACC15]/20">
              v1.0
            </span>
          </div>
        )}
      </div>

    </aside>
  );
}
