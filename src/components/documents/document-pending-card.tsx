'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentEntityBadge } from './document-entity-badge';
import { DocumentReviewPanel } from './document-review-panel';
import { getDocumentTypeDisplay } from '@/services/admin/document.types';
import type { DocumentListItem, DocumentDetail } from '@/services/admin/document.types';

interface DocumentPendingCardProps {
  document: DocumentListItem;
  detail: DocumentDetail | null;
  detailLoading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
}

export function DocumentPendingCard({
  document: doc,
  detail,
  detailLoading,
  isExpanded,
  onToggle,
  onApprove,
  onReject,
  approving,
}: DocumentPendingCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-[#141414] overflow-hidden transition-colors',
        isExpanded ? 'border-[#FACC15]/40' : 'border-[#2A2A2A] hover:border-[#3A3A3A]',
      )}
    >
      {/* Card Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1A1A1A] shrink-0">
            <Clock className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white truncate">
                {getDocumentTypeDisplay(doc.type)}
              </p>
              <DocumentEntityBadge entityType={doc.entity.entityType} />
            </div>
            <p className="text-xs text-[#6B7280] truncate">
              {doc.entity.name} ({doc.entity.displayId})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-[#6B7280]">{doc._computed?.submittedAgo}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#6B7280]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#6B7280]" />
          )}
        </div>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <>
          {detailLoading ? (
            <div className="p-4 border-t border-[#2A2A2A] flex items-center justify-center">
              <div className="flex items-center gap-2 text-[#6B7280]">
                <div className="h-4 w-4 border-2 border-[#6B7280] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading document details...</span>
              </div>
            </div>
          ) : detail ? (
            <DocumentReviewPanel
              detail={detail}
              onApprove={onApprove}
              onReject={onReject}
              approving={approving}
            />
          ) : (
            <div className="p-4 border-t border-[#2A2A2A] text-center text-sm text-[#6B7280]">
              Failed to load document details
            </div>
          )}
        </>
      )}
    </div>
  );
}
