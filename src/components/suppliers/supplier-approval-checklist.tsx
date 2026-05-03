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
import { Checkbox } from '@/components/ui/checkbox';
import { supplierService } from '@/services/admin/supplier.service';
import { toast } from 'sonner';

interface SupplierApprovalChecklistProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId: string;
  supplierName: string;
  onSuccess: () => void;
}

const CHECKLIST_ITEMS = [
  'All documents verified and valid',
  'Business license confirmed',
  'Stripe account connected',
  'Company information accurate',
];

export function SupplierApprovalChecklist({
  open,
  onOpenChange,
  supplierId,
  supplierName,
  onSuccess,
}: SupplierApprovalChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const [submitting, setSubmitting] = useState(false);

  const allChecked = checked.every(Boolean);

  const handleToggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleConfirm = async () => {
    if (!allChecked) return;
    setSubmitting(true);
    try {
      await supplierService.approveSupplier(supplierId);
      toast.success(`${supplierName} approved successfully`);
      onOpenChange(false);
      setChecked(CHECKLIST_ITEMS.map(() => false));
      onSuccess();
    } catch {
      toast.error('Failed to approve supplier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setChecked(CHECKLIST_ITEMS.map(() => false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Approval Checklist
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {CHECKLIST_ITEMS.map((label, index) => (
            <label
              key={index}
              className="flex items-center gap-3 rounded-lg border border-[#2A2A2A] bg-[#141414] p-3.5 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
            >
              <Checkbox
                checked={checked[index]}
                onCheckedChange={() => handleToggle(index)}
                className="border-[#2A2A2A] data-[state=checked]:bg-[#FACC15] data-[state=checked]:border-[#FACC15] data-[state=checked]:text-black"
              />
              <span className="text-sm text-[#9CA3AF]">{label}</span>
            </label>
          ))}
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
            disabled={!allChecked || submitting}
            className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Approving...
              </span>
            ) : (
              'Confirm Approval'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
