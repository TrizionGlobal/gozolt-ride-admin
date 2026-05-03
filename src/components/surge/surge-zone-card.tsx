'use client';

import { SurgeZoneTypeBadge } from './surge-zone-type-badge';
import { cn } from '@/lib/utils';
import type { SurgeZoneItem } from '@/services/admin/surge.types';

interface SurgeZoneCardProps {
  zone: SurgeZoneItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function SurgeZoneCard({ zone, isSelected, onSelect }: SurgeZoneCardProps) {
  return (
    <button
      onClick={() => onSelect(zone.id)}
      className={cn(
        'flex items-start justify-between w-full rounded-md px-3 py-2.5 text-left transition-colors',
        isSelected ? 'bg-[#2A2A2A]' : 'hover:bg-[#1A1A1A]',
      )}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <span
          className="h-2.5 w-2.5 rounded-full mt-1 shrink-0"
          style={{ backgroundColor: zone._color }}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{zone.name}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            <span className="font-medium text-white">{zone.multiplier}X</span>
            {' '}
            {zone._rides24h} Rides/24h
            {' '}
            {zone._activeDrivers} Drivers
            {' '}
            <span className="text-green-400">
              {zone.isActive ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>
      </div>
      <div className="shrink-0 ml-2">
        <SurgeZoneTypeBadge type={zone._zoneType} />
      </div>
    </button>
  );
}
