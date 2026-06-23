'use client';

import { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Loader2, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DocumentEntityBadge } from './document-entity-badge';
import { getDocumentTypeDisplay } from '@/services/admin/document.types';
import type { DocumentDetail } from '@/services/admin/document.types';

interface DocumentReviewPanelProps {
  detail: DocumentDetail;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
}

export function DocumentReviewPanel({
  detail,
  onApprove,
  onReject,
  approving,
}: DocumentReviewPanelProps) {
  const [notes, setNotes] = useState('');

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${(bytes / 1000).toFixed(0)} KB`;
  };

  const requirements = detail.requirements || [];
  const metCount = requirements.filter((r) => r.met).length;
  const totalCount = requirements.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border-t border-[#2A2A2A] bg-[#0A0A0A]/50">
      {/* Left: Document Preview */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Document Preview</p>
        <div className="aspect-[4/3] rounded-lg border border-[#2A2A2A] bg-[#141414] flex items-center justify-center">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 text-[#6B7280] mx-auto" />
            <p className="text-sm text-[#6B7280]">{detail.fileName}</p>
            <p className="text-xs text-[#4B5563]">
              {detail.mimeType} &middot; {formatFileSize(detail.fileSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Info + Requirements + Notes */}
      <div className="space-y-4">
        {/* Entity Info */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Entity Info</p>
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{detail.entity?.name || 'Unknown Entity'}</p>
                <p className="text-xs text-[#6B7280]">{detail.entity?.displayId || (detail as any).entityId || 'N/A'}</p>
              </div>
              <DocumentEntityBadge entityType={detail.entity?.entityType || (detail as any).entityType || 'driver'} />
            </div>
            <div className="pt-2 border-t border-[#2A2A2A]">
              <p className="text-xs text-[#6B7280]">Document Type</p>
              <p className="text-sm text-white">{getDocumentTypeDisplay(detail.type)}</p>
            </div>
            {detail.expiresAt && (
              <div>
                <p className="text-xs text-[#6B7280]">Expires</p>
                <p className="text-sm text-white">
                  {new Date(detail.expiresAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
            Requirements ({metCount}/{totalCount})
          </p>
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-3 space-y-2">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2">
                {req.met ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                )}
                <span className={`text-sm ${req.met ? 'text-[#9CA3AF]' : 'text-red-400'}`}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <StickyNote className="h-3.5 w-3.5 text-[#9CA3AF]" />
            <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Admin Notes</p>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add review notes..."
            rows={2}
            className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20 resize-none text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={onApprove}
            disabled={approving}
            className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
          >
            {approving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Approving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Approve (A)
              </span>
            )}
          </Button>
          <Button
            onClick={onReject}
            variant="outline"
            className="flex-1 border-red-600/50 text-red-400 hover:bg-red-600/10 hover:text-red-300"
          >
            <span className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Reject (R)
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
