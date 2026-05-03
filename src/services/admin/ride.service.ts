import { apiClient } from '@/lib/api-client';
import { RideStatus } from '@/types';
import { mockActiveRides, mockAllRides, buildMockRideDetail } from './ride.mock';
import type {
  RideListItem,
  RideDetail,
  RideFilterParams,
  IssueRefundPayload,
  AdminCancelRidePayload,
  RideListResponse,
  Refund,
} from './ride.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const CANCEL_STATUSES = [
  RideStatus.CANCELLED,
  RideStatus.NO_DRIVERS,
  RideStatus.NO_SHOW_USER,
  RideStatus.NO_SHOW_DRIVER,
];

function filterAndPaginate(params: RideFilterParams): RideListResponse {
  let filtered = [...mockAllRides];

  if (params.status) {
    if (CANCEL_STATUSES.includes(params.status)) {
      filtered = filtered.filter((r) => CANCEL_STATUSES.includes(r.status));
    } else {
      filtered = filtered.filter((r) => r.status === params.status);
    }
  }

  if (params.disputed) {
    filtered = filtered.filter((r) => r._isDisputed);
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r._displayId.toLowerCase().includes(s) ||
        `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.toLowerCase().includes(s) ||
        (r.driver
          ? `${r.driver.firstName} ${r.driver.lastName}`.toLowerCase().includes(s)
          : false),
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

export const rideService = {
  async listActiveRides(): Promise<RideListItem[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return [...mockActiveRides];
    }
    const { data } = await apiClient.get<RideListItem[]>('/admin/rides/active');
    return data;
  },

  async listRides(params: RideFilterParams): Promise<RideListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    const { data } = await apiClient.get<RideListResponse>('/admin/rides', { params });
    return data;
  },

  async getRideDetail(id: string): Promise<RideDetail> {
    if (DEV_BYPASS) {
      await delay(300);
      const ride = mockAllRides.find((r) => r.id === id) ?? mockActiveRides.find((r) => r.id === id);
      if (!ride) throw new Error('Ride not found');
      return buildMockRideDetail(ride);
    }
    const { data } = await apiClient.get<RideDetail>(`/admin/rides/${id}`);
    return data;
  },

  async issueRefund(rideId: string, payload: IssueRefundPayload): Promise<Refund> {
    if (DEV_BYPASS) {
      await delay(600);
      return {
        id: `refund-${Date.now()}`,
        amount: payload.amount,
        reason: payload.reason,
        processedBy: 'mock-admin-id',
        createdAt: new Date().toISOString(),
      };
    }
    const { data } = await apiClient.post<Refund>(`/admin/rides/${rideId}/refund`, payload);
    return data;
  },

  async adminCancelRide(rideId: string, payload: AdminCancelRidePayload): Promise<RideListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const ride = mockAllRides.find((r) => r.id === rideId);
      if (!ride) throw new Error('Ride not found');
      return { ...ride, status: RideStatus.CANCELLED };
    }
    const { data } = await apiClient.post<RideListItem>(`/admin/rides/${rideId}/cancel`, payload);
    return data;
  },
};
