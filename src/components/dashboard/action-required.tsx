'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { ActionRequiredItem } from '@/services/admin/dashboard.types';

interface ActionRequiredProps {
  items: ActionRequiredItem[];
  isLoading: boolean;
}

export function ActionRequired({ items, isLoading }: ActionRequiredProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-32 mb-4 bg-[#2A2A2A]" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full bg-[#2A2A2A]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Action Required</h3>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1.5"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-[#9CA3AF]">{item.label}</span>
            </div>
            <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] px-2 text-xs font-medium text-white">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
