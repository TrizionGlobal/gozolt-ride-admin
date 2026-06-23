'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { DocumentStatus } from '@/types';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useDocuments, useDocumentKpis } from '@/hooks/use-documents';
import { DocumentKpiCards } from '@/components/documents/document-kpi-cards';
import { DocumentTabs, type DocumentTab } from '@/components/documents/document-tabs';
import { DocumentPendingList } from '@/components/documents/document-pending-list';
import { DocumentTable } from '@/components/documents/document-table';
import { DocumentExpiredTable } from '@/components/documents/document-expired-table';
import { DocumentRejectModal } from '@/components/documents/document-reject-modal';
import { DocumentDetailModal } from '@/components/documents/document-detail-modal';
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
  const [entityType, setEntityType] = useState<'supplier' | 'driver'>('supplier');
  const [sortBy, setSortBy] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Reject modal state
  const [rejectModal, setRejectModal] = useState<{ open: boolean; document: DocumentListItem | null }>({
    open: false,
    document: null,
  });

  // Detail modal state
  const [detailModal, setDetailModal] = useState<{ open: boolean; documentId: string | null }>({
    open: false,
    documentId: null,
  });

  // Build filter params
  const tabConfig = TAB_STATUS_MAP[activeTab];
  const params: DocumentFilterParams = useMemo(
    () => ({
      ...tabConfig,
      search: search || undefined,
      entityType,
      sortBy: sortBy || undefined,
      page,
      limit: 20,
    }),
    [activeTab, search, sortBy, page, tabConfig, entityType],
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
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => toast.info('Export CSV — coming soon')}
            className="border-[#2A2A2A] bg-transparent text-white hover:bg-[#1A1A1A] hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-[#22C55E] animate-pulse' : 'bg-[#EF4444]'}`} />
            <span className={`text-xs font-medium ${connected ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {connected ? 'Live Sync Active' : 'Live Sync Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <DocumentKpiCards kpis={kpis} loading={kpisLoading} />

      {/* Tabs + Search + Filters */}
      <div className="relative space-y-4">
        {/* Entity Toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-[#141414] border border-[#2A2A2A] p-1 w-fit">
          <button
            onClick={() => { setEntityType('supplier'); setPage(1); }}
            className={`px-6 py-1.5 text-sm font-medium rounded-md transition-colors ${
              entityType === 'supplier'
                ? 'bg-[#FACC15] text-black shadow-sm'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Suppliers
          </button>
          <button
            onClick={() => { setEntityType('driver'); setPage(1); }}
            className={`px-6 py-1.5 text-sm font-medium rounded-md transition-colors ${
              entityType === 'driver'
                ? 'bg-[#FACC15] text-black shadow-sm'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Drivers
          </button>
        </div>

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
        <DocumentPendingList
          documents={data?.data ?? []}
          loading={loading}
          onReject={handleReject}
          onMutationSuccess={handleMutationSuccess}
        />
      )}

      {activeTab === 'approved' && (
        <DocumentTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
          variant="approved"
          onRowClick={(id) => setDetailModal({ open: true, documentId: id })}
        />
      )}

      {activeTab === 'rejected' && (
        <DocumentTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
          variant="rejected"
          onRowClick={(id) => setDetailModal({ open: true, documentId: id })}
        />
      )}

      {activeTab === 'expired' && (
        <DocumentExpiredTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
          onRowClick={(id) => setDetailModal({ open: true, documentId: id })}
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

      {/* Detail Modal */}
      <DocumentDetailModal
        open={detailModal.open}
        onOpenChange={(open) => setDetailModal((prev) => ({ ...prev, open }))}
        documentId={detailModal.documentId}
      />
    </div>
  );
}
