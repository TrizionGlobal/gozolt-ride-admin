'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface DemandHeatmapProps {
  isLoading: boolean;
}

// Malta map coordinates (simplified) for dot visualization
const zones = [
  // Surge zones (red)
  { x: 48, y: 35, type: 'surge' as const },
  { x: 52, y: 40, type: 'surge' as const },
  { x: 50, y: 38, type: 'surge' as const },
  // Pickup zones (orange)
  { x: 40, y: 45, type: 'pickup' as const },
  { x: 55, y: 50, type: 'pickup' as const },
  { x: 45, y: 55, type: 'pickup' as const },
  { x: 60, y: 42, type: 'pickup' as const },
  // Standard zones (green)
  { x: 35, y: 30, type: 'standard' as const },
  { x: 65, y: 35, type: 'standard' as const },
  { x: 42, y: 60, type: 'standard' as const },
  { x: 58, y: 55, type: 'standard' as const },
  { x: 50, y: 65, type: 'standard' as const },
  { x: 38, y: 48, type: 'standard' as const },
];

const typeColors = {
  surge: '#EF4444',
  pickup: '#F59E0B',
  standard: '#22C55E',
};

export function DemandHeatmap({ isLoading }: DemandHeatmapProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-40 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="h-[240px] w-full bg-[#2A2A2A]" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Demand Heatmap Malta</h3>

      {/* Map visualization */}
      <div className="relative h-[220px] bg-[#0A0A0A] rounded-lg overflow-hidden">
        {/* Malta outline (simplified SVG shape) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Simplified Malta island outline */}
          <path
            d="M 35 25 Q 30 30 32 40 Q 30 50 35 60 Q 38 68 45 72 Q 55 75 60 70 Q 68 65 70 55 Q 72 45 68 35 Q 65 28 58 25 Q 50 22 42 23 Z"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="0.5"
            opacity="0.6"
          />
          {/* Gozo island */}
          <path
            d="M 30 15 Q 28 18 32 22 Q 38 24 42 20 Q 44 16 40 14 Q 35 12 30 15 Z"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="0.5"
            opacity="0.6"
          />

          {/* Heat zones */}
          {zones.map((zone, i) => (
            <g key={i}>
              <circle
                cx={zone.x}
                cy={zone.y}
                r="6"
                fill={typeColors[zone.type]}
                opacity="0.15"
              />
              <circle
                cx={zone.x}
                cy={zone.y}
                r="3"
                fill={typeColors[zone.type]}
                opacity="0.3"
              />
              <circle
                cx={zone.x}
                cy={zone.y}
                r="1.5"
                fill={typeColors[zone.type]}
                opacity="0.8"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-[#6B7280]">Surge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          <span className="text-xs text-[#6B7280]">Pickup</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
          <span className="text-xs text-[#6B7280]">Standard</span>
        </div>
      </div>
    </div>
  );
}
