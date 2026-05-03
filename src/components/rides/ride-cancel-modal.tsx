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
import { rideService } from '@/services/admin/ride.service';
import { toast } from 'sonner';

interface RideCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideId: string;
  rideDisplayId: string;
  onSuccess: () => void;
}

export function RideCancelModal({
  open,
  onOpenChange,
  rideId,
  rideDisplayId,
  onSuccess,
}: RideCancelModalProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = reason.trim().length > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await rideService.adminCancelRide(rideId, { reason: reason.trim() });
      toast.success(`Ride ${rideDisplayId} has been cancelled`);
      onOpenChange(false);
      setReason('');
      onSuccess();
    } catch {
      toast.error('Failed to cancel ride');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Cancel Ride
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-3">
            <p className="text-sm text-[#9CA3AF]">Ride</p>
            <p className="text-sm font-medium text-white mt-0.5">{rideDisplayId}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Cancellation reason <span className="text-red-400">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
              className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20 resize-none"
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-red-950/20 border border-red-800/30 p-3">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400/80">
              This will immediately cancel the ride and notify both the passenger and driver.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
          >
            Go Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cancelling...
              </span>
            ) : (
              'Cancel Ride'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
