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
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/admin/payment.service';
import { mockSupplierList } from '@/services/admin/payment.mock';
import { toast } from 'sonner';

interface ProcessPayoutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProcessPayoutsModal({
  open,
  onOpenChange,
  onSuccess,
}: ProcessPayoutsModalProps) {
  const [supplierId, setSupplierId] = useState('');
  const [amount, setAmount] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedSupplier = mockSupplierList.find((s) => s.id === supplierId);
  const numAmount = parseFloat(amount) || 0;
  const canSubmit = supplierId && numAmount > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit || !selectedSupplier) return;
    setSubmitting(true);
    try {
      await paymentService.triggerPayout({
        supplierId,
        supplierName: selectedSupplier.companyName,
        amount: numAmount,
        periodStart: periodStart || undefined,
        periodEnd: periodEnd || undefined,
      });
      toast.success(
        `Payout of €${numAmount.toFixed(2)} initiated for ${selectedSupplier.companyName}`,
      );
      onOpenChange(false);
      resetForm();
      onSuccess();
    } catch {
      toast.error('Failed to process payout');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSupplierId('');
    setAmount('');
    setPeriodStart('');
    setPeriodEnd('');
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
            Process Payout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Supplier select */}
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Supplier</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 appearance-none"
            >
              <option value="" className="bg-[#141414]">
                Select supplier...
              </option>
              {mockSupplierList.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#141414]">
                  {s.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Amount (€)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
            />
          </div>

          {/* Period dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-[#9CA3AF]">Period Start</label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#9CA3AF]">Period End</label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
              />
            </div>
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
              'Process Payout'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
