'use client';

import { Search, CircleHelp } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A] px-6">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        <Input
          type="text"
          placeholder="Search reservation..."
          aria-label="Search reservations"
          className="pl-10 h-9 bg-[#141414] border-[#2A2A2A] text-white text-sm placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
        />
      </div>

      <button aria-label="Help center" className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors">
        <CircleHelp className="h-4 w-4" />
        <span>Help Center</span>
      </button>
    </header>
  );
}
