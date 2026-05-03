'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supplierService } from '@/services/admin/supplier.service';
import { REJECTION_REASONS } from '@/services/admin/supplier.types';
import { toast } from 'sonner';

interface SupplierRejectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId: string;
  supplierName: string;
  onSuccess: () => void;
}

export function SupplierRejectModal({
  open,
  onOpenChange,
  supplierId,
  supplierName,
  onSuccess,
}: SupplierRejectModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOthers = selectedReason === 'Others';
  const finalReason = isOthers ? customReason.trim() : selectedReason;
  const canSubmit = finalReason.length > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await supplierService.rejectSupplier(supplierId, { reason: finalReason });
      toast.success(`${supplierName} rejected`);
      onOpenChange(false);
      resetForm();
      onSuccess();
    } catch {
      toast.error('Failed to reject supplier');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedReason('');
    setCustomReason('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Reject Supplier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Rejection Reason</label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="bg-[#141414] border-[#FACC15]/50 text-white focus:ring-[#FACC15]/20">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                {REJECTION_REASONS.map((reason) => (
                  <SelectItem
                    key={reason}
                    value={reason}
                    className="text-[#9CA3AF] hover:text-white focus:bg-[#2A2A2A] focus:text-white"
                  >
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isOthers && (
            <div className="space-y-2">
              <label className="text-sm text-[#9CA3AF]">Custom Reason</label>
              <Input
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Provide rejection reason..."
                className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20"
              />
            </div>
          )}
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
