'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { VehicleTypeBreakdown } from '@/services/admin/dashboard.types';

const VEHICLE_COLORS: Record<string, string> = {
  GO: '#3B82F6',
  STANDARD: '#22C55E',
  COMFORT: '#FACC15',
  GREEN: '#14B8A6',
  PRIME: '#F59E0B',
  PREMIUM_XL: '#A855F7',
  VAN: '#6366F1', // Indigo
  CHAUFFEUR: '#1E293B', // Slate
};

interface VehicleTypeDonutProps {
  data: VehicleTypeBreakdown[];
  isLoading: boolean;
}

export function VehicleTypeDonut({ data, isLoading }: VehicleTypeDonutProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-36 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="flex-1 min-h-[200px] w-full bg-[#2A2A2A]" />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    color: item.color || VEHICLE_COLORS[item.type?.toUpperCase()] || '#9CA3AF'
  }));

  return (
    <div className="h-full flex flex-col rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Rides by Vehicle Type</h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="percentage"
              nameKey="type"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
              }}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
