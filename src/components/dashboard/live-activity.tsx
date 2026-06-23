'use client';

import { Car, Users, Building2, FileText, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { LiveActivityItem } from '@/services/admin/dashboard.types';

interface LiveActivityProps {
  items: LiveActivityItem[];
  isLoading: boolean;
}

const typeIcons = {
  ride: Car,
  driver: Users,
  supplier: Building2,
  document: FileText,
  payment: CreditCard,
};

const typeColors = {
  ride: '#FACC15',
  driver: '#22C55E',
  supplier: '#3B82F6',
  document: '#F59E0B',
  payment: '#A855F7',
};

export function LiveActivity({ items, isLoading }: LiveActivityProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-28 mb-4 bg-[#2A2A2A]" />
        <div className="flex-1 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-[#2A2A2A]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-white">Live Activity</h3>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs text-[#22C55E]">Live</span>
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {items.map((item) => {
          const Icon = typeIcons[item.type];
          const color = typeColors[item.type];
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#9CA3AF] truncate">{item.message}</p>
                <p className="text-xs text-[#6B7280]">{item.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
