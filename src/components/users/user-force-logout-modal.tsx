'use client';

import { useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/admin/user.service';
import { toast } from 'sonner';

interface UserForceLogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  displayId: string;
  onSuccess: () => void;
}

export function UserForceLogoutModal({
  open,
  onOpenChange,
  userId,
  userName,
  displayId,
  onSuccess,
}: UserForceLogoutModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const result = await userService.forceLogoutUser(userId);
      toast.success(`${userName} logged out. ${result.sessionsDeleted} sessions terminated.`);
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error('Failed to force logout user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Force Logout User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User info */}
          <div className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-3">
            <p className="text-sm text-[#9CA3AF]">User</p>
            <p className="text-sm font-medium text-white mt-0.5">
              {userName} ({displayId})
            </p>
          </div>

          <p className="text-sm text-[#9CA3AF]">
            This will immediately terminate all active sessions for this user across all devices.
            The user will need to log in again.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging out...
              </span>
            ) : (
              'Force Logout'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
