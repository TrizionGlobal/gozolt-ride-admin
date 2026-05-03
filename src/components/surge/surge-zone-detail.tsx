'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SurgeZoneMetrics } from './surge-zone-metrics';
import { SurgeZoneRules } from './surge-zone-rules';
import type { SurgeZoneItem } from '@/services/admin/surge.types';

interface SurgeZoneDetailProps {
  zone: SurgeZoneItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function SurgeZoneDetail({ zone, onEdit, onDelete }: SurgeZoneDetailProps) {
  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: zone._color }}
          />
          <div>
            <h3 className="text-base font-semibold text-white">{zone.name}</h3>
            <p className="text-xs text-[#6B7280]">
              {zone._displayId} · {zone._zoneType} zone
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onEdit}
            className="bg-[#FACC15] text-black hover:bg-[#E5B800] h-8 text-xs"
          >
            <Pencil className="mr-1.5 h-3 w-3" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-8 text-xs"
          >
            <Trash2 className="mr-1.5 h-3 w-3" />
            Delete
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <SurgeZoneMetrics zone={zone} />

      {/* Rules */}
      <SurgeZoneRules rules={zone._rules} />
    </div>
  );
}
