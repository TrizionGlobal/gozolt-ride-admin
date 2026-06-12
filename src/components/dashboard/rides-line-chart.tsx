'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { RideTrends } from '@/services/admin/dashboard.types';

interface RidesLineChartProps {
  data: RideTrends | null;
  isLoading: boolean;
}

export function RidesLineChart({ data, isLoading }: RidesLineChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-16 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="h-[200px] w-full bg-[#2A2A2A]" />
      </div>
    );
  }

  const chartData = data?.totals.map((item) => ({
    day: new Date(item.period).getDate(),
    rides: item.count,
  })) || [];

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Line</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="99%" height="100%" minWidth={0}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#2A2A2A' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#2A2A2A' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="rides"
              stroke="#FACC15"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#FACC15' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
