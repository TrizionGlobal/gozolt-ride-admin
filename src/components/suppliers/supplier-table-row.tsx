'use client';

import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { SupplierStatusBadge } from './supplier-status-badge';
import { SupplierActionsMenu } from './supplier-actions-menu';
import { TIER_DISPLAY, TIER_COLORS } from '@/services/admin/supplier.types';
import { supplierService } from '@/services/admin/supplier.service';
import type { SupplierListItem } from '@/services/admin/supplier.types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SupplierTableRowProps {
  supplier: SupplierListItem;
  onRefetch: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

export function SupplierTableRow({
  supplier,
  onRefetch,
  onApprove,
  onReject,
  onSuspend,
  onViewDetail,
}: SupplierTableRowProps) {
  const tier = supplier.subscription?.tier;
  const revenue = supplier.totalRevenue ?? 0;

  const handleView = () => {
    onViewDetail?.(supplier.id);
  };

  const handleActivate = async () => {
    try {
      await supplierService.activateSupplier(supplier.id);
      toast.success(`${supplier.companyName} activated successfully`);
      onRefetch();
    } catch {
      toast.error('Failed to activate supplier');
    }
  };

  const handleToggleBankDetails = async () => {
    try {
      const newStatus = !supplier.editBankDetails;
      await supplierService.toggleBankDetailsPermission(supplier.id, newStatus);
      toast.success(newStatus ? 'Bank edit enabled' : 'Bank edit disabled');
      onRefetch();
    } catch {
      toast.error('Failed to update permission');
    }
  };

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors">
      <TableCell className="text-sm font-medium text-white">
        {supplier.companyName}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF] font-mono">
        {supplier.vatNumber || '—'}
      </TableCell>
      <TableCell>
        {tier ? (
          <span
            className={cn(
              'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium',
              (TIER_COLORS as any)[tier] || 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
            )}
          >
            {(TIER_DISPLAY as any)[tier] || (typeof tier === 'string' ? tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase() : 'Standard')}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium bg-[#2A2A2A] text-[#9CA3AF] border border-[#3A3A3A]">
            Not Subscribed
          </span>
        )}
      </TableCell>
      <TableCell>
        <SupplierStatusBadge status={supplier.status} />
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {supplier._count.vehicles}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {supplier._count.drivers}
      </TableCell>
      <TableCell className="text-sm text-white">
        €{revenue.toLocaleString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <SupplierActionsMenu
            status={supplier.status}
            onView={handleView}
            onApprove={() => onApprove(supplier.id)}
            onReject={() => onReject(supplier.id)}
            onSuspend={() => onSuspend(supplier.id)}
            onActivate={handleActivate}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
