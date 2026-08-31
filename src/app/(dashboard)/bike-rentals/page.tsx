'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BikeRentalTabs, type BikeRentalTab } from '@/components/bike-rentals/bike-rental-tabs';
import { BikeRentalVehicleTable } from '@/components/bike-rentals/bike-rental-vehicle-table';
import { BikeRentalBookingTable } from '@/components/bike-rentals/bike-rental-booking-table';
import { useAdminBikeRentalBikes, useAdminBikeRentalBookings, type AdminBikeRentalFilter } from '@/hooks/use-admin-bike-rentals';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function BikeRentalsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as BikeRentalTab | null;

  const [activeTab, setActiveTab] = useState<BikeRentalTab>(
    tabParam === 'bookings' ? 'bookings' : 'bikes'
  );
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [customStatus, setCustomStatus] = useState<string>('ALL');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Sync tab state from URL if it changes
  useEffect(() => {
    if (tabParam === 'bookings' || tabParam === 'bikes') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = useCallback((tab: BikeRentalTab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch('');
    setDebouncedSearch('');
    setCustomStatus('ALL');
    
    // Update URL without a full page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const filterParams = useMemo<AdminBikeRentalFilter>(
    () => ({
      search: debouncedSearch || undefined,
      customStatus: customStatus !== 'ALL' ? customStatus : undefined,
      page,
      limit,
    }),
    [debouncedSearch, customStatus, page, limit]
  );

  const { data: bikeData, loading: bikeLoading } = useAdminBikeRentalBikes(filterParams, activeTab !== 'bikes');
  const { data: bookingData, loading: bookingLoading } = useAdminBikeRentalBookings(filterParams, activeTab !== 'bookings');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bike Rentals Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage global supplier bikes and bookings
          </p>
        </div>
      </div>

      {/* Tabs + Search + Filter in one row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <BikeRentalTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <Input
              placeholder="Search..."
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
          {/* Status filter — only visible on Bookings tab */}
          {activeTab === 'bookings' && (
            <Select value={customStatus} onValueChange={(val) => { setCustomStatus(val); setPage(1); }}>
              <SelectTrigger className="w-[190px] bg-[#141414] border-[#2A2A2A] text-white h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[#141414] border-[#2A2A2A] text-white">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="APPROVED">Confirmed (Approved)</SelectItem>
                <SelectItem value="ON_RENT">On Rent (Active)</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Supplier Rejected</SelectItem>
                <SelectItem value="USER_CANCELLED">User Cancellation</SelectItem>
                <SelectItem value="EXTENDED">Extended</SelectItem>
                <SelectItem value="EXTENDED_CANCELLED">Extended Cancelled</SelectItem>
                <SelectItem value="EXTENSION_REJECTED">Extension Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414]">
        {activeTab === 'bikes' ? (
          <BikeRentalVehicleTable
            data={bikeData}
            loading={bikeLoading}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        ) : (
          <BikeRentalBookingTable
            data={bookingData}
            loading={bookingLoading}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </div>
    </div>
  );
}
