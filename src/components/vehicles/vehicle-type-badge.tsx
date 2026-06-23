'use client';

import type { VehicleType, FuelType } from '@/types';
import { cn } from '@/lib/utils';

const VEHICLE_TYPE_DISPLAY: Record<VehicleType, string> = {
  GO: 'Go',
  STANDARD: 'Standard',
  COMFORT: 'Comfort',
  GREEN: 'Green',
  PRIME: 'Prime',
  PREMIUM_XL: 'Premium XL',
  VAN: 'Van',
  CHAUFFEUR: 'Chauffeur',
};

const VEHICLE_TYPE_COLORS: Record<VehicleType, string> = {
  GO: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  STANDARD: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50',
  COMFORT: 'bg-purple-900/50 text-purple-400 border-purple-700/50',
  GREEN: 'bg-green-900/50 text-green-400 border-green-700/50',
  PRIME: 'bg-amber-900/50 text-amber-400 border-amber-700/50',
  PREMIUM_XL: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  VAN: 'bg-indigo-900/50 text-indigo-400 border-indigo-700/50',
  CHAUFFEUR: 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50',
};

interface VehicleTypeBadgeProps {
  type: VehicleType;
  fuelType: FuelType;
}

export function VehicleTypeBadge({ type, fuelType }: VehicleTypeBadgeProps) {
  const label = VEHICLE_TYPE_DISPLAY[type] ?? type;
  const colors = VEHICLE_TYPE_COLORS[type] ?? 'bg-gray-900/50 text-gray-400 border-gray-700/50';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colors,
      )}
    >
      {label}
    </span>
  );
}
