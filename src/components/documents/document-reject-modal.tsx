'use client';

import { useState } from 'react';
import { Loader2, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { documentService } from '@/services/admin/document.service';
import { getDocumentTypeDisplay } from '@/services/admin/document.types';
import { toast } from 'sonner';
import type { DocumentType } from '@/types';

interface DocumentRejectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentType: DocumentType;
  entityName: string;
  entityDisplayId: string;
  onSuccess: () => void;
}

const REJECT_REASONS = [
  'Document expired',
  'Poor quality / unreadable',
  'Information mismatch',
  'Wrong document type',
  'Suspected fraud',
];

export function DocumentRejectModal({
  open,
  onOpenChange,
  documentId,
  documentType,
  entityName,
  entityDisplayId,
  onSuccess,
}: DocumentRejectModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = reason.length > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await documentService.reviewDocument(documentId, {
        approved: false,
        reason: reason + (details.trim() ? ` - ${details.trim()}` : ''),
      });
      toast.success(`Document rejected for ${entityName}`);
      onOpenChange(false);
      setReason('');
      setDetails('');
      onSuccess();
    } catch {
      toast.error('Failed to reject document');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason('');
    setDetails('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Reject Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Document info */}
          <div className="rounded-lg bg-[#141414] border border-[#2A2A2A] p-3 space-y-1">
            <div>
              <p className="text-sm text-[#9CA3AF]">Document</p>
              <p className="text-sm font-medium text-white mt-0.5">
                {getDocumentTypeDisplay(documentType)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF]">Supplier</p>
              <p className="text-sm font-medium text-white mt-0.5">
                {entityName}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Rejection reason <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
            >
              <option value="" disabled>
                Select reason...
              </option>
              {REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Additional details</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20 resize-none"
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-blue-950/20 border border-blue-800/30 p-3">
            <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-400/80">
              The supplier will be notified of the rejection and will need to re-upload the document.
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
              'Reject Document'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
