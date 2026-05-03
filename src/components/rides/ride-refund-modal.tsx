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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { rideService } from '@/services/admin/ride.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RideRefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideId: string;
  rideDisplayId: string;
  fare: number;
  onSuccess: () => void;
}

type RefundType = 'full' | 'partial';

export function RideRefundModal({
  open,
  onOpenChange,
  rideId,
  rideDisplayId,
  fare,
  onSuccess,
}: RideRefundModalProps) {
  const [refundType, setRefundType] = useState<RefundType>('full');
  const [amount, setAmount] = useState(fare.toFixed(2));
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const canSubmit = reason.trim().length > 0 && numAmount > 0 && numAmount <= fare && !submitting;

  const handleTypeChange = (type: RefundType) => {
    setRefundType(type);
    if (type === 'full') {
      setAmount(fare.toFixed(2));
    }
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await rideService.issueRefund(rideId, {
        amount: numAmount,
        reason: reason.trim(),
      });
      toast.success(`Refund of €${numAmount.toFixed(2)} processed for ${rideDisplayId}`);
      onOpenChange(false);
      setRefundType('full');
      setAmount(fare.toFixed(2));
      setReason('');
      onSuccess();
    } catch {
      toast.error('Failed to process refund');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setRefundType('full');
    setAmount(fare.toFixed(2));
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#FACC15]/40 border-dashed text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Issue Refund
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Full / Partial toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTypeChange('full')}
              className={cn(
                'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                refundType === 'full'
                  ? 'bg-[#FACC15] text-black border-[#FACC15]'
                  : 'bg-[#141414] text-[#9CA3AF] border-[#2A2A2A] hover:border-[#3A3A3A]',
              )}
            >
              Full Refund
            </button>
            <button
              onClick={() => handleTypeChange('partial')}
              className={cn(
                'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                refundType === 'partial'
                  ? 'bg-[#FACC15] text-black border-[#FACC15]'
                  : 'bg-[#141414] text-[#9CA3AF] border-[#2A2A2A] hover:border-[#3A3A3A]',
              )}
            >
              Partial Refund
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Amount (€)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={fare}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              readOnly={refundType === 'full'}
              className={cn(
                'w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20',
                refundType === 'full' && 'opacity-60 cursor-not-allowed',
              )}
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Refund Reason......"
              rows={3}
              className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20 resize-none"
            />
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
            className="bg-[#FACC15] text-black hover:bg-[#E5B800] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              'Process Refund'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
