'use client';

import type { DateRange } from '@/services/admin/analytics.types';

interface AnalyticsDateRangeSelectorProps {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export function AnalyticsDateRangeSelector({
  range,
  onRangeChange,
}: AnalyticsDateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md bg-[#141414] border border-[#2A2A2A] px-2 py-1">
        <span className="text-xs text-[#6B7280] mr-2">From:</span>
        <input
          type="date"
          value={range.from.split('T')[0]}
          onChange={(e) => {
            const dateStr = e.target.value;
            if (dateStr) {
              const d = new Date(dateStr);
              d.setHours(0, 0, 0, 0);
              onRangeChange({ ...range, from: d.toISOString() });
            }
          }}
          className="bg-transparent text-sm text-white focus:outline-none focus:ring-0 appearance-none [&::-webkit-calendar-picker-indicator]:invert"
        />
      </div>
      <div className="flex items-center rounded-md bg-[#141414] border border-[#2A2A2A] px-2 py-1">
        <span className="text-xs text-[#6B7280] mr-2">To:</span>
        <input
          type="date"
          value={range.to.split('T')[0]}
          onChange={(e) => {
            const dateStr = e.target.value;
            if (dateStr) {
              const d = new Date(dateStr);
              d.setHours(23, 59, 59, 999);
              onRangeChange({ ...range, to: d.toISOString() });
            }
          }}
          className="bg-transparent text-sm text-white focus:outline-none focus:ring-0 appearance-none [&::-webkit-calendar-picker-indicator]:invert"
        />
      </div>
    </div>
  );
}
