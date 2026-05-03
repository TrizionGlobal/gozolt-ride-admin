import { apiClient } from '@/lib/api-client';
import { DriverStatus } from '@/types';
import { mockDrivers, mockDriverDetailExtended } from './driver.mock';
import type {
  DriverListItem,
  DriverDetail,
  DriverDetailExtended,
  DriverFilterParams,
  SuspendDriverPayload,
  DriverListResponse,
  DriverKpis,
} from './driver.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// In-memory mutable copy for dev bypass state mutations
let mutableDrivers = [...mockDrivers];

function filterAndPaginate(params: DriverFilterParams): DriverListResponse {
  let filtered = [...mutableDrivers];

  if (params.status) {
    filtered = filtered.filter((d) => d.status === params.status);
  }

  if (params.onlineOnly) {
    filtered = filtered.filter((d) => d.status === DriverStatus.ACTIVE && d.isOnline);
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.firstName.toLowerCase().includes(s) ||
        d.lastName.toLowerCase().includes(s) ||
        d.driverId.toLowerCase().includes(s) ||
        d.phone.includes(s) ||
        d.supplier.companyName.toLowerCase().includes(s),
    );
  }

  if (params.supplierId) {
    filtered = filtered.filter((d) => d.supplierId === params.supplierId);
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, meta: { total, page, limit, totalPages } };
}

export const driverService = {
  async listDrivers(params: DriverFilterParams): Promise<DriverListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    const { data } = await apiClient.get<DriverListResponse>('/admin/drivers', { params });
    return data;
  },

  async getDriverDetail(id: string): Promise<DriverDetail> {
    if (DEV_BYPASS) {
      await delay(300);
      const driver = mutableDrivers.find((d) => d.id === id);
      if (!driver) throw new Error('Driver not found');
      return {
        ...driver,
        supplier: { id: driver.supplierId, companyName: driver.supplier.companyName },
        vehicleAssignment: driver.vehicleAssignment
          ? {
              vehicle: {
                id: `veh-${driver.id}`,
                ...driver.vehicleAssignment.vehicle,
                year: 2022,
                color: 'White',
                type: 'STANDARD',
                seats: 4,
              },
            }
          : null,
        earningsBalance: {
          totalEarnings: driver._computed?.totalEarnings ?? 0,
          totalPaidOut: Math.floor((driver._computed?.totalEarnings ?? 0) * 0.8),
          pendingPenalties: 0,
          availableBalance: Math.floor((driver._computed?.totalEarnings ?? 0) * 0.2),
        },
        _count: { rides: driver.totalRides, ratings: 245, documents: 6 },
      };
    }
    const { data } = await apiClient.get<DriverDetail>(`/admin/drivers/${id}`);
    return data;
  },

  async approveDriver(id: string): Promise<DriverListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableDrivers.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Driver not found');
      mutableDrivers[idx] = {
        ...mutableDrivers[idx],
        status: DriverStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
        _computed: {
          totalEarnings: 0,
          docsStatus: 'verified',
        },
      };
      return mutableDrivers[idx];
    }
    const { data } = await apiClient.patch<DriverListItem>(`/admin/drivers/${id}/approve`);
    return data;
  },

  async suspendDriver(id: string, payload: SuspendDriverPayload): Promise<DriverListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableDrivers.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Driver not found');
      mutableDrivers[idx] = {
        ...mutableDrivers[idx],
        status: DriverStatus.SUSPENDED,
        isOnline: false,
        updatedAt: new Date().toISOString(),
      };
      return mutableDrivers[idx];
    }
    const { data } = await apiClient.patch<DriverListItem>(`/admin/drivers/${id}/suspend`, payload);
    return data;
  },

  async activateDriver(id: string): Promise<DriverListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableDrivers.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Driver not found');
      mutableDrivers[idx] = {
        ...mutableDrivers[idx],
        status: DriverStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
      };
      return mutableDrivers[idx];
    }
    const { data } = await apiClient.patch<DriverListItem>(`/admin/drivers/${id}/activate`);
    return data;
  },

  async getDriverDetailExtended(id: string): Promise<DriverDetailExtended> {
    if (DEV_BYPASS) {
      await delay(300);
      const driver = mutableDrivers.find((d) => d.id === id);
      if (!driver) throw new Error('Driver not found');
      return mockDriverDetailExtended();
    }
    const { data } = await apiClient.get<DriverDetailExtended>(`/admin/drivers/${id}/extended`);
    return data;
  },

  getKpis(): DriverKpis {
    const all = mutableDrivers;
    return {
      activeDrivers: all.filter((d) => d.status === DriverStatus.ACTIVE).length,
      onlineNow: all.filter((d) => d.status === DriverStatus.ACTIVE && d.isOnline).length,
      pendingApproval: all.filter((d) => d.status === DriverStatus.PENDING_APPROVAL).length,
      suspended: all.filter((d) => d.status === DriverStatus.SUSPENDED).length,
    };
  },
};
