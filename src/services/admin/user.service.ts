import { apiClient } from '@/lib/api-client';
import { UserStatus, VehicleType } from '@/types';
import { mockUsers, mockUserExportData, mockUserDetailExtras } from './user.mock';
import type {
  UserListItem,
  UserDetail,
  UserFilterParams,
  SuspendUserPayload,
  UserListResponse,
  UserKpis,
} from './user.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// In-memory mutable copy for dev bypass state mutations
let mutableUsers = [...mockUsers];

function filterAndPaginate(params: UserFilterParams): UserListResponse {
  let filtered = [...mutableUsers];

  if (params.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        (u.firstName?.toLowerCase() || '').includes(s) ||
        (u.lastName?.toLowerCase() || '').includes(s) ||
        (u.email?.toLowerCase() || '').includes(s) ||
        (u.phone || '').includes(s) ||
        u.displayId.toLowerCase().includes(s),
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

export const userService = {
  async listUsers(params: UserFilterParams): Promise<UserListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    const { data } = await apiClient.get<UserListResponse>('/admin/users', { params });
    return data;
  },

  async getUserDetail(id: string): Promise<UserDetail> {
    if (DEV_BYPASS) {
      await delay(300);
      const user = mutableUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return {
        id: user.id,
        phone: user.phone,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: null,
        city: 'Valletta',
        country: 'MT',
        status: user.status,
        avgRating: user.avgRating,
        referralCode: 'GOZOLT2024',
        stripeCustomerId: 'cus_mock_123',
        createdAt: user.createdAt,
        addresses: [
          { label: 'Home', address: '23 Republic Street, Valletta' },
          { label: 'Work', address: 'Malta International Airport' },
        ],
        preferences: {
          preferredPayment: 'CARD',
          preferredVehicle: user._computed?.preferredVehicle ?? VehicleType.STANDARD,
          language: 'en',
        },
        rewardAccount: { tier: 'GOLD', totalPoints: 2890, currentPoints: 1247 },
        recentRides: mockUserDetailExtras.recentRides,
        recentPayments: mockUserDetailExtras.recentPayments,
        consentPreferences: mockUserDetailExtras.consentPreferences,
        processingRestricted: mockUserDetailExtras.processingRestricted,
        processingRestrictedAt: mockUserDetailExtras.processingRestrictedAt,
        _count: { rides: user._count.rides, payments: 45 },
      };
    }
    const { data } = await apiClient.get<UserDetail>(`/admin/users/${id}`);
    return data;
  },

  async suspendUser(id: string, payload: SuspendUserPayload): Promise<UserListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableUsers.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error('User not found');
      mutableUsers[idx] = {
        ...mutableUsers[idx],
        status: UserStatus.SUSPENDED,
      };
      return mutableUsers[idx];
    }
    const { data } = await apiClient.patch<UserListItem>(`/admin/users/${id}/suspend`, payload);
    return data;
  },

  async activateUser(id: string): Promise<UserListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableUsers.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error('User not found');
      mutableUsers[idx] = {
        ...mutableUsers[idx],
        status: UserStatus.ACTIVE,
      };
      return mutableUsers[idx];
    }
    const { data } = await apiClient.patch<UserListItem>(`/admin/users/${id}/activate`);
    return data;
  },

  async forceLogoutUser(id: string): Promise<{ sessionsDeleted: number }> {
    if (DEV_BYPASS) {
      await delay(400);
      return { sessionsDeleted: 3 };
    }
    const { data } = await apiClient.post<{ sessionsDeleted: number }>(`/admin/users/${id}/force-logout`);
    return data;
  },

  async exportUserData(id: string): Promise<Record<string, unknown>> {
    if (DEV_BYPASS) {
      await delay(600);
      const user = mutableUsers.find((u) => u.id === id);
      return {
        ...mockUserExportData,
        id: user?.id ?? id,
        firstName: user?.firstName ?? 'Unknown',
        lastName: user?.lastName ?? 'User',
        email: user?.email ?? null,
        phone: user?.phone ?? null,
      };
    }
    const { data } = await apiClient.get<Record<string, unknown>>(`/admin/users/${id}/export`);
    return data;
  },

  getKpis(): UserKpis {
    const all = mutableUsers;
    return {
      totalUsers: all.length,
      activeUsers: all.filter((u) => u.status === UserStatus.ACTIVE).length,
      bannedUsers: all.filter((u) => u.status === UserStatus.SUSPENDED).length,
      inactiveUsers: all.filter((u) => u.status === UserStatus.DELETED).length,
    };
  },
};
