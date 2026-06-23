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
import type { PeakHoursData } from '@/services/admin/dashboard.types';

interface PeakHoursChartProps {
  data: PeakHoursData | null;
  isLoading: boolean;
}

export function PeakHoursChart({ data, isLoading }: PeakHoursChartProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <Skeleton className="h-5 w-48 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="flex-1 min-h-[220px] w-full bg-[#2A2A2A]" />
      </div>
    );
  }

  // Pre-populate all 24 hours so the chart is complete even if some hours have 0 rides
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const found = data?.byHour?.find((item) => item.hour === i);
    const displayHour = i === 0 ? '12 AM' : i === 12 ? '12 PM' : i > 12 ? `${i - 12} PM` : `${i} AM`;
    return {
      hour: i,
      name: displayHour,
      rides: found ? found.rideCount : 0,
      avgFare: found ? found.avgFare : 0,
    };
  });

  return (
    <div className="h-full flex flex-col rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Peak Demand Hours</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">Hourly ride volume breakdown</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
          <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
          <span>Completed Rides</span>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="99%" height="100%" minWidth={0}>
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FACC15" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#FACC15" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#71717A', fontSize: 10 }}
              axisLine={{ stroke: '#2A2A2A' }}
              tickLine={false}
              interval={2} // Show every 3rd hour to prevent cluttering
            />
            <YAxis
              tick={{ fill: '#71717A', fontSize: 10 }}
              axisLine={{ stroke: '#2A2A2A' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(250, 204, 21, 0.05)' }}
              contentStyle={{
                backgroundColor: '#111111',
                border: '1px solid #27272A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: any, name: any, props: any) => {
                if (name === 'Rides') {
                  const fare = props.payload.avgFare;
                  return [
                    <div key="tooltip-content" className="space-y-1">
                      <div className="font-semibold text-white">{value} rides</div>
                      {value > 0 && (
                        <div className="text-xs text-[#A1A1AA]">
                          Avg. Fare: <span className="text-[#FACC15] font-medium">€{Number(fare).toFixed(2)}</span>
                        </div>
                      )}
                    </div>,
                    null
                  ];
                }
                return [value, name];
              }}
              labelClassName="text-[#71717A] text-xs mb-1"
            />
            <Bar
              name="Rides"
              dataKey="rides"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
