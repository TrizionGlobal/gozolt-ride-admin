'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentReviewPanel } from './document-review-panel';
import { documentService } from '@/services/admin/document.service';
import type { DocumentDetail } from '@/services/admin/document.types';
import { Loader2 } from 'lucide-react';

interface DocumentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string | null;
}

export function DocumentDetailModal({ open, onOpenChange, documentId }: DocumentDetailModalProps) {
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && documentId) {
      setLoading(true);
      documentService.getDocumentDetail(documentId)
        .then(setDetail)
        .catch(() => setDetail(null))
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [open, documentId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#141414] border-[#2A2A2A] text-white p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-[#2A2A2A]">
          <DialogTitle>Document Details</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 text-[#6B7280] animate-spin" />
          </div>
        ) : detail ? (
          <DocumentReviewPanel
            detail={detail}
            onApprove={() => {}}
            onReject={() => {}}
            approving={false}
          />
        ) : (
          <div className="p-12 text-center text-[#6B7280]">
            Failed to load document details.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
