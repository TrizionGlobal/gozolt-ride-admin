'use client';

import { useState, useMemo } from 'react';
import { AuditLogFilters } from '@/components/audit-logs/audit-log-filters';
import { AuditLogTable } from '@/components/audit-logs/audit-log-table';
import { useAuditLogs } from '@/hooks/use-audit-logs';
import type { AuditLogFilterParams } from '@/services/admin/audit-log.types';

export default function AuditLogsPage() {
  const [entityType, setEntityType] = useState('');
  const [action, setAction] = useState('');
  const [actorId, setActorId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  const filterParams = useMemo<AuditLogFilterParams>(
    () => ({
      entityType: entityType || undefined,
      action: action || undefined,
      actorId: actorId || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
      page,
      limit: 20,
    }),
    [entityType, action, actorId, fromDate, toDate, page],
  );

  const { data, loading } = useAuditLogs(filterParams);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track all system activities and admin actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-green-400">System Online</span>
        </div>
      </div>

      {/* Filters */}
      <AuditLogFilters
        entityType={entityType}
        onEntityTypeChange={(v) => { setEntityType(v); setPage(1); }}
        action={action}
        onActionChange={(v) => { setAction(v); setPage(1); }}
        actorId={actorId}
        onActorIdChange={(v) => { setActorId(v); setPage(1); }}
        fromDate={fromDate}
        onFromDateChange={(v) => { setFromDate(v); setPage(1); }}
        toDate={toDate}
        onToDateChange={(v) => { setToDate(v); setPage(1); }}
      />

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        <AuditLogTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
