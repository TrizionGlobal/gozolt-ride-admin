'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { AuditLogActionBadge } from './audit-log-action-badge';
import type { AuditLogItem } from '@/services/admin/audit-log.types';

interface AuditLogTableRowProps {
  log: AuditLogItem;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' ' + d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDetails(entityId: string): string {
  const shortId = entityId.substring(entityId.length - 4);
  return `Action on record #${shortId}`;
}

export function AuditLogTableRow({ log }: AuditLogTableRowProps) {
  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
      <TableCell>
        <span className="text-sm font-bold text-[#FACC15] font-mono">
          {log._displayId}
        </span>
      </TableCell>
      <TableCell className="text-sm text-white">{log.entityType}</TableCell>
      <TableCell>
        <AuditLogActionBadge action={log.action} />
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">{log._actorEmail}</TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {formatTimestamp(log.createdAt)}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {formatDetails(log.entityId)}
      </TableCell>
    </TableRow>
  );
}
