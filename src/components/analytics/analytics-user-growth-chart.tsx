'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChartDataPoint } from '@/services/admin/analytics.types';

interface AnalyticsUserGrowthChartProps {
  data: ChartDataPoint[] | null;
  loading: boolean;
}

export function AnalyticsUserGrowthChart({ data, loading }: AnalyticsUserGrowthChartProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-24 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="h-[200px] w-full bg-[#2A2A2A]" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">User Growth</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              axisLine={{ stroke: '#2A2A2A' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 10 }}
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
              formatter={(value: number | undefined) => [
                `${(value ?? 0).toLocaleString()}`,
                'Users',
              ]}
            />
            <Bar
              dataKey="users"
              fill="#FACC15"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15]" />
        <span className="text-xs text-[#9CA3AF]">This Week</span>
      </div>
    </div>
  );
}
