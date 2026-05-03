'use client';

import { MoreHorizontal, Eye, FileText, Ban, CheckCircle2, Link, User } from 'lucide-react';
import { VehicleStatus } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { vehicleService } from '@/services/admin/vehicle.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface VehicleActionsMenuProps {
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  status: VehicleStatus;
  supplierName: string;
  driverName: string | null;
  onSuspend: () => void;
  onReject: () => void;
  onRefetch: () => void;
}

export function VehicleActionsMenu({
  vehicleId,
  vehicleName,
  plateNumber,
  status,
  supplierName,
  driverName,
  onSuspend,
  onReject,
  onRefetch,
}: VehicleActionsMenuProps) {
  const router = useRouter();

  const handleApprove = async () => {
    try {
      await vehicleService.approveVehicle(vehicleId);
      toast.success(`${vehicleName} (${plateNumber}) approved successfully`);
      onRefetch();
    } catch {
      toast.error('Failed to approve vehicle');
    }
  };

  const handleReactivate = async () => {
    try {
      await vehicleService.activateVehicle(vehicleId);
      toast.success(`${vehicleName} (${plateNumber}) reactivated successfully`);
      onRefetch();
    } catch {
      toast.error('Failed to reactivate vehicle');
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
          onClick={() => toast.info(`View details for ${vehicleName} (${plateNumber})`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.info(`View documents for ${vehicleName}`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          View Documents
        </DropdownMenuItem>

        {/* Active vehicle actions */}
        {status === VehicleStatus.ACTIVE && driverName && (
          <DropdownMenuItem
            onClick={() => router.push(`/driver-management?search=${encodeURIComponent(driverName)}`)}
            className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            View Assigned Driver
          </DropdownMenuItem>
        )}

        {status === VehicleStatus.ACTIVE && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={onSuspend}
              className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspend Vehicle
            </DropdownMenuItem>
          </>
        )}

        {/* Pending approval actions */}
        {status === VehicleStatus.PENDING_APPROVAL && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={handleApprove}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve Vehicle
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onReject}
              className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <Ban className="mr-2 h-4 w-4" />
              Reject Vehicle
            </DropdownMenuItem>
          </>
        )}

        {/* Suspended vehicle actions */}
        {status === VehicleStatus.SUSPENDED && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={handleReactivate}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Reactivate Vehicle
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-[#2A2A2A]" />
        <DropdownMenuItem
          onClick={() => router.push(`/supplier-management?search=${encodeURIComponent(supplierName)}`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Link className="mr-2 h-4 w-4" />
          View Supplier
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
