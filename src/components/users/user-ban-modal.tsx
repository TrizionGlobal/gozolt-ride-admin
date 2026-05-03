'use client';

import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/admin/user.service';
import { toast } from 'sonner';

interface UserBanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  displayId: string;
  email: string | null;
  totalRides: number;
  onSuccess: () => void;
}

const BAN_REASONS = [
  'Fraudulent activity',
  'Abusive behavior',
  'Payment violations',
  'Terms of service violation',
  'Other',
];

export function UserBanModal({
  open,
  onOpenChange,
  userId,
  userName,
  displayId,
  email,
  totalRides,
  onSuccess,
}: UserBanModalProps) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = reason.length > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const fullReason = notes.trim() ? `${reason}: ${notes.trim()}` : reason;
      await userService.suspendUser(userId, { reason: fullReason });
      // Also force logout all sessions
      await userService.forceLogoutUser(userId);
      toast.success(`${userName} has been banned and all sessions terminated`);
      onOpenChange(false);
      setReason('');
      setNotes('');
      onSuccess();
    } catch {
      toast.error('Failed to ban user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Ban User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User info */}
          <div className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-3 space-y-1">
            <div>
              <p className="text-sm text-[#9CA3AF]">User</p>
              <p className="text-sm font-medium text-white mt-0.5">
                {userName} ({displayId})
              </p>
            </div>
            {email && (
              <div>
                <p className="text-sm text-[#9CA3AF]">Email</p>
                <p className="text-sm font-medium text-white mt-0.5">{email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-[#9CA3AF]">Total Rides</p>
              <p className="text-sm font-medium text-white mt-0.5">{totalRides}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Reason for ban <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
            >
              <option value="" disabled>
                Select reason...
              </option>
              {BAN_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Additional notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20 resize-none"
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-red-950/20 border border-red-800/30 p-3">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400/80">
              This will immediately prevent the user from booking rides and accessing the platform.
              All active sessions will be terminated.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Banning...
              </span>
            ) : (
              'Ban User'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
