'use client';

import type { VehicleType, FuelType } from '@/types';
import { cn } from '@/lib/utils';

const VEHICLE_TYPE_DISPLAY: Record<VehicleType, string> = {
  ECONOMY: 'Economy',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  XL: 'XL',
  ELECTRIC: 'Electric',
};

const VEHICLE_TYPE_COLORS: Record<VehicleType, string> = {
  ECONOMY: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  STANDARD: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50',
  PREMIUM: 'bg-purple-900/50 text-purple-400 border-purple-700/50',
  XL: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  ELECTRIC: 'bg-green-900/50 text-green-400 border-green-700/50',
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
