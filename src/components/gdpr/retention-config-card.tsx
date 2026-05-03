'use client';

import { Database, Calendar, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DataRetentionConfig } from '@/services/admin/gdpr.types';

interface RetentionConfigCardProps {
  config: DataRetentionConfig | null;
  loading: boolean;
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RetentionConfigCard({ config, loading }: RetentionConfigCardProps) {
  if (loading || !config) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
        <Skeleton className="h-6 w-48 bg-[#1A1A1A] mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 bg-[#1A1A1A] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Data Retention Policy</h3>

      {/* Retention Periods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-[#FACC15]" />
            <p className="text-xs text-[#6B7280]">User Data Purge</p>
          </div>
          <p className="text-2xl font-bold text-white">{config.userPurgeDays}</p>
          <p className="text-xs text-[#6B7280] mt-1">days after account deletion</p>
        </div>

        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-[#FACC15]" />
            <p className="text-xs text-[#6B7280]">Supplier Data Purge</p>
          </div>
          <p className="text-2xl font-bold text-white">{config.supplierPurgeDays}</p>
          <p className="text-xs text-[#6B7280] mt-1">days after contract end</p>
        </div>

        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-[#FACC15]" />
            <p className="text-xs text-[#6B7280]">Financial Records</p>
          </div>
          <p className="text-2xl font-bold text-white">{config.financialRetentionYears}</p>
          <p className="text-xs text-[#6B7280] mt-1">years retention period</p>
        </div>
      </div>

      {/* Purge Run Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-[#9CA3AF]" />
            <p className="text-xs text-[#6B7280]">Last Purge Run</p>
          </div>
          <p className="text-sm text-white">{formatDateTime(config.lastPurgeRun)}</p>
        </div>

        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-[#9CA3AF]" />
            <p className="text-xs text-[#6B7280]">Next Purge Run</p>
          </div>
          <p className="text-sm text-white">{formatDateTime(config.nextPurgeRun)}</p>
        </div>

        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="h-4 w-4 text-[#9CA3AF]" />
            <p className="text-xs text-[#6B7280]">Records Purged (Last Run)</p>
          </div>
          <p className="text-sm text-white font-semibold">
            {config.recordsPurged.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
