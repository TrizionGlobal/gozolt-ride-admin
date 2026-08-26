'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarRentalTabs, type CarRentalTab } from '@/components/car-rentals/car-rental-tabs';
import { CarRentalVehicleTable } from '@/components/car-rentals/car-rental-vehicle-table';
import { CarRentalBookingTable } from '@/components/car-rentals/car-rental-booking-table';
import { useAdminCarRentalVehicles, useAdminCarRentalBookings, type AdminCarRentalFilter } from '@/hooks/use-admin-car-rentals';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function CarRentalsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as CarRentalTab | null;

  const [activeTab, setActiveTab] = useState<CarRentalTab>(
    tabParam === 'bookings' ? 'bookings' : 'vehicles'
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
    if (tabParam === 'bookings' || tabParam === 'vehicles') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = useCallback((tab: CarRentalTab) => {
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

  const filterParams = useMemo<AdminCarRentalFilter>(
    () => ({
      search: debouncedSearch || undefined,
      customStatus: customStatus !== 'ALL' ? customStatus : undefined,
      page,
      limit,
    }),
    [debouncedSearch, customStatus, page, limit]
  );

  const { data: vehicleData, loading: vehicleLoading } = useAdminCarRentalVehicles(filterParams, activeTab !== 'vehicles');
  const { data: bookingData, loading: bookingLoading } = useAdminCarRentalBookings(filterParams, activeTab !== 'bookings');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Car Rentals Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage global supplier vehicles and bookings
          </p>
        </div>
      </div>

      {/* Tabs + Search + Filter in one row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CarRentalTabs activeTab={activeTab} onTabChange={handleTabChange} />
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
        {activeTab === 'vehicles' ? (
          <CarRentalVehicleTable
            data={vehicleData}
            loading={vehicleLoading}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        ) : (
          <CarRentalBookingTable
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
