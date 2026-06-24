'use client';

import { RideStatus } from '@/types';
import type { RideListItem } from '@/services/admin/ride.types';

interface RideLiveMapProps {
  rides: RideListItem[];
}

// Malta map bounding box for positioning dots
const MAP_BOUNDS = {
  minLat: 35.80,
  maxLat: 35.96,
  minLng: 14.35,
  maxLng: 14.58,
};

function getMarkerColor(status: RideStatus): string {
  switch (status) {
    case RideStatus.IN_PROGRESS:
      return 'bg-[#22C55E]'; // green — In Ride
    case RideStatus.DRIVER_ARRIVED:
      return 'bg-orange-400'; // orange — At Pickup
    default:
      return 'bg-[#FACC15]'; // yellow — en route
  }
}

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x: Math.min(95, Math.max(5, x)), y: Math.min(90, Math.max(5, y)) };
}

export function RideLiveMap({ rides }: RideLiveMapProps) {
  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2A2A2A]">
        <p className="text-sm font-medium text-white">Live Map Malta</p>
      </div>

      {/* Map area with static background + dots */}
      <div className="relative aspect-[4/3] bg-[#0A0A0A]">
        {/* Static Malta map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg viewBox="0 0 200 120" className="w-3/4 h-3/4 text-[#2A2A2A]" fill="currentColor">
            {/* Simplified Malta island shape */}
            <ellipse cx="100" cy="55" rx="70" ry="40" />
            <ellipse cx="45" cy="30" rx="20" ry="12" />
          </svg>
        </div>

        {/* Place names */}
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '15%', left: '25%' }}>Gharb</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '12%', left: '45%' }}>Victoria</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '18%', left: '62%' }}>Nadur</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '38%', left: '30%' }}>St Paul&apos;s Bay</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '45%', left: '55%' }}>Mosta</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '55%', left: '60%' }}>Sliema</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '60%', left: '48%' }}>Valletta</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '68%', left: '42%' }}>Marsaskala</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '72%', left: '28%' }}>Marsaxlokk</span>
        <span className="absolute text-[9px] text-[#6B7280]" style={{ top: '75%', left: '55%' }}>Birzebbuga</span>
        <span className="absolute text-[10px] font-medium text-[#9CA3AF]" style={{ top: '50%', left: '45%' }}>Malta</span>

        {/* Ride markers */}
        {rides.map((ride) => {
          const { x, y } = latLngToPercent(Number(ride.pickupLat || 0), Number(ride.pickupLng || 0));
          const color = getMarkerColor(ride.status);
          return (
            <div
              key={ride.id}
              className={`absolute h-3 w-3 rounded-full ${color} shadow-lg ring-2 ring-black/30`}
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              title={`${ride._displayId} — ${ride.pickupAddress}`}
            />
          );
        })}

        {/* Map data watermark */}
        <span className="absolute bottom-2 right-3 text-[8px] text-[#4B5563]">Map data</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15]" />
          <span className="text-xs text-[#9CA3AF]">en route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
          <span className="text-xs text-[#9CA3AF]">At Pickup</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
          <span className="text-xs text-[#9CA3AF]">In Ride</span>
        </div>
      </div>
    </div>
  );
}
