import { apiClient } from '@/lib/api-client';
import { VehicleStatus } from '@/types';
import { mockVehicles } from './vehicle.mock';
import type {
  VehicleListItem,
  VehicleDetail,
  VehicleFilterParams,
  SuspendVehiclePayload,
  RejectVehiclePayload,
  VehicleListResponse,
  VehicleKpis,
} from './vehicle.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// In-memory mutable copy for dev bypass state mutations
let mutableVehicles = [...mockVehicles];

function filterAndPaginate(params: VehicleFilterParams): VehicleListResponse {
  let filtered = [...mutableVehicles];

  if (params.status) {
    filtered = filtered.filter((v) => v.status === params.status);
  }

  if (params.type) {
    filtered = filtered.filter((v) => v.type === params.type);
  }

  if (params.supplierId) {
    filtered = filtered.filter((v) => v.supplierId === params.supplierId);
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.plateNumber.toLowerCase().includes(s) ||
        v.make.toLowerCase().includes(s) ||
        v.model.toLowerCase().includes(s) ||
        v.supplier.companyName.toLowerCase().includes(s),
    );
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, meta: { total, page, limit, totalPages } };
}

export const vehicleService = {
  async listVehicles(params: VehicleFilterParams): Promise<VehicleListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    const { data } = await apiClient.get<VehicleListResponse>('/admin/vehicles', { params });
    return data;
  },

  async getVehicleDetail(id: string): Promise<VehicleDetail> {
    if (DEV_BYPASS) {
      await delay(300);
      const vehicle = mutableVehicles.find((v) => v.id === id);
      if (!vehicle) throw new Error('Vehicle not found');
      return {
        ...vehicle,
        supplier: { id: vehicle.supplierId, companyName: vehicle.supplier.companyName },
        assignment: vehicle.assignment
          ? {
              driver: {
                id: `drv-${vehicle.id}`,
                ...vehicle.assignment.driver,
                phone: '+35679000000',
              },
            }
          : null,
        _count: { documents: 4, maintenanceLogs: 2 },
      };
    }
    const { data } = await apiClient.get<VehicleDetail>(`/admin/vehicles/${id}`);
    return data;
  },

  async approveVehicle(id: string): Promise<VehicleListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableVehicles.findIndex((v) => v.id === id);
      if (idx === -1) throw new Error('Vehicle not found');
      mutableVehicles[idx] = {
        ...mutableVehicles[idx],
        status: VehicleStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
      };
      return mutableVehicles[idx];
    }
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/approve`);
    return data;
  },

  async rejectVehicle(id: string, payload: RejectVehiclePayload): Promise<VehicleListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableVehicles.findIndex((v) => v.id === id);
      if (idx === -1) throw new Error('Vehicle not found');
      mutableVehicles[idx] = {
        ...mutableVehicles[idx],
        status: VehicleStatus.DECOMMISSIONED,
        updatedAt: new Date().toISOString(),
      };
      return mutableVehicles[idx];
    }
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/reject`, payload);
    return data;
  },

  async suspendVehicle(id: string, payload: SuspendVehiclePayload): Promise<VehicleListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableVehicles.findIndex((v) => v.id === id);
      if (idx === -1) throw new Error('Vehicle not found');
      mutableVehicles[idx] = {
        ...mutableVehicles[idx],
        status: VehicleStatus.SUSPENDED,
        updatedAt: new Date().toISOString(),
      };
      return mutableVehicles[idx];
    }
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/suspend`, payload);
    return data;
  },

  async activateVehicle(id: string): Promise<VehicleListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableVehicles.findIndex((v) => v.id === id);
      if (idx === -1) throw new Error('Vehicle not found');
      mutableVehicles[idx] = {
        ...mutableVehicles[idx],
        status: VehicleStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
      };
      return mutableVehicles[idx];
    }
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/activate`);
    return data;
  },

  getKpis(): VehicleKpis {
    const all = mutableVehicles;
    return {
      totalVehicles: all.length,
      activeOnRoad: all.filter((v) => v.status === VehicleStatus.ACTIVE).length,
      pendingInspection: all.filter((v) => v.status === VehicleStatus.PENDING_APPROVAL).length,
      suspended: all.filter((v) => v.status === VehicleStatus.SUSPENDED).length,
    };
  },
};
