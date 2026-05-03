'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { mockZoneOverrides } from '@/services/admin/surge.mock';
import type { ZoneOverride } from '@/services/admin/surge.types';

export function SurgeZoneOverrides() {
  const [overrides, setOverrides] = useState<ZoneOverride[]>([...mockZoneOverrides]);

  const toggleOverride = (id: string) => {
    setOverrides((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, isActive: !o.isActive } : o,
      ),
    );
  };

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Zone Overrides</h3>

      <div className="space-y-3">
        {overrides.map((ovr) => (
          <div
            key={ovr.id}
            className="flex items-center justify-between rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-medium text-white">{ovr.zoneName}</p>
              <p className="text-xs text-[#6B7280]">{ovr.rule}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ovr.isActive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {ovr.isActive ? 'Active' : 'Inactive'}
              </span>
              <Switch
                checked={ovr.isActive}
                onCheckedChange={() => toggleOverride(ovr.id)}
                className="data-[state=checked]:bg-[#22C55E]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
