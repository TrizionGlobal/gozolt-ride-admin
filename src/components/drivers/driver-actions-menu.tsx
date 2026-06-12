'use client';

import { MoreHorizontal, Eye, Ban, CheckCircle2 } from 'lucide-react';
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
  onViewDetail?: () => void;
}

export function DriverActionsMenu({
  driverId,
  driverName,
  status,
  supplierName,
  onSuspend,
  onRefetch,
  onViewDetail,
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
          onClick={(e) => { e.stopPropagation(); onViewDetail?.(); }}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          <span>Show Driver Details</span>
        </DropdownMenuItem>

        {/* NEW_DRIVER: explicitly show disabled actions for clarity */}
        {status === DriverStatus.NEW_DRIVER && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              disabled
              className="text-gray-500 cursor-not-allowed opacity-50 hover:bg-transparent"
            >
              <CheckCircle2 className="h-4 w-4 text-gray-600" />
              <span>Approve Documents</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled
              className="text-gray-500 cursor-not-allowed opacity-50 hover:bg-transparent"
            >
              <Ban className="h-4 w-4 text-gray-600" />
              <span>Suspend Driver</span>
            </DropdownMenuItem>
          </>
        )}

        {(status === DriverStatus.ACTIVE || status === DriverStatus.VEHICLE_ASSIGNED || status === DriverStatus.ADMIN_APPROVED) && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onSuspend(); }}
              className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <Ban className="h-4 w-4" />
              <span>Suspend Driver</span>
            </DropdownMenuItem>
          </>
        )}

        {status === DriverStatus.SUPPLIER_APPROVED && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); handleApprove(); }}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve Documents</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onSuspend(); }}
              className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <Ban className="h-4 w-4" />
              <span>Suspend Driver</span>
            </DropdownMenuItem>
          </>
        )}

        {(status === DriverStatus.SUSPENDED || status === DriverStatus.ADMIN_SUSPENDED || status === DriverStatus.SUPPLIER_SUSPENDED) && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); handleActivate(); }}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Activate Driver</span>
            </DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
