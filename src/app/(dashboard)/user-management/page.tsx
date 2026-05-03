'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { UserStatus } from '@/types';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useUsers, useUserKpis } from '@/hooks/use-users';
import { UserKpiCards } from '@/components/users/user-kpi-cards';
import { UserTabs, type UserTab } from '@/components/users/user-tabs';
import { UserTable } from '@/components/users/user-table';
import { UserBanModal } from '@/components/users/user-ban-modal';
import { UserForceLogoutModal } from '@/components/users/user-force-logout-modal';
import { UserFiltersPopover } from '@/components/users/user-filters-popover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { UserFilterParams, UserListItem } from '@/services/admin/user.types';

const TAB_STATUS_MAP: Record<UserTab, { status?: UserStatus }> = {
  all: {},
  active: { status: UserStatus.ACTIVE },
  inactive: { status: UserStatus.DELETED },
  banned: { status: UserStatus.SUSPENDED },
};

const VALID_TABS: UserTab[] = ['all', 'active', 'inactive', 'banned'];

export default function UserManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state from URL
  const tabParam = (searchParams.get('tab') as UserTab) || 'all';
  const activeTab = (VALID_TABS.includes(tabParam) ? tabParam : 'all') as UserTab;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Ban modal state
  const [banModal, setBanModal] = useState<{ open: boolean; user: UserListItem | null }>({
    open: false,
    user: null,
  });

  // Force logout modal state
  const [logoutModal, setLogoutModal] = useState<{ open: boolean; user: UserListItem | null }>({
    open: false,
    user: null,
  });

  // Build filter params
  const tabConfig = TAB_STATUS_MAP[activeTab];
  const params: UserFilterParams = useMemo(
    () => ({
      ...tabConfig,
      search: search || undefined,
      sortBy: sortBy || undefined,
      page,
      limit: 20,
    }),
    [activeTab, search, sortBy, page, tabConfig],
  );

  // Fetch banned count separately for the tab badge
  const bannedParams: UserFilterParams = useMemo(
    () => ({ status: UserStatus.SUSPENDED, page: 1, limit: 100 }),
    [],
  );

  const { data, loading, refetch } = useUsers(params);
  const { data: bannedData } = useUsers(bannedParams);
  const { kpis, refresh: refreshKpis } = useUserKpis();
  const bannedCount = bannedData?.meta.total ?? 0;

  const handleTabChange = useCallback(
    (tab: UserTab) => {
      setPage(1);
      const newParams = new URLSearchParams();
      if (tab !== 'all') newParams.set('tab', tab);
      router.push(`/user-management${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    },
    [router],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(sanitizeSearchQuery(value));
    setPage(1);
  }, []);

  const handleBan = useCallback(
    (id: string) => {
      const user = data?.data.find((u) => u.id === id) ?? null;
      if (user) setBanModal({ open: true, user });
    },
    [data],
  );

  const handleForceLogout = useCallback(
    (id: string) => {
      const user = data?.data.find((u) => u.id === id) ?? null;
      if (user) setLogoutModal({ open: true, user });
    },
    [data],
  );

  const handleMutationSuccess = useCallback(() => {
    refetch();
    refreshKpis();
  }, [refetch, refreshKpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Manage passenger accounts and activity
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
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-medium text-[#22C55E]">System Online</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <UserKpiCards kpis={kpis} />

      {/* Tabs + Search + Filters */}
      <div className="relative">
        <UserTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          bannedCount={bannedCount}
          search={search}
          onSearchChange={handleSearchChange}
          onFiltersClick={() => setFiltersOpen(!filtersOpen)}
        />
        <UserFiltersPopover
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          sortBy={sortBy}
          onSortByChange={(v) => {
            setSortBy(v);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <UserTable
        data={data}
        loading={loading}
        page={page}
        onPageChange={setPage}
        onBan={handleBan}
        onForceLogout={handleForceLogout}
        onRefetch={handleMutationSuccess}
      />

      {/* Ban Modal */}
      {banModal.user && (
        <UserBanModal
          open={banModal.open}
          onOpenChange={(open) => setBanModal((prev) => ({ ...prev, open }))}
          userId={banModal.user.id}
          userName={[banModal.user.firstName, banModal.user.lastName].filter(Boolean).join(' ') || 'Unknown User'}
          displayId={banModal.user.displayId}
          email={banModal.user.email}
          totalRides={banModal.user._count.rides}
          onSuccess={handleMutationSuccess}
        />
      )}

      {/* Force Logout Modal */}
      {logoutModal.user && (
        <UserForceLogoutModal
          open={logoutModal.open}
          onOpenChange={(open) => setLogoutModal((prev) => ({ ...prev, open }))}
          userId={logoutModal.user.id}
          userName={[logoutModal.user.firstName, logoutModal.user.lastName].filter(Boolean).join(' ') || 'Unknown User'}
          displayId={logoutModal.user.displayId}
          onSuccess={handleMutationSuccess}
        />
      )}
    </div>
  );
}
