'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DataBreach, BreachStatus } from '@/services/admin/gdpr.types';
import {
  getBreachSeverityDisplay,
  getBreachStatusDisplay,
} from '@/services/admin/gdpr.types';

interface BreachTableProps {
  breaches: DataBreach[];
  loading: boolean;
  onUpdateStatus: (id: string, status: BreachStatus) => Promise<void>;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function BreachRow({
  breach,
  onUpdateStatus,
}: {
  breach: DataBreach;
  onUpdateStatus: (id: string, status: BreachStatus) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const severity = getBreachSeverityDisplay(breach.severity);
  const status = getBreachStatusDisplay(breach.status);

  return (
    <>
      <TableRow
        className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A] cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="text-white text-sm w-8">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-[#6B7280]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#6B7280]" />
          )}
        </TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${severity.className}`}
          >
            {severity.label}
          </span>
        </TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </TableCell>
        <TableCell className="text-white text-sm max-w-xs truncate">
          {breach.description}
        </TableCell>
        <TableCell className="text-white text-sm">
          {breach.affectedUsers !== null ? breach.affectedUsers.toLocaleString() : 'Unknown'}
        </TableCell>
        <TableCell className="text-[#9CA3AF] text-sm">
          {breach.reporterName}
        </TableCell>
        <TableCell className="text-[#9CA3AF] text-sm">
          {formatDate(breach.reportedAt)}
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="border-b border-[#2A2A2A] bg-[#0F0F0F]">
          <TableCell colSpan={7} className="p-0">
            <div className="px-6 py-4 space-y-3">
              {/* Full Description */}
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Full Description</p>
                <p className="text-sm text-white">{breach.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Data Types */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Data Types</p>
                  <div className="flex flex-wrap gap-1">
                    {breach.dataTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex rounded-full bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-0.5 text-xs text-[#9CA3AF]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DPA Notification */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">DPA Notified</p>
                  <p className="text-sm text-white">
                    {breach.notifiedDpaAt
                      ? formatDate(breach.notifiedDpaAt)
                      : 'Not yet notified'}
                  </p>
                </div>

                {/* Resolved At */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Resolved</p>
                  <p className="text-sm text-white">
                    {breach.resolvedAt ? formatDate(breach.resolvedAt) : 'Unresolved'}
                  </p>
                </div>

                {/* Mitigation */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Mitigation Steps</p>
                  <p className="text-sm text-white">
                    {breach.mitigationSteps || 'None documented'}
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              {breach.status !== 'RESOLVED' && (
                <div className="flex items-center gap-2 pt-2">
                  <p className="text-xs text-[#6B7280] mr-2">Update Status:</p>
                  {(['INVESTIGATING', 'CONTAINED', 'RESOLVED'] as BreachStatus[])
                    .filter((s) => s !== breach.status)
                    .map((s) => {
                      const display = getBreachStatusDisplay(s);
                      return (
                        <button
                          key={s}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(breach.id, s);
                          }}
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${display.className}`}
                        >
                          {display.label}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function BreachTable({ breaches, loading, onUpdateStatus }: BreachTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (breaches.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
        No breaches recorded
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
            <TableHead className="text-[#9CA3AF] text-xs font-medium w-8" />
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Severity</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Description</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Affected</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Reporter</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Reported</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breaches.map((breach) => (
            <BreachRow
              key={breach.id}
              breach={breach}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
