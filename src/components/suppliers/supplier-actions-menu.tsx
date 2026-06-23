'use client';

import { MoreHorizontal, Eye, Ban, CheckCircle2, XCircle, Percent } from 'lucide-react';
import { SupplierStatus } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface SupplierActionsMenuProps {
  status: SupplierStatus;
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSuspend?: () => void;
  onActivate?: () => void;
  onChangeCommission?: () => void;
}

export function SupplierActionsMenu({
  status,
  onView,
  onApprove,
  onReject,
  onSuspend,
  onActivate,
  onChangeCommission,
}: SupplierActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-[#1A1A1A] border-[#2A2A2A] text-white"
      >
        <DropdownMenuItem
          onClick={onView}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        {status === SupplierStatus.ACTIVE && (
          <>
            {onChangeCommission && (
              <DropdownMenuItem
                onClick={onChangeCommission}
                className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
              >
                <Percent className="mr-2 h-4 w-4" />
                Change Commission
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            {onSuspend && (
              <DropdownMenuItem
                onClick={onSuspend}
                className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
            )}
          </>
        )}

        {status === SupplierStatus.PENDING_VERIFICATION && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            {onApprove && (
              <DropdownMenuItem
                onClick={onApprove}
                className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
            {onReject && (
              <DropdownMenuItem
                onClick={onReject}
                className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            )}
          </>
        )}

        {status === SupplierStatus.SUSPENDED && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            {onActivate && (
              <DropdownMenuItem
                onClick={onActivate}
                className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
          </>
        )}

        {status === SupplierStatus.REJECTED && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            {onApprove && (
              <DropdownMenuItem
                onClick={onApprove}
                className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
