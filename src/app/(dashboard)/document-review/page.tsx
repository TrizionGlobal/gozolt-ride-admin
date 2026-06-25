'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DocumentStatus } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useDocuments, useDocumentKpis } from '@/hooks/use-documents';
import { documentService } from '@/services/admin/document.service';
import { DocumentKpiCards } from '@/components/documents/document-kpi-cards';
import { DocumentTabs, type DocumentTab } from '@/components/documents/document-tabs';
import { DocumentPendingList } from '@/components/documents/document-pending-list';
import { DocumentTable } from '@/components/documents/document-table';
import { DocumentExpiredTable } from '@/components/documents/document-expired-table';
import { DocumentRejectModal } from '@/components/documents/document-reject-modal';
import { DocumentFiltersPopover } from '@/components/documents/document-filters-popover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAdminSocket } from '@/hooks/use-admin-socket';
import type { DocumentFilterParams, DocumentListItem } from '@/services/admin/document.types';

const TAB_STATUS_MAP: Record<DocumentTab, { status?: DocumentStatus }> = {
  pending: { status: DocumentStatus.PENDING },
  approved: { status: DocumentStatus.APPROVED },
  rejected: { status: DocumentStatus.REJECTED },
  expired: { status: DocumentStatus.EXPIRED },
};

const VALID_TABS: DocumentTab[] = ['pending', 'approved', 'rejected', 'expired'];

export default function DocumentReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state from URL
  const tabParam = (searchParams.get('tab') as DocumentTab) || 'pending';
  const activeTab = (VALID_TABS.includes(tabParam) ? tabParam : 'pending') as DocumentTab;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const entityType = 'supplier';
  const [sortBy, setSortBy] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Reject modal state
  const [rejectModal, setRejectModal] = useState<{ open: boolean; document: DocumentListItem | null }>({
    open: false,
    document: null,
  });

  // Build filter params
  const tabConfig = TAB_STATUS_MAP[activeTab];
  const params: DocumentFilterParams = useMemo(
    () => {
      const parts = sortBy ? sortBy.split(':') : [];
      return {
        ...tabConfig,
        search: debouncedSearch || undefined,
        entityType,
        sortBy: parts[0] || undefined,
        order: (parts[1] as 'asc' | 'desc') || undefined,
        page,
        limit: 20,
      };
    },
    [activeTab, debouncedSearch, sortBy, page, tabConfig, entityType],
  );

  const { data, loading, refetch } = useDocuments(params);
  const { kpis, loading: kpisLoading, refresh: refreshKpis } = useDocumentKpis(entityType);
  const pendingCount = kpis?.pendingReview ?? 0;

  const handleTabChange = useCallback(
    (tab: DocumentTab) => {
      setPage(1);
      const newParams = new URLSearchParams();
      if (tab !== 'pending') newParams.set('tab', tab);
      router.push(`/document-review${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    },
    [router],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(sanitizeSearchQuery(value));
    setPage(1);
  }, []);

  const handleReject = useCallback((doc: DocumentListItem) => {
    setRejectModal({ open: true, document: doc });
  }, []);

  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleApprove = async (doc: any) => {
    setApprovingId(doc.id);
    try {
      await documentService.reviewDocument(doc.id, {
        approved: true,
      });
      toast.success('Document approved successfully');
      handleMutationSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve document');
    } finally {
      setApprovingId(null);
    }
  };

  const handleMutationSuccess = useCallback(() => {
    refetch();
    refreshKpis();
  }, [refetch, refreshKpis]);

  const { socket, connected } = useAdminSocket();

  useEffect(() => {
    if (!socket) return;

    const onDocumentRefresh = (data: any) => {
      // Re-fetch data instantly when a document is uploaded/reviewed
      refetch();
      refreshKpis();
    };

    socket.on('document:refresh', onDocumentRefresh);

    return () => {
      socket.off('document:refresh', onDocumentRefresh);
    };
  }, [socket, refetch, refreshKpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Document Verification</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Review and verify uploaded documents
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <DocumentKpiCards kpis={kpis} loading={kpisLoading} />

      {/* Tabs + Search + Filters */}
      <div className="relative space-y-4">

        <DocumentTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingCount={pendingCount}
          search={search}
          onSearchChange={handleSearchChange}
          onFiltersClick={() => setFiltersOpen(!filtersOpen)}
        />
        <DocumentFiltersPopover
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          sortBy={sortBy}
          onSortByChange={(v) => {
            setSortBy(v);
            setPage(1);
          }}
        />
      </div>

      {/* Content — different per tab */}
      {activeTab === 'pending' && (
        <DocumentTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
          variant="pending"
          onApprove={handleApprove}
          onReject={handleReject}
          approvingId={approvingId}
        />
      )}

      {activeTab === 'approved' && (
        <DocumentTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
          variant="approved"
        />
      )}

      {activeTab === 'rejected' && (
        <DocumentTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
          variant="rejected"
        />
      )}

      {activeTab === 'expired' && (
        <DocumentExpiredTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
        />
      )}

      {/* Reject Modal */}
      {rejectModal.document && (
        <DocumentRejectModal
          open={rejectModal.open}
          onOpenChange={(open) => setRejectModal((prev) => ({ ...prev, open }))}
          documentId={rejectModal.document.id}
          documentType={rejectModal.document.type}
          entityName={rejectModal.document.entity.name}
          entityDisplayId={rejectModal.document.entity.displayId}
          onSuccess={handleMutationSuccess}
        />
      )}
    </div>
  );
}
