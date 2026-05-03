'use client';

import type { SurgeZoneItem } from '@/services/admin/surge.types';

const MAP_BOUNDS = {
  minLat: 35.80,
  maxLat: 35.96,
  minLng: 14.35,
  maxLng: 14.58,
};

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x: Math.min(95, Math.max(5, x)), y: Math.min(90, Math.max(5, y)) };
}

interface SurgeServiceMapProps {
  zones: SurgeZoneItem[];
}

export function SurgeServiceMap({ zones }: SurgeServiceMapProps) {
  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-3">
        Malta Service Map
      </h3>

      <div className="relative aspect-[4/3] bg-[#0A0A0A] rounded-md overflow-hidden">
        {/* Dark Malta SVG */}
        <svg
          viewBox="0 0 200 120"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <ellipse cx="110" cy="65" rx="65" ry="38" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.5" />
          <ellipse cx="50" cy="28" rx="22" ry="14" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.5" />
          <circle cx="70" cy="38" r="4" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.3" />
        </svg>

        {/* Zone dots */}
        {zones.map((z) => {
          const center = z.polygon.coordinates[0][0];
          const pos = latLngToPercent(center[1], center[0]);
          return (
            <span
              key={z.id}
              className="absolute h-3 w-3 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${pos.y}%`,
                left: `${pos.x}%`,
                backgroundColor: z._color,
                opacity: z.isActive ? 1 : 0.3,
              }}
              title={z.name}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-[#9CA3AF]">Surge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
          <span className="text-xs text-[#9CA3AF]">Pickup</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
          <span className="text-xs text-[#9CA3AF]">Standard</span>
        </div>
      </div>
    </div>
  );
}
