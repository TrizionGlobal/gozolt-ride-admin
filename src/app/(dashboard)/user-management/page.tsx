'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { UserStatus } from '@/types';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { exportToExcel } from '@/lib/export-excel';
import { useUsers, useUserKpis } from '@/hooks/use-users';
import { UserKpiCards } from '@/components/users/user-kpi-cards';
import { UserTabs, type UserTab } from '@/components/users/user-tabs';
import { UserTable } from '@/components/users/user-table';
import { UserBanModal } from '@/components/users/user-ban-modal';
import { UserForceLogoutModal } from '@/components/users/user-force-logout-modal';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { UserFilterParams, UserListItem } from '@/services/admin/user.types';

const TAB_STATUS_MAP: Record<UserTab, { status?: UserStatus }> = {
  all: {},
  active: { status: UserStatus.ACTIVE },
  deleted: { status: UserStatus.DELETED },
  suspended: { status: UserStatus.SUSPENDED },
};

const VALID_TABS: UserTab[] = ['all', 'active', 'deleted', 'suspended'];

export default function UserManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state from URL
  const tabParam = (searchParams.get('tab') as UserTab) || 'all';
  const activeTab = (VALID_TABS.includes(tabParam) ? tabParam : 'all') as UserTab;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

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
      search: debouncedSearch || undefined,
      sortBy: 'firstName',
      order: 'asc',
      page,
      limit: 10,
    }),
    [tabConfig, debouncedSearch, page]
  );

  const { data, loading, refetch } = useUsers(params);
  const { kpis, refresh: refreshKpis } = useUserKpis();
  const bannedCount = kpis?.bannedUsers ?? 0;

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

  const handleExport = useCallback(() => {
    if (!data?.data) return;
    const rows = data.data.map((u) => ({
      name: [u.firstName, u.lastName].filter(Boolean).join(' '),
      phone: u.phone ?? '',
      rides: u._count?.rides ?? 0,
      rating: u.avgRating ?? 0,
      status: u.status,
      date: u.createdAt,
    }));
    exportToExcel(
      rows,
      [
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'rides', label: 'Rides' },
        { key: 'rating', label: 'Rating' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
      ],
      'users',
      'Users Data'
    );
  }, [data]);

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
          <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-medium text-[#22C55E]">System Online</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <UserKpiCards kpis={kpis} />

      {/* Tabs + Search */}
      <div className="relative">
        <UserTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          bannedCount={kpis?.bannedUsers ?? 0}
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onExport={handleExport}
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
