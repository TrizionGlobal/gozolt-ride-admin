'use client';

import { MoreHorizontal, Eye, MapPin, LogOut, Ban, CheckCircle2, Download } from 'lucide-react';
import { UserStatus } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/admin/user.service';
import { toast } from 'sonner';

interface UserActionsMenuProps {
  userId: string;
  userName: string;
  displayId: string;
  status: UserStatus;
  onBan: () => void;
  onForceLogout: () => void;
  onRefetch: () => void;
}

export function UserActionsMenu({
  userId,
  userName,
  displayId,
  status,
  onBan,
  onForceLogout,
  onRefetch,
}: UserActionsMenuProps) {
  const handleUnban = async () => {
    try {
      await userService.activateUser(userId);
      toast.success(`${userName} has been unbanned`);
      onRefetch();
    } catch {
      toast.error('Failed to unban user');
    }
  };

  const handleReactivate = async () => {
    try {
      await userService.activateUser(userId);
      toast.success(`${userName} has been reactivated`);
      onRefetch();
    } catch {
      toast.error('Failed to reactivate user');
    }
  };

  const handleExportData = async () => {
    try {
      const data = await userService.exportUserData(userId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_export_${displayId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('User data exported successfully');
    } catch {
      toast.error('Failed to export user data');
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
          onClick={() => toast.info(`View profile for ${userName}`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.info(`View ride history for ${userName}`)}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <MapPin className="mr-2 h-4 w-4" />
          View Ride History
        </DropdownMenuItem>

        {/* Active user actions */}
        {status === UserStatus.ACTIVE && (
          <>
            <DropdownMenuItem
              onClick={onForceLogout}
              className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Force Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={onBan}
              className="text-red-400 hover:text-red-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <Ban className="mr-2 h-4 w-4" />
              Ban User
            </DropdownMenuItem>
          </>
        )}

        {/* Banned user actions */}
        {status === UserStatus.SUSPENDED && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={handleUnban}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Unban User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onForceLogout}
              className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Force Logout
            </DropdownMenuItem>
          </>
        )}

        {/* Inactive (deleted) user actions */}
        {status === UserStatus.DELETED && (
          <>
            <DropdownMenuSeparator className="bg-[#2A2A2A]" />
            <DropdownMenuItem
              onClick={handleReactivate}
              className="text-green-400 hover:text-green-300 hover:bg-[#2A2A2A] cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Reactivate User
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-[#2A2A2A]" />
        <DropdownMenuItem
          onClick={handleExportData}
          className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] cursor-pointer"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data (GDPR)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
