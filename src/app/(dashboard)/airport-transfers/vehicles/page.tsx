'use client';

import { useState, useEffect, useCallback } from 'react';
import { Car, Search, Building2, Check, RefreshCw } from 'lucide-react';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { useDebounce } from '@/hooks/use-debounce';
import { apiClient } from '@/lib/api-client';

export interface AdminVehicle {
  id: string;
  make: string;
  model: string;
  year?: number | null;
  registrationNo: string;
  vehicleType: string;
  passengerCapacity: number;
  luggageCapacity: number;
  fixedPrice: number;
  pricePerKm?: number | null;
  minPrice?: number | null;
  currency: string;
  images?: string[];
  features?: string[];
  isMeetAndGreetIncluded?: boolean;
  freeWaitingMinutes?: number;
  status: string;
  isApproved: boolean;
  supplier?: {
    id: string;
    companyName: string;
    contactPhone?: string;
    email: string;
  } | null;
}

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  GO_5P: 'GO 5P',
  PREMIUM_5P: 'PREMIUM 5P',
  SUV_7P: 'SUV 7P',
  MINI_VAN_8P: 'MINI VAN 8P',
  VAN_8P: 'VAN 8P',
  ELECTRIC_5P: 'ELECTRIC 5P',
};

export default function AdminAirportTransferVehiclesPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounce(search, 350);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page,
        limit,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const res = await apiClient.get('/airport-transfers/admin/vehicles', { params });
      const items = res.data.items || [];
      items.sort((a: AdminVehicle, b: AdminVehicle) => {
        const nameA = `${a.make || ''} ${a.model || ''}`.trim().toLowerCase();
        const nameB = `${b.make || ''} ${b.model || ''}`.trim().toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setVehicles(items);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch admin vehicles:', err);
      setVehicles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const columns: ColumnDef<AdminVehicle>[] = [
    // 1. VEHICLE with Image
    {
      key: 'vehicle',
      title: 'Vehicle',
      className: 'min-w-[240px]',
      render: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="h-10 w-16 bg-[#27272A] rounded overflow-hidden flex-shrink-0 border border-[#3F3F46]/50">
            {row.images?.[0] ? (
              <img
                src={row.images[0]}
                alt={`${row.make} ${row.model}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-[#71717A] bg-[#1A1A1A]">
                <Car className="h-4 w-4 text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-white uppercase tracking-wide">
              {row.make ? `${row.make} ` : ''}{row.model}
            </div>

          </div>
        </div>
      ),
    },

    // 2. REG & YEAR
    {
      key: 'reg',
      title: 'Reg & Year',
      className: 'min-w-[120px]',
      render: (row) => (
        <div className="py-1">
          <div className="text-sm font-bold text-[#FCD223] font-mono tracking-wide">
            {row.registrationNo || '—'}
          </div>
          <div className="text-xs text-[#71717A] mt-0.5">{row.year || '—'}</div>
        </div>
      ),
    },

    // 3. CATEGORY
    {
      key: 'category',
      title: 'Category',
      className: 'min-w-[130px]',
      render: (row) => (
        <div className="py-1">
          <span className="inline-flex items-center rounded-full border border-[#27272A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#A1A1AA] uppercase">
            {VEHICLE_TYPE_LABELS[row.vehicleType] || row.vehicleType?.replace(/_/g, ' ')}
          </span>
        </div>
      ),
    },

    // 4. SUPPLIER
    {
      key: 'supplier',
      title: 'Supplier',
      className: 'min-w-[180px]',
      render: (row) => (
        <div className="py-1 space-y-0.5">
          <div className="text-sm font-medium text-white flex items-center gap-1.5">
            <span className="truncate">{row.supplier?.companyName || 'Independent Partner'}</span>
          </div>
          {row.supplier?.email && (
            <div className="text-xs text-gray-500 truncate">{row.supplier.email}</div>
          )}
        </div>
      ),
    },

    // 5. TARIFF (RATE/KM)
    {
      key: 'price',
      title: 'Tariff (Rate/KM)',
      className: 'min-w-[140px]',
      render: (row) => (
        <div className="py-1">
          <div className="text-sm font-semibold text-[#FCD223]">
            €{Number(row.pricePerKm || 2.5).toFixed(2)}
            <span className="text-xs text-[#A1A1AA] font-normal"> / km</span>
          </div>
        </div>
      ),
    },

    // 6. CAPACITY
    {
      key: 'capacity',
      title: 'Capacity',
      className: 'text-center min-w-[110px]',
      render: (row) => (
        <div className="text-center py-1">
          <span className="inline-flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#27272A] px-2.5 py-0.5 text-xs font-medium text-white">
            {row.passengerCapacity}P • {row.luggageCapacity}B
          </span>
        </div>
      ),
    },

    // 7. MEET & GREET
    {
      key: 'meetAndGreet',
      title: 'Meet & Greet',
      className: 'text-center min-w-[120px]',
      render: (row) => (
        <div className="text-center py-1">
          {row.isMeetAndGreetIncluded ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
              <Check className="w-3 h-3" /> Included
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-zinc-800/60 border border-zinc-700/40 px-2.5 py-0.5 text-xs text-zinc-400">
              Standard
            </span>
          )}
        </div>
      ),
    },

    // 8. STATUS
    {
      key: 'status',
      title: 'Status',
      className: 'text-center min-w-[110px]',
      render: (row) => {
        const formatStatus = (s: string) => {
          if (!s) return 'Available';
          return s
            .split('_')
            .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
            .join(' ');
        };
        const st = row.status || 'AVAILABLE';
        return (
          <div className="text-center py-1">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${st === 'AVAILABLE'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : st === 'MAINTENANCE'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                  : 'bg-red-500/10 text-red-400 border-red-500/25'
                }`}
            >
              {formatStatus(st)}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="h-6 w-6 text-[#FCD223]" />
            Airport Transfer Vehicle Fleet
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Audit and monitor all supplier airport transfer fleet inventory platform-wide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchVehicles()}
            disabled={loading}
            className="h-10 px-3.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#FCD223]/50 transition-colors flex items-center gap-2 text-xs font-medium"
            title="Refresh fleet vehicles"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#FCD223]' : ''}`} />
            Refresh
          </button>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicle, registration, supplier..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-sm outline-none focus:border-[#FCD223] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ServerSideTable */}
      <div className="rounded-xl border border-[#27272A] bg-[#141414] overflow-hidden">
        <ServerSideTable<AdminVehicle>
          columns={columns}
          data={vehicles}
          isLoading={loading}
          page={page}
          limit={limit}
          total={total}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          rowKey="id"
          emptyText="No airport transfer vehicles found."
        />
      </div>
    </div>
  );
}
