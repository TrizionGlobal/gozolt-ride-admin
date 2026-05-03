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
import type { SurgeHistoryPoint } from '@/services/admin/surge.types';

interface SurgeHistoryChartProps {
  data: SurgeHistoryPoint[];
  loading: boolean;
}

export function SurgeHistoryChart({ data, loading }: SurgeHistoryChartProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-40 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="h-[200px] w-full bg-[#2A2A2A]" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">
        Surge History — 24h
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              axisLine={{ stroke: '#2A2A2A' }}
              tickLine={false}
              interval={3}
            />
            <YAxis
              domain={[1, 3.5]}
              tick={{ fill: '#6B7280', fontSize: 10 }}
              axisLine={{ stroke: '#2A2A2A' }}
              tickLine={false}
              tickFormatter={(v) => `${v}x`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
              }}
              formatter={(value: number | undefined, name?: string) => [
                `${(value ?? 0).toFixed(2)}x`,
                name === 'demand' ? 'Demand' : 'Supply',
              ]}
            />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="supply"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
