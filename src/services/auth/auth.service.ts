import { apiClient } from '@/lib/api-client';
import { authMockData } from './auth.mock';
import type { AdminLoginPayload, AuthResponse, TokenRefreshResponse, MessageResponse } from './auth.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

export async function adminLogin(payload: AdminLoginPayload): Promise<AuthResponse> {
  if (DEV_BYPASS) {
    await new Promise((r) => setTimeout(r, 800));
    // If totpCode is provided, simulate successful 2FA verification
    if (payload.totpCode) {
      return authMockData.loginSuccess;
    }
    // Simulate 2FA requirement (toggle this for testing)
    // return authMockData.loginRequires2FA;
    return authMockData.loginSuccess;
  }
  const { data } = await apiClient.post<AuthResponse>('/auth/admin/login', payload);
  return data;
}

export async function refreshToken(token: string): Promise<TokenRefreshResponse> {
  if (DEV_BYPASS) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      accessToken: authMockData.loginSuccess.accessToken,
      refreshToken: authMockData.loginSuccess.refreshToken,
      expiresIn: '15m',
    };
  }
  const { data } = await apiClient.post<TokenRefreshResponse>('/auth/refresh', {
    refreshToken: token,
  });
  return data;
}

export async function logout(): Promise<MessageResponse> {
  if (DEV_BYPASS) {
    await new Promise((r) => setTimeout(r, 300));
    return { message: 'Logged out successfully' };
  }
  const { data } = await apiClient.post<MessageResponse>('/auth/logout');
  return data;
}
