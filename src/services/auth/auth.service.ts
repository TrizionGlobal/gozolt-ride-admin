import { apiClient } from '@/lib/api-client';
import type { AdminLoginPayload, AuthResponse, TokenRefreshResponse, MessageResponse } from './auth.types';

export async function adminLogin(payload: AdminLoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/admin/login', payload);
  return data;
}

export async function refreshToken(token: string): Promise<TokenRefreshResponse> {
  const { data } = await apiClient.post<TokenRefreshResponse>('/auth/refresh', {
    refreshToken: token,
  });
  return data;
}

export async function logout(): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>('/auth/logout');
  return data;
}
