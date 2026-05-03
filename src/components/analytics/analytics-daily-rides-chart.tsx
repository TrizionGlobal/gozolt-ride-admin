'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChartDataPoint } from '@/services/admin/analytics.types';

interface AnalyticsDailyRidesChartProps {
  data: ChartDataPoint[] | null;
  loading: boolean;
}

export function AnalyticsDailyRidesChart({ data, loading }: AnalyticsDailyRidesChartProps) {
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
      <h3 className="text-sm font-semibold text-white mb-4">Daily Rides</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data ?? []}>
            <defs>
              <linearGradient id="ridesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
              </linearGradient>
            </defs>
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
                'Rides',
              ]}
            />
            <Area
              type="monotone"
              dataKey="rides"
              stroke="#FACC15"
              strokeWidth={2}
              fill="url(#ridesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15]" />
        <span className="text-xs text-[#9CA3AF]">Rides</span>
      </div>
    </div>
  );
}
