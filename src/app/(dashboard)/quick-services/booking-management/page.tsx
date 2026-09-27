'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickServiceBookingTable } from '@/components/quick-services/quick-service-booking-table';
import { useAdminQuickServiceBookings, type AdminQuickServiceFilter } from '@/hooks/use-admin-quick-services';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useAdminSocket } from '@/hooks/use-admin-socket';
import { toast } from 'sonner';

export default function QuickServicesBookingManagementPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [customStatus, setCustomStatus] = useState<string>('ALL');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const filterParams = useMemo<AdminQuickServiceFilter>(
    () => ({
      search: debouncedSearch || undefined,
      customStatus: customStatus !== 'ALL' ? customStatus : undefined,
      page,
      limit,
    }),
    [debouncedSearch, customStatus, page, limit, refreshTrigger]
  );

  const { data, total, loading } = useAdminQuickServiceBookings(filterParams);

  const handleAssignSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const { socket } = useAdminSocket();

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = (data: any) => {
      toast.success('New quick service booked! Refreshing...');
      setRefreshTrigger((prev) => prev + 1);
    };

    socket.on('quick-service:refresh', handleRefresh);

    return () => {
      socket.off('quick-service:refresh', handleRefresh);
    };
  }, [socket]);

  const statuses = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quick Services Bookings</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage and assign quick services to suppliers
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A]">
        {/* Status Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto pb-0 px-1 hide-scrollbar">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => { setCustomStatus(status.value); setPage(1); }}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${customStatus === status.value
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-[#6B7280] hover:text-white'
                }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pb-3">
          {/* Search */}
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <Input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(sanitizeSearchQuery(e.target.value))}
              className="pl-9 bg-[#141414] border-[#2A2A2A] text-white focus:border-[#FFD700] h-9"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setDebouncedSearch(search);
                  setPage(1);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        <QuickServiceBookingTable
          data={data}
          loading={loading}
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onAssignSuccess={handleAssignSuccess}
        />
      </div>
    </div>
  );
}