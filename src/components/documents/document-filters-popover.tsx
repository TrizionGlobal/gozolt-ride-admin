'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import type { DocumentEntityType } from '@/services/admin/document.types';

interface DocumentFiltersPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export function DocumentFiltersPopover({
  open,
  onOpenChange,
  sortBy,
  onSortByChange,
}: DocumentFiltersPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [localSortBy, setLocalSortBy] = useState(sortBy);

  useEffect(() => {
    if (open) {
      setLocalSortBy(sortBy);
    }
  }, [open, sortBy]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onOpenChange]);

  if (!open) return null;

  const handleApply = () => {
    onSortByChange(localSortBy);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalSortBy('');
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-72 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 shadow-xl space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm text-[#9CA3AF]">Sort By</label>
        <select
          value={localSortBy}
          onChange={(e) => setLocalSortBy(e.target.value)}
          className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
        >
          <option value="">Default (Submitted)</option>
          <option value="type:asc">Documents</option>
          <option value="supplier:asc">Supplier</option>
        </select>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
        >
          Reset
        </Button>
        <Button
          size="sm"
          onClick={handleApply}
          className="bg-[#FACC15] text-black hover:bg-[#E5B800]"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
