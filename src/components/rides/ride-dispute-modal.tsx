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
import { toast } from 'sonner';

interface RideDisputeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideDisplayId: string;
  passengerName: string;
  driverName: string;
  onSuccess: () => void;
}

const DISPUTE_CATEGORIES = [
  'Fare dispute',
  'Safety concern',
  'Driver behavior',
  'Route deviation',
  'Payment issue',
  'Other',
];

export function RideDisputeModal({
  open,
  onOpenChange,
  rideDisplayId,
  passengerName,
  driverName,
  onSuccess,
}: RideDisputeModalProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = category.length > 0 && description.trim().length > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    // Simulated — no actual endpoint for support tickets yet
    await new Promise((r) => setTimeout(r, 500));
    toast.success('Dispute flagged — support ticket created');
    onOpenChange(false);
    setCategory('');
    setDescription('');
    onSuccess();
    setSubmitting(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setCategory('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Flag Dispute
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Ride info */}
          <div className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-3 space-y-1">
            <div>
              <p className="text-sm text-[#9CA3AF]">Ride</p>
              <p className="text-sm font-medium text-white mt-0.5">{rideDisplayId}</p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">Passenger</p>
              <p className="text-sm font-medium text-white mt-0.5">{passengerName}</p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">Driver</p>
              <p className="text-sm font-medium text-white mt-0.5">{driverName}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
            >
              <option value="" disabled>
                Select category...
              </option>
              {DISPUTE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Description <span className="text-red-400">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the dispute..."
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
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Flagging...
              </span>
            ) : (
              'Flag Dispute'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
