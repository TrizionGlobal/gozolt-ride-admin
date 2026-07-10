'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { supplierService } from '@/services/admin/supplier.service';
import { driverService } from '@/services/admin/driver.service';

interface PenaltyDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityId: string | null;
  entityType: 'SUPPLIER' | 'DRIVER';
}

export function PenaltyDetailsModal({
  open,
  onOpenChange,
  entityId,
  entityType,
}: PenaltyDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [penalties, setPenalties] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !entityId) {
      setPenalties([]);
      return;
    }

    const fetchPenalties = async () => {
      setLoading(true);
      try {
        if (entityType === 'SUPPLIER') {
          const data = await supplierService.getSupplierPenalties(entityId);
          setPenalties(data);
        } else {
          const data = await driverService.getDriverPenalties(entityId);
          setPenalties(data);
        }
      } catch (error) {
        console.error('Failed to fetch penalties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPenalties();
  }, [open, entityId, entityType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#0F0F0F] border-[#27272A] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            User Cancellation Fees Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#FACC15]" />
            </div>
          ) : penalties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-[#27272A] bg-[#141414]">
              <p className="text-[#9CA3AF]">No cancellation fees found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {penalties.map((penalty) => (
                <div
                  key={penalty.id}
                  className="p-4 rounded-lg border border-[#27272A] bg-[#1A1A1A] flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{penalty.driverName}</p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {new Date(penalty.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-sm bg-green-500/10 px-2.5 py-0.5 text-sm font-medium text-green-500 border border-green-500/20">
                        &euro;{Number(penalty.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {penalty.reason && (
                    <div className="mt-2 text-sm text-[#D4D4D8]">
                      <span className="text-[#71717A] mr-2">User Reason:</span>
                      <span className="text-red-400">{penalty.reason}</span>
                    </div>
                  )}

                  {penalty.ride && (
                    <div className="mt-2 p-3 rounded bg-[#222] text-xs space-y-1">
                      <div className="flex gap-2">
                        <span className="text-[#71717A] min-w-[50px]">From:</span>
                        <span className="text-[#D4D4D8] truncate">{penalty.ride.pickupAddress || 'N/A'}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#71717A] min-w-[50px]">To:</span>
                        <span className="text-[#D4D4D8] truncate">{penalty.ride.dropoffAddress || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
