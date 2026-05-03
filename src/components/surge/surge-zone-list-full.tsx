'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { SurgeZoneCard } from './surge-zone-card';
import type { SurgeZoneItem } from '@/services/admin/surge.types';

interface SurgeZoneListFullProps {
  zones: SurgeZoneItem[];
  selectedZoneId: string | null;
  onSelectZone: (id: string) => void;
}

export function SurgeZoneListFull({
  zones,
  selectedZoneId,
  onSelectZone,
}: SurgeZoneListFullProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? zones.filter((z) => z.name.toLowerCase().includes(search.toLowerCase()))
    : zones;

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Zone List</h3>
        <span className="text-xs text-[#6B7280]">{zones.length} zones</span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(sanitizeSearchQuery(e.target.value))}
          placeholder="Search Zones..."
          className="w-full h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] pl-9 pr-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
        />
      </div>

      {/* Zone list */}
      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {filtered.map((zone) => (
          <SurgeZoneCard
            key={zone.id}
            zone={zone}
            isSelected={selectedZoneId === zone.id}
            onSelect={onSelectZone}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-[#6B7280] text-center py-4">
            No zones found
          </p>
        )}
      </div>
    </div>
  );
}
