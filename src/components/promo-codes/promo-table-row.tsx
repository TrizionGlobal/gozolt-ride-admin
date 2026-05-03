'use client';

import { MoreHorizontal, Pencil, Power, Eye } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PromoStatusBadge } from './promo-status-badge';
import { PromoTypeBadge } from './promo-type-badge';
import type { PromoCode } from '@/services/admin/promo.types';
import { toast } from 'sonner';

interface PromoTableRowProps {
  promo: PromoCode;
  onEdit: (promo: PromoCode) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA'); // YYYY-MM-DD
}

export function PromoTableRow({ promo, onEdit, onToggle }: PromoTableRowProps) {
  const usageDisplay = promo.usageLimit
    ? `${promo.usedCount}/${promo.usageLimit}`
    : `${promo.usedCount}/∞`;

  const valueDisplay = promo.type === 'PERCENTAGE'
    ? `${promo.value}%`
    : `€${promo.value.toFixed(2)}`;

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
      <TableCell className="text-sm font-semibold text-white font-mono">
        {promo.code}
      </TableCell>
      <TableCell>
        <PromoTypeBadge type={promo.type} />
      </TableCell>
      <TableCell className="text-sm text-white">
        {valueDisplay}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {usageDisplay}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {formatDate(promo.validUntil)}
      </TableCell>
      <TableCell>
        <PromoStatusBadge promo={promo} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#2A2A2A]">
            <DropdownMenuItem
              onClick={() => onEdit(promo)}
              className="text-[#9CA3AF] hover:text-white cursor-pointer"
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onToggle(promo.id, !promo.isActive)}
              className="text-[#9CA3AF] hover:text-white cursor-pointer"
            >
              <Power className="mr-2 h-3.5 w-3.5" />
              {promo.isActive ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info('Usage details — coming soon')}
              className="text-[#9CA3AF] hover:text-white cursor-pointer"
            >
              <Eye className="mr-2 h-3.5 w-3.5" />
              View Usage
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
