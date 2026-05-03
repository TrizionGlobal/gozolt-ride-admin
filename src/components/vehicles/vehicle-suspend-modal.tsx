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
import { vehicleService } from '@/services/admin/vehicle.service';
import { toast } from 'sonner';

interface VehicleSuspendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  supplierName: string;
  driverName: string | null;
  onSuccess: () => void;
}

export function VehicleSuspendModal({
  open,
  onOpenChange,
  vehicleId,
  vehicleName,
  plateNumber,
  supplierName,
  driverName,
  onSuccess,
}: VehicleSuspendModalProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = reason.trim().length > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await vehicleService.suspendVehicle(vehicleId, { reason: reason.trim() });
      toast.success(`${vehicleName} (${plateNumber}) has been suspended`);
      onOpenChange(false);
      setReason('');
      onSuccess();
    } catch {
      toast.error('Failed to suspend vehicle');
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
            Suspend Vehicle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Vehicle info */}
          <div className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-3 space-y-1">
            <div>
              <p className="text-sm text-[#9CA3AF]">Vehicle</p>
              <p className="text-sm font-medium text-white mt-0.5">
                {vehicleName} ({plateNumber})
              </p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">Supplier</p>
              <p className="text-sm font-medium text-white mt-0.5">{supplierName}</p>
            </div>
            {driverName && (
              <div>
                <p className="text-sm text-[#9CA3AF]">Assigned Driver</p>
                <p className="text-sm font-medium text-white mt-0.5">{driverName}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Reason for suspension <span className="text-red-400">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide suspension reason..."
              rows={3}
              className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20 resize-none"
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-red-950/20 border border-red-800/30 p-3">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400/80">
              This will immediately take the vehicle off the road. The assigned driver will be
              unable to accept rides with this vehicle.
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
                Suspending...
              </span>
            ) : (
              'Suspend Vehicle'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
