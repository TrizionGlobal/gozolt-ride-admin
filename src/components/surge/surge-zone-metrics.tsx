'use client';

import type { SurgeZoneItem } from '@/services/admin/surge.types';

interface SurgeZoneMetricsProps {
  zone: SurgeZoneItem;
}

interface MetricCard {
  label: string;
  value: string;
  className?: string;
}

export function SurgeZoneMetrics({ zone }: SurgeZoneMetricsProps) {
  const metrics: MetricCard[] = [
    {
      label: 'Status',
      value: zone.isActive ? 'Active' : 'Inactive',
      className: zone.isActive ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Multiplier',
      value: `${zone.multiplier}x`,
      className: 'text-[#FACC15]',
    },
    {
      label: 'Rides (24h)',
      value: String(zone._rides24h),
    },
    {
      label: 'Active Drivers',
      value: String(zone._activeDrivers),
    },
    {
      label: 'Type',
      value: zone._zoneType.charAt(0).toUpperCase() + zone._zoneType.slice(1),
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-md border border-[#2A2A2A] bg-[#141414] px-3 py-2.5"
        >
          <p className="text-[11px] text-[#6B7280] mb-1">{m.label}</p>
          <p className={`text-sm font-bold ${m.className ?? 'text-white'}`}>
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
