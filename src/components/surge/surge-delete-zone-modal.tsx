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
import { toast } from 'sonner';

interface SurgeDeleteZoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zoneName: string;
  zoneId: string;
  onDelete: (id: string) => Promise<void>;
}

export function SurgeDeleteZoneModal({
  open,
  onOpenChange,
  zoneName,
  zoneId,
  onDelete,
}: SurgeDeleteZoneModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await onDelete(zoneId);
      toast.success(`Zone "${zoneName}" deleted`);
      onOpenChange(false);
    } catch {
      toast.error('Failed to delete zone');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Delete Surge Zone
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-[#9CA3AF]">
            Are you sure you want to delete <span className="text-white font-medium">&ldquo;{zoneName}&rdquo;</span>?
          </p>

          <div className="flex items-start gap-2 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400/90">
              This action cannot be undone. Active surge pricing for this zone will be deactivated.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={submitting}
            className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              'Delete Zone'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
