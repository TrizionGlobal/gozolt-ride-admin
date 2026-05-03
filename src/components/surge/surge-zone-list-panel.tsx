'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { SurgeZoneItem } from '@/services/admin/surge.types';

interface SurgeZoneListPanelProps {
  zones: SurgeZoneItem[];
  selectedZoneId: string | null;
  onSelectZone: (id: string) => void;
  onToggleZone: (id: string) => void;
  onAddZone: () => void;
}

export function SurgeZoneListPanel({
  zones,
  selectedZoneId,
  onSelectZone,
  onToggleZone,
  onAddZone,
}: SurgeZoneListPanelProps) {
  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Zones</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddZone}
          className="h-7 text-xs border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15] hover:text-black"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Zone
        </Button>
      </div>

      {/* Zone list */}
      <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onSelectZone(zone.id)}
            className={cn(
              'flex items-center justify-between w-full rounded-md px-3 py-2.5 text-left transition-colors',
              selectedZoneId === zone.id
                ? 'bg-[#2A2A2A]'
                : 'hover:bg-[#1A1A1A]',
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: zone._color }}
              />
              <span className="text-sm text-white truncate">{zone.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-sm font-bold text-red-400">
                {zone.multiplier}x
              </span>
              <Switch
                checked={zone.isActive}
                onCheckedChange={() => onToggleZone(zone.id)}
                onClick={(e) => e.stopPropagation()}
                className="data-[state=checked]:bg-[#22C55E]"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
