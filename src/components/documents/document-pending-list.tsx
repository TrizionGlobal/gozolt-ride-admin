'use client';

import { useState, useCallback, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DocumentPendingCard } from './document-pending-card';
import { documentService } from '@/services/admin/document.service';
import { toast } from 'sonner';
import type { DocumentListItem, DocumentDetail } from '@/services/admin/document.types';

interface DocumentPendingListProps {
  documents: DocumentListItem[];
  loading: boolean;
  onReject: (doc: DocumentListItem) => void;
  onMutationSuccess: () => void;
}

export function DocumentPendingList({
  documents,
  loading,
  onReject,
  onMutationSuccess,
}: DocumentPendingListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, DocumentDetail>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  const fetchDetail = useCallback(async (id: string) => {
    if (details[id]) return;
    setDetailLoading(id);
    try {
      const result = await documentService.getDocumentDetail(id);
      setDetails((prev) => ({ ...prev, [id]: result }));
    } catch {
      // detail fetch failed silently
    } finally {
      setDetailLoading(null);
    }
  }, [details]);

  const handleToggle = useCallback(
    (id: string) => {
      if (expandedId === id) {
        setExpandedId(null);
      } else {
        setExpandedId(id);
        fetchDetail(id);
      }
    },
    [expandedId, fetchDetail],
  );

  const handleApprove = useCallback(
    async (doc: DocumentListItem) => {
      setApproving(true);
      try {
        await documentService.approveDocument(doc.id);
        toast.success(`${doc.entity.name}'s document approved`);
        setExpandedId(null);
        onMutationSuccess();
      } catch {
        toast.error('Failed to approve document');
      } finally {
        setApproving(false);
      }
    },
    [onMutationSuccess],
  );

  // Keyboard shortcuts: A=Approve, R=Reject, N=Next
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is typing in an input or textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const expandedDoc = documents.find((d) => d.id === expandedId);
      if (!expandedDoc) return;

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleApprove(expandedDoc);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReject(expandedDoc);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        const currentIdx = documents.findIndex((d) => d.id === expandedId);
        const nextIdx = currentIdx + 1;
        if (nextIdx < documents.length) {
          const nextDoc = documents[nextIdx];
          setExpandedId(nextDoc.id);
          fetchDetail(nextDoc.id);
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expandedId, documents, handleApprove, onReject, fetchDetail]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-8 text-center">
        <p className="text-sm text-[#6B7280]">No pending documents to review</p>
        <p className="text-xs text-[#4B5563] mt-1">New submissions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Keyboard shortcuts hint */}
      {expandedId && (
        <div className="flex items-center gap-3 text-xs text-[#6B7280] pb-1">
          <span>
            Shortcuts:
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded bg-[#2A2A2A] px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF]">A</kbd>
            Approve
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded bg-[#2A2A2A] px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF]">R</kbd>
            Reject
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded bg-[#2A2A2A] px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF]">N</kbd>
            Next
          </span>
        </div>
      )}

      {documents.map((doc) => (
        <DocumentPendingCard
          key={doc.id}
          document={doc}
          detail={details[doc.id] ?? null}
          detailLoading={detailLoading === doc.id}
          isExpanded={expandedId === doc.id}
          onToggle={() => handleToggle(doc.id)}
          onApprove={() => handleApprove(doc)}
          onReject={() => onReject(doc)}
          approving={approving && expandedId === doc.id}
        />
      ))}
    </div>
  );
}
