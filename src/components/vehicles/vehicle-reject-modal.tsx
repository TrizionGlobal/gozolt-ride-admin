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
import { Button } from '@/components/ui/button';
import { vehicleService } from '@/services/admin/vehicle.service';
import { toast } from 'sonner';

interface VehicleRejectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  onSuccess: () => void;
}

const REJECTION_REASONS = [
  'Failed safety inspection',
  'Vehicle too old',
  'Incomplete documentation',
  'Does not meet platform standards',
  'Other',
];

export function VehicleRejectModal({
  open,
  onOpenChange,
  vehicleId,
  vehicleName,
  plateNumber,
  onSuccess,
}: VehicleRejectModalProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = reason.length > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await vehicleService.rejectVehicle(vehicleId, { reason });
      toast.success(`${vehicleName} (${plateNumber}) has been rejected`);
      onOpenChange(false);
      setReason('');
      onSuccess();
    } catch {
      toast.error('Failed to reject vehicle');
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
            Reject Vehicle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Vehicle info */}
          <div className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-3">
            <p className="text-sm text-[#9CA3AF]">Vehicle</p>
            <p className="text-sm font-medium text-white mt-0.5">
              {vehicleName} ({plateNumber})
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Rejection Reason <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
            >
              <option value="" disabled>
                Select reason...
              </option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-red-950/20 border border-red-800/30 p-3">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400/80">
              Rejected vehicles are marked as decommissioned and cannot be reactivated without
              re-registration.
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
                Rejecting...
              </span>
            ) : (
              'Confirm Rejection'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
