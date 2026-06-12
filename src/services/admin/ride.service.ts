import { apiClient } from '@/lib/api-client';
import { RideStatus } from '@/types';
import type {
  RideListItem,
  RideDetail,
  RideFilterParams,
  IssueRefundPayload,
  AdminCancelRidePayload,
  RideListResponse,
  Refund,
} from './ride.types';

export const rideService = {
  async listActiveRides(): Promise<RideListItem[]> {
    try {
      const { data } = await apiClient.get<RideListItem[]>('/admin/rides/active');
      return data;
    } catch {
      return [];
    }
  },

  async listRides(params: RideFilterParams): Promise<RideListResponse> {
    try {
      const { data } = await apiClient.get<RideListResponse>('/admin/rides', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getRideDetail(id: string): Promise<RideDetail> {
    const { data } = await apiClient.get<RideDetail>(`/admin/rides/${id}`);
    return data;
  },

  async issueRefund(rideId: string, payload: IssueRefundPayload): Promise<Refund> {
    const { data } = await apiClient.post<Refund>(`/admin/rides/${rideId}/refund`, payload);
    return data;
  },

  async adminCancelRide(rideId: string, payload: AdminCancelRidePayload): Promise<RideListItem> {
    const { data } = await apiClient.post<RideListItem>(`/admin/rides/${rideId}/cancel`, payload);
    return data;
  },
};
