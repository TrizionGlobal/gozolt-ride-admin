'use client';

import { MoreHorizontal, Eye, FileText, Ban, CheckCircle2, Link } from 'lucide-react';
import { DriverStatus } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { driverService } from '@/services/admin/driver.service';
import { toast } from 'sonner';

interface DriverActionsMenuProps {
  driverId: string;
  driverName: string;
  status: DriverStatus;
  supplierName: string;
  onSuspend: () => void;
  onRefetch: () => void;
}

export function DriverActionsMenu({
  driverId,
  driverName,
  status,
  supplierName,
  onSuspend,
  onRefetch,
}: DriverActionsMenuProps) {
  const handleApprove = async () => {
    try {
      await driverService.approveDriver(driverId);
      toast.success(`${driverName} approved successfully`);
      onRefetch();
    } catch {
      toast.error('Failed to approve driver');
    }
  };

  const handleActivate = async () => {
    try {
      await driverService.activateDriver(driverId);
      toast.success(`${driverName} activated successfully`);
      onRefetch();
    } catch {
      toast.error('Failed to activate driver');
    }
  };

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
          onClick={() => toast.info(`View details for ${driverName}`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.info(`View documents for ${driverName}`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          View Documents
        </DropdownMenuItem>

        {status === DriverStatus.ACTIVE && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={onSuspend}
              className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspend Driver
            </DropdownMenuItem>
          </>
        )}

        {status === DriverStatus.PENDING_APPROVAL && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={handleApprove}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve Driver
            </DropdownMenuItem>
          </>
        )}

        {(status === DriverStatus.SUSPENDED || status === DriverStatus.INACTIVE) && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={handleActivate}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Activate Driver
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-[#2A2A2A]" />
        <DropdownMenuItem
          onClick={() => toast.info(`Navigate to supplier: ${supplierName}`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Link className="mr-2 h-4 w-4" />
          View Supplier
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
