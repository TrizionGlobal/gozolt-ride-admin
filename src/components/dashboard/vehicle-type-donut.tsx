'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { VehicleTypeBreakdown } from '@/services/admin/dashboard.types';

interface VehicleTypeDonutProps {
  data: VehicleTypeBreakdown[];
  isLoading: boolean;
}

export function VehicleTypeDonut({ data, isLoading }: VehicleTypeDonutProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-36 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="h-[200px] w-full bg-[#2A2A2A]" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Rides by Vehicle Type</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="percentage"
              nameKey="type"
            >
              {data.map((entry, index) => (
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
