'use client';

import { useState, useMemo } from 'react';
import { PenaltyKpiCards } from '@/components/penalties/penalty-kpi-cards';
import { PenaltyFilters } from '@/components/penalties/penalty-filters';
import { PenaltyTable } from '@/components/penalties/penalty-table';
import { usePenalties, usePenaltyKPIs } from '@/hooks/use-penalties';
import type {
  PenaltyFilterParams,
  PenaltyType,
  PenaltyEntityType,
  PenaltyStatus,
} from '@/services/admin/penalty.types';

export default function PenaltiesPage() {
  const [type, setType] = useState<PenaltyType | ''>('');
  const [entityType, setEntityType] = useState<PenaltyEntityType | ''>('');
  const [status, setStatus] = useState<PenaltyStatus | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  const filterParams = useMemo<PenaltyFilterParams>(
    () => ({
      type: type || undefined,
      entityType: entityType || undefined,
      status: status || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
      page,
      limit: 20,
    }),
    [type, entityType, status, fromDate, toDate, page],
  );

  const { data, loading } = usePenalties(filterParams);
  const { kpis, loading: kpiLoading } = usePenaltyKPIs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Penalties</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track and manage driver & supplier penalties
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <PenaltyKpiCards kpis={kpis} loading={kpiLoading} />

      {/* Filters */}
      <PenaltyFilters
        type={type}
        onTypeChange={(v) => { setType(v); setPage(1); }}
        entityType={entityType}
        onEntityTypeChange={(v) => { setEntityType(v); setPage(1); }}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        fromDate={fromDate}
        onFromDateChange={(v) => { setFromDate(v); setPage(1); }}
        toDate={toDate}
        onToDateChange={(v) => { setToDate(v); setPage(1); }}
      />

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        <PenaltyTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
